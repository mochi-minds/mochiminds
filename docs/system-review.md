# MochiMinds System Review

Review date: 2026-04-07

---

## Skill Review (12 skills)

### Critical

**1. `foundry-solidity` — Solidity 0.8.30 + Prague EVM contradicts project stack (Confidence: 95)**

The entire skill uses Solidity 0.8.30 and `evm_version = "prague"`. CLAUDE.md mandates `^0.8.24` and Etherlink uses EVM Osaka. Affected lines:
- `SKILL.md` line 10: header says "Solidity 0.8.30"
- `SKILL.md` lines 103, 169: `pragma solidity ^0.8.30;`
- `SKILL.md` line 220: `solc = "0.8.30"`, `evm_version = "prague"`
- All files under `references/` repeat these values

Agents following this skill will generate contracts incompatible with Etherlink.

Fix: Change all pragmas to `^0.8.24`, `solc = "0.8.24"`, `evm_version = "osaka"`.

**2. `solidity-security` — OZ v5 `Ownable` missing `initialOwner` constructor (Confidence: 85)**

Lines 152 and 293 show contracts inheriting `Ownable` with no constructor argument. OZ v5 requires `constructor(address initialOwner) Ownable(initialOwner) {}`. Generated code will not compile.

Line 451 uses `revertedWith("Ownable: caller is not the owner")` — OZ v5 uses custom error `OwnableUnauthorizedAccount`, not this string.

Fix: Add `initialOwner` constructors. Update error check to OZ v5 custom error.

**3. `solidity-security` — Hardhat test examples in a Foundry project (Confidence: 83)**

Lines 411–454 use Hardhat/chai syntax (`ethers.getContractFactory`, `describe/it`). Project stack is Foundry. Agents writing security tests from this skill will generate the wrong framework.

Fix: Replace with Forge test patterns or cross-reference `foundry-solidity/references/security.md`.

### Important

**4. `etherlink` vs `foundry-solidity` — Cross-skill Solidity version contradiction (Confidence: 90)**

`etherlink/references/differences.md` line 34 caps Solidity at 0.8.24. `foundry-solidity` uses 0.8.30 throughout. Agents loading both get contradictory instructions.

Fix: Resolve via fixing #1 above.

**5. `nextjs-app-router-patterns` — Says "Next.js 14+" but project uses Next.js 16 (Confidence: 82)**

Description and body say "14+". The caching section (line 496) shows `force-cache` as default, which changed in Next.js 15+ to `no-store`. Agents may produce code with unexpected caching behavior.

Fix: Update description to "Next.js 16". Add note about changed caching defaults.

**6. `etherlink-api` — Uses ethers.js in JSON-RPC examples (Confidence: 80)**

Lines 238–264 use `ethers.JsonRpcProvider`, `ethers.Contract`, etc. Project stack is wagmi v2 + viem.

Fix: Replace with viem `createPublicClient` / `createWalletClient` examples.

**7. `upgrade-solidity-contracts` — `Initializable` import path inconsistency (Confidence: 85)**

Line 50 imports `Initializable` from `@openzeppelin/contracts/proxy/utils/Initializable.sol` (non-upgradeable package) while the same code block uses upgradeable base contracts. Line 73 correctly explains the v5.5+ change, but the code example doesn't match the prose.

Fix: Add a comment clarifying the v5.5+ context or import from the upgradeable package.

### Skill Description Lengths

| Skill | Chars | Over 250? |
|-------|-------|-----------|
| smartpy-new-syntax | ~839 | Yes |
| smartpy-deploy | ~798 | Yes |
| upgrade-solidity-contracts | ~425 | Yes |
| solidity-auditor | ~370 | Yes |
| develop-secure-contracts | ~352 | Yes |
| setup-solidity-contracts | ~284 | Yes |
| foundry-solidity | ~225 | No |
| etherlink | ~222 | No |
| etherlink-api | ~208 | No |
| solidity-security | ~183 | No |
| nextjs-app-router-patterns | ~148 | No |
| frontend-design | ~141 | No |

### Clean Skills (no issues found)

