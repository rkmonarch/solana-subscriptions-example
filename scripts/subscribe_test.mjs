import { config } from "dotenv";
config({ path: ".env.local" });
import { createNoopSigner, address } from "@solana/kit";
import {
  getSubscribeOverlayInstructionAsync,
  getInitSubscriptionAuthorityOverlayInstructionAsync,
  findSubscriptionAuthorityPda,
  findPlanPda,
  findSubscriptionDelegationPda,
} from "@solana/subscriptions";
import { getAssociatedTokenAddressSync, createAssociatedTokenAccountIdempotentInstruction, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import web3 from "@solana/web3.js";
import bs58 from "bs58";
const { PublicKey, Keypair, TransactionMessage, VersionedTransaction, Connection } = web3;

const RPC = process.env.NEXT_PUBLIC_RPC_URL;
const conn = new Connection(RPC, "confirmed");

const subKp = Keypair.fromSecretKey(bs58.decode(process.env.SPOTIFY_MERCHANT_SECRET_KEY));
const sub = address(subKp.publicKey.toBase58());
const merchant = address(process.env.NEXT_PUBLIC_SPOTIFY_OWNER);
const USDC = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
const kitUSDC = address(USDC.toBase58());
const TOKEN_P = address("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const ata = getAssociatedTokenAddressSync(USDC, subKp.publicKey, false, TOKEN_PROGRAM_ID);

const toLegacy = ix => ({
  programId: new PublicKey(ix.programAddress),
  keys: (ix.accounts ?? []).map(a => ({ pubkey: new PublicKey(a.address), isSigner: a.role===2||a.role===3, isWritable: a.role===1||a.role===3 })),
  data: Buffer.from(ix.data ?? [])
});
async function simAndSend(instructions) {
  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash();
  const msg = new TransactionMessage({ payerKey: subKp.publicKey, recentBlockhash: blockhash, instructions }).compileToV0Message();
  const tx = new VersionedTransaction(msg);
  const sim = await conn.simulateTransaction(tx, { sigVerify: false, replaceRecentBlockhash: true });
  if (sim.value.err) { console.error("SIM FAIL:", sim.value.err); sim.value.logs?.forEach(l=>console.error(" ",l)); return null; }
  tx.sign([subKp]);
  const sig = await conn.sendRawTransaction(tx.serialize(), { skipPreflight: true });
  await conn.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, "confirmed");
  return sig;
}

console.log("Subscriber:", sub);
const [sauthPda] = await findSubscriptionAuthorityPda({ user: sub, tokenMint: kitUSDC });
const sauthInfo = await conn.getAccountInfo(new PublicKey(sauthPda));
console.log("SubAuth exists:", !!sauthInfo);

if (!sauthInfo) {
  console.log("Initialising...");
  const ataLeg = createAssociatedTokenAccountIdempotentInstruction(subKp.publicKey, ata, subKp.publicKey, USDC, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID);
  const initIx = await getInitSubscriptionAuthorityOverlayInstructionAsync({ owner: createNoopSigner(sub), tokenMint: kitUSDC, tokenProgram: TOKEN_P, userAta: address(ata.toBase58()) });
  const sig = await simAndSend([ataLeg, toLegacy(initIx)]);
  console.log(sig ? "Init OK: "+sig : "INIT FAILED");
  if (!sig) process.exit(1);
}

// Read initId raw (offset 64..72 is initId in SubscriptionAuthority)
const sauth = await conn.getAccountInfo(new PublicKey(sauthPda));
const initId = Buffer.from(sauth.data).readBigInt64LE(64);
console.log("initId:", initId);

// Read plan raw
const [planPda] = await findPlanPda({ owner: merchant, planId: 1n });
const planRaw = await conn.getAccountInfo(new PublicKey(planPda));
if (!planRaw) { console.error("Plan not found"); process.exit(1); }
// Plan data offset: discriminator(1)+owner(32)+bump(1)+status(1) = 35 bytes before planData
// planData: planId(8)+mint(32)+terms={amount(8)+periodHours(8)+createdAt(8)}
const d = Buffer.from(planRaw.data);
const amount      = d.readBigUInt64LE(35 + 8 + 32);
const periodHours = d.readBigUInt64LE(35 + 8 + 32 + 8);
const createdAt   = d.readBigInt64LE(35 + 8 + 32 + 16);
console.log("Plan:", { amount: amount.toString(), periodHours: periodHours.toString(), createdAt: createdAt.toString() });

// Check if already subscribed
const [subPda] = await findSubscriptionDelegationPda({ planPda, subscriber: sub });
const subInfo = await conn.getAccountInfo(new PublicKey(subPda));
if (subInfo) { console.log("Already subscribed at:", subPda); process.exit(0); }

// Build and send subscribe
console.log("\nBuilding subscribe ix...");
const subIx = await getSubscribeOverlayInstructionAsync({
  merchant, planId: 1n, tokenMint: kitUSDC,
  subscriber: createNoopSigner(sub),
  expectedAmount: amount,
  expectedPeriodHours: periodHours,
  expectedCreatedAt: createdAt,
  expectedSubscriptionAuthorityInitId: initId,
});
console.log("Accounts:");
(subIx.accounts ?? []).forEach(a => console.log(` ${a.role===3?'W+S':a.role===1?'W  ':a.role===2?'R+S':'R  '} ${a.address}`));
const sig = await simAndSend([toLegacy(subIx)]);
console.log(sig ? "\n✓ SUBSCRIBED: "+sig : "\n✗ SUBSCRIBE FAILED");
