# MochiMinds Project

Next.js 16 frontend template with dual-chain support for **Etherlink** (EVM L2) and **Tezos L1**.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_ETHERLINK_NETWORK` | `shadownet` or `mainnet` |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Etherlink contract address |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID ([cloud.walletconnect.com](https://cloud.walletconnect.com)) |
| `NEXT_PUBLIC_TEZOS_NETWORK` | `shadownet` or `mainnet` |
| `NEXT_PUBLIC_TEZOS_CONTRACT_ADDRESS` | Tezos contract address |

## Structure

```
src/
├── app/                    # Pages, layouts, providers
├── components/
│   ├── etherlink/          # Etherlink balance & contract UI
│   ├── tezos/              # Tezos wallet & contract UI
│   └── layout/             # Nav
├── lib/
│   ├── config/             # Chain configs (etherlink, tezos, wagmi)
│   ├── hooks/              # React hooks (useEtherlinkContract, useTezos)
│   ├── store/              # Zustand store (Tezos wallet)
│   ├── helpers/            # API clients (TzKT)
│   ├── contract.ts         # viem contract read helpers
│   └── utils.ts            # Address formatting
```

## Chains

- **Etherlink Shadownet**: Chain ID 127823, RPC `https://node.shadownet.etherlink.com`
- **Etherlink Mainnet**: Chain ID 42793, RPC `https://node.mainnet.etherlink.com`
- **Tezos Shadownet**: RPC `https://rpc.shadownet.teztnets.com`
- **Tezos Mainnet**: RPC `https://mainnet.ecadinfra.com`

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript
- Tailwind CSS v3
- wagmi v2 + viem + RainbowKit (Etherlink wallet — MetaMask, WalletConnect, Coinbase)
- @tezos-x/octez + Beacon SDK (Tezos L1 wallet)
- Zustand (Tezos wallet state)
- TanStack React Query (data fetching)
