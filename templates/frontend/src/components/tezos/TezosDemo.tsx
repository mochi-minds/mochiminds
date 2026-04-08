"use client";

import { useState } from "react";
import { useTezos } from "@/lib/hooks/useTezos";
import { TezosConnectButton } from "./TezosConnectButton";
import { tezosExplorerLink } from "@/lib/config/tezos";
import { getBalance } from "@/lib/helpers/tzkt";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TEZOS_CONTRACT_ADDRESS ?? "";

export function TezosDemo() {
  const { address, connectWallet, disconnectWallet } = useTezos();
  const [balance, setBalance] = useState<string | null>(null);

  async function handleCheckBalance() {
    if (!address) return;
    const mutez = await getBalance(address);
    setBalance((mutez / 1_000_000).toFixed(2));
  }

  return (
    <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Tezos L1</h2>
        <TezosConnectButton
          address={address}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
        />
      </div>

      {address && (
        <>
          <button
            onClick={handleCheckBalance}
            className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm"
          >
            Check Balance
          </button>

          {balance !== null && (
            <p className="text-sm text-zinc-300">
              Balance: <span className="text-white font-mono">{balance} XTZ</span>
            </p>
          )}

          <a
            href={tezosExplorerLink("addresses", address)}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-zinc-500 hover:text-zinc-300"
          >
            View on TzKT
          </a>
        </>
      )}

      {CONTRACT_ADDRESS && (
        <div className="text-xs text-zinc-500">
          <span>Contract: </span>
          <a
            href={tezosExplorerLink("addresses", CONTRACT_ADDRESS)}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 font-mono"
          >
            {CONTRACT_ADDRESS.slice(0, 10)}...
          </a>
        </div>
      )}

      {!CONTRACT_ADDRESS && !address && (
        <p className="text-zinc-500 text-sm">
          Connect a Beacon wallet to interact with Tezos L1.
        </p>
      )}
    </div>
  );
}
