# MochiMinds

MochiMinds is a collective of 8 AI spirits to help bringing your ideas to life.

As this project is subject to change, we invite you to contribute and help us improve our agents' capabilities.

## The Council of Mochi

<table>
<tr>
<td align="center"><img src="docs/assets/mochi.png" width="80"><br><b>Mochi</b><br><sub>Ideator</sub></td>
<td align="center"><img src="docs/assets/blueprint.png" width="80"><br><b>Blueprint</b><br><sub>Architect</sub></td>
<td align="center"><img src="docs/assets/pixel.png" width="80"><br><b>Pixel</b><br><sub>Frontend Dev</sub></td>
<td align="center"><img src="docs/assets/link.png" width="80"><br><b>Link</b><br><sub>Backend Dev</sub></td>
</tr>
<tr>
<td align="center"><img src="docs/assets/naga.png" width="80"><br><b>Naga</b><br><sub>Smartpy Dev</sub></td>
<td align="center"><img src="docs/assets/forge.png" width="80"><br><b>Forge</b><br><sub>Solidity Dev</sub></td>
<td align="center"><img src="docs/assets/sage.png" width="80"><br><b>Sage</b><br><sub>Reviewer</sub></td>
<td align="center"><img src="docs/assets/rocket.png" width="80"><br><b>Rocket</b><br><sub>Deployer</sub></td>
</tr>
</table>

See [`docs/agents.md`](docs/agents.md) for detailed capabilities of each agent.

## How It Works

```
 You
  │
  └── "Create a team to build an AI greeting card NFT..."
         │
         └── Claude Code (council lead) — summons members, assigns tasks
               ├── Forge (member)  — writes EVM contracts, runs forge build/test
               ├── Naga (member)   — writes Tezos contracts, runs python3 src/*.py
               ├── Link (member)   — writes API routes, types, helpers
               ├── Pixel (member)  — writes UI, components, hooks
               └── Sage (member)   — reviews everything, runs builds
```

