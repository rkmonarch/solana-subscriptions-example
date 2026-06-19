/**
 * One-time devnet setup for the Subscriptions MVP.
 *
 *   npm run bootstrap
 *
 * What it does:
 *  1. Loads (or generates) two merchant keypairs — Spotify and Netflix — and persists their
 *     secrets to `.env.local`.
 *  2. Airdrops devnet SOL to each merchant if their balance is low.
 *  3. Publishes a $2/month Spotify plan and a $5/month Netflix plan on the real Subscriptions
 *     program, both billed in Circle's devnet USDC (4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU).
 *  4. Writes the merchant public keys into `.env.local` so the Next.js app can find them.
 *
 * To get devnet USDC for your own wallet: https://faucet.circle.com  (select Solana + Devnet)
 *
 * Safe to re-run — every step is idempotent.
 */
import "./load-env"; // must be the first import — see load-env.ts for why

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  createKeyPairSignerFromBytes,
  address as toAddress,
  type Address,
  type KeyPairSigner,
} from "@solana/kit";
import { getCreatePlanOverlayInstructionAsync } from "@solana/subscriptions";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";

import { DEMO_PERIOD_HOURS, SERVICES, USDC_DECIMALS, USDC_MINT } from "../lib/solana/constants";
import { getPlan } from "../lib/solana/queries";
import { sendInstructions } from "../lib/solana/send";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL ?? "https://api.devnet.solana.com";
const ENV_LOCAL_PATH = path.resolve(process.cwd(), ".env.local");
const MIN_BALANCE_LAMPORTS = 0.05 * LAMPORTS_PER_SOL;
const AIRDROP_LAMPORTS = 1 * LAMPORTS_PER_SOL;

const connection = new Connection(RPC_URL, "confirmed");

function readEnvLocal(): Record<string, string> {
  if (!existsSync(ENV_LOCAL_PATH)) return {};
  const contents = readFileSync(ENV_LOCAL_PATH, "utf8");
  const out: Record<string, string> = {};
  for (const line of contents.split("\n")) {
    const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (match) out[match[1]] = match[2];
  }
  return out;
}

function writeEnvLocal(updates: Record<string, string>) {
  const existing = readEnvLocal();
  const merged = { ...existing, ...updates };
  const body = Object.entries(merged)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  writeFileSync(ENV_LOCAL_PATH, body + "\n");
}

interface Signer {
  legacyKeypair: Keypair;
  kitSigner: KeyPairSigner;
  address: Address;
}

async function loadOrCreateSigner(envVar: string): Promise<{ signer: Signer; isNew: boolean }> {
  const existing = readEnvLocal()[envVar] ?? process.env[envVar];
  let legacyKeypair: Keypair;
  let isNew = false;

  if (existing) {
    legacyKeypair = Keypair.fromSecretKey(bs58.decode(existing));
  } else {
    legacyKeypair = Keypair.generate();
    isNew = true;
    writeEnvLocal({ [envVar]: bs58.encode(legacyKeypair.secretKey) });
  }

  const kitSigner = await createKeyPairSignerFromBytes(legacyKeypair.secretKey);
  return {
    signer: {
      legacyKeypair,
      kitSigner,
      address: toAddress(legacyKeypair.publicKey.toBase58()),
    },
    isNew,
  };
}

async function ensureFunded(label: string, signer: Signer) {
  const balance = await connection.getBalance(signer.legacyKeypair.publicKey, "confirmed");
  if (balance >= MIN_BALANCE_LAMPORTS) {
    console.log(`  ${label}: already funded (${(balance / LAMPORTS_PER_SOL).toFixed(3)} SOL)`);
    return;
  }
  console.log(`  ${label}: requesting devnet airdrop...`);
  try {
    const sig = await connection.requestAirdrop(signer.legacyKeypair.publicKey, AIRDROP_LAMPORTS);
    await connection.confirmTransaction(sig, "confirmed");
    console.log(`  ${label}: airdropped ${AIRDROP_LAMPORTS / LAMPORTS_PER_SOL} SOL ✓`);
  } catch (error) {
    console.warn(
      `  ${label}: airdrop rate-limited. Fund ${signer.legacyKeypair.publicKey.toBase58()} ` +
        `manually via https://faucet.solana.com if plan creation fails below.`,
    );
    console.warn(`    (${(error as Error).message})`);
  }
}

