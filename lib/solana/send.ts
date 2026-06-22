/**
 * Server-side transaction sending using Kit's native pipeline. Used by both the bootstrap script
 * (tsx / plain Node) and the Next.js API routes. Deliberately does NOT import `server-only`
 * because this file is also imported by `scripts/bootstrap.ts` which runs outside Next.js.
 */
import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  getBase64EncodedWireTransaction,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type Instruction,
  type KeyPairSigner,
} from "@solana/kit";

import { getRpc } from "./rpc";
import { RPC_URL } from "./constants";

async function getConnection() {
  const { Connection } = await import("@solana/web3.js");
  return new Connection(RPC_URL, "confirmed");
}

/**
 * Poll for transaction confirmation via `getSignatureStatus`.
 * Uses exponential backoff on 429 rate-limit responses — the public devnet RPC
 * (`api.devnet.solana.com`) has aggressive rate limits. A private endpoint
 * (Helius/QuickNode devnet) avoids these waits entirely.
 */
async function pollForConfirmation(
  signature: string,
  timeoutMs = 90_000,
  baseIntervalMs = 3_000, // start at 3 s between polls
): Promise<void> {
  const conn = await getConnection();
  const deadline = Date.now() + timeoutMs;
  let intervalMs = baseIntervalMs;

  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, intervalMs));
    try {
      const { value: status } = await conn.getSignatureStatus(signature, {
        searchTransactionHistory: true,
      });
      if (status?.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(status.err)}`);
      }
      if (
        status?.confirmationStatus === "confirmed" ||
        status?.confirmationStatus === "finalized"
      ) {
        return;
      }
      // Reset backoff on a successful (but pending) response
      intervalMs = baseIntervalMs;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("429") || msg.toLowerCase().includes("too many")) {
        // Back off: double the wait time, cap at 15 s
        intervalMs = Math.min(intervalMs * 2, 15_000);
        console.warn(`sendInstructions: rate-limited (429), backing off to ${intervalMs}ms`);
        continue;
      }
      // Re-throw real errors (not 429)
      throw err;
    }
  }
  // Timeout — tx may still confirm; return signature so caller can link to Solscan.
  console.warn(`sendInstructions: confirmation polling timed out for ${signature}`);
}

/**
 * Builds, signs, sends and polls for confirmation of a transaction.
 * Uses `skipPreflight: true` so stale RPC state doesn't abort the send, and polling
 * so a dropped WebSocket notification can't hang the call forever.
 */
export async function sendInstructions(
  payer: KeyPairSigner,
  instructions: Instruction[],
): Promise<string> {
  const rpc = getRpc();
  const conn = await getConnection();

  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayerSigner(payer, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions(instructions, tx),
  );

  const signedTx = await signTransactionMessageWithSigners(message);
  const wireBase64 = getBase64EncodedWireTransaction(signedTx);
  const wireBytes = Buffer.from(wireBase64, "base64");

  const signature = await conn.sendRawTransaction(wireBytes, {
    skipPreflight: true,
    preflightCommitment: "confirmed",
  });

  await pollForConfirmation(signature);
  return signature;
}
