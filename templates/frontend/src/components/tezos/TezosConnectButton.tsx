"use client";

import { shortenTezosAddress } from "@/lib/utils";

interface Props {
  address: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function TezosConnectButton({ address, onConnect, onDisconnect }: Props) {
  if (address) {
    return (
      <button
        onClick={onDisconnect}
        className="px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-600 hover:border-zinc-400 transition-colors font-mono text-sm"
      >
        {shortenTezosAddress(address)}
      </button>
    );
  }

  return (
    <button
      onClick={onConnect}
      className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors text-sm"
    >
      Connect Beacon
    </button>
  );
}
