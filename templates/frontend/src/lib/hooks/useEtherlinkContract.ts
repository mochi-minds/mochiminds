"use client";

import { useCallback, useState } from "react";
import {
  usePublicClient,
  useWalletClient,
  useWaitForTransactionReceipt,
} from "wagmi";
import { type Abi, type Address, type Hash } from "viem";
import { etherlinkExplorerLink } from "@/lib/config/etherlink";

export interface TxStatus {
  state: "idle" | "pending" | "confirming" | "confirmed" | "error";
  hash: Hash | null;
  error: string | null;
  explorerUrl: string | null;
}

export function useEtherlinkContract(address: Address, abi: Abi) {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const [txStatus, setTxStatus] = useState<TxStatus>({
    state: "idle",
    hash: null,
    error: null,
    explorerUrl: null,
  });

  const read = useCallback(
    async (functionName: string, args: unknown[] = []) => {
      if (!publicClient) throw new Error("Public client not available");
      return publicClient.readContract({ address, abi, functionName, args });
    },
    [address, abi, publicClient]
  );

  const write = useCallback(
    async (functionName: string, args: unknown[] = []) => {
      if (!walletClient) throw new Error("Wallet not connected");
      if (!publicClient) throw new Error("Public client not available");

      setTxStatus({ state: "pending", hash: null, error: null, explorerUrl: null });

      try {
        const hash = await walletClient.writeContract({
          address,
          abi,
          functionName,
          args,
        });

        setTxStatus({
          state: "confirming",
          hash,
          error: null,
          explorerUrl: etherlinkExplorerLink("tx", hash),
        });

        const receipt = await publicClient.waitForTransactionReceipt({ hash });

        if (receipt.status === "reverted") {
          throw new Error("Transaction reverted");
        }

        setTxStatus({
          state: "confirmed",
          hash,
          error: null,
          explorerUrl: etherlinkExplorerLink("tx", hash),
        });

        return receipt;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Transaction failed";
        setTxStatus((prev) => ({ ...prev, state: "error", error: message }));
        throw err;
      }
    },
    [address, abi, walletClient, publicClient]
  );

  const resetTx = useCallback(() => {
    setTxStatus({ state: "idle", hash: null, error: null, explorerUrl: null });
  }, []);

  return { read, write, txStatus, resetTx };
}
