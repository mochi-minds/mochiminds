/** Tezos L1 chain configuration — reads from environment variables. */

const SHADOWNET = {
  name: "Tezos Shadownet",
  rpcUrl: "https://rpc.shadownet.teztnets.com",
  explorerUrl: "https://shadownet.tzkt.io",
  tzktApi: "https://api.shadownet.tzkt.io/v1",
  faucetUrl: "https://faucet.shadownet.teztnets.com/",
  networkType: "shadownet" as const,
} as const;

const MAINNET = {
  name: "Tezos Mainnet",
  rpcUrl: "https://mainnet.ecadinfra.com",
  explorerUrl: "https://tzkt.io",
  tzktApi: "https://api.tzkt.io/v1",
  faucetUrl: null,
  networkType: "mainnet" as const,
} as const;

export const TEZOS =
  process.env.NEXT_PUBLIC_TEZOS_NETWORK === "mainnet" ? MAINNET : SHADOWNET;

/** Build a TzKT explorer link. */
export function tezosExplorerLink(
  type: "transactions" | "addresses",
  hash: string
): string {
  return `${TEZOS.explorerUrl}/${hash}`;
}
