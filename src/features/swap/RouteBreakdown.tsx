"use client";

import { useSwapStore } from "@/stores/swap.store";
import { useRoutingStore } from "@/stores/routing.store";
import { RouteGraph } from "@/components/RouteGraph";
import { cn } from "@/lib/utils";

const MODES = [
  { value: "best", label: "Best" },
  { value: "fastest", label: "Fastest" },
  { value: "cheapest", label: "Cheapest" },
] as const;

export function RouteBreakdown() {
  const { quote } = useSwapStore();
  const { compareMode, setCompareMode } = useRoutingStore();

  if (!quote) return null;

  return (
    <div className="w-full rounded-2xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Route</h3>
        <div className="flex gap-1">
          {MODES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setCompareMode(value)}
              className={cn(
                "rounded-lg px-2 py-0.5 text-xs font-medium transition-colors",
                compareMode === value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Split path summary */}
      <div className="mb-3 space-y-1">
        {quote.paths.map((path) => (
          <div key={path.id} className="flex items-center gap-2 text-xs">
            <div
              className="h-1.5 rounded-full bg-primary"
              style={{ width: `${path.splitPercent}%`, maxWidth: "60%" }}
            />
            <span className="text-muted-foreground">
              {path.splitPercent}% via{" "}
              {path.hops.map((h) => h.asset.code).join(" → ")}
            </span>
          </div>
        ))}
      </div>

      <RouteGraph quote={quote} />
    </div>
  );
}
