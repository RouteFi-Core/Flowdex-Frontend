import { SwapForm } from "@/components/SwapForm";
import { RouteBreakdown } from "@/features/swap/RouteBreakdown";
import { TransactionPanel } from "@/components/TransactionPanel";

export const metadata = {
  title: "Swap — Flowdex",
  description: "Swap assets with optimal routing on Stellar.",
};

export default function SwapPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-md">
        <SwapForm />
      </div>
      <div className="w-full max-w-md">
        <RouteBreakdown />
      </div>
      <div className="w-full max-w-md">
        <TransactionPanel />
      </div>
    </div>
  );
}
