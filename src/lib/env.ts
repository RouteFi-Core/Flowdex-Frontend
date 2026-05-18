/**
 * Centralised environment configuration.
 * All env access goes through this module — never read process.env directly in features.
 */

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export const env = {
  stellar: {
    network: optional("NEXT_PUBLIC_STELLAR_NETWORK", "TESTNET") as
      | "MAINNET"
      | "TESTNET"
      | "FUTURENET",
    horizonUrl: optional(
      "NEXT_PUBLIC_HORIZON_URL",
      "https://horizon-testnet.stellar.org"
    ),
    sorobanRpcUrl: optional(
      "NEXT_PUBLIC_SOROBAN_RPC_URL",
      "https://soroban-testnet.stellar.org"
    ),
  },
  api: {
    baseUrl: optional("NEXT_PUBLIC_FLOWDEX_API_URL", "https://api.flowdex.io/v1"),
  },
  features: {
    devMode: optional("NEXT_PUBLIC_ENABLE_DEV_MODE", "false") === "true",
    routeSimulation: optional("NEXT_PUBLIC_ENABLE_ROUTE_SIMULATION", "false") === "true",
  },
} as const;
