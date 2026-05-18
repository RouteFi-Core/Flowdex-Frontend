"use client";

import { useState } from "react";
import { Settings2 } from "lucide-react";
import { useSwapStore } from "@/stores/swap.store";

const PRESETS = [0.1, 0.5, 1.0];

export function SlippageControl() {
  const { slippageTolerance, setSlippage } = useSwapStore();
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
        aria-label="Slippage settings"
      >
        <Settings2 className="h-3.5 w-3.5" />
        {slippageTolerance}%
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-10 w-52 rounded-xl border border-border bg-card p-3 shadow-xl">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Slippage tolerance
          </p>
          <div className="flex gap-1">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setSlippage(p);
                  setCustom("");
                  setOpen(false);
                }}
                className={`flex-1 rounded-lg py-1 text-xs font-medium transition-colors ${
                  slippageTolerance === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-accent"
                }`}
              >
                {p}%
              </button>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-1">
            <input
              type="number"
              min="0.01"
              max="50"
              step="0.1"
              placeholder="Custom"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onBlur={() => {
                const val = parseFloat(custom);
                if (!isNaN(val) && val > 0 && val <= 50) {
                  setSlippage(val);
                  setOpen(false);
                }
              }}
              className="w-full rounded-lg border border-border bg-background px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-primary"
            />
            <span className="text-xs text-muted-foreground">%</span>
          </div>
        </div>
      )}
    </div>
  );
}
