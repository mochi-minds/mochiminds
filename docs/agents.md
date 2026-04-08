# Agents

MochiMinds has 8 specialized agents. Each runs as its own Claude Code session with a dedicated system prompt, tool access, domain skills, and file ownership rules.

Agent definitions live in `.claude/agents/{name}.md`.

---

## <img src="assets/mochi.png" width="48" style="vertical-align: middle" /> Mochi — Ideator

Researches, brainstorms, and selects a project idea. Writes a clear, actionable brief that the rest of the team can execute.

**Tools:** Read, Write, Edit, Bash, Glob, Grep, WebFetch, WebSearch

**Skills:** etherlink, smartpy-new-syntax

**Standalone usage:**
```bash
claude --agent mochi
```
Ask Mochi to brainstorm project ideas for a hackathon, evaluate feasibility, or write a brief for a specific concept.

---

## <img src="assets/blueprint.png" width="48" style="vertical-align: middle" /> Blueprint — Architect

Reads the project brief and creates a complete technical specification. Designs contracts, API, frontend, database, and how everything connects. The spec is the source of truth for the entire team.

**Tools:** Read, Write, Edit, Glob, Grep, WebFetch, WebSearch

**Skills:** On-demand loading (no preloaded skills). Blueprint reads skill files as needed per spec section — see `blueprint.md` for the full mapping.

**Standalone usage:**
```bash
claude --agent blueprint
```
Give Blueprint a brief or project idea and it will produce a full technical spec with contract interfaces, API routes, frontend pages, environment variables, and a build sequence.

---

## <img src="assets/forge.png" width="48" style="vertical-align: middle" /> Forge — Solidity Dev

Writes, tests, and verifies production-grade Solidity smart contracts using Foundry and OpenZeppelin, targeting Etherlink and other EVM-compatible chains.

**Tools:** Read, Write, Edit, Bash, Glob, Grep, WebFetch, WebSearch

**Skills:** foundry-solidity, setup-solidity-contracts, develop-secure-contracts, solidity-security, etherlink, etherlink-api, upgrade-solidity-contracts

**Standalone usage:**
```bash
claude --agent forge
```
Use Forge for any Solidity/Foundry work — writing contracts, setting up a Foundry project, writing tests, optimizing gas, or debugging compilation errors.

---

## <img src="assets/naga.png" width="48" style="vertical-align: middle" /> Naga — Smartpy Dev

Writes, tests, and deploys production-grade Tezos smart contracts using SmartPy v0.17+. Builds FA2 tokens (NFTs, fungible, single-asset), DeFi protocols, and dApps targeting Tezos L1.

**Tools:** Read, Write, Edit, Bash, Glob, Grep, WebFetch, WebSearch

**Skills:** smartpy-new-syntax, smartpy-deploy

**Standalone usage:**
```bash
claude --agent naga
```
Use Naga for any SmartPy/Tezos work — FA2 tokens, contract testing, Tezos deployment, or migrating old SmartPy syntax to v0.17+.

---

## <img src="assets/link.png" width="48" style="vertical-align: middle" /> Link — Backend Dev

Builds the backend layer: API routes, database integrations, contract interaction helpers, external service integrations, and TypeScript types. The bridge between smart contracts, databases, external APIs, and the frontend.

**Tools:** Read, Write, Edit, Bash, Glob, Grep, WebFetch, WebSearch

**Skills:** etherlink-api, etherlink, nextjs-app-router-patterns

**Standalone usage:**
```bash
claude --agent link
```
Use Link for Next.js API routes, database setup (Supabase, Prisma, Drizzle), contract ABI helpers, AI service integrations, or TypeScript type definitions.

---

## <img src="assets/pixel.png" width="48" style="vertical-align: middle" /> Pixel — Frontend Dev

Builds production-grade web frontends — pages, components, hooks, styling, and state management. Cares about design quality, accessibility, performance, and user experience.

**Tools:** Read, Write, Edit, Bash, Glob, Grep, WebFetch, WebSearch

**Skills:** frontend-design, nextjs-app-router-patterns, etherlink-api, etherlink

**Standalone usage:**
```bash
claude --agent pixel
```
Use Pixel for building UI pages, designing component systems, wallet integration, responsive layouts, or any frontend work.

---

## <img src="assets/sage.png" width="48" style="vertical-align: middle" /> Sage — Reviewer

Reviews all code produced by the team. Runs builds, audits, and checks. Reports issues with confidence scores. Does NOT write application code — reads, verifies, and gates quality. Approval is required before deployment.

**Tools:** Read, Bash, Glob, Grep, WebFetch, WebSearch (no Write or Edit — read-only)

**Skills:** On-demand loading (no preloaded skills). Sage reads skill files as needed per review domain — see `sage.md` for the full mapping.

**Review process:**
1. Build verification (contracts + frontend)
2. Smart contract review (security, access control, gas)
3. Tezos contract review (if applicable)
4. Backend/API review (secrets, validation, error handling)
5. Frontend review (wallet edge cases, loading states, accessibility)
6. Integration review (ABIs match, URLs match, env vars consistent)
7. Spec compliance check

**Verdict:** APPROVE or REQUEST_CHANGES (only for confidence 80+ issues)

**Standalone usage:**
```bash
claude --agent sage
```
Use Sage for code reviews, security audits, build verification, or checking spec compliance on any codebase.

---

## <img src="assets/rocket.png" width="48" style="vertical-align: middle" /> Rocket — Deployer

Deploys smart contracts to EVM and Tezos L1 chains. Verifies deployments, writes documentation, and ensures the project is production-ready. Last agent before the project ships.

**Tools:** Read, Write, Edit, Bash, Glob, Grep, WebFetch, WebSearch

**Skills:** foundry-solidity, etherlink-api, etherlink, smartpy-deploy, upgrade-solidity-contracts

**Deployment targets:**
- EVM contracts → Etherlink (Foundry + Blockscout verification)
- Tezos contracts → Tezos L1 (octez-client)

**Standalone usage:**
```bash
claude --agent rocket
```
Use Rocket for deploying contracts, setting up hosting, writing deploy scripts, creating README files, or pushing projects to GitHub.

---

## Using Agents in a Team

When running as a team, the lead spawns agents as teammates:

```
Create a team to build [project name]:
- Spawn a teammate using the forge agent type for EVM contracts
- Spawn a teammate using the link agent type for backend
- Spawn a teammate using the pixel agent type for frontend
- Spawn a teammate using the sage agent type for review
```

Agents communicate via `SendMessage`, coordinate through shared tasks, and follow file ownership rules defined in `CLAUDE.md`. The lead can also spawn Mochi and Blueprint first to generate the brief and spec before the implementation agents start.

### Monitoring

- **Shift+Down** — cycle through teammates
- **Ctrl+T** — toggle task list
- Logs in `logs/{team-name}.raw.jsonl`
