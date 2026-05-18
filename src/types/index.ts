// ─── Assets ───────────────────────────────────────────────────────────────────

export interface Asset {
  code: string;
  issuer: string | null; // null = XLM (native)
  name: string;
  logoUrl?: string;
  decimals: number;
}

// ─── Routing ──────────────────────────────────────────────────────────────────

export interface RouteHop {
  asset: Asset;
  pool: string; // pool address / AMM id
  fee: number; // basis points
}

export interface RoutePath {
  id: string;
  hops: RouteHop[];
  splitPercent: number; // 0–100
  estimatedOutput: string; // stringified bigint
  priceImpact: number; // percentage
}

export interface RouteQuote {
  inputAsset: Asset;
  outputAsset: Asset;
  inputAmount: string;
  estimatedOutput: string;
  minimumOutput: string; // after slippage
  paths: RoutePath[];
  fees: {
    network: string;
    protocol: string;
    total: string;
  };
  slippageTolerance: number; // percentage
  expiresAt: number; // unix ms
  simulationOnly: boolean;
}

// ─── Liquidity ────────────────────────────────────────────────────────────────

export interface LiquidityPool {
  id: string;
  assetA: Asset;
  assetB: Asset;
  reserveA: string;
  reserveB: string;
  totalShares: string;
  fee: number; // basis points
  apr: number; // percentage
  volume24h: string;
  tvl: string;
}

export interface PricePoint {
  timestamp: number;
  price: number;
  volume: number;
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export type TxStatus = "idle" | "signing" | "pending" | "success" | "failed";

export interface Transaction {
  id: string;
  hash?: string;
  status: TxStatus;
  inputAsset: Asset;
  outputAsset: Asset;
  inputAmount: string;
  outputAmount?: string;
  route: RoutePath[];
  createdAt: number;
  confirmedAt?: number;
  error?: string;
}

// ─── Wallet ───────────────────────────────────────────────────────────────────

export type WalletType = "freighter" | "walletconnect" | "albedo" | "xbull";

export interface WalletState {
  connected: boolean;
  address: string | null;
  network: string | null;
  walletType: WalletType | null;
}

// ─── API responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
