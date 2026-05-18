import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WalletState, WalletType } from "@/types";

interface WalletStore extends WalletState {
  connect: (address: string, network: string, walletType: WalletType) => void;
  disconnect: () => void;
  setNetwork: (network: string) => void;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      connected: false,
      address: null,
      network: null,
      walletType: null,

      connect: (address, network, walletType) =>
        set({ connected: true, address, network, walletType }),

      disconnect: () =>
        set({ connected: false, address: null, network: null, walletType: null }),

      setNetwork: (network) => set({ network }),
    }),
    {
      name: "flowdex-wallet",
      partialize: (state) => ({
        address: state.address,
        network: state.network,
        walletType: state.walletType,
      }),
    }
  )
);
