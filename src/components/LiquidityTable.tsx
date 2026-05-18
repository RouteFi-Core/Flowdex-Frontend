"use client";

import { usePools } from "@/features/liquidity/hooks";
import { formatAmount, basisPointsToPercent } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function LiquidityTable() {
  const { data: pools, isLoading, isError } = usePools();

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !pools) {
    return (
      <p className="py-8 text-center text-sm text-destructive">
        Failed to load liquidity pools.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
            <th className="px-4 py-3 font-medium">Pool</th>
            <th className="px-4 py-3 font-medium">TVL</th>
            <th className="px-4 py-3 font-medium">Volume 24h</th>
            <th className="px-4 py-3 font-medium">Fee</th>
            <th className="px-4 py-3 font-medium">APR</th>
          </tr>
        </thead>
        <tbody>
          {pools.map((pool) => (
            <tr
              key={pool.id}
              className="border-b border-border transition-colors last:border-0 hover:bg-muted/20"
            >
              <td className="px-4 py-3 font-medium">
                {pool.assetA.code}/{pool.assetB.code}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                ${formatAmount(pool.tvl, 2)}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                ${formatAmount(pool.volume24h, 2)}
              </td>
              <td className="px-4 py-3">{basisPointsToPercent(pool.fee)}</td>
              <td className="px-4 py-3 text-green-500">{pool.apr.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
