# Prompt Guide

How to prompt the MochiMinds agent system. Copy, adapt, and use these prompts as starting points.

---

## 1. Team Prompts

Use these when you want multiple agents working in parallel on a project.

### Full pipeline
```
Create a team to build [PROJECT NAME] — [one-line description].

Members:
- Spawn a member using the mochi agent type to write the project brief
- Spawn a member using the blueprint agent type to design the spec
- Spawn a member using the forge agent type for EVM smart contracts
- Spawn a member using the naga agent type for Tezos L1 contracts
- Spawn a member using the link agent type for backend/API
- Spawn a member using the pixel agent type for frontend UI
- Spawn a member using the sage agent type for code review

Task structure:
1. Mochi: Brainstorm and write docs/brief.md
2. Blueprint: Read brief, design docs/spec.md (depends on 1)
3. Forge: Write Solidity contracts and tests (depends on 2)
4. Naga: Write SmartPy contracts and tests (depends on 2)
5. Link: Write API routes, types, contract helpers (depends on 2)
6. Pixel: Build UI with wallet connection (depends on 2, can use mock data)
7. Sage: Review all code, run builds (depends on 3+4+5+6)
```

### Skip ideation — start from a brief
```
Create a team to build [PROJECT NAME].

The brief is already written at projects/[ProjectName]/docs/brief.md.

Members:
- Spawn a member using the blueprint agent type to design the spec
- Spawn a member using the forge agent type for EVM smart contracts
- Spawn a member using the link agent type for backend/API
- Spawn a member using the pixel agent type for frontend UI
- Spawn a member using the sage agent type for code review

Task structure:
1. Blueprint: Read brief, write docs/spec.md
2. Forge + Link + Pixel: Implement in parallel (depends on 1)
3. Sage: Review all code (depends on 2)
```

### EVM only — no Tezos
```
Create a team to build [PROJECT NAME] — [description]. EVM contracts only, no Tezos L1.

Members:
- Spawn a member using the forge agent type for Solidity contracts
- Spawn a member using the link agent type for backend/API
- Spawn a member using the pixel agent type for frontend
- Spawn a member using the sage agent type for review
```

### Tezos L1 only — no EVM
```
Create a team to build [PROJECT NAME] — [description]. Tezos L1 contracts only, no EVM.

Members:
- Spawn a member using the naga agent type for SmartPy contracts
- Spawn a member using the link agent type for backend/API
- Spawn a member using the pixel agent type for frontend
- Spawn a member using the sage agent type for review
```

---

## 2. Single Agent Prompts

Run any agent standalone for focused work.

### Mochi — Brainstorm ideas
```bash
claude --agent mochi
```
```
Brainstorm 5 project ideas that combine AI and NFTs on Etherlink.
Evaluate each for feasibility, technical depth, and uniqueness.
Write the best one as a brief to docs/brief.md.
```

### Blueprint — Design architecture
```bash
claude --agent blueprint
```
```
Read docs/brief.md and design a complete technical spec.
Write it to docs/spec.md.
```

### Forge — Write Solidity contracts
```bash
claude --agent forge
```
```
Read docs/spec.md and implement the EVM contracts.
Set up Foundry if needed, write contracts and comprehensive tests.
```

### Naga — Write Tezos contracts
```bash
claude --agent naga
```
```
Read docs/spec.md and implement the Tezos L1 contracts.
Use SmartPy v0.17+ syntax and the FA2 library for token contracts.
```

### Link — Build backend/API
```bash
claude --agent link
```
```
Read docs/spec.md and implement the backend layer.
Write type definitions first, then API routes and contract helpers.
```

### Pixel — Build frontend
```bash
claude --agent pixel
```
```
Read docs/spec.md and build the frontend.
Choose a distinctive design direction — not generic dark mode.
Use wagmi + RainbowKit for Etherlink wallet and Beacon for Tezos L1.
```

### Sage — Review code
```bash
claude --agent sage
```
```
Review all code in this project. Run builds, check test coverage,
and report issues with confidence scores.
```

### Rocket — Deploy contracts
```bash
claude --agent rocket
```
```
Deploy the EVM contracts to Etherlink Shadownet.
Write the deploy script, run it, verify on the explorer,
and update .env.example with the deployed addresses.
```

---

## 3. Subagent & Team Management

