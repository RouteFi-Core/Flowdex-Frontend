"use client";

import { useState, useCallback } from "react";
import { StellarWalletsKit, WalletNetwork, FREIGHTER_ID } from "@creit.tech/stellar-wallets-kit";
import { useWalletStore } from "@/stores/wallet.store";
import { env } from "@/lib/env";
import { toast } from "sonner";

const NETWORK_MAP: Record<string, WalletNetwork> = {
  MAINNET: WalletNetwork.PUBLIC,
  TESTNET: WalletNetwork.TESTNET,
  FUTURENET: WalletNetwork.FUTURENET,
};

let kit: StellarWalletsKit | null = null;

function getKit(): StellarWalletsKit {
  if (!kit) {
    kit = new StellarWalletsKit({
      network: NETWORK_MAP[env.stellar.network] ?? WalletNetwork.TESTNET,
      selectedWalletId: FREIGHTER_ID,
    });
  }
  return kit;
}

export function useWallet() {
  const { connect: storeConnect, disconnect: storeDisconnect } = useWalletStore();
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const walletKit = getKit();

      // Open wallet selection modal
      await walletKit.openModal({
        onWalletSelected: async (option) => {
          walletKit.setWallet(option.id);
          const { address } = await walletKit.getAddress();
          storeConnect(address, env.stellar.network, option.id as "freighter");
          toast.success("Wallet connected");
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to connect wallet";
      toast.error(message);
    } finally {
      setIsConnecting(false);
    }
  }, [storeConnect]);

  const disconnect = useCallback(() => {
    storeDisconnect();
    kit = null;
    toast.info("Wallet disconnected");
  }, [storeDisconnect]);

  /**
   * Sign a Stellar transaction XDR string.
   * Returns the signed XDR or throws on user rejection.
   */
  const signTransaction = useCallback(
    async (xdr: string): Promise<string> => {
      const walletKit = getKit();
      const { signedTxXdr } = await walletKit.signTransaction(xdr, {
        networkPassphrase:
          env.stellar.network === "MAINNET"
            ? "Public Global Stellar Network ; September 2015"
            : "Test SDF Network ; September 2015",
      });
      return signedTxXdr;
    },
    []
  );

  return { connect, disconnect, signTransaction, isConnecting };
}
