<div align="center">

# ⬡ Flowdex

**Smart liquidity routing and FX optimization on the Stellar network.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Stellar](https://img.shields.io/badge/Stellar-Network-7B61FF?logo=stellar)](https://stellar.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Live Demo](https://flowdex.io) · [Report a Bug](https://github.com/flowdex/flowdex-frontend/issues) · [Request a Feature](https://github.com/flowdex/flowdex-frontend/issues)

</div>

---

## What is Flowdex?

Flowdex is an open-source frontend for a **liquidity routing and FX optimization layer** built on [Stellar](https://stellar.org). It finds the best path across Stellar's AMM pools and order books to give users the most efficient swap — splitting routes across multiple paths when that yields a better price.

Think of it as a DEX aggregator purpose-built for Stellar's unique liquidity model: native AMM pools, SDEX order books, and Soroban smart contracts all in one interface.

### Key capabilities

| Feature | Description |
|---|---|
| **Smart routing** | Automatically finds the optimal path (or split path) for any asset pair |
| **Route visualization** | Graph-style UI showing split percentages and hop-by-hop paths |
| **Liquidity dashboard** | Browse pools, TVL, volume, fees, and APR at a glance |
| **Price charts** | Historical price data per pool with 1h / 1d / 1w intervals |
| **Transaction panel** | Real-time swap status with Stellar Explorer links |
| **Slippage control** | Preset and custom slippage tolerance |
| **Route comparison** | Compare Best / Fastest / Cheapest routes side-by-side |
| **Developer console** | API playground with raw JSON output and simulation mode |
| **Dark mode** | Full dark/light theme support |
| **Wallet integration** | Freighter, xBull, Albedo, and WalletConnect via Stellar Wallets Kit |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org) (App Router) |
| Language | [TypeScript 5](https://typescriptlang.org) |
| Styling | [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| State | [Zustand](https://zustand-demo.pmnd.rs) |
| Data fetching | [TanStack Query v5](https://tanstack.com/query) |
| Charts | [Recharts](https://recharts.org) |
| Route graph | [React Flow](https://reactflow.dev) |
| Wallet | [Stellar Wallets Kit](https://github.com/Creit-Tech/Stellar-Wallets-Kit) + [Freighter API](https://www.freighter.app) |
| Stellar SDK | [stellar-sdk](https://github.com/stellar/js-stellar-sdk) |
| Notifications | [Sonner](https://sonner.emilkowal.ski) |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.17
- **npm** ≥ 9 (or pnpm / yarn)
- A [Freighter](https://www.freighter.app) wallet (or any Stellar Wallets Kit-compatible wallet) for testing swaps

### 1. Clone the repository

```bash
git clone https://github.com/flowdex/flowdex-frontend.git
cd flowdex-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the values:

```env
# Stellar network — TESTNET for local development
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Flowdex backend API
NEXT_PUBLIC_FLOWDEX_API_URL=https://api.flowdex.io/v1

# Enable developer console
NEXT_PUBLIC_ENABLE_DEV_MODE=true
NEXT_PUBLIC_ENABLE_ROUTE_SIMULATION=true
```

> **Never commit `.env.local`** — it is already in `.gitignore`.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app redirects to `/swap` by default.

> **Note:** If you see a blank page or routing error, make sure `NEXT_PUBLIC_FLOWDEX_API_URL` is set in `.env.local` — it is the only required variable.

### 5. Build for production

```bash
npm run build
npm run start
```

The production server runs on [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & layouts
│   ├── layout.tsx          # Root layout (fonts, metadata, providers)
│   ├── providers.tsx       # React Query + ThemeProvider wrapper
│   ├── globals.css         # CSS variables & Tailwind base
│   ├── page.tsx            # Root redirect → /swap
│   ├── swap/page.tsx       # Swap interface
│   ├── liquidity/page.tsx  # Liquidity dashboard
│   └── dev/page.tsx        # Developer console (feature-flagged)
│
├── components/             # Reusable, stateless UI components
│   ├── SwapForm.tsx
│   ├── RouteGraph.tsx
│   ├── LiquidityTable.tsx
│   ├── TransactionPanel.tsx
│   ├── AssetSelector.tsx
│   ├── SlippageControl.tsx
│   ├── PriceChart.tsx
│   ├── WalletButton.tsx
│   └── Navbar.tsx
│
├── features/               # Feature-scoped modules (co-locate logic + UI)
│   ├── routing/
│   │   ├── api.ts          # Routing API calls
│   │   └── hooks.ts        # React Query hooks
│   ├── swap/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   └── RouteBreakdown.tsx
│   ├── liquidity/
│   │   ├── api.ts
│   │   └── hooks.ts
│   └── dev/
│       └── DevConsole.tsx
│
├── stores/                 # Zustand global state
│   ├── swap.store.ts
│   ├── routing.store.ts
│   └── wallet.store.ts
│
├── lib/                    # Shared utilities and singletons
│   ├── api-client.ts       # Axios instance with interceptors
│   ├── env.ts              # Typed environment config
│   ├── utils.ts            # cn(), formatAmount(), etc.
│   └── wallet.ts           # Stellar Wallets Kit integration
│
└── types/
    └── index.ts            # Shared TypeScript types
```

For a deeper explanation of every layer, see [STRUCTURE.md](docs/STRUCTURE.md).

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking (no emit) |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing |

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_STELLAR_NETWORK` | No | `TESTNET` | `MAINNET`, `TESTNET`, or `FUTURENET` |
| `NEXT_PUBLIC_HORIZON_URL` | No | Testnet Horizon | Stellar Horizon endpoint |
| `NEXT_PUBLIC_SOROBAN_RPC_URL` | No | Testnet Soroban | Soroban RPC endpoint |
| `NEXT_PUBLIC_FLOWDEX_API_URL` | Yes | — | Flowdex backend base URL |
| `FLOWDEX_API_SECRET` | No | — | Server-side API secret (never exposed to browser) |
| `NEXT_PUBLIC_ENABLE_DEV_MODE` | No | `false` | Show developer console in nav |
| `NEXT_PUBLIC_ENABLE_ROUTE_SIMULATION` | No | `false` | Enable simulation-only routing |

---

## Wallet Support

Flowdex uses [Stellar Wallets Kit](https://github.com/Creit-Tech/Stellar-Wallets-Kit) to support multiple wallets through a single unified interface:

- **Freighter** (recommended) — browser extension
- **xBull** — browser extension
- **Albedo** — web-based signer
- **WalletConnect** — mobile wallets

The wallet modal is triggered from the `Connect` button in the navbar. Once connected, the wallet address is persisted in `localStorage` (via Zustand `persist` middleware) so users stay connected across page refreshes.

---

## Developer Console

When `NEXT_PUBLIC_ENABLE_DEV_MODE=true`, a **Dev Console** link appears in the navbar at `/dev`. It lets you:

- Craft arbitrary routing API requests as JSON
- Run simulations without executing any on-chain transaction
- Inspect the raw route response (paths, fees, split percentages)
- Toggle between raw JSON and formatted views

This is useful for integrators building on top of the Flowdex API.

---

## Contributing

We welcome contributions of all kinds — bug fixes, new features, documentation improvements, and more. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

---

## Architecture

For a detailed explanation of the system design, data flow, and key decisions, see [ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

## Acknowledgements

- [Stellar Development Foundation](https://stellar.org) for the network and SDKs
- [Creit Tech](https://github.com/Creit-Tech) for Stellar Wallets Kit
- [shadcn](https://ui.shadcn.com) for the component system
- [React Flow](https://reactflow.dev) for the route graph renderer
