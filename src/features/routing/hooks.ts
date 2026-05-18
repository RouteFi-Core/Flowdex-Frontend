import { useQuery, useMutation } from "@tanstack/react-query";
import { routingApi, type QuoteParams } from "@/features/routing/api";
import { useSwapStore } from "@/stores/swap.store";

export const routingKeys = {
  quote: (params: QuoteParams) => ["routing", "quote", params] as const,
  simulate: (params: QuoteParams) => ["routing", "simulate", params] as const,
};

/** Fetch a live route quote. Refetches every 15 s while the window is focused. */
export function useRouteQuote(params: QuoteParams | null) {
  return useQuery({
    queryKey: params ? routingKeys.quote(params) : ["routing", "quote", "disabled"],
    queryFn: () => routingApi.getQuote(params!),
    enabled: !!params,
    staleTime: 15_000,
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
  });
}

/** Simulate a route without executing — used in dev mode. */
export function useSimulateRoute() {
  const setQuote = useSwapStore((s) => s.setQuote);

  return useMutation({
    mutationFn: routingApi.simulateRoute,
    onSuccess: (quote) => setQuote(quote),
  });
}
