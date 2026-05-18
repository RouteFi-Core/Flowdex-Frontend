import { apiClient } from "@/lib/api-client";
import type { Transaction, ApiResponse } from "@/types";

export interface ExecuteSwapParams {
  quoteId: string;
  signedXdr: string;
  walletAddress: string;
}

export const swapApi = {
  executeSwap: async (params: ExecuteSwapParams): Promise<Transaction> => {
    const { data } = await apiClient.post<ApiResponse<Transaction>>(
      "/swap/execute",
      params
    );
    return data.data;
  },

  getTransaction: async (id: string): Promise<Transaction> => {
    const { data } = await apiClient.get<ApiResponse<Transaction>>(
      `/swap/transactions/${id}`
    );
    return data.data;
  },

  getTransactionHistory: async (walletAddress: string): Promise<Transaction[]> => {
    const { data } = await apiClient.get<ApiResponse<Transaction[]>>(
      "/swap/transactions",
      { params: { wallet: walletAddress } }
    );
    return data.data;
  },
};
