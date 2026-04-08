"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTezos } from "@/lib/hooks/useTezos";
import { TezosConnectButton } from "@/components/tezos/TezosConnectButton";

export function Nav() {
  const {
    address: tezosAddress,
    connectWallet: connectTezos,
    disconnectWallet: disconnectTezos,
  } = useTezos();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-zinc-950/80 backdrop-blur-sm border-b border-zinc-800">
      <span className="text-sm font-semibold">MochiMinds</span>
      <div className="flex items-center gap-3">
        <TezosConnectButton
          address={tezosAddress}
          onConnect={connectTezos}
          onDisconnect={disconnectTezos}
        />
        <ConnectButton />
      </div>
    </nav>
  );
}