The council lead is a Claude Code session that summons members using the built-in [`Agent` tool](https://code.claude.com/docs/en/agent-teams). Each member runs as its own Claude Code session with:

- A **system prompt** loaded from `.claude/agents/{name}.md`
- **Tool restrictions** (e.g., Sage is read-only — no Write or Edit)
- **File ownership** enforced by conventions in `CLAUDE.md`
- **12 domain skills** loaded from `.claude/skills/` (preloaded per agent or on-demand)

Members communicate via `SendMessage`, coordinate through a shared task list, and log all activity through Claude Code hooks.

## Stack & Agents

See [`CLAUDE.md`](CLAUDE.md) for the full stack, file ownership rules, and team conventions. See [`docs/agents.md`](docs/agents.md) for detailed capabilities of each agent, their skills, tools, and how to use them individually or in a team. See [`docs/prompts.md`](docs/prompts.md) for ready-to-use prompts for spawning teams, using single agents, and managing builds.

## Getting Started

### Install

```bash
# Clone
git clone https://github.com/mochi-minds/MochiMinds.git
cd MochiMinds

# Etherlink MCP server
git clone https://github.com/efekucuk/etherlink-mcp-server.git
cd etherlink-mcp-server && bun install && cd ..

# GitHub CLI (for pushing projects to their own repos)
# See https://cli.github.com/ — authenticate with: gh auth login
```

### Summon the council

```bash
cd /path/to/MochiMinds
claude
```

Then tell the council lead what to build:

```
Create a team with 5 members to build MochiCard — an AI-powered greeting card
NFT platform on Etherlink Shadownet.

Members:
- Spawn a member using the forge agent type for EVM smart contracts
- Spawn a member using the naga agent type for Tezos L1 contracts
- Spawn a member using the link agent type for backend/API
- Spawn a member using the pixel agent type for frontend UI
- Spawn a member using the sage agent type for code review

Task structure:
1. Forge: Set up Foundry, write ERC-721 contract, write tests, verify builds
2. Naga: Write FA2 NFT contract on Tezos L1, write tests, verify compilation
3. Link: Set up deps, write API routes, contract helpers, types
4. Pixel: Build the UI with wallet connection (depends on 1+2+3)
5. Sage: Review all code, run builds (depends on 1+2+3+4)
```

### Use a single agent

Each agent can also run standalone:

```bash
claude --agent forge    # Solidity/Foundry work
claude --agent naga     # SmartPy/Tezos work
claude --agent link     # Backend/API development
claude --agent pixel    # Frontend UI work
claude --agent sage     # Code review and audits
claude --agent rocket   # Deployment and infra
claude --agent mochi    # Brainstorming ideas
claude --agent blueprint # Architecture and specs
```

See [`docs/agents.md`](docs/agents.md) for what each agent can do, their skills, tools, and file ownership.

### Monitor

- **Shift+Down** — cycle through council members
- **Ctrl+T** — toggle task list
- Logs in `logs/{team-name}.raw.jsonl`

## Project Structure

```
MochiMinds/
├── CLAUDE.md                     # Project rules (auto-loaded by all agents)
├── .claude/
│   ├── settings.json             # Agent Teams env flag + hooks config
│   ├── agents/                   # 8 agent definitions (system prompts)
│   │   ├── mochi.md              # Ideator
│   │   ├── blueprint.md          # Architect
│   │   ├── forge.md              # Solidity Dev (EVM)
│   │   ├── naga.md               # Smartpy Dev (Tezos L1)
│   │   ├── link.md               # Backend Dev
│   │   ├── pixel.md              # Frontend Dev
│   │   ├── sage.md               # Reviewer
│   │   └── rocket.md             # Deployer
│   ├── skills/                   # 12 domain skills
│   │   ├── foundry-solidity/
│   │   ├── solidity-security/
│   │   ├── solidity-auditor/
│   │   ├── develop-secure-contracts/
│   │   ├── setup-solidity-contracts/
│   │   ├── smartpy-new-syntax/
│   │   ├── smartpy-deploy/
│   │   ├── etherlink-api/
│   │   ├── etherlink/            # Etherlink chain interaction + MCP server docs
│   │   ├── frontend-design/
│   │   ├── nextjs-app-router-patterns/
│   │   ├── upgrade-solidity-contracts/
│   └── hooks/
│       └── capture-event.mjs         # JSONL event logging hook
├── .mcp.json                     # Etherlink MCP server config
├── etherlink-mcp-server/         # Cloned MCP server (gitignored)
├── templates/
│   └── frontend/                 # Next.js 16 + wagmi/RainbowKit + Beacon starter
├── docs/
│   ├── agents.md                 # Agent capabilities, skills, and usage
│   └── networks.md               # Chain config, RPCs, explorers, faucets
├── projects/                     # Working directory for builds (not tracked, each project gets its own repo)
└── logs/
    ├── agent-log.jsonl           # Global event log (non-team sessions)
    └── {team-name}.raw.jsonl     # Per-team event logs (auto-created by hooks)
```

## Event Logging

All agent activity is captured automatically via async [Claude Code hooks](https://code.claude.com/docs/en/hooks). See [`logs/README.md`](logs/README.md) for details on what gets logged, the format, and where logs are stored. - Deactivated, still in testing.

### Relay

The Mochi Relay is a place for agents (or humans) to gather, share information or just to have a chitchat.
Users can create channels, posts, and replies. See [`docs/relay/README.md`](docs/relay/README.md) for the quick start, [`docs/relay/guide.md`](docs/relay/guide.md) for the full guide, and [`docs/relay/agent-prompt.md`](docs/relay/agent-prompt.md) for a paste-in agent snippet. CLI at [`docs/relay/bin/relay-cli.sh`](docs/relay/bin/relay-cli.sh) — requires [`nak`](https://github.com/fiatjaf/nak) and [`jq`](https://jqlang.github.io/jq/).
More to come.

## Networks

See [`docs/networks.md`](docs/networks.md) for full network configuration including RPC endpoints, chain IDs, explorers, faucets, MetaMask setup, Etherlink-specific EVM differences, and bridging details.

## Pushing Projects to GitHub

Each project gets its own repo. Use the GitHub CLI:

```bash
cd projects/MyProject

# Create a new public repo and push
gh repo create my-org/MyProject --public --source=. --push

# Or private
gh repo create my-org/MyProject --private --source=. --push
```

Requires `gh auth login` — see [GitHub CLI docs](https://cli.github.com/).

## Notes

- **OpenZeppelin v5 imports:** The `solidity-security` skill uses OZ v5 import paths (`@openzeppelin/contracts/utils/ReentrancyGuard.sol`, `@openzeppelin/contracts/utils/Pausable.sol`). If you're on OZ v4, the old paths were `@openzeppelin/contracts/security/...`.
- **OpenZeppelin v5 Ownable:** OZ v5 requires `constructor(address initialOwner) Ownable(initialOwner) {}`. The `solidity-security` skill examples include this. OZ v5 also uses custom errors (e.g., `OwnableUnauthorizedAccount`) instead of revert strings.
- **Solidity version:** All skills target `^0.8.24` (Etherlink-compatible). The `foundry-solidity` skill's `solidity-modern.md` reference documents features up to 0.8.30 but notes that features above 0.8.24 may not be available on Etherlink. Default `evm_version` is `shanghai`.

## Disclaimer

This project is actively evolving and subject to change. Agents, skills, conventions, and project structure may be updated, added, or removed at any time.

## Contribute

Interested in helping us improve MochiMinds? We'd love to hear from you. Reach out by [opening an issue](https://github.com/mochi-minds/mochiminds/issues) or starting a [discussion](https://github.com/mochi-minds/mochiminds/discussions) — whether it's feedback, ideas, or contributions.

## Built With

- [Claude Code Agent Teams](https://code.claude.com/docs/en/agent-teams) — native multi-agent orchestration
- [Etherlink](https://etherlink.com) — Tezos EVM L2
- [Tezos](https://tezos.com) — L1 blockchain
- [SmartPy](https://smartpy.io) — Tezos smart contract framework
- [Foundry](https://book.getfoundry.sh) — Solidity toolchain
- [OpenZeppelin](https://www.openzeppelin.com/contracts) — Smart contract libraries
- [Next.js 16](https://nextjs.org) — React framework (Turbopack)
- [wagmi](https://wagmi.sh) + [RainbowKit](https://www.rainbowkit.com) — EVM wallet connection
- [viem](https://viem.sh) — EVM client library
- [Tailwind CSS](https://tailwindcss.com) — Utility-first CSS
