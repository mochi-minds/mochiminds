import { create } from "zustand";
import { TezosToolkit } from "@tezos-x/octez.js";
import { TEZOS } from "../config/tezos";

interface TezosWalletState {
  Tezos: TezosToolkit;
  wallet: any | null;
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  setWallet: (wallet: any) => void;
  setAddress: (address: string | null) => void;
}

export const useTezosWalletStore = create<TezosWalletState>((set) => ({
  Tezos: new TezosToolkit(TEZOS.rpcUrl),
  wallet: null,
  address: null,
  connectWallet: async () => {
    const { wallet } = useTezosWalletStore.getState();
    if (wallet) {
      await wallet.requestPermissions();
      const userAddress = await wallet.getPKH();
      set({ address: userAddress });
    }
  },
  disconnectWallet: async () => {
    const { wallet } = useTezosWalletStore.getState();
    if (wallet) {
      await wallet.client.clearActiveAccount();
    }
    set({ address: null });
  },
  setWallet: (wallet) => set({ wallet }),
  setAddress: (address) => set({ address }),
}));
