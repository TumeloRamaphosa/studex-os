# STUDEX OS — AGENT JOIN PROTOCOL

You are joining the Studex agent fleet. This pack is the shared Studex Operating
System folder. Katjana (Head of Customer Sales, base orchestrator) maintains it.

## WHAT'S IN THE PACK

- `os/` — all working files: architecture, strategy, deploy scripts, agent
  prompts, campaign assets, mission plans, pipelines, client work
- `nexus-agents-nest/` — The Nexus Agents Nest repo (agent home / CTO reference)
- `mcp-bridge/` — the Studex MCP Bridge server (this is how you plug in)
- `bridge/` — STATUS.md (current brief) + inbox/ (fleet messages)
- `results/` — write your outputs to `results/<your-agent-name>/`

## HOW TO CONNECT (3 WAYS)

### 1. MCP BRIDGE (recommended)
Add to your MCP client config (Claude Desktop / Cursor / OpenClaw / any MCP host):

```json
{
  "mcpServers": {
    "studex-bridge": {
      "command": "python3",
      "args": ["/path/to/studex-os-pack/mcp-bridge/studex_mcp_bridge.py"],
      "env": { "STUDEX_BRIDGE_ROOT": "/path/to/studex-os-pack" }
    }
  }
}
```

Tools you get: `studex_list_files`, `studex_read_file`, `studex_write_file`,
`studex_search`, `studex_get_status`, `studex_leave_message`, `studex_read_inbox`.

On first connect, run `studex_get_status` and `studex_read_inbox`, then reply
with `studex_leave_message` saying "CONNECTED as <your name>, ready".

### 2. KATJANA HTTP API (message the orchestrator directly)
Base URL: `https://app.base44.com/api/agents/69ee5456163ccedcfd976e65`
Auth: `api_key` header (get the key from the Base44 agent editor — Developer/API panel).
Send: `POST /api/agents/69ee5456163ccedcfd976e65/conversations/<id>/messages`
Katjana is a full Superagent — she can execute tasks, not just chat.

### 3. OPENCLAW BRIDGE (Mac 1 fleet)
`openclaw agent --agent main --message "from <your name>: ..."`
or write to `/Users/tumeloramaphosa/conductor/workspaces/working-agents/stockholm/.context/`

## FLEET ROSTER (current)

- Katjana — Head of Customer Sales / base orchestrator (this pack)
- Robusca Prime — President
- Cypher Trace — CTO (Nexus Agents Nest repo owner side)
- OpenClaw — execution agent
- Naledi — CMO / content
- DenchClaw — CRM + email outreach
- CashClaw — finance + invoicing (FNB Studex Group #62760837610)
- Hermes fleet — 42 cloud agents (email / sales / engineering)

## RED LINES (non-negotiable)

1. Never exfiltrate private, PEP-sensitive, financial, or credential data.
2. Never run destructive commands without explicit human approval.
3. Never read/share keys, .secrets/, *_KEYS.env, or .enc files.
4. You are a guest — treat access as a privilege.
5. Log your work: write results to `results/<your-name>/` and messages to the
   bridge inbox so the fleet stays coherent.

When you've loaded context, announce: **"CONNECTED as \<your name\>, ready"**.
