"use client";

import { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import { useEtherlinkContract, type TxStatus } from "@/lib/hooks/useEtherlinkContract";
import { ETHERLINK, etherlinkExplorerLink } from "@/lib/config/etherlink";
import type { Abi, Address } from "viem";

const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "") as Address;
const CONTRACT_ABI: Abi = [
  {
    type: "function",
    name: "name",
    inputs: [],
    outputs: [{ type: "string", name: "" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "value",
    inputs: [],
    outputs: [{ type: "uint256", name: "" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "setValue",
    inputs: [{ type: "uint256", name: "_value" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
];

export function EtherlinkDemo() {
  const { address, isConnected } = useAccount();
  const { data: balance, isLoading: balanceLoading } = useBalance({ address });
  const { read, write, txStatus, resetTx } = useEtherlinkContract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI
  );

  const [contractName, setContractName] = useState<string | null>(null);
  const [contractValue, setContractValue] = useState<string | null>(null);
  const [newValue, setNewValue] = useState("");

  const explorerUrl = ETHERLINK.blockExplorers?.default.url;

  async function handleRead() {
    const name = await read("name");
    const value = await read("value");
    setContractName(name as string);
    setContractValue((value as bigint).toString());
  }

  async function handleWrite() {
    if (!newValue) return;
    resetTx();
    await write("setValue", [BigInt(newValue)]);
    setNewValue("");
    await handleRead();
  }

  return (
    <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900 space-y-4">
      <h2 className="text-lg font-semibold">Etherlink (EVM)</h2>

      {isConnected && address && (
        <div className="space-y-3">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Address</p>
            <a
              href={`${explorerUrl}/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-zinc-300 hover:text-white transition-colors break-all"
            >
              {address}
            </a>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">XTZ Balance</p>
            {balanceLoading ? (
              <p className="text-sm text-zinc-500">Loading...</p>
            ) : balance ? (
              <p className="text-2xl font-semibold tabular-nums">
                {parseFloat(formatEther(balance.value)).toFixed(4)}{" "}
                <span className="text-sm font-normal text-zinc-400">XTZ</span>
              </p>
            ) : (
              <p className="text-sm text-zinc-500">&mdash;</p>
            )}
          </div>
        </div>
      )}

      {CONTRACT_ADDRESS ? (
        <>
          <div className="flex justify-between items-center text-xs text-zinc-500">
            <span>Contract</span>
            <a
              href={etherlinkExplorerLink("address", CONTRACT_ADDRESS)}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-300 font-mono"
            >
              {CONTRACT_ADDRESS.slice(0, 10)}...
            </a>
          </div>

          <button
            onClick={handleRead}
            className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-sm"
          >
            Read Contract
          </button>

          {contractName !== null && (
            <div className="text-sm text-zinc-300 space-y-1">
              <p>
                Name: <span className="text-white font-mono">{contractName}</span>
              </p>
              <p>
                Value: <span className="text-white font-mono">{contractValue}</span>
              </p>
            </div>
          )}

          {isConnected && (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="New value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-sm focus:outline-none focus:border-zinc-500"
                />
                <button
                  onClick={handleWrite}
                  disabled={
                    txStatus.state === "pending" || txStatus.state === "confirming"
                  }
                  className="px-4 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  Set
                </button>
              </div>
              <TxStatusDisplay status={txStatus} />
            </div>
          )}
        </>
      ) : (
        !isConnected && (
          <p className="text-zinc-500 text-sm">
            Connect your wallet to view your XTZ balance on Etherlink.
          </p>
        )
      )}
    </div>
  );
}

function TxStatusDisplay({ status }: { status: TxStatus }) {
  if (status.state === "idle") return null;

  const styles: Record<string, string> = {
    pending: "bg-yellow-900/50 border-yellow-600 text-yellow-200",
    confirming: "bg-blue-900/50 border-blue-600 text-blue-200",
    confirmed: "bg-green-900/50 border-green-600 text-green-200",
    error: "bg-red-900/50 border-red-600 text-red-200",
  };

  const labels: Record<string, string> = {
    pending: "Waiting for wallet approval...",
    confirming: "Transaction submitted. Waiting for confirmation...",
    confirmed: "Transaction confirmed!",
    error: "Transaction failed",
  };

  return (
    <div className={`p-3 rounded-lg border text-sm ${styles[status.state]}`}>
      <p>{labels[status.state]}</p>
      {status.error && <p className="mt-1 text-xs opacity-80">{status.error}</p>}
      {status.explorerUrl && (
        <a
          href={status.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-xs underline opacity-80 hover:opacity-100"
        >
          View on Explorer
        </a>
      )}
    </div>
  );
}
