#!/usr/bin/env node
/**
 * Captures team activity to JSONL for the MochiMinds interactive website.
 *
 * Tracks: session lifecycle, agent spawns, task flow, and inter-agent messages.
 * Output: logs/{team-name}.raw.jsonl (or logs/agent-log.jsonl for non-team sessions)
 *
 * Uses appendFileSync to avoid race conditions with async writes.
 */

import { appendFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const logsDir = join(__dirname, "..", "..", "logs");
mkdirSync(logsDir, { recursive: true });

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  let d;
  try {
    d = JSON.parse(input);
  } catch {
    process.stderr.write("capture-event: invalid JSON on stdin\n");
    process.exit(0);
  }

  const event = {
    event: d.hook_event_name,
    ts: new Date().toISOString(),
    session_id: d.session_id,
  };

  // Add team/agent context when available
  if (d.team_name) event.team_name = d.team_name;
  if (d.teammate_name) event.teammate_name = d.teammate_name;
  if (d.agent_id) event.agent_id = d.agent_id;
  if (d.agent_type) event.agent_type = d.agent_type;

  // Event-specific fields
  switch (d.hook_event_name) {
    case "SessionStart":
      event.source = d.source;
      event.model = d.model;
      break;

    case "SessionEnd":
      event.reason = d.session_end_reason;
      break;

    case "SubagentStart":
      // agent_id and agent_type already added above
      break;

    case "SubagentStop":
      if (d.last_assistant_message) event.last_message = d.last_assistant_message;
      break;

    case "TaskCreated":
      event.task_id = d.task_id;
      event.task_subject = d.task_subject;
      if (d.task_description) event.task_description = d.task_description;
      break;

    case "TaskCompleted":
      event.task_id = d.task_id;
      event.task_subject = d.task_subject;
      break;

    case "PostToolUse":
      // Only SendMessage is captured. Exits handler entirely — no log written
      // for non-SendMessage events. The settings.json matcher also filters to
      // SendMessage, so this is a defensive guard.
      if (d.tool_name !== "SendMessage") return;
      if (!d.tool_input) break;
      event.event = "AgentMessage";
      event.to = d.tool_input.to;
      event.summary = d.tool_input.summary;
      if (typeof d.tool_input.message === "string") {
        event.message = d.tool_input.message;
      }
      break;

    case "TeammateIdle":
      break;
  }

  const file = join(logsDir, d.team_name ? `${d.team_name}.raw.jsonl` : "agent-log.jsonl");

  try {
    appendFileSync(file, JSON.stringify(event) + "\n");
  } catch (err) {
    process.stderr.write(`capture-event: write error: ${err.message}\n`);
  }
});
