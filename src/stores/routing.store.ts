import { create } from "zustand";
import type { RouteQuote } from "@/types";

export type RouteCompareMode = "best" | "fastest" | "cheapest";

interface RoutingStore {
  compareMode: RouteCompareMode;
  selectedQuote: RouteQuote | null;
  alternativeQuotes: RouteQuote[];
  showRawJson: boolean;

  setCompareMode: (mode: RouteCompareMode) => void;
  setSelectedQuote: (quote: RouteQuote | null) => void;
  setAlternativeQuotes: (quotes: RouteQuote[]) => void;
  toggleRawJson: () => void;
}

export const useRoutingStore = create<RoutingStore>((set) => ({
  compareMode: "best",
  selectedQuote: null,
  alternativeQuotes: [],
  showRawJson: false,

  setCompareMode: (mode) => set({ compareMode: mode }),
  setSelectedQuote: (quote) => set({ selectedQuote: quote }),
  setAlternativeQuotes: (quotes) => set({ alternativeQuotes: quotes }),
  toggleRawJson: () => set((s) => ({ showRawJson: !s.showRawJson })),
}));
