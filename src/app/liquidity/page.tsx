import { LiquidityTable } from "@/components/LiquidityTable";
import { PriceChart } from "@/components/PriceChart";

export const metadata = {
  title: "Liquidity — Flowdex",
  description: "Browse liquidity pools and historical rates on Stellar.",
};

export default function LiquidityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Liquidity Pools</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Available pools, rates, and depth on the Stellar network.
        </p>
      </div>

      <LiquidityTable />

      {/* Default chart for XLM/USDC pool — in production, driven by row selection */}
      <PriceChart poolId="xlm-usdc" />
    </div>
  );
}
