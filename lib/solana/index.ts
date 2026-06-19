/**
 * Public surface of `lib/solana/*` — the rest of the app should import Solana logic from here
 * (`@/lib/solana`) rather than reaching into individual files. Server-only modules
 * (`server-signers.ts`, `send.ts`) are deliberately NOT re-exported here so they can never be
 * accidentally pulled into a client bundle.
 */
export * from "./actions";
export * from "./constants";
export * from "./queries";
export * from "./token";
export { signAndSendInstructions, fromLegacyInstruction } from "./legacy-bridge";
