# CLAUDE.md

Behavioral guidelines for all agents. **Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## Project Rules

### Think Before Coding
**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### Simplicity First
**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### Surgical Changes
**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the task.

### Goal-Driven Execution
**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

### Project Structure
All generated projects live under `projects/<ProjectName>/`. Each project contains its own `contracts-evm/`, `contracts-tezos/`, `frontend/`, and `docs/` directories. When a team is created, the lead creates `projects/<ProjectName>/` and agents work inside it.

```
MochiMinds/
├── CLAUDE.md
├── .claude/
│   ├── agents/            # 8 agent definitions (system prompts)
│   ├── skills/            # 12 domain skills (Foundry, OZ, Etherlink, SmartPy, etc.)
│   ├── hooks/
│   │   └── capture-event.mjs  # JSONL event logging hook
│   └── settings.json      # Agent Teams env flag + hooks config
├── .mcp.json                  # Etherlink MCP server config
├── etherlink-mcp-server/      # Cloned MCP server (gitignored)
├── templates/
│   └── frontend/          # Next.js 16 + wagmi/RainbowKit + Beacon starter (copied into each project)
├── projects/
│   └── <ProjectName>/
│       ├── contracts-evm/   # Forge's Solidity contracts (Foundry project)
│       ├── contracts-tezos/ # Naga's SmartPy contracts (Tezos L1)
│       ├── frontend/        # Link + Pixel's Next.js app
│       └── docs/            # Brief, spec
└── logs/
    ├── agent-log.jsonl    # Global event log (non-team sessions)
    └── {team-name}.raw.jsonl  # Per-team event logs (auto-created by hooks)
```

### Build Verification
After writing code, run the project's build and test commands and fix errors before marking your task done.

### Agent Safety Rules
These prevent agents from bricking themselves or poisoning their context:
- **No interactive commands:** Do not run interactive or long-running commands (`npm run dev`, `python` REPL, `vim`, `git rebase -i`, `forge init` without `--no-commit`). Use background mode or flags that skip interactive prompts.
- **No unbounded reads:** Do not read files larger than 500 lines without using `offset`/`limit`. Never read files in `node_modules/`, `.next/`, `contracts-evm/out/`, or other build artifact directories.

## Team Rules

- **AI provider:** Projects can use any AI service (Anthropic, OpenAI, DALL-E, etc.).
- **Env vars:** Every `process.env.*` in code MUST have an entry in `.env.example`.
- **File ownership:** Only write files you own (see table below). If you need a file another teammate owns, message them.
- **No silent overwrites:** If a file exists and another teammate wrote it, read it first and extend — don't replace.
- **Communicate:** If you're blocked or need something from a teammate, send them a message.

## Stack

- **Smart Contracts (EVM):** Solidity ^0.8.24, Foundry, OpenZeppelin — deployed on Etherlink
- **Smart Contracts (Tezos L1):** SmartPy v0.17+, FA2 library — deployed on Tezos Mainnet/Shadownet
- **Frontend:** Next.js 16 + React 19 + TypeScript + Tailwind CSS v3
- **Wallet (EVM):** wagmi v2 + viem + RainbowKit (MetaMask, WalletConnect, Coinbase)
- **Wallet (Tezos L1):** @tezos-x/octez + Beacon SDK + Zustand store
- **Backend/API:** Next.js API routes
- **Chain (Etherlink):** Tezos EVM L2
  - Shadownet RPC: `https://node.shadownet.etherlink.com`
  - Shadownet Chain ID: 127823
  - Mainnet RPC: `https://node.mainnet.etherlink.com`
  - Mainnet Chain ID: 42793
  - Explorer (Shadownet): https://shadownet.explorer.etherlink.com
  - Explorer (Mainnet): https://explorer.etherlink.com
  - Explorer API: `https://shadownet.explorer.etherlink.com/api/v2`
  - Faucet: https://shadownet.faucet.etherlink.com/
  - Native Token: XTZ (18 decimals)
  - EVM Version: Osaka
  - MCP Server: configured in `.mcp.json` (see `etherlink-mcp-server/`)
- **Chain (Tezos L1):**
  - Shadownet RPC: `https://rpc.shadownet.teztnets.com`
  - Shadownet Faucet: `https://faucet.shadownet.teztnets.com/`
  - Mainnet RPC: `https://mainnet.ecadinfra.com`
  - Explorer: https://tzkt.io/ (Mainnet), https://shadownet.tzkt.io/ (Shadownet)

## File Ownership

All paths are relative to the project directory (`projects/<ProjectName>/`).

| Teammate | Owns |
|----------|------|
| Mochi | `docs/brief.md` |
| Blueprint | `docs/spec.md`, `docs/architecture.md` |
| Forge | `contracts-evm/src/`, `contracts-evm/test/`, `contracts-evm/foundry.toml`, `contracts-evm/remappings.txt` |
| Naga | `contracts-tezos/src/`, `contracts-tezos/tests/`, `contracts-tezos/pyproject.toml`, `contracts-tezos/README.md` |
| Link | `frontend/src/lib/`, `frontend/src/app/api/`, `frontend/src/types/`, `frontend/package.json`, `frontend/next.config.mjs`, `docs/api-contracts.md` |
| Pixel | `frontend/src/app/**` (pages, layouts), `frontend/src/components/`, `frontend/src/hooks/`, `frontend/tailwind.config.ts`, `frontend/src/app/globals.css` |
| Sage | Nothing (read-only — reviews code, runs builds, messages teammates) |
| Lead / Rocket | `contracts-evm/script/`, `README.md`, `.env.example`, `.gitignore` |

### Shared Rules
- **`package.json`:** Link owns `frontend/package.json` for backend deps. Pixel can run `npm install` for frontend deps (UI libraries, fonts, animation). If both need to install, Pixel messages Link to avoid conflicts.
- **`NEXT_PUBLIC_` safety:** Never use `NEXT_PUBLIC_` prefix for API keys, database URLs, or secrets. Only contract addresses, chain IDs, and explorer URLs belong in `NEXT_PUBLIC_*` vars.
- **Spec updates:** If requirements change mid-build, message Blueprint to update `docs/spec.md`. Don't edit it directly unless you own it.

## Logging

See [`logs/README.md`](logs/README.md) for full format, field reference, and examples.
