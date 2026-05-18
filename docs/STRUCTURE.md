# Project Structure

A detailed walkthrough of every directory and file in the Flowdex frontend.

---

## Root

```
flowdex-frontend/
├── src/                  # All application source code
├── public/               # Static assets (favicon, og-image, etc.)
├── docs/                 # Project documentation
├── .env.example          # Environment variable template
├── .gitignore
├── .prettierrc           # Prettier config
├── next.config.ts        # Next.js config
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── README.md
└── CONTRIBUTING.md
```

---

## `src/app/` — Pages & Layouts

The Next.js App Router directory. Every folder with a `page.tsx` becomes a route.

```
src/app/
├── layout.tsx          # Root layout — wraps every page
│                       # Sets HTML lang, fonts, metadata, and mounts Providers + Navbar
├── providers.tsx       # Client component — QueryClientProvider + ThemeProvider + Toaster
├── globals.css         # Tailwind directives + CSS custom properties for theming
├── page.tsx            # / → redirect to /swap
├── swap/
│   └── page.tsx        # /swap — main swap interface
├── liquidity/
│   └── page.tsx        # /liquidity — pool dashboard
└── dev/
    └── page.tsx        # /dev — developer console (only rendered when ENABLE_DEV_MODE=true)
```

**Conventions:**
- Pages are thin. They import feature components and lay them out. No business logic.
- `metadata` exports are defined in each `page.tsx` for SEO.
- The `providers.tsx` is a separate `"use client"` file so the root layout can remain a Server Component.

---

## `src/components/` — Reusable UI Components

Generic, stateless (or lightly stateful) components used across multiple features.

```
src/components/
├── Navbar.tsx            # Top navigation bar with links, theme toggle, wallet button
├── WalletButton.tsx      # Connect / disconnect wallet CTA
├── SwapForm.tsx          # Swap input form — asset selectors, amount input, quote display
├── AssetSelector.tsx     # Dropdown for selecting a Stellar asset
├── SlippageControl.tsx   # Slippage tolerance popover (presets + custom input)
├── RouteGraph.tsx        # ReactFlow graph visualising split routing paths
├── LiquidityTable.tsx    # Table of liquidity pools with TVL, volume, fee, APR
├── PriceChart.tsx        # Recharts area chart for pool price history
└── TransactionPanel.tsx  # Live swap status card with Explorer link
```

**Rule:** A component belongs here if it is used in more than one feature, or if it has no feature-specific business logic. If it only makes sense within one feature, it lives in `src/features/<feature>/`.

---

## `src/features/` — Feature Modules

Each subdirectory is a self-contained vertical slice: API calls, React Query hooks, and any feature-specific UI components.

```
src/features/
│
├── routing/
│   ├── api.ts            # routingApi.getQuote(), routingApi.simulateRoute()
│   └── hooks.ts          # useRouteQuote(), useSimulateRoute()
│
├── swap/
│   ├── api.ts            # swapApi.executeSwap(), getTransaction(), getTransactionHistory()
│   ├── hooks.ts          # useExecuteSwap(), useTransaction(), useTransactionHistory()
│   └── RouteBreakdown.tsx  # Route comparison tabs + split path bars + RouteGraph
│
├── liquidity/
│   ├── api.ts            # liquidityApi.getPools(), getPool(), getPriceHistory()
│   └── hooks.ts          # usePools(), usePool(), usePriceHistory()
│
└── dev/
    └── DevConsole.tsx    # JSON editor + simulate button + raw response viewer
```

**Why this structure?**

Co-locating the API, hooks, and UI for a feature means:
- You can understand a feature by reading one directory.
- Deleting a feature is a single `rm -rf`.
- There's no ambiguity about where to add new code for a feature.

---

## `src/stores/` — Zustand State

Global client state. Each store is a single file exporting one `useXxxStore` hook.

```
src/stores/
├── swap.store.ts       # inputAsset, outputAsset, inputAmount, slippage, quote, activeTransaction
├── routing.store.ts    # compareMode (best/fastest/cheapest), showRawJson
└── wallet.store.ts     # connected, address, network, walletType — persisted to localStorage
```

**Conventions:**
- Stores hold UI state and user preferences, not server data.
- Server data lives in React Query's cache (accessed via hooks).
- `wallet.store.ts` uses Zustand's `persist` middleware to survive page refreshes.

---

## `src/lib/` — Shared Utilities & Singletons

```
src/lib/
├── api-client.ts   # Axios instance with base URL, timeout, and error normalisation
├── env.ts          # Typed, validated environment config — the only place process.env is read
├── utils.ts        # cn() (Tailwind class merge), formatAmount(), shortenAddress(), basisPointsToPercent()
└── wallet.ts       # useWallet() hook — wraps Stellar Wallets Kit (connect, disconnect, signTransaction)
```

**`env.ts` is the single source of truth for configuration.** All feature code imports from `@/lib/env` rather than reading `process.env` directly. This makes it trivial to audit what config the app needs and to mock it in tests.

---

## `src/types/` — Shared TypeScript Types

```
src/types/
└── index.ts    # Asset, RouteHop, RoutePath, RouteQuote, LiquidityPool,
                # PricePoint, Transaction, TxStatus, WalletState, WalletType,
                # ApiResponse<T>, ApiError
```

All types shared between features live here. Feature-specific types (e.g., API request params) are defined in the feature's `api.ts`.

---

## `docs/` — Documentation

```
docs/
├── ARCHITECTURE.md   # System design, data flow diagrams, key decisions
├── STRUCTURE.md      # This file — directory and file reference
├── API.md            # Flowdex backend API reference
└── DEPLOYMENT.md     # How to deploy to Vercel / self-host
```

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| React components | PascalCase | `SwapForm.tsx` |
| Hooks | camelCase, `use` prefix | `useRouteQuote` |
| Stores | camelCase, `.store.ts` suffix | `swap.store.ts` |
| API modules | camelCase, `.api.ts` or `api.ts` | `routing/api.ts` |
| Types | PascalCase | `RouteQuote`, `TxStatus` |
| CSS variables | kebab-case | `--primary-foreground` |
| Env variables | SCREAMING_SNAKE_CASE | `NEXT_PUBLIC_STELLAR_NETWORK` |

---

## Import Paths

Always use the `@/` alias for internal imports:

```ts
// ✅ correct
import { useSwapStore } from "@/stores/swap.store";
import { cn } from "@/lib/utils";

// ❌ avoid
import { useSwapStore } from "../../stores/swap.store";
```

The alias is configured in `tsconfig.json` and resolved by Next.js automatically.
