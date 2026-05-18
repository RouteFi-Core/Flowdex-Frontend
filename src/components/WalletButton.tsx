"use client";

import { Wallet, LogOut } from "lucide-react";
import { useWalletStore } from "@/stores/wallet.store";
import { useWallet } from "@/lib/wallet";
import { shortenAddress } from "@/lib/utils";

export function WalletButton() {
  const { connected, address } = useWalletStore();
  const { connect, disconnect, isConnecting } = useWallet();

  if (connected && address) {
    return (
      <div className="flex items-center gap-1">
        <span className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium">
          {shortenAddress(address)}
        </span>
        <button
          onClick={disconnect}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          aria-label="Disconnect wallet"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={isConnecting}
      className="flex items-center gap-2 rounded-xl bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-60"
    >
      <Wallet className="h-4 w-4" />
      {isConnecting ? "Connecting…" : "Connect"}
    </button>
  );
}
