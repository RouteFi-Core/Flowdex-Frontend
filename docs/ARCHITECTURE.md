# Architecture

This document explains the system design, data flow, and key architectural decisions behind the Flowdex frontend.

---

## Table of Contents

- [Overview](#overview)
- [High-Level Architecture](#high-level-architecture)
- [Frontend Layer](#frontend-layer)
  - [Routing & Pages](#routing--pages)
  - [State Management](#state-management)
  - [Data Fetching](#data-fetching)
  - [API Abstraction](#api-abstraction)
- [Wallet Integration](#wallet-integration)
- [Feature Module Pattern](#feature-module-pattern)
- [Theming](#theming)
- [Environment Configuration](#environment-configuration)
- [Key Design Decisions](#key-design-decisions)
- [Data Flow: Swap](#data-flow-swap)
- [Data Flow: Route Visualization](#data-flow-route-visualization)

---

## Overview

Flowdex is a **client-side Next.js application** that communicates with:

1. The **Flowdex backend API** — a routing engine that computes optimal swap paths across Stellar's AMM pools and SDEX order books.
2. The **Stellar Horizon API** — for on-chain data (account balances, transaction status).
3. The **Soroban RPC** — for Soroban smart contract interactions (future).
4. A **Stellar wallet** (Freighter, xBull, Albedo, or WalletConnect) — for signing transactions.

The frontend never holds private keys. All signing happens inside the user's wallet extension.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────────┐  │
│  │  Next.js App │   │ Zustand Store│   │  Wallet (ext.) │  │
│  │  (App Router)│◄──│  (client)    │   │  Freighter etc │  │
│  └──────┬───────┘   └──────────────┘   └───────┬────────┘  │
│         │                                       │           │
│         │ React Query                           │ sign XDR  │
│         ▼                                       ▼           │
│  ┌──────────────┐                    ┌──────────────────┐   │
│  │ Flowdex API  │                    │  Stellar Wallets │   │
│  │  /routing    │                    │  Kit             │   │
│  │  /liquidity  │                    └──────────────────┘   │
│  │  /swap       │                                           │
│  └──────┬───────┘                                           │
└─────────┼─────────────────────────────────────────────────-─┘
          │
          ▼
┌─────────────────────┐     ┌──────────────────────┐
│  Flowdex Backend    │────►│  Stellar Network      │
│  (routing engine)   │     │  Horizon / Soroban    │
└─────────────────────┘     └──────────────────────┘
```

---

## Frontend Layer

### Routing & Pages

The app uses the **Next.js App Router**. All pages live under `src/app/`:

| Route | Page | Description |
|---|---|---|
| `/` | `page.tsx` | Redirects to `/swap` |
| `/swap` | `swap/page.tsx` | Main swap interface |
| `/liquidity` | `liquidity/page.tsx` | Liquidity pool dashboard |
| `/dev` | `dev/page.tsx` | Developer console (feature-flagged) |

The root layout (`layout.tsx`) wraps every page with the `Providers` component (React Query + ThemeProvider) and the `Navbar`.

### State Management

Flowdex uses **Zustand** for global client state. There are three stores:

| Store | Responsibility |
|---|---|
| `swap.store.ts` | Input/output assets, amount, slippage, active quote, active transaction |
| `routing.store.ts` | Route comparison mode, selected quote, raw JSON toggle |
| `wallet.store.ts` | Wallet connection state (address, network, wallet type) — persisted to `localStorage` |

Stores are kept small and focused. They hold UI state and derived values, not raw server data (that lives in React Query's cache).

### Data Fetching

All server data is fetched and cached with **TanStack Query v5**. Hooks live in `src/features/*/hooks.ts`:

| Hook | Behaviour |
|---|---|
| `useRouteQuote` | Polls every 15 s while the window is focused. Disabled when inputs are incomplete. |
| `useSimulateRoute` | Mutation — fires on demand from the dev console. |
| `useExecuteSwap` | Mutation — fires when the user confirms a swap. |
| `useTransaction` | Polls every 3 s while status is `pending` or `signing`. Stops automatically on terminal states. |
| `usePools` | Cached for 60 s. |
| `usePriceHistory` | Cached for 60 s per pool + interval combination. |

### API Abstraction

All HTTP calls go through a single **Axios instance** (`src/lib/api-client.ts`) that:

- Sets the base URL from `env.api.baseUrl`
- Applies a 15 s timeout
- Normalises error messages from the API's error envelope into plain `Error` objects

Feature-specific API functions live in `src/features/*/api.ts`. Components never call `axios` directly.

---

## Wallet Integration

Wallet connectivity is handled by **Stellar Wallets Kit** (`@creit.tech/stellar-wallets-kit`), which provides a unified interface over multiple wallet providers.

The integration lives in `src/lib/wallet.ts` and exposes a `useWallet` hook with three operations:

- `connect()` — opens the wallet selection modal, retrieves the user's address, and writes it to the Zustand wallet store.
- `disconnect()` — clears the store and resets the kit singleton.
- `signTransaction(xdr)` — passes a Stellar transaction XDR to the active wallet for signing and returns the signed XDR.

The signed XDR is then submitted to the Flowdex backend via `swapApi.executeSwap()`, which broadcasts it to the Stellar network.

**Security note:** The frontend never constructs or inspects the transaction envelope beyond passing it to the wallet. The backend is responsible for building a valid, safe transaction.

---

## Feature Module Pattern

Each product feature is a self-contained module under `src/features/`:

```
src/features/swap/
├── api.ts          ← HTTP calls
├── hooks.ts        ← React Query hooks
└── RouteBreakdown.tsx  ← Feature-specific UI
```

This co-location keeps related code together and makes it easy to delete or replace a feature without hunting across the codebase. Generic, reusable UI components live in `src/components/`.

The rule of thumb:
- If a component is used in more than one feature → `src/components/`
- If a component is only used within one feature → `src/features/<feature>/`

---

## Theming

Theming is implemented with **CSS custom properties** defined in `src/app/globals.css`. The `next-themes` library toggles the `dark` class on `<html>`, which switches the variable set.

All Tailwind colour utilities (`bg-background`, `text-foreground`, `border-border`, etc.) reference these variables, so the entire UI responds to theme changes without any JavaScript logic in components.

---

## Environment Configuration

All environment access is centralised in `src/lib/env.ts`. This module:

- Reads `process.env` once at module load time
- Throws a clear error for missing required variables
- Exports a typed `env` object consumed everywhere else

This prevents scattered `process.env.NEXT_PUBLIC_*` calls and makes it easy to audit what configuration the app depends on.

---

## Key Design Decisions

### Why Zustand over Redux or Context?

Zustand has minimal boilerplate, no provider wrapping required for most stores, and excellent TypeScript inference. For an app of this size, Redux would add ceremony without benefit. React Context is fine for static values (theme, locale) but causes unnecessary re-renders for frequently-updated state like swap inputs.

### Why TanStack Query over SWR?

TanStack Query v5 has first-class support for mutations with optimistic updates, fine-grained refetch control (e.g., polling only while pending), and better devtools. Both are good choices; TanStack Query's API is more expressive for the polling patterns Flowdex needs.

### Why not use the Stellar SDK directly on the frontend?

The Stellar SDK is included as a dependency for type definitions and utility functions (e.g., asset formatting). However, all routing logic and transaction construction happens on the Flowdex backend. This keeps the frontend thin, makes the routing algorithm easy to update without a frontend deploy, and avoids exposing routing logic to users.

### Why App Router over Pages Router?

App Router enables React Server Components, streaming, and per-segment layouts. Even though most of Flowdex is client-side (wallet state, live quotes), the App Router's layout system and metadata API are cleaner than the Pages Router equivalent.

---

## Data Flow: Swap

```
User types amount
       │
       ▼
useSwapStore.setInputAmount()
       │
       ▼
useRouteQuote() detects valid params
       │  (debounced via staleTime)
       ▼
GET /routing/quote  ──►  Flowdex API  ──►  Stellar AMM / SDEX
       │
       ▼
RouteQuote stored in React Query cache
       │
       ├──► SwapForm renders estimated output + fees
       └──► RouteBreakdown renders split paths + RouteGraph
       
User clicks "Swap"
       │
       ▼
useExecuteSwap.mutate({ quoteId, signedXdr, walletAddress })
       │
       ├── signTransaction(xdr)  ──►  Wallet extension (user approves)
       │
       ▼
POST /swap/execute  ──►  Flowdex API  ──►  Stellar Network
       │
       ▼
Transaction stored in swap.store.activeTransaction
       │
       ▼
useTransaction() polls /swap/transactions/:id every 3 s
       │
       ▼
TransactionPanel shows live status + Explorer link
```

## Data Flow: Route Visualization

```
RouteQuote.paths[]
       │
       ▼
RouteBreakdown maps paths → split percentage bars
       │
       ▼
RouteGraph.buildGraph()
  - Creates a ReactFlow Node per asset hop
  - Creates a ReactFlow Edge per hop transition
  - Labels edges with split percentage
       │
       ▼
ReactFlow renders interactive graph
```
