"use client";

import { useEffect } from "react";
import { useTezosWalletStore } from "../store/walletStore";

export const useTezos = () => {
  const {
    Tezos,
    address,
    wallet,
    setWallet,
    setAddress,
    connectWallet,
    disconnectWallet,
  } = useTezosWalletStore();

  useEffect(() => {
    const initBeaconWallet = async () => {
      try {
        const { BeaconWallet } = await import("@tezos-x/octez.js-dapp-wallet");
        const { NetworkType } = await import("@tezos-x/octez.connect-dapp");

        const network =
          process.env.NEXT_PUBLIC_TEZOS_NETWORK === "mainnet"
            ? NetworkType.MAINNET
            : NetworkType.SHADOWNET;

        const walletInstance = new BeaconWallet({
          name: "MochiMinds",
          preferredNetwork: network as any,
        });

        Tezos.setWalletProvider(walletInstance);
        setWallet(walletInstance);

        // Restore existing session
        const activeAccount = await walletInstance.client.getActiveAccount();
        if (activeAccount) {
          setAddress(activeAccount.address);
        }
      } catch (error) {
        console.error("Error initializing Beacon wallet:", error);
      }
    };

    if (Tezos) initBeaconWallet();
  }, [Tezos]);

  return {
    Tezos,
    wallet,
    address,
    connectWallet,
    disconnectWallet,
  };
};
