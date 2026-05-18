import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { swapApi, type ExecuteSwapParams } from "@/features/swap/api";
import { useSwapStore } from "@/stores/swap.store";
import { useWalletStore } from "@/stores/wallet.store";

export const swapKeys = {
  transaction: (id: string) => ["swap", "transaction", id] as const,
  history: (wallet: string) => ["swap", "history", wallet] as const,
};

export function useExecuteSwap() {
  const qc = useQueryClient();
  const { setActiveTransaction, reset } = useSwapStore();
  const address = useWalletStore((s) => s.address);

  return useMutation({
    mutationFn: (params: ExecuteSwapParams) => swapApi.executeSwap(params),
    onSuccess: (tx) => {
      setActiveTransaction(tx);
      if (address) {
        qc.invalidateQueries({ queryKey: swapKeys.history(address) });
      }
    },
    onError: () => reset(),
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: swapKeys.transaction(id),
    queryFn: () => swapApi.getTransaction(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "pending" || status === "signing" ? 3_000 : false;
    },
  });
}

export function useTransactionHistory() {
  const address = useWalletStore((s) => s.address);
  return useQuery({
    queryKey: address ? swapKeys.history(address) : ["swap", "history", "disconnected"],
    queryFn: () => swapApi.getTransactionHistory(address!),
    enabled: !!address,
    staleTime: 30_000,
  });
}
