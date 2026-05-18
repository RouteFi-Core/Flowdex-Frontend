"use client";

import { useState } from "react";
import { useSimulateRoute } from "@/features/routing/hooks";
import { useSwapStore } from "@/stores/swap.store";
import { useRoutingStore } from "@/stores/routing.store";
import { Terminal, Play, RotateCcw } from "lucide-react";
import type { QuoteParams } from "@/features/routing/api";

const DEFAULT_PARAMS: QuoteParams = {
  inputAssetCode: "XLM",
  inputAssetIssuer: null,
  outputAssetCode: "USDC",
  outputAssetIssuer: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
  inputAmount: "100",
  slippageTolerance: 0.5,
  simulationOnly: true,
};

export function DevConsole() {
  const [params, setParams] = useState(JSON.stringify(DEFAULT_PARAMS, null, 2));
  const [parseError, setParseError] = useState<string | null>(null);
  const { quote } = useSwapStore();
  const { showRawJson, toggleRawJson } = useRoutingStore();
  const simulate = useSimulateRoute();

  function handleRun() {
    try {
      const parsed = JSON.parse(params) as QuoteParams;
      setParseError(null);
      simulate.mutate(parsed);
    } catch {
      setParseError("Invalid JSON — check your input.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Terminal className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold">Dev Console</h1>
        <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-500">
          Simulation only
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Request params (JSON)</label>
          <textarea
            value={params}
            onChange={(e) => setParams(e.target.value)}
            rows={16}
            spellCheck={false}
            className="w-full rounded-xl border border-border bg-muted/40 p-3 font-mono text-xs outline-none focus:ring-1 focus:ring-primary"
          />
          {parseError && <p className="text-xs text-destructive">{parseError}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleRun}
              disabled={simulate.isPending}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              <Play className="h-3.5 w-3.5" />
              {simulate.isPending ? "Simulating…" : "Run Simulation"}
            </button>
            <button
              onClick={() => setParams(JSON.stringify(DEFAULT_PARAMS, null, 2))}
              className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-accent"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Response</label>
            {quote && (
              <button
                onClick={toggleRawJson}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {showRawJson ? "Hide raw" : "Show raw JSON"}
              </button>
            )}
          </div>
          <div className="min-h-64 rounded-xl border border-border bg-muted/40 p-3">
            {simulate.isPending && (
              <p className="text-xs text-muted-foreground">Simulating route…</p>
            )}
            {simulate.isError && (
              <p className="text-xs text-destructive">
                {(simulate.error as Error).message}
              </p>
            )}
            {quote && (
              <pre className="overflow-auto text-xs text-foreground">
                {JSON.stringify(quote, null, 2)}
              </pre>
            )}
            {!quote && !simulate.isPending && !simulate.isError && (
              <p className="text-xs text-muted-foreground">
                Run a simulation to see the route response here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
