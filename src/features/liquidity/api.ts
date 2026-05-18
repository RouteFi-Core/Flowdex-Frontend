import { apiClient } from "@/lib/api-client";
import type { LiquidityPool, PricePoint, ApiResponse } from "@/types";

export const liquidityApi = {
  getPools: async (): Promise<LiquidityPool[]> => {
    const { data } = await apiClient.get<ApiResponse<LiquidityPool[]>>("/liquidity/pools");
    return data.data;
  },

  getPool: async (id: string): Promise<LiquidityPool> => {
    const { data } = await apiClient.get<ApiResponse<LiquidityPool>>(
      `/liquidity/pools/${id}`
    );
    return data.data;
  },

  getPriceHistory: async (
    poolId: string,
    interval: "1h" | "1d" | "1w" = "1d"
  ): Promise<PricePoint[]> => {
    const { data } = await apiClient.get<ApiResponse<PricePoint[]>>(
      `/liquidity/pools/${poolId}/history`,
      { params: { interval } }
    );
    return data.data;
  },
};
