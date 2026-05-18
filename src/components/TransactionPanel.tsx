"use client";

import { CheckCircle2, XCircle, Clock, Loader2, ExternalLink } from "lucide-react";
import { useSwapStore } from "@/stores/swap.store";
import { useTransaction } from "@/features/swap/hooks";
import { formatAmount, shortenAddress } from "@/lib/utils";
import { env } from "@/lib/env";
import type { TxStatus } from "@/types";

const HORIZON_EXPLORER: Record<string, string> = {
  MAINNET: "https://stellar.expert/explorer/public/tx",
  TESTNET: "https://stellar.expert/explorer/testnet/tx",
  FUTURENET: "https://stellar.expert/explorer/futurenet/tx",
};

function StatusIcon({ status }: { status: TxStatus }) {
  switch (status) {
    case "success":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "failed":
      return <XCircle className="h-5 w-5 text-destructive" />;
    case "pending":
    case "signing":
      return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
    default:
      return <Clock className="h-5 w-5 text-muted-foreground" />;
  }
}

export function TransactionPanel() {
  const { activeTransaction } = useSwapStore();

  // Poll for updates while pending
  const { data: liveTransaction } = useTransaction(activeTransaction?.id ?? "");
  const tx = liveTransaction ?? activeTransaction;

  if (!tx) return null;

  const explorerBase = HORIZON_EXPLORER[env.stellar.network] ?? HORIZON_EXPLORER.TESTNET;

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-4 shadow-lg">
      <div className="mb-3 flex items-center gap-2">
        <StatusIcon status={tx.status} />
        <h3 className="font-semibold capitalize">{tx.status}</h3>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Swap</span>
          <span>
            {formatAmount(tx.inputAmount)} {tx.inputAsset.code} →{" "}
            {tx.outputAmount ? formatAmount(tx.outputAmount) : "…"} {tx.outputAsset.code}
          </span>
        </div>

        {tx.hash && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tx hash</span>
            <a
              href={`${explorerBase}/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              {shortenAddress(tx.hash, 6)}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        {tx.error && (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {tx.error}
          </p>
        )}
      </div>
    </div>
  );
}
