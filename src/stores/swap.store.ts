import { create } from "zustand";
import type { Asset, RouteQuote, Transaction } from "@/types";

interface SwapStore {
  // Form state
  inputAsset: Asset | null;
  outputAsset: Asset | null;
  inputAmount: string;
  slippageTolerance: number;

  // Quote
  quote: RouteQuote | null;
  isQuoteLoading: boolean;

  // Transaction
  activeTransaction: Transaction | null;

  // Actions
  setInputAsset: (asset: Asset | null) => void;
  setOutputAsset: (asset: Asset | null) => void;
  setInputAmount: (amount: string) => void;
  setSlippage: (slippage: number) => void;
  setQuote: (quote: RouteQuote | null) => void;
  setQuoteLoading: (loading: boolean) => void;
  setActiveTransaction: (tx: Transaction | null) => void;
  swapAssets: () => void;
  reset: () => void;
}

const DEFAULT_SLIPPAGE = 0.5;

export const useSwapStore = create<SwapStore>((set, get) => ({
  inputAsset: null,
  outputAsset: null,
  inputAmount: "",
  slippageTolerance: DEFAULT_SLIPPAGE,
  quote: null,
  isQuoteLoading: false,
  activeTransaction: null,

  setInputAsset: (asset) => set({ inputAsset: asset, quote: null }),
  setOutputAsset: (asset) => set({ outputAsset: asset, quote: null }),
  setInputAmount: (amount) => set({ inputAmount: amount, quote: null }),
  setSlippage: (slippage) => set({ slippageTolerance: slippage }),
  setQuote: (quote) => set({ quote }),
  setQuoteLoading: (loading) => set({ isQuoteLoading: loading }),
  setActiveTransaction: (tx) => set({ activeTransaction: tx }),

  swapAssets: () => {
    const { inputAsset, outputAsset } = get();
    set({ inputAsset: outputAsset, outputAsset: inputAsset, quote: null, inputAmount: "" });
  },

  reset: () =>
    set({
      inputAmount: "",
      quote: null,
      isQuoteLoading: false,
      activeTransaction: null,
    }),
}));
