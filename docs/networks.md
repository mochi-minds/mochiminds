# Networks

MochiMinds deploys to Etherlink (Tezos EVM L2) and Tezos L1. Both have Shadownet testnets for development and Mainnet for production.

> Etherlink Shadownet and Tezos Shadownet are separate networks. Etherlink is a Tezos EVM L2, Tezos Shadownet is the L1 testnet.

---

## Etherlink (EVM L2)

### Shadownet (Testnet)

| | |
|---|---|
| **Network Name** | Etherlink Shadownet Testnet |
| **RPC** | `https://node.shadownet.etherlink.com` |
| **Relay** | `https://relay.shadownet.etherlink.com` |
| **Chain ID** | 127823 (`0x1F34F`) |
| **Explorer** | https://shadownet.explorer.etherlink.com |
| **Explorer API v2** | `https://shadownet.explorer.etherlink.com/api/v2` |
| **Explorer API v1** | `https://shadownet.explorer.etherlink.com/api` |
| **Faucet** | https://shadownet.faucet.etherlink.com/ |
| **Native Token** | XTZ (18 decimals) |
| **EVM Version** | Osaka |
| **Solidity** | Up to 0.8.24 |
| **Block Speed** | ~500ms sequencer confirmation |
| **Wallet Derivation** | `m/44'/60'/0'/0` |

### Mainnet

| | |
|---|---|
| **Network Name** | Etherlink Mainnet |
| **RPC** | `https://node.mainnet.etherlink.com` |
| **Relay** | `https://relay.mainnet.etherlink.com` |
| **Chain ID** | 42793 (`0xA729`) |
| **Explorer** | https://explorer.etherlink.com |
| **Explorer API v2** | `https://explorer.etherlink.com/api/v2` |
| **Explorer API v1** | `https://explorer.etherlink.com/api` |
| **Native Token** | XTZ (18 decimals) |
| **EVM Version** | Osaka |

### MetaMask Setup

**Shadownet:**
```
Network Name: Etherlink Shadownet
RPC URL: https://node.shadownet.etherlink.com
Chain ID: 127823
Currency Symbol: XTZ
Block Explorer: https://shadownet.explorer.etherlink.com
```

**Mainnet:**
```
Network Name: Etherlink Mainnet
RPC URL: https://node.mainnet.etherlink.com
Chain ID: 42793
Currency Symbol: XTZ
Block Explorer: https://explorer.etherlink.com
```

### Etherlink-Specific Notes

- **No priority fees** — `max_priority_fee_per_gas` is ignored. Sequencer uses first-come-first-served ordering.
- **Block hashes** are computed differently — don't rely on `blockhash()` for verification.
- **Solidity <=0.8.24** — newer versions may have issues on Etherlink.
- **`PREVRANDAO`** may behave differently than on Ethereum.
- **Rate limit** — Public RPC is limited to 1000 requests/minute.
- **WebSockets** — not available on public RPC, only on self-hosted nodes.

### Contract Verification

```bash
forge verify-contract <ADDRESS> <CONTRACT_NAME> \
  --chain-id $CHAIN_ID \
  --verifier blockscout \
  --verifier-url $VERIFIER_URL
```

### MCP Server

An Etherlink MCP server is configured in `.mcp.json` for direct chain interaction (balance checks, contract reads/writes, transaction history). See `.claude/skills/etherlink/references/mcp-setup.md` for details.

---

## Tezos L1

### Shadownet (Testnet)

| | |
|---|---|
| **RPC** | `https://rpc.shadownet.teztnets.com` |
| **Explorer** | https://shadownet.tzkt.io/ |
| **Faucet** | https://faucet.shadownet.teztnets.com/ |

### Mainnet

| | |
|---|---|
| **RPC** | `https://mainnet.ecadinfra.com` |
| **Explorer** | https://tzkt.io/ |

### Notes

- Ghostnet is deprecated — use Shadownet for all testnet work.
- Use environment variables (`TEZOS_RPC_URL`, `TEZOS_NETWORK`) for network switching.

---

## Bridging (Tezos L1 ↔ Etherlink)

- **Deposits (Tezos → Etherlink):** Initiated on Tezos L1, requires Tezos tooling, ~10-15 minutes.
- **Withdrawals (Etherlink → Tezos):** Initiated on Etherlink (EVM transaction), ~2 weeks (optimistic rollup challenge period).

See [Etherlink bridging docs](https://docs.etherlink.com/building-on-etherlink/bridging) for details.

---

## Environment Variables

Use env vars so the same code works across networks:

```bash
# Etherlink
RPC_URL=https://node.shadownet.etherlink.com
CHAIN_ID=127823
VERIFIER_URL=https://shadownet.explorer.etherlink.com/api
NEXT_PUBLIC_EXPLORER_URL=https://shadownet.explorer.etherlink.com

# Tezos
TEZOS_RPC_URL=https://rpc.shadownet.teztnets.com
TEZOS_NETWORK=shadownet
```
