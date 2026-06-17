/**
 * Plain SPL Token helpers (ATA derivation + balance reads). These intentionally use the mature,
 * widely-used `@solana/spl-token` + classic `@solana/web3.js` APIs rather than Kit's newer
 * instruction-plan system — there's nothing Subscriptions-specific here.
 */
import { address, type Address } from "@solana/kit";
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, type Connection } from "@solana/web3.js";

/** Derives a wallet's associated token account for `mint`, as a Kit-branded `Address`. */
export function deriveAta(owner: Address, mint: Address): Address {
  const ata = getAssociatedTokenAddressSync(
    new PublicKey(mint),
    new PublicKey(owner),
    false,
    TOKEN_PROGRAM_ID,
  );
  return address(ata.toBase58());
}

/** UI-formatted token balance for `owner`'s `mint` ATA. Returns 0 if the ATA doesn't exist yet. */
export async function getTokenBalance(
  connection: Connection,
  owner: Address,
  mint: Address,
): Promise<number> {
  try {
    const ata = new PublicKey(deriveAta(owner, mint));
    const balance = await connection.getTokenAccountBalance(ata, "confirmed");
    return balance.value.uiAmount ?? 0;
  } catch {
    return 0;
  }
}
