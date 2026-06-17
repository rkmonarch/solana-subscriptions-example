/**
 * Server-only signer loading. Decodes merchant keypairs stored in env vars into both a Kit
 * `KeyPairSigner` (for Subscriptions-program instruction building) and a classic web3.js `Keypair`
 * (for any SPL Token / web3.js calls). There is no mint-authority signer because we use
 * Circle's real devnet USDC — no custom mint is created or controlled by this app.
 */
import "server-only";

import { createKeyPairSignerFromBytes, type KeyPairSigner } from "@solana/kit";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

export interface DualSigner {
  /** Address shared by both representations, e.g. for logging. */
  address: string;
  /** Use for @solana/subscriptions instruction building. */
  kit: KeyPairSigner;
  /** Use for @solana/spl-token / @solana/web3.js calls. */
  legacy: Keypair;
}

async function loadDualSigner(envVar: string): Promise<DualSigner> {
  const secret = process.env[envVar];
  if (!secret) {
    throw new Error(
      `Missing ${envVar} in the environment. Run \`npm run bootstrap\` first, then copy its output into .env.local.`,
    );
  }
  const bytes = bs58.decode(secret);
  const legacy = Keypair.fromSecretKey(bytes);
  const kit = await createKeyPairSignerFromBytes(bytes);
  return { address: legacy.publicKey.toBase58(), kit, legacy };
}

export const getSpotifyMerchantSigner = (): Promise<DualSigner> =>
  loadDualSigner("SPOTIFY_MERCHANT_SECRET_KEY");

export const getNetflixMerchantSigner = (): Promise<DualSigner> =>
  loadDualSigner("NETFLIX_MERCHANT_SECRET_KEY");
