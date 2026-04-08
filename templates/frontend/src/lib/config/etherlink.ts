/** Etherlink chain configuration using viem Chain type. */

import { type Chain } from "viem";

export const etherlinkShadownet = {
  id: 127823,
  name: "Etherlink Shadownet",
  nativeCurrency: { name: "XTZ", symbol: "XTZ", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://node.shadownet.etherlink.com"] },
  },
  blockExplorers: {
    default: {
      name: "Etherlink Explorer",
      url: "https://shadownet.explorer.etherlink.com",
    },
  },
} as const satisfies Chain;

export const etherlinkMainnet = {
  id: 42793,
  name: "Etherlink Mainnet",
  nativeCurrency: { name: "XTZ", symbol: "XTZ", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://node.mainnet.etherlink.com"] },
  },
  blockExplorers: {
    default: {
      name: "Etherlink Explorer",
      url: "https://explorer.etherlink.com",
    },
  },
} as const satisfies Chain;

export const ETHERLINK =
  process.env.NEXT_PUBLIC_ETHERLINK_NETWORK === "mainnet"
    ? etherlinkMainnet
    : etherlinkShadownet;

/** Build a block explorer link for a transaction, address, or token. */
export function etherlinkExplorerLink(
  type: "tx" | "address" | "token",
  hash: string
): string {
  return `${ETHERLINK.blockExplorers.default.url}/${type}/${hash}`;
}
