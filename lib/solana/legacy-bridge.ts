/**
 * Bridges Kit `Instruction` objects (produced by `@solana/subscriptions`) into classic
 * `@solana/web3.js` instructions so they can be signed by a connected browser wallet via
 * `@solana/wallet-adapter-react`.
 */
import { AccountRole, type Instruction, type Address } from "@solana/kit";
import {
  Connection,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import type { WalletContextState } from "@solana/wallet-adapter-react";

/** Kit Instruction → legacy TransactionInstruction */
function toLegacyInstruction(ix: Instruction): TransactionInstruction {
  const keys = (ix.accounts ?? []).map((account) => {
    if ("lookupTableAddress" in account) {
      throw new Error("Address lookup table accounts are not supported.");
    }
    const { role } = account;
    return {
      pubkey: new PublicKey(account.address),
      isSigner:
        role === AccountRole.READONLY_SIGNER || role === AccountRole.WRITABLE_SIGNER,
      isWritable: role === AccountRole.WRITABLE || role === AccountRole.WRITABLE_SIGNER,
    };
  });
  return new TransactionInstruction({
    programId: new PublicKey(ix.programAddress),
    keys,
    data: Buffer.from(ix.data ?? new Uint8Array()),
  });
}

/**
 * Legacy TransactionInstruction → Kit Instruction shape.
 * Used to include SPL Token instructions (e.g. createAssociatedTokenAccountIdempotent)
 * in the same `signAndSendInstructions` array as Kit instructions.
 */
export function fromLegacyInstruction(ix: TransactionInstruction): Instruction {
  return {
    programAddress: ix.programId.toBase58() as Address,
    accounts: ix.keys.map((k) => ({
      address: k.pubkey.toBase58() as Address,
      role: k.isSigner
        ? k.isWritable
          ? AccountRole.WRITABLE_SIGNER
          : AccountRole.READONLY_SIGNER
        : k.isWritable
          ? AccountRole.WRITABLE
          : AccountRole.READONLY,
    })),
    data: new Uint8Array(ix.data),
  };
}

/**
 * Signs and sends Kit instructions via the connected browser wallet, then confirms on-chain.
 *
 * Key design: we use `wallet.signTransaction` (sign-only) + `connection.sendRawTransaction`
 * rather than `wallet.sendTransaction`. The difference matters when Phantom is configured for a
 * different network (e.g. mainnet) while our app targets devnet: `sendTransaction` lets Phantom
 * route the transaction through its own RPC (wrong network → simulation fails, send fails).
 * Sign-only + our `connection.sendRawTransaction` always targets the correct devnet endpoint
 * regardless of what network Phantom's UI is set to.
 *
 * If the wallet doesn't expose `signTransaction` (rare), falls back to `sendTransaction`.
 */
export async function signAndSendInstructions(
  connection: Connection,
  wallet: WalletContextState,
  instructions: Instruction[],
): Promise<string> {
  if (!wallet.publicKey) {
    throw new Error("Connect a wallet first.");
  }

  const legacyInstructions = instructions.map(toLegacyInstruction);
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash("confirmed");

  const message = new TransactionMessage({
    payerKey: wallet.publicKey,
    recentBlockhash: blockhash,
    instructions: legacyInstructions,
  }).compileToV0Message();

  const transaction = new VersionedTransaction(message);

  // Preferred path: sign-only → send via our connection (network-agnostic wallet config)
  if (wallet.signTransaction) {
    const signedTx = await wallet.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signedTx.serialize(), {
      skipPreflight: true,
      preflightCommitment: "confirmed",
    });
    await connection.confirmTransaction(
      { signature, blockhash, lastValidBlockHeight },
      "confirmed",
    );
    return signature;
  }

  // Fallback: sendTransaction (wallet picks its own RPC — may fail if wrong network)
  const signature = await wallet.sendTransaction(transaction, connection, {
    skipPreflight: true,
    preflightCommitment: "confirmed",
  });
  await connection.confirmTransaction(
    { signature, blockhash, lastValidBlockHeight },
    "confirmed",
  );
  return signature;
}