async function ensurePlan(merchant: Signer, service: (typeof SERVICES)[number]) {
  const existingPlan = await getPlan(merchant.address, service.planId).catch(() => null);

  if (existingPlan) {
    const planMint = existingPlan.data.data.mint;
    if (planMint === USDC_MINT) {
      console.log(`  ${service.name}: plan ${service.planId} on-chain with correct USDC mint ✓`);
    } else {
      // The plan exists with a different mint (e.g. the old demo TUSDC from the first bootstrap
      // run). On-chain Subscriptions plans with endTs=0 cannot be deleted — so we can't replace
      // it in-place. Instead, bump the planId so bootstrap creates a fresh plan at the new ID.
      // If you see this message, update SERVICES.planId in constants.ts and re-run bootstrap.
      console.warn(
        `  ${service.name}: plan ${service.planId} has wrong mint (${planMint})! ` +
        `This can't be replaced because the program only allows deleting EXPIRED plans. ` +
        `Bump SERVICES.planId in constants.ts (e.g. 1n → 2n) and re-run bootstrap.`,
      );
    }
    return;
  }

  // Create the plan with the correct Circle devnet USDC mint
  const mint = new PublicKey(USDC_MINT);
  console.log(`  ${service.name}: creating merchant ATA for devnet USDC...`);
  const merchantAta = await getOrCreateAssociatedTokenAccount(
    connection,
    merchant.legacyKeypair,
    mint,
    merchant.legacyKeypair.publicKey,
  );

  console.log(`  ${service.name}: publishing $${service.priceUsdc}/30-day plan with Circle USDC...`);
  const ix = await getCreatePlanOverlayInstructionAsync({
    owner: merchant.kitSigner,
    mint: USDC_MINT,
    planId: service.planId,
    amount: BigInt(service.priceUsdc) * 10n ** BigInt(USDC_DECIMALS),
    periodHours: DEMO_PERIOD_HOURS,
    endTs: 0n, // perpetual
    destinations: [toAddress(merchantAta.address.toBase58())],
    pullers: [merchant.address],
    metadataUri: `https://example.com/plans/${service.id}`,
  });

  const signature = await sendInstructions(merchant.kitSigner, [ix]);
  console.log(`  ${service.name}: plan published ✓  ${signature}`);
}

async function main() {
  console.log("Subscriptions MVP bootstrap");
  console.log(`RPC:  ${RPC_URL}`);
  console.log(`USDC: ${USDC_MINT} (Circle devnet USDC)\n`);

  // ── Step 1: merchant keypairs ──────────────────────────────────────────────
  console.log("Step 1/3 — merchant keypairs");
  const { signer: spotify, isNew: spotifyIsNew } =
    await loadOrCreateSigner("SPOTIFY_MERCHANT_SECRET_KEY");
  const { signer: netflix, isNew: netflixIsNew } =
    await loadOrCreateSigner("NETFLIX_MERCHANT_SECRET_KEY");

  if (spotifyIsNew) console.log(`  Generated Spotify merchant: ${spotify.address}`);
  else console.log(`  Loaded  Spotify merchant:   ${spotify.address}`);
  if (netflixIsNew) console.log(`  Generated Netflix merchant: ${netflix.address}`);
  else console.log(`  Loaded  Netflix merchant:   ${netflix.address}`);

  writeEnvLocal({
    NEXT_PUBLIC_RPC_URL: RPC_URL,
    NEXT_PUBLIC_SPOTIFY_OWNER: spotify.address,
    NEXT_PUBLIC_NETFLIX_OWNER: netflix.address,
    NEXT_PUBLIC_SPOTIFY_PLAN_ID: String(SERVICES.find((s) => s.id === "spotify")?.planId ?? 2),
    NEXT_PUBLIC_NETFLIX_PLAN_ID: String(SERVICES.find((s) => s.id === "netflix")?.planId ?? 2),
  });
  Object.assign(process.env, readEnvLocal());

  // ── Step 2: fund merchants with devnet SOL ────────────────────────────────
  console.log("\nStep 2/3 — devnet SOL for merchants");
  await ensureFunded("Spotify merchant", spotify);
  await ensureFunded("Netflix merchant", netflix);

  // ── Step 3: publish plans on-chain ───────────────────────────────────────
  console.log("\nStep 3/3 — publishing plans (devnet USDC)");
  for (const service of SERVICES) {
    const merchant = service.id === "spotify" ? spotify : netflix;
    await ensurePlan(merchant, service);
  }

  console.log("\n✓ Done! .env.local has been written:");
  console.log("    NEXT_PUBLIC_RPC_URL, NEXT_PUBLIC_SPOTIFY_OWNER, NEXT_PUBLIC_NETFLIX_OWNER");
  console.log("    NEXT_PUBLIC_SPOTIFY_PLAN_ID, NEXT_PUBLIC_NETFLIX_PLAN_ID");
  console.log("    SPOTIFY_MERCHANT_SECRET_KEY, NETFLIX_MERCHANT_SECRET_KEY");
  console.log("\nGet devnet USDC for your wallet → https://faucet.circle.com");
  console.log("Then run:  npm run dev");
}

main().catch((error) => {
  console.error("\nBootstrap failed:", error);
  process.exit(1);
});