- `smartpy-deploy` — Accurate. RPC/faucet URLs match CLAUDE.md.
- `smartpy-new-syntax` — Accurate. Banned syntax table, FA2 patterns all correct.
- `develop-secure-contracts` — Excellent. Correctly instructs reading installed source first.
- `solidity-auditor` — Good. All `references/*.md` files exist. OWASP SC Top 10 cited correctly.
- `frontend-design` — No technical API claims. Style-focused. No issues.
- `setup-solidity-contracts` — Foundry remappings correct for OZ v5.

---

## Agent Review (8 agents)

### Pixel — ethers.js reference instead of wagmi/viem (Confidence: 90)

`pixel.md` line 91: "Etherlink (EVM): `useEtherlinkWallet` hook + ethers.js."
CLAUDE.md specifies wagmi v2 + viem + RainbowKit. The template uses wagmi/viem, not ethers.js.

Fix: Change line 91 to reference `wagmi v2 + viem`.

### Link — Missing ownership + skill in frontmatter (Confidence: 90–95)

1. `link.md` "What You Own" (line 32) omits `docs/api-contracts.md`, which CLAUDE.md assigns to Link. — FIXED 2026-04-08
2. ~~`nextjs-app-router-patterns` not in frontmatter~~ — False positive: it was already at line 17.

### Blueprint — Spec template missing Link's docs file (Confidence: 85)

`blueprint.md` line 121 File Ownership Map template lists Link's files but omits `docs/api-contracts.md`.

Fix: Add `docs/api-contracts.md` to the Link entry in the spec template.

### Mochi — Bash tool likely unnecessary (Confidence: 80)

Mochi's job is brainstorming and writing `docs/brief.md`. No process step or quality gate requires shell commands. Including Bash widens the attack surface for an ideation agent.

Fix: Consider removing Bash from Mochi's tools list.

### Clean Agents (no issues found)

- **Forge** — Ownership matches CLAUDE.md. All 7 skills exist. Stack references accurate.
- **Naga** — All 2 skills exist. Stack references match.
- **Rocket** — Ownership correct including `.gitignore`. All 5 skills exist.
- **Sage** — Read-only tools correct (no Write/Edit). On-demand skill loading is intentional.

---

## docs/agents.md Discrepancies

7 discrepancies between docs/agents.md and actual agent definitions:

| Agent | docs/agents.md says | Actual agent file |
|-------|--------------------|--------------------|
| Mochi | Skills: None | `skills: [etherlink, smartpy-new-syntax]` |
| Blueprint | Skills: static list of 7 | No `skills:` frontmatter — on-demand loading only |
| Link | Skills: etherlink-api, etherlink | Body also lists `nextjs-app-router-patterns` |
| Forge | Skills: 6 listed | Frontmatter has 7 — missing `upgrade-solidity-contracts` |
| Rocket | Skills: 4 listed | Frontmatter has 5 — missing `upgrade-solidity-contracts` |
| Sage | Skills: 8 listed | No `skills:` frontmatter — on-demand loading; also missing `develop-secure-contracts` |
| Rocket | "deploys frontend to Netlify/Vercel" | No frontend deployment steps in agent file |

---

## Priority Summary

### Fix immediately (broken code generation) — FIXED 2026-04-08

1. ~~`foundry-solidity` — 0.8.30 → `^0.8.24`, prague → shanghai (all files + references/)~~ Done
2. ~~`solidity-security` — OZ v5 `Ownable` constructor, error string, Hardhat → Foundry tests~~ Done

### Fix soon (quality/consistency)

3. `pixel.md` — ethers.js → wagmi v2 + viem
4. `link.md` — add `docs/api-contracts.md` ownership + `nextjs-app-router-patterns` to frontmatter
5. `blueprint.md` — add `docs/api-contracts.md` to spec template
6. `nextjs-app-router-patterns` — "14+" → "16", caching defaults
7. `etherlink-api` — ethers.js → viem examples
8. `upgrade-solidity-contracts` — Initializable import clarity
9. `docs/agents.md` — sync all 7 discrepancies

### Consider

10. Remove Bash from Mochi's tools
11. Trim skill descriptions over 250 chars
