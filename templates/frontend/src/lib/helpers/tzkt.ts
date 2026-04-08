/** TzKT API client for Tezos L1 data. */

import { TEZOS } from "../config/tezos";

const API = TEZOS.tzktApi;

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`TzKT API error: ${res.status} ${path}`);
  return res.json();
}

export interface TezosAccount {
  address: string;
  alias?: string;
  balance: number;
  numTransactions: number;
}

export interface TezosOperation {
  hash: string;
  type: string;
  level: number;
  timestamp: string;
  sender: { address: string; alias?: string };
  target?: { address: string; alias?: string };
  amount: number;
  status: string;
}

/** Get account info (balance, tx count). */
export async function getAccount(address: string): Promise<TezosAccount> {
  return fetchApi(`/accounts/${address}`);
}

/** Get account balance in mutez. */
export async function getBalance(address: string): Promise<number> {
  return fetchApi(`/accounts/${address}/balance`);
}

/** Get recent operations for an account. */
export async function getAccountOperations(
  address: string,
  limit = 10
): Promise<TezosOperation[]> {
  return fetchApi(`/accounts/${address}/operations?limit=${limit}`);
}

/** Get contract storage as JSON. */
export async function getContractStorage(address: string): Promise<unknown> {
  return fetchApi(`/contracts/${address}/storage`);
}
