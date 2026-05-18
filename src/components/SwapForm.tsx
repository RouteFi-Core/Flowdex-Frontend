"use client";

import { useEffect, useRef } from "react";
import { ArrowDownUp, Settings2, Loader2 } from "lucide-react";
import { useSwapStore } from "@/stores/swap.store";
import { useWalletStore } from "@/stores/wallet.store";
import { useRouteQuote } from "@/features/routing/hooks";
import { formatAmount, basisPointsToPercent } from "@/lib/utils";
import { SlippageControl } from "@/components/SlippageControl";
import { AssetSelector } from "@/components/AssetSelector";
import type { QuoteParams } from "@/features/routing/api";

export function SwapForm() {
  const {
    inputAsset,
    outputAsset,
    inputAmount,
    slippageTolerance,
    quote,
    setInputAmount,
    setQuote,
    setQuoteLoading,
    swapAssets,
  } = useSwapStore();
  const { connected } = useWalletStore();

  const quoteParams: QuoteParams | null =
    inputAsset && outputAsset && inputAmount && parseFloat(inputAmount) > 0
      ? {
          inputAssetCode: inputAsset.code,
          inputAssetIssuer: inputAsset.issuer,
          outputAssetCode: outputAsset.code,
          outputAssetIssuer: outputAsset.issuer,
          inputAmount,
          slippageTolerance,
        }
      : null;

  const { data, isFetching, isError } = useRouteQuote(quoteParams);

  useEffect(() => {
    setQuote(data ?? null);
    setQuoteLoading(isFetching);
  }, [data, isFetching, setQuote, setQuoteLoading]);

  const canSwap = connected && !!quote && !isFetching;

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-4 shadow-lg">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Swap</h2>
        <SlippageControl />
      </div>

      {/* Input */}
      <div className="rounded-xl border border-border bg-background p-3">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>You pay</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="0.00"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            className="w-full bg-transparent text-2xl font-medium outline-none placeholder:text-muted-foreground"
          />
          <AssetSelector side="input" />
        </div>
      </div>

      {/* Swap direction button */}
      <div className="flex justify-center py-2">
        <button
          onClick={swapAssets}
          className="rounded-full border border-border bg-card p-2 transition-colors hover:bg-accent"
          aria-label="Swap assets"
        >
          <ArrowDownUp className="h-4 w-4" />
        </button>
      </div>

      {/* Output */}
      <div className="rounded-xl border border-border bg-background p-3">
        <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>You receive</span>
          {quote && (
            <span className="text-green-500">
              ~{formatAmount(quote.estimatedOutput)} {outputAsset?.code}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-full text-2xl font-medium text-muted-foreground">
            {isFetching ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : quote ? (
              formatAmount(quote.estimatedOutput)
            ) : (
              "0.00"
            )}
          </div>
          <AssetSelector side="output" />
        </div>
      </div>

      {/* Quote details */}
      {quote && !isFetching && (
        <div className="mt-3 space-y-1 rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Price impact</span>
            <span
              className={
                quote.paths[0]?.priceImpact > 1 ? "text-yellow-500" : "text-green-500"
              }
            >
              {quote.paths[0]?.priceImpact.toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Network fee</span>
            <span>{formatAmount(quote.fees.network)} XLM</span>
          </div>
          <div className="flex justify-between">
            <span>Min. received</span>
            <span>
              {formatAmount(quote.minimumOutput)} {outputAsset?.code}
            </span>
          </div>
        </div>
      )}

      {isError && (
        <p className="mt-2 text-center text-xs text-destructive">
          Failed to fetch quote. Please try again.
        </p>
      )}

      {/* CTA */}
      <button
        disabled={!canSwap}
        className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
      >
        {!connected
          ? "Connect Wallet"
          : isFetching
            ? "Fetching quote…"
            : !quote
              ? "Enter an amount"
              : "Swap"}
      </button>
    </div>
  );
}
