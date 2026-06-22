# Solana Subscriptions MVP

A full-stack **Next.js 15** application demonstrating real on-chain recurring subscriptions using the official [Solana Subscriptions Program](https://github.com/solana-foundation/subscriptions) (`De1egAFMkMWZSN5rYXRj9CAdheBamobVNubTsi9avR44`) on devnet.

**Live demo concept:** Subscribe to demo "Spotify" ($2/month) and "Netflix" ($5/month) plans with Circle's devnet USDC. Payment is charged immediately on subscribe, then collected monthly by the merchant. Cancel anytime — cancellation is instant and on-chain.

> 🔑 **Key insight:** One USDC token account, two independent delegations. The Subscriptions Program lets a single `SubscriptionAuthority` account govern unlimited delegations to different merchants — all drawing from the same token balance.

---

## Table of Contents

- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Architecture Deep Dive](#architecture-deep-dive)
- [API Routes](#api-routes)
- [The Subscription Flow](#the-subscription-flow)
- [Merchant Dashboard](#merchant-dashboard)
- [Key Engineering Decisions](#key-engineering-decisions)
- [Hard-Won Debugging Lessons](#hard-won-debugging-lessons)
- [Known Limitations](#known-limitations)
- [Roadmap](#roadmap)

---

## How It Works

```
User Wallet (3YKG…)
  └── SubscriptionAuthority PDA  ←  one per (wallet, token mint), created once ever
        ├── SubscriptionDelegation PDA  ←  "Spotify" $2/30 days
        │     delegate = Spotify planPda
        │     expiresAtTs = 0  (active, perpetual)
        │
        └── SubscriptionDelegation PDA  ←  "Netflix" $5/30 days
              delegate = Netflix planPda
              expiresAtTs = 0  (active, perpetual)
```

### Subscribe flow (user-signed)

1. `createAssociatedTokenAccountIdempotent` — ensure user's USDC ATA exists
2. `initSubscriptionAuthority` — one-time setup per (wallet, USDC) pair; sets the SubscriptionAuthority PDA as the **delegate** on the user's USDC ATA (full delegation, `u64::MAX` tokens)
3. `subscribe` — creates a `SubscriptionDelegation` account tied to the merchant's plan; stores billing terms snapshot

### Payment collection (merchant-signed)

4. `transferSubscription` — merchant calls this (via our `/api/pull` server route); performs a delegated SPL Token transfer from the user's ATA to the merchant's ATA; enforces per-period limits on-chain

### Cancel / Resume (user-signed)

5. `cancelSubscription` — sets `expiresAtTs` to the end of the current billing period; user keeps access until then
6. `resumeSubscription` — resets `expiresAtTs` back to `0` (perpetual active)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 · shadcn/ui (base-nova) · Lucide icons |
| State | Zustand v5 |
| Wallet | `@solana/wallet-adapter-react` + `@solana/wallet-adapter-react-ui` (Wallet Standard auto-detect) |
| Program SDK | `@solana/subscriptions` v0.3 · `@solana/kit` v6 |
| Token operations | `@solana/spl-token` (ATA derivation, balance reads) |
| Dates | date-fns v4 |
| Scripts | tsx + dotenv |

---

## Project Structure

```
├── app/
│   ├── api/pull/route.ts          POST — merchant pulls subscription payment
│   ├── layout.tsx                 Root layout (Providers, metadata)
│   ├── merchant/page.tsx          Merchant dashboard (/merchant)
│   └── page.tsx                   Subscriber dashboard (/)
│
├── components/
│   ├── dashboard/
│   │   ├── activity-feed.tsx      Transaction log with copy + Solscan links
│   │   ├── balance-card.tsx       USDC + SOL balances with faucet links
│   │   ├── plan-card.tsx          Per-service subscription card (subscribe flow)
│   │   ├── subscription-item.tsx  Single active subscription row
│   │   └── subscription-list.tsx  Lists all user SubscriptionDelegations
│   ├── merchant/
│   │   ├── merchant-balance.tsx   Merchant's USDC ATA balance
│   │   ├── subscriber-list.tsx    Table of subscribers per plan
│   │   └── subscriber-row.tsx     Individual subscriber row with collect button
│   ├── navbar.tsx                 Sticky top bar (logo, cluster badge, wallet button)
│   ├── providers.tsx              Client provider tree (wallet, theme, tooltip, toaster)
│   └── theme-provider.tsx         next-themes wrapper
│
├── lib/
│   ├── hooks.ts                   React hooks: useUsdcBalance, usePlan, useServiceSubscriptions
│   ├── store.ts                   Zustand: refresh signal + activity log
│   └── solana/
│       ├── actions.ts             Client orchestration: subscribe / cancel / resume
│       ├── constants.ts           Program ID, service config, URL helpers
│       ├── index.ts               Public barrel re-export
│       ├── instructions.ts        Pure Kit instruction builders (no side effects)
│       ├── legacy-bridge.ts       Kit Instruction → web3.js TransactionInstruction bridge
│       ├── queries.ts             Read plan / authority / subscriptions from chain
│       ├── rpc.ts                 Shared Kit RPC + WebSocket clients
│       ├── send.ts                Server-side: sign + send + poll for confirmation
│       ├── server-signers.ts      Load merchant keypairs from env (server-only)
│       └── token.ts               ATA derivation + balance reads
│
└── scripts/
    ├── bootstrap.ts               One-time devnet setup (merchants, plans)
    └── load-env.ts                Loads .env + .env.local before other imports
```

---

## Quick Start

### Prerequisites

- **Node.js 18+**
- A **devnet** Solana wallet (Phantom, Solflare, Backpack — set to devnet)
- No Solana CLI required

### 1 — Clone & install

```bash
git clone <repo>
cd solana-multi-event-listener
npm install
```

### 2 — Bootstrap (one-time)

```bash
npm run bootstrap
```

This single command:
1. **Generates two merchant keypairs** (Spotify & Netflix) and saves secrets to `.env.local`
2. **Airdrops devnet SOL** to each merchant for transaction fees
3. **Creates merchant USDC ATAs** for receiving payments
4. **Publishes plans on-chain** — $2/month Spotify and $5/month Netflix, both in Circle devnet USDC
5. **Writes public keys** (`NEXT_PUBLIC_SPOTIFY_OWNER`, etc.) to `.env.local`

Safe to re-run — every step checks on-chain state first.

> **Important:** Bootstrap sets `destinations = [merchantWalletAddress]` in each plan. The program validates the *owner* of the receiver ATA (not the ATA address itself) against this list. Getting this wrong causes `UNAUTHORIZED_DESTINATION` (error 506).

### 3 — Get devnet tokens

| Token | Faucet |
|---|---|
| Devnet USDC | [faucet.circle.com](https://faucet.circle.com) — select Solana + Devnet |
| Devnet SOL | [faucet.solana.com](https://faucet.solana.com) — needed for transaction fees (~0.005 SOL minimum) |

### 4 — Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), connect your devnet wallet, and subscribe.

---

## Environment Variables

`npm run bootstrap` fills everything in automatically. Copy `.env.example` → `.env.local` to start.

```env
# ── Public (browser-safe) ────────────────────────────────────────────────

# Devnet RPC. Replace with Helius/QuickNode for production (public RPC is rate-limited).
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com

# Cosmetic only — affects Solscan links and the cluster badge in the navbar.
NEXT_PUBLIC_CLUSTER=devnet

# Set automatically by `npm run bootstrap`:
NEXT_PUBLIC_SPOTIFY_OWNER=          # Spotify merchant wallet pubkey
NEXT_PUBLIC_NETFLIX_OWNER=          # Netflix merchant wallet pubkey
NEXT_PUBLIC_SPOTIFY_PLAN_ID=3       # On-chain plan ID (planId=3 = correct USDC destinations)
NEXT_PUBLIC_NETFLIX_PLAN_ID=3

# ── Server-only secrets (NEVER commit, NEVER expose to the browser) ──────

# base58-encoded 64-byte secret keys. Set by `npm run bootstrap`.
SPOTIFY_MERCHANT_SECRET_KEY=
NETFLIX_MERCHANT_SECRET_KEY=
```

> `.env.local` is already in `.gitignore`. Never commit it.

---

## Architecture Deep Dive

### The wallet–SDK bridge (`lib/solana/legacy-bridge.ts`)

`@solana/subscriptions` produces **Kit `Instruction` objects**. Browser wallets speak classic web3.js `VersionedTransaction`. Rather than fight the two models together, we:

1. Build Kit instructions with the official overlay functions (correct accounts, correct discriminators)
2. Convert each `Instruction` → `TransactionInstruction` via a small field-mapping function
3. Compile into a `VersionedTransaction` (v0 message)
4. Call **`wallet.signTransaction(tx)`** — sign only, no Phantom network routing
5. Send via **`connection.sendRawTransaction(signed.serialize(), { skipPreflight: true })`** — always hits our devnet connection regardless of what network Phantom is configured for

**Why `signTransaction` instead of `sendTransaction`?**
When Phantom's `sendTransaction` is used, Phantom routes the transaction through its own configured RPC for sending (which could be mainnet). `signTransaction` only requests the cryptographic signature — our `connection` handles all network I/O.

### Server-side transactions (`lib/solana/send.ts`)

Merchant-signed transactions (payment pulls) use Kit's native pipeline:
- Build transaction message with `pipe()` and Kit helpers
- Sign with `signTransactionMessageWithSigners` (real `KeyPairSigner`, not noop)
- Encode to wire format via `getBase64EncodedWireTransaction`
- Send via `connection.sendRawTransaction` with `skipPreflight: true`
- Confirm via **polling** (`getSignatureStatus` every 3s) instead of WebSocket-based `confirmTransaction` — the public devnet WebSocket endpoint drops notifications regularly, causing infinite hangs

### Subscription matching (`lib/solana/queries.ts`)

The program stores the **planPda** (not the merchant wallet) in `header.delegatee` of each `SubscriptionDelegation`. This means looking up "which service does this subscription belong to?" by comparing `delegatee` against merchant addresses always fails.

**Solution:** `getServiceSubscriptions` derives the expected `subscriptionPda` for each known service via `findSubscriptionDelegationPda({ planPda, subscriber })` and fetches it directly. This is O(services) RPC calls but completely deterministic — no address matching required.

### planId migration history

| planId | USDC mint | destinations | Status |
|---|---|---|---|
| 1 | Demo TUSDC | ATA address (wrong) | ❌ abandoned |
| 2 | Circle USDC ✓ | ATA address (wrong) | ❌ abandoned |
| 3 | Circle USDC ✓ | Wallet address ✓ | ✅ current |

The `isCurrentPlan` flag on `ServiceSubscription` lets the UI distinguish a planId=2 subscription (still shows in "My subscriptions" for cancel) from a planId=3 subscription (marks the plan card as "Already subscribed").

---

## API Routes

### `POST /api/pull`

Collects one billing period's payment from a subscriber. Server-signed by the merchant's keypair.

```json
// Request
{ "serviceId": "spotify" | "netflix", "subscriber": "<base58 pubkey>" }

// Response
{ "signature": "5abc...", "amount": 2 }
```

**Smart subscription discovery:** The route tries `planId = 3, 2, 1` in order to find an active subscription, then falls back to `fetchSubscriptionsForUser` (full scan). This handles the case where a user's subscription lives at an older planId — the pull always uses the current plan's `planPda` (which has correct wallet-address destinations) but the actual `subscriptionPda` wherever it lives.

---

## The Subscription Flow

### Subscribing for the first time

```
User clicks "Subscribe — $2 USDC charged today"
│
├── Phase 1 (user signs, wallet popup)
│   ├── createAssociatedTokenAccountIdempotent  ← ensures USDC ATA exists
│   └── initSubscriptionAuthority               ← sets SubscriptionAuthority as delegate on ATA
│
├── (if SubscriptionAuthority already exists, skip Phase 1)
│
├── Phase 2 (user signs, second wallet popup)
│   └── subscribe                               ← creates SubscriptionDelegation PDA
│
└── Phase 3 (merchant signs, no popup)
    └── POST /api/pull → transferSubscription   ← moves $2 USDC from user → merchant
```

### Re-subscribing after cancel

The app detects whether the existing subscription is on the **current planId**:
- **Same planId, cancelled** → `resumeSubscription` (resets `expiresAtTs → 0`)
- **Old planId, any state** → skip it, call `subscribe` on current planId (different PDA)

### Cancel

`cancelSubscription` sets `expiresAtTs = currentPeriodStart + periodLength`. The subscription account still exists — it's just marked "will not renew." The UI dismisses it **immediately** via optimistic local state (no waiting for RPC to confirm the visual update).

---

## Merchant Dashboard

Navigate to `/merchant` via the top navbar.

**What it shows:**
- USDC balance of each merchant wallet (how much has been collected)
- Per-plan subscriber tables with:
  - Subscriber wallet address (links to Solscan)
  - Status: `Collectable` / `Collected` / `Cancelled`
  - Amount collected vs total this period
  - Next billing date
  - Individual **Collect** button + **Collect All** batch button

**How collection works:**

The `POST /api/pull` route is called with the subscriber's address. The server loads the merchant's `KeyPairSigner` from the env secret, builds a `transferSubscription` instruction, and sends it. USDC moves directly from the subscriber's ATA to the merchant's ATA via the Subscriptions program's delegated transfer mechanism.

---

## Key Engineering Decisions

### Why not use `@solana/wallet-adapter-wallets`?

The catch-all package bundles WalletConnect, viem, and Ethereum dependencies — 80+ transitive audit warnings and 5 MB extra. Modern wallets (Phantom, Solflare, Backpack) register via the **Wallet Standard** automatically. `wallets={[]}` in `WalletProvider` is all that's needed.

### Why polling for confirmation instead of WebSocket?

`connection.confirmTransaction({signature, blockhash, lastValidBlockHeight})` subscribes via WebSocket. On the public devnet RPC this notification is **silently dropped** about 30% of the time, causing the confirmation to hang forever. Polling `getSignatureStatus` every 3 seconds with exponential backoff on 429s is slower (3–15s) but never hangs.

### Why `skipPreflight: true` everywhere?

Phantom's and the network's own simulation run against their configured RPC — which may not have propagated a transaction that just confirmed 2 seconds ago. Stale state causes simulation to reject valid transactions. Sending with `skipPreflight: true` lets the transaction reach the network and either succeed or fail with a real program error, instead of a confusing "unexpected error" from stale local simulation.

---

## Hard-Won Debugging Lessons

These took hours to find — documenting them so you don't have to.

### 1. `destinations` stores wallet addresses, not ATA addresses

When creating a plan with `getCreatePlanOverlayInstructionAsync`, `destinations` should be the **wallet address** of the recipient, not the ATA address. The program calls `get_token_account_owner(receiver_ata)` and checks if the *owner* is in `plan.destinations`. Passing the ATA address itself will always produce `UNAUTHORIZED_DESTINATION` (error 506).

```ts
// ❌ Wrong
destinations: [merchantAta.address]      // the SPL token account address

// ✅ Correct
destinations: [merchant.publicKey]       // the wallet that owns that ATA
```

### 2. `header.delegatee` in `SubscriptionDelegation` is the `planPda`, not the merchant wallet

The program stores the **planPda** in `header.delegatee`. Any code that tries to reverse-lookup a service by comparing `delegatee` against `NEXT_PUBLIC_SPOTIFY_OWNER` will always return "Unknown." Use PDA derivation (`findSubscriptionDelegationPda`) to match subscriptions to services.

### 3. Subscription plan terms include `createdAt` — mixing planIds fails

When you `subscribe` to a plan, the subscription stores a snapshot of the plan's terms including `terms.createdAt` (the block timestamp when the plan was **created**). `transferSubscription` validates the subscription's terms against the live plan. If you subscribe under planId=2 and try to pull against planId=3 (a different plan with a different `createdAt`), you get `PLAN_TERMS_MISMATCH` (error 519).

### 4. Phantom simulates on its own RPC, not yours

`wallet.sendTransaction(tx, connection)` lets Phantom route the transaction through its own configured network for simulation and sending. If Phantom is set to mainnet, devnet transactions will always fail simulation. Always use `wallet.signTransaction` + `connection.sendRawTransaction` so your `connection` controls where the transaction goes.

### 5. `server-only` throws in Node.js scripts, not just in Next.js builds

The `server-only` package throws unconditionally when imported from any runtime context. It only works as a compile-time Next.js bundler guard. Never import it in files that are also imported by `tsx` bootstrap scripts.

### 6. Public devnet RPC rate-limits at ~100 req/10s

During the subscribe + immediately-pull flow, the app fires multiple parallel RPC calls (balance, subscription lookup, plan fetch, confirmation polling). This easily exceeds the public endpoint's limit. Use a private RPC (Helius free tier, QuickNode) to avoid 429 errors.

---

## Known Limitations

| Limitation | Notes |
|---|---|
| Public devnet RPC rate limits | Use Helius/QuickNode for stable dev experience |
| No webhook / cron billing | Monthly payment collection is manual ("Collect next payment" button) |
| `npm audit` reports 18 issues | All from `bigint-buffer` transitive via `@solana/web3.js` — ecosystem-wide, not exploitable in this usage |
| Server-side merchant keys in env | Fine for devnet demos; use a KMS for production |
| No mainnet support | Destinations on live plans would need merchant's mainnet wallet; a new bootstrap run would be needed |

---

## Roadmap

- [ ] **Helius webhook** for automatic monthly billing — merchant gets notified when periods reset
- [ ] **Mainnet mode** — switch to real Circle USDC (`EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`) with funded merchant wallets
- [ ] **Dark/light toggle** — currently forced light; toggle would require removing `forcedTheme`
- [ ] **Export subscriptions as CSV** — for merchant accounting
- [ ] **Configurable RPC input** in the UI — so users can paste their own endpoint
- [ ] **Per-plan subscriber count** on the plan card
- [ ] **Plan creation UI** — so merchants can publish their own plans without running a script
- [ ] **Multiple token support** — the program supports any SPL mint

---

## Learn More

| Resource | Link |
|---|---|
| Solana Foundation blog | [Subscriptions and Allowances](https://solana.com/news/subscriptions-and-allowances) |
| Program repository | [github.com/solana-foundation/subscriptions](https://github.com/solana-foundation/subscriptions) |
| Official demo app | [solana-subscriptions-program.vercel.app](https://solana-subscriptions-program.vercel.app/) |
| `@solana/kit` docs | [github.com/anza-xyz/kit](https://github.com/anza-xyz/kit) |
| Wallet Standard | [wallet-standard.github.io](https://wallet-standard.github.io/wallet-standard/) |
| Circle devnet USDC faucet | [faucet.circle.com](https://faucet.circle.com) |
| Helius free RPC | [helius.dev](https://helius.dev) |

---

## License

MIT