### Spawn a subagent from within a session
```
Spawn naga to write an FA2 NFT contract with admin minting and burn support.
```
```
Spawn sage to review the contracts in contracts-evm/src/ and report findings.
```

### Experimental work on a branch
```
Spawn forge in a worktree to prototype a Dutch auction contract.
```

### Check progress
```
What's the status of each teammate's tasks?
```

### Redirect a teammate
```
Message Pixel: stop working on the animation and focus on the mint form first.
```

### Add a reviewer mid-build
```
Spawn a member using the sage agent type to review Forge's contracts.
The contracts are in contracts-evm/src/ — focus on security.
```

---

## 4. Real Project Examples

Prompts based on projects we've actually built and shipped.

### EthBalance — Etherlink wallet + balance checker
A simple app: connect wallet via RainbowKit, show XTZ balance on Etherlink Shadownet. No smart contracts.

```
Create a new project called EthBalance under projects/EthBalance/.

Copy the template frontend from templates/frontend/ and strip out
the Tezos L1 files (tezos config, Beacon wallet, TezosDemo, TezosConnectButton,
useTezos hook, walletStore, tzkt helpers). Keep only the Etherlink/EVM side.

The app should:
- Connect wallet via RainbowKit (wagmi + viem)
- Show the connected address with a link to the Etherlink Shadownet explorer
- Display the user's XTZ balance using wagmi's useBalance hook
- Target Etherlink Shadownet (chain ID 127823)
- Dark theme, single page, minimal UI

No smart contract interaction needed — just wallet connect + balance display.
```

### TezBalance — Tezos L1 wallet + balance checker
Same concept for Tezos L1: connect Beacon wallet, show XTZ balance via TzKT API. No smart contracts.

```
Create a new project called TezBalance under projects/TezBalance/.

Copy the template frontend from templates/frontend/ and strip out
the Etherlink/EVM files (etherlink config, wagmi config, RainbowKit,
EtherlinkDemo, useEtherlinkContract, contract.ts). Keep only the Tezos L1 side.

The app should:
- Connect wallet via Beacon SDK (@tezos-x/octez)
- Show the connected address with a link to TzKT
- Fetch and display the user's XTZ balance using the TzKT API
- Target Tezos Mainnet (or Shadownet via NEXT_PUBLIC_TEZOS_NETWORK)
- Dark theme, single page, minimal UI

No smart contract interaction needed — just wallet connect + balance display.
```

### MochiTheater — Agent session replay viewer
A fully static frontend that replays AI agent team build sessions as an animated timeline. No wallet, no contracts, no API routes.

```
Create a new project called MochiTheater under projects/MochiTheater/.

This is a static app — no blockchain interaction. It parses JSONL event logs
produced by Claude Code agent teams and plays them back as an animated timeline.

The app should have:
- Landing page with hero, team grid (9 agents), how-it-works section, roadmap
- Agent detail pages at /agents/[slug] with avatar, skills, project history
- Replay section: loads a .jsonl log file and plays it back with:
  - Phase pipeline (planning → design → implementation → review → deployment)
  - Agent grid showing live status (idle, busy, offline) with colored accents
  - Task tracker (pending, in-progress, completed)
  - Event feed with color-coded entries (messages, issues, fixes)
  - Playback controls (play/pause, speed 0.5x-4x, timeline scrubber)

Agent avatars are PNG files copied from docs/assets/ to public/avatars/.
Sample log file goes in public/replays/.

Tech: Next.js (App Router), Tailwind, no external deps beyond React.
Theme: dark (#0a0a0a), per-agent color accents, gradient text, monospace event feed.
```

---

## 5. Tips

- **Be specific** — "Write an ERC-721 with royalties" beats "Write a contract"
- **Reference the spec** — "Read docs/spec.md and implement..." gives agents full context
- **Name the network** — "Deploy to Etherlink Shadownet" or "Target Tezos Mainnet"
- **Set dependencies** — "Pixel depends on Link's types" prevents blocking
- **Start with 3-5 teammates** — more adds coordination overhead without proportional benefit
- **Let agents communicate** — they can message each other to resolve issues
- **Use plan approval** for risky work — "Require plan approval before Forge makes changes"
- **Use the template** — `templates/frontend/` has wagmi + RainbowKit + Beacon pre-configured. Copy it as a starting point for any new project.
