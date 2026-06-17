/**
 * Server-side transaction sending using Kit's native pipeline. Used by both the bootstrap script
 * (tsx / plain Node) and the Next.js API routes. Deliberately does NOT import `server-only`
 * because this file is also imported by `scripts/bootstrap.ts` which runs outside Next.js —
 * `server-only` throws unconditionally in plain Node (it only works as a Next bundler guard, not
 * a runtime one). Client-bundle leakage is prevented instead by `server-signers.ts` (which
 * imports `server-only`) never being included in the public lib/solana/index.ts barrel.
 */
import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  getSignatureFromTransaction,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type Instruction,
  type KeyPairSigner,
} from "@solana/kit";

import { getRpc, getRpcSubscriptions } from "./rpc";

/**
 * Builds, signs, sends and confirms a transaction containing `instructions`, paid for and signed
 * by `payer`. Returns the transaction signature.
 */
export async function sendInstructions(
  payer: KeyPairSigner,
  instructions: Instruction[],
): Promise<string> {
  const rpc = getRpc();
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  const message = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayerSigner(payer, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions(instructions, tx),
  );

  const signedTransaction = await signTransactionMessageWithSigners(message);

  // `sendAndConfirmTransactionFactory` is overloaded per-cluster (devnet/testnet/mainnet) so it
  // can tag the RPC's `~cluster` literal type. Our RPC client is built from a runtime `string`
  // URL (not a string-literal type), so TS can't pick a single overload — the cast below is
  // purely to satisfy that compile-time cluster tagging; it has no effect at runtime.
  type AnyFactoryConfig = Parameters<typeof sendAndConfirmTransactionFactory>[0];
  const sendAndConfirm = sendAndConfirmTransactionFactory({
    rpc,
    rpcSubscriptions: getRpcSubscriptions(),
  } as AnyFactoryConfig);

  await sendAndConfirm(
    signedTransaction as Parameters<typeof sendAndConfirm>[0],
    { commitment: "confirmed" },
  );
  return getSignatureFromTransaction(signedTransaction);
}
