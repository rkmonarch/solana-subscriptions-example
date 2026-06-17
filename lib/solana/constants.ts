/**
 * Network + program configuration for the Subscriptions MVP.
 *
 * The Subscriptions program (`De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44`) is deployed at the
 * same address on devnet and mainnet-beta. We default to devnet and use Circle's real devnet USDC
 * (4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU) so there's no custom token to manage.
 * Get devnet USDC from https://faucet.circle.com.
 */
import { address, type Address } from "@solana/kit";
import { SUBSCRIPTIONS_PROGRAM_ADDRESS } from "@solana/subscriptions";

/** HTTP RPC endpoint used for all reads/writes. */
export const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL ?? "https://api.devnet.solana.com";

/** WebSocket RPC endpoint, derived from {@link RPC_URL} unless overridden. */
export const RPC_WS_URL =
  process.env.NEXT_PUBLIC_RPC_WS_URL ??
  RPC_URL.replace(/^http/, "ws").replace(/\.solana\.com\/?$/, ".solana.com");

/** Which cluster the app is pointed at — purely cosmetic (badges, explorer links). */
export const CLUSTER: "devnet" | "mainnet-beta" | "testnet" | "custom" =
  (process.env.NEXT_PUBLIC_CLUSTER as typeof CLUSTER | undefined) ??
  (RPC_URL.includes("devnet")
    ? "devnet"
    : RPC_URL.includes("testnet")
      ? "testnet"
      : RPC_URL.includes("mainnet")
        ? "mainnet-beta"
        : "custom");

/** Re-exported for convenience so the rest of the app never imports the SDK directly. */
export const SUBSCRIPTIONS_PROGRAM_ID = SUBSCRIPTIONS_PROGRAM_ADDRESS;

/** Classic SPL Token program address (kit-branded). */
export const TOKEN_PROGRAM_ADDRESS = address(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
);

export const USDC_DECIMALS = 6;

/**
 * Circle's devnet USDC mint — the same token address used on Solana devnet by Circle.
 * Get devnet USDC from https://faucet.circle.com (select Solana + Devnet).
 * This is hardcoded so no env var or bootstrap step is needed for the token itself.
 */
export const USDC_MINT: Address = address(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
);

/** Kept for call-sites that previously called getUsdcMint() — now a trivial wrapper. */
export function getUsdcMint(): Address {
  return USDC_MINT;
}

/** Billing period used for every demo plan: 30 days, expressed in hours. */
export const DEMO_PERIOD_HOURS = 720n;

export type ServiceId = "spotify" | "netflix";

export interface ServiceConfig {
  id: ServiceId;
  name: string;
  tagline: string;
  /** Price per 30-day period, in whole USDC (converted to base units at use-sites). */
  priceUsdc: number;
  /** Brand color used for the card accent + badges. */
  color: string;
  /** On-chain plan id chosen by the merchant when the plan was created. */
  planId: bigint;
  ownerEnvVar: "NEXT_PUBLIC_SPOTIFY_OWNER" | "NEXT_PUBLIC_NETFLIX_OWNER";
}

export const SERVICES: ServiceConfig[] = [
  {
    id: "spotify",
    name: "Spotify",
    tagline: "Music streaming, ad-free",
    priceUsdc: 2,
    color: "#1DB954",
    planId: 1n,
    ownerEnvVar: "NEXT_PUBLIC_SPOTIFY_OWNER",
  },
  {
    id: "netflix",
    name: "Netflix",
    tagline: "Movies & shows on demand",
    priceUsdc: 5,
    color: "#E50914",
    planId: 1n,
    ownerEnvVar: "NEXT_PUBLIC_NETFLIX_OWNER",
  },
];

// NOTE: Next.js only inlines `NEXT_PUBLIC_*` vars for the browser bundle when they're accessed
// via a literal `process.env.NEXT_PUBLIC_X` expression — `process.env[someVariable]` is invisible
// to its build-time replacer and would silently be `undefined` on the client. Hence the switch.
export function getServiceOwner(service: ServiceConfig): Address {
  const resolved =
    service.id === "spotify"
      ? process.env.NEXT_PUBLIC_SPOTIFY_OWNER
      : process.env.NEXT_PUBLIC_NETFLIX_OWNER;
  if (!resolved) {
    throw new Error(
      `${service.ownerEnvVar} is not set. Run \`npm run bootstrap\` and copy its output into .env.local.`,
    );
  }
  return address(resolved);
}

/** Reverse lookup used by the UI to label a SubscriptionDelegation's `delegatee` with a service. */
export function findServiceByOwner(owner: Address): ServiceConfig | undefined {
  return SERVICES.find((service) => {
    try {
      return getServiceOwner(service) === owner;
    } catch {
      return false;
    }
  });
}

export function explorerTxUrl(signature: string): string {
  const suffix = CLUSTER === "mainnet-beta" ? "" : `?cluster=${CLUSTER}`;
  return `https://solscan.io/tx/${signature}${suffix}`;
}

export function explorerAddressUrl(addr: string): string {
  const suffix = CLUSTER === "mainnet-beta" ? "" : `?cluster=${CLUSTER}`;
  return `https://solscan.io/account/${addr}${suffix}`;
}
