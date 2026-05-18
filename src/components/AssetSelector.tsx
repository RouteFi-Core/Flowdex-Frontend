"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSwapStore } from "@/stores/swap.store";
import type { Asset } from "@/types";

// Hardcoded common Stellar assets — in production, fetch from Horizon
const COMMON_ASSETS: Asset[] = [
  { code: "XLM", issuer: null, name: "Stellar Lumens", decimals: 7 },
  {
    code: "USDC",
    issuer: "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
    name: "USD Coin",
    decimals: 7,
  },
  {
    code: "yXLM",
    issuer: "GARDNV3Q7YGT4AKSDF25LT32YSCCW4EV22Y2TV3I2PU2MMXJTEDL5T55",
    name: "yXLM",
    decimals: 7,
  },
  {
    code: "BTC",
    issuer: "GDPJALI4AZKUU2W426U5WKMAT6CN3AJRPIIRYR2YM54TL2GDWO5O2MZM",
    name: "Bitcoin",
    decimals: 7,
  },
  {
    code: "ETH",
    issuer: "GBDEVU63Y6NTHJQQZIKVTC23NWLQVP3WJ2RI2OTSJTNYOIGICST6DUXR",
    name: "Ethereum",
    decimals: 7,
  },
];

interface AssetSelectorProps {
  side: "input" | "output";
}

export function AssetSelector({ side }: AssetSelectorProps) {
  const { inputAsset, outputAsset, setInputAsset, setOutputAsset } = useSwapStore();
  const [open, setOpen] = useState(false);

  const selected = side === "input" ? inputAsset : outputAsset;
  const setAsset = side === "input" ? setInputAsset : setOutputAsset;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex shrink-0 items-center gap-1 rounded-xl bg-muted px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-accent"
      >
        {selected?.code ?? "Select"}
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-border bg-card shadow-xl">
          {COMMON_ASSETS.map((asset) => (
            <button
              key={`${asset.code}-${asset.issuer}`}
              onClick={() => {
                setAsset(asset);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-accent"
            >
              <span className="font-medium">{asset.code}</span>
              <span className="text-xs text-muted-foreground">{asset.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
