# Subscriptions MVP

A real, production-ready **Next.js 15** app demonstrating on-chain recurring subscriptions using
the official [Solana Subscriptions Program](https://github.com/solana-foundation/subscriptions)
(`De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44`).

**Showcase**: one USDC token account, two independent recurring delegations — subscribe to a
"Spotify"-style plan ($2/month) and a "Netflix"-style plan ($5/month), both drawing from the
same on-chain SubscriptionAuthority/token account, each backed by its own PDA-controlled
SubscriptionDelegation. Cancel or resume either independently. Simulate an actual billing cycle
where the merchant pulls a payment on-chain in real time.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 · shadcn/ui (base-nova) · Lucide icons |
| State | Zustand v5 |
| Wallet | `@solana/wallet-adapter-react` + `@solana/wallet-adapter-react-ui` |
| Program SDK | `@solana/subscriptions` v0.3 · `@solana/kit` v6 |
| Token ops | `@solana/spl-token` |
| Dates | date-fns v4 |

---

## How it works

### Core concept: one token account, many delegations

The Subscriptions Program introduces a **SubscriptionAuthority** PDA — one per `(user, tokenMint)` pair.
Every subscription (Spotify, Netflix, and any future service) shares that single authority. Under
the hood each subscription is its own **SubscriptionDelegation** PDA: it records billing terms,
the amount already pulled in the current period, and when the period resets.

```
[User wallet]
    └── SubscriptionAuthority  (per mint — created once, ever)
            ├── SubscriptionDelegation  ←  Spotify plan ($2 / 720h)
            └── SubscriptionDelegation  ←  Netflix plan ($5 / 720h)
```

### Wallet ↔ SDK bridge

`@solana/subscriptions` v0.3 exports overlay instruction builders that return Kit `Instruction`
objects. The browser wallet flow uses `@solana/wallet-adapter-react` (multi-wallet, battle-tested).
`lib/solana/legacy-bridge.ts` converts each Kit `Instruction` into a classic web3.js
`TransactionInstruction` — a straightforward field mapping — then wraps them into a v0
`VersionedTransaction` for the wallet to sign. Server-side routes use Kit natively with a real
`KeyPairSigner` — no bridging needed there.

### Demo USDC (TUSDC)

A local 6-decimal SPL token mint, created during bootstrap, whose mint authority is a
server-controlled keypair. The `/api/faucet` route hands out 100 TUSDC to any connected wallet
on demand — no third-party faucet dependency.

### Simulated billing

"Simulate billing" calls `/api/pull`. The server uses the merchant keypair to invoke
`transferSubscription`, moving TUSDC from the user's token account to the merchant's ATA —
exactly what a real cron would do. Balance changes are observable on Solscan.

---

## Quick start

### Prerequisites

- Node.js 18+
- A devnet browser wallet (Phantom / Solflare / Backpack) — set to **devnet**

### 1 — Install

```bash
git clone <this-repo>
cd solana-multi-event-listener
npm install
```

### 2 — Bootstrap (one-time)

```bash
npm run bootstrap
```

This command:
1. Generates three server keypairs (mint authority, Spotify merchant, Netflix merchant) → `.env.local`
2. Airdrops devnet SOL to each (retry via <https://faucet.solana.com> if rate-limited)
3. Creates the **Test USDC (TUSDC)** mint (6 decimals)
4. Publishes a **$2/month Spotify plan** and **$5/month Netflix plan** on the Subscriptions Program
5. Writes all public addresses (`NEXT_PUBLIC_USDC_MINT`, `NEXT_PUBLIC_SPOTIFY_OWNER`, …) into `.env.local`

Safe to re-run — every step is idempotent.

### 3 — Run

```bash
npm run dev
```

Open <http://localhost:3000>, connect a devnet wallet, click **Get test USDC**, then **Subscribe**.

---

## Environment variables

Copy `.env.example` → `.env.local`. `npm run bootstrap` fills everything in automatically.

```env
# Public (browser-safe)
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_CLUSTER=devnet
NEXT_PUBLIC_USDC_MINT=            # set by bootstrap
NEXT_PUBLIC_SPOTIFY_OWNER=        # set by bootstrap
NEXT_PUBLIC_NETFLIX_OWNER=        # set by bootstrap
NEXT_PUBLIC_SPOTIFY_PLAN_ID=1
NEXT_PUBLIC_NETFLIX_PLAN_ID=1

# Server-only secrets (NEVER commit)
MINT_AUTHORITY_SECRET_KEY=        # base58 64-byte secret
SPOTIFY_MERCHANT_SECRET_KEY=      # base58 64-byte secret
NETFLIX_MERCHANT_SECRET_KEY=      # base58 64-byte secret
```

> `.env.local` is already in `.gitignore` — never commit it.

---

## Project structure

```
app/
  layout.tsx               Root layout (Providers, dark theme, metadata)
  page.tsx                 Main dashboard (client component)
  api/faucet/route.ts      POST — mint 100 TUSDC to caller
  api/pull/route.ts        POST — merchant pulls one billing period's payment

components/
  providers.tsx            Wallet + Theme + Tooltip + Sonner toaster
  navbar.tsx               Sticky header — logo, cluster badge, wallet button
  theme-provider.tsx       next-themes wrapper (dark forced)
  dashboard/
    balance-card.tsx       TUSDC balance + faucet button
    plan-card.tsx          Per-service card with live plan data + subscribe flow
    subscription-list.tsx  All user SubscriptionDelegations from chain
    subscription-item.tsx  Cancel / Resume / Simulate billing per subscription
    activity-feed.tsx      Session transaction log with copy + Solscan links

lib/
  solana/
    constants.ts           Program ID, service config, URL helpers
    rpc.ts                 Shared Kit RPC + WebSocket clients
    server-signers.ts      Load merchant keypairs from env (server-only)
    send.ts                Kit-native send+confirm for server routes (server-only)
    legacy-bridge.ts       Kit Instruction → web3.js TransactionInstruction
    queries.ts             Read plan / authority / subscriptions from chain
    token.ts               ATA derivation + balance reads
    instructions.ts        Pure instruction builders (no side effects)
    actions.ts             Client orchestration (init → subscribe → cancel → resume)
    index.ts               Public barrel re-export
  store.ts                 Zustand: refresh signal + activity log
  hooks.ts                 useUsdcBalance · usePlan · useMySubscriptions

scripts/
  bootstrap.ts             One-time devnet setup
  load-env.ts              Loads .env + .env.local before other imports (ESM import order)
```

---

## API routes

### `POST /api/faucet`
```json
// body
{ "wallet": "<base58 public key>" }
// response
{ "signature": "...", "amount": 100 }
```
Mints 100 TUSDC to the wallet's ATA. Server-signed by the mint authority.

### `POST /api/pull`
```json
// body
{ "serviceId": "spotify" | "netflix", "subscriber": "<base58>" }
// response
{ "signature": "...", "amount": 2 }
```
Merchant's server keypair calls `transferSubscription`, pulling one period's payment.

---

## Security notes

- **Secret keys in env**: acceptable for a personal devnet demo. Use a KMS for production.
- **No rate limiting on `/api/faucet`**: add middleware before any public deployment.
- **`npm audit` reports 18 issues**: all from `bigint-buffer` (transitive, via `@solana/web3.js`).
  This is a known, ecosystem-wide issue. The specific finding is not exploitable in controlled-input
  usage. See [solana-web3.js#2076](https://github.com/solana-labs/solana-web3.js/issues/2076).

---

## Roadmap

- [ ] Precise cancelled/active state from on-chain flags (currently inferred from `expiresAtTs`)
- [ ] Export activity feed as JSON
- [ ] RPC endpoint input in the UI
- [ ] Light/dark theme toggle
- [ ] Mainnet mode: real USDC mint (`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`)
- [ ] Cron-based auto-pull script (`npm run pull-all`)
- [ ] Subscriber count per plan card
- [ ] Plan creation UI for custom merchants (no bootstrap script needed)

---

## Learn more

- [Solana Subscriptions Program repo](https://github.com/solana-foundation/subscriptions)
- [Solana Foundation blog post](https://solana.com/news/subscriptions-and-allowances)
- [Official demo app](https://solana-subscriptions-program.vercel.app/)
- [`@solana/kit` docs](https://github.com/solana-labs/solana-web3.js)
- [Wallet adapter docs](https://github.com/solana-labs/wallet-adapter)
