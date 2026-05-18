import { apiClient } from "@/lib/api-client";
import type { RouteQuote, ApiResponse } from "@/types";

export interface QuoteParams {
  inputAssetCode: string;
  inputAssetIssuer: string | null;
  outputAssetCode: string;
  outputAssetIssuer: string | null;
  inputAmount: string;
  slippageTolerance: number;
  simulationOnly?: boolean;
}

export const routingApi = {
  getQuote: async (params: QuoteParams): Promise<RouteQuote> => {
    const { data } = await apiClient.post<ApiResponse<RouteQuote>>(
      "/routing/quote",
      params
    );
    return data.data;
  },

  simulateRoute: async (params: QuoteParams): Promise<RouteQuote> => {
    const { data } = await apiClient.post<ApiResponse<RouteQuote>>(
      "/routing/simulate",
      { ...params, simulationOnly: true }
    );
    return data.data;
  },
};
