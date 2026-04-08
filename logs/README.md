# Logs

> **Logging is currently disabled.** The hook configuration is preserved in `docs/v2/settings.json`. To re-enable, merge its contents into `.claude/settings.json`.

## What Gets Logged

Team activity for the MochiMinds interactive website. Every event includes `session_id` and `ts`.

| Event | When | Key Fields |
|-------|------|------------|
| `SessionStart` | Session begins or resumes | `source`, `model` |
| `SessionEnd` | Session terminates | `reason` |
| `SubagentStart` | Agent spawned into a team | `agent_id`, `agent_type` |
| `SubagentStop` | Agent finishes | `agent_id`, `agent_type`, `last_message` |
| `TaskCreated` | Task assigned to an agent | `task_id`, `task_subject`, `task_description`, `teammate_name`, `team_name` |
| `TaskCompleted` | Agent marks task done | `task_id`, `task_subject`, `teammate_name`, `team_name` |
| `AgentMessage` | Agent sends a message (via SendMessage) | `to`, `summary`, `message`, `teammate_name`, `team_name` |
| `TeammateIdle` | Agent goes idle | `teammate_name`, `team_name` |

## Files

- `{team-name}.raw.jsonl` — Per-team event log (created automatically when a team runs)
- `agent-log.jsonl` — Events from non-team sessions

Events with a `team_name` field route to the team file. All others go to `agent-log.jsonl`.

## Example Events

**Agent spawned:**
```json
{"event":"SubagentStart","ts":"2026-04-07T12:00:00.000Z","session_id":"abc","team_name":"mochicard","agent_id":"a1b2c3","agent_type":"forge"}
```

**Task assigned:**
```json
{"event":"TaskCreated","ts":"2026-04-07T12:01:00.000Z","session_id":"abc","team_name":"mochicard","teammate_name":"Forge","task_id":"1","task_subject":"Write ERC-721 contract","task_description":"Set up Foundry, write NFT contract with mint function"}
```

**Agent message:**
```json
{"event":"AgentMessage","ts":"2026-04-07T12:05:00.000Z","session_id":"abc","team_name":"mochicard","teammate_name":"Forge","to":"Link","summary":"Contract ABI ready","message":"The MochiCard contract is deployed. ABI is at contracts-evm/out/MochiCard.sol/MochiCard.json"}
```

**Task completed:**
```json
{"event":"TaskCompleted","ts":"2026-04-07T12:10:00.000Z","session_id":"abc","team_name":"mochicard","teammate_name":"Forge","task_id":"1","task_subject":"Write ERC-721 contract"}
```

## Hook Source

- Script: `.claude/hooks/capture-event.mjs`
- Config: `docs/v2/settings.json` (copy to `.claude/settings.json` to enable)
- All hooks run async with 30s timeout — they never block agents
