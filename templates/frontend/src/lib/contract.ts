/** Etherlink contract interaction helpers using viem. */

import { createPublicClient, http, type Abi, type Address } from "viem";
import { ETHERLINK } from "./config/etherlink";

const publicClient = createPublicClient({
  chain: ETHERLINK,
  transport: http(ETHERLINK.rpcUrls.default.http[0]),
});

/** Read from a contract (no wallet needed). */
export async function readContract<T>(
  address: Address,
  abi: Abi,
  functionName: string,
  args: unknown[] = []
): Promise<T> {
  return publicClient.readContract({
    address,
    abi,
    functionName,
    args,
  }) as Promise<T>;
}
