import { useQuery } from "@tanstack/react-query";
import { liquidityApi } from "@/features/liquidity/api";

export const liquidityKeys = {
  pools: () => ["liquidity", "pools"] as const,
  pool: (id: string) => ["liquidity", "pool", id] as const,
  history: (poolId: string, interval: string) =>
    ["liquidity", "history", poolId, interval] as const,
};

export function usePools() {
  return useQuery({
    queryKey: liquidityKeys.pools(),
    queryFn: liquidityApi.getPools,
    staleTime: 60_000,
  });
}

export function usePool(id: string) {
  return useQuery({
    queryKey: liquidityKeys.pool(id),
    queryFn: () => liquidityApi.getPool(id),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function usePriceHistory(
  poolId: string,
  interval: "1h" | "1d" | "1w" = "1d"
) {
  return useQuery({
    queryKey: liquidityKeys.history(poolId, interval),
    queryFn: () => liquidityApi.getPriceHistory(poolId, interval),
    enabled: !!poolId,
    staleTime: 60_000,
  });
}
