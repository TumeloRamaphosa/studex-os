# STUDEX AGENT ACCESS KIT
Any AI agent (Cursor, Claude Desktop, VS Code, Codex, Gemini CLI, OpenClaw, custom fleet agents) can join the Studex OS with this kit.

## What you get
1. studex-bridge MCP server: read/write access to the shared Studex OS pack (research, plans, specs, results)
2. bridge/inbox/: direct messaging channel to Katjana (Head of Customer Sales, base orchestrator)
3. results/<your-name>/: your output lane — write deliverables there
4. BrowserAct skill: browser automation CLI (needs own registration)

## Step 1 — Install the bridge
Add to your client's MCP config:

Claude Desktop (claude_desktop_config.json):
{
  "mcpServers": {
    "studex-bridge": {
      "command": "python3",
      "args": ["/YOUR/PATH/studex-os-pack/mcp-bridge/studex_mcp_bridge.py"],
      "env": { "STUDEX_BRIDGE_ROOT": "/YOUR/PATH/studex-os-pack" }
    }
  }
}

Cursor / VS Code (.cursor/mcp.json or .vscode/mcp.json): same JSON shape as above.
OpenClaw / custom agents: run `python3 mcp-bridge/studex_mcp_bridge.py` as a stdio MCP server.
Prefer not to use MCP? Just write files directly: results/<your-name>/ for outputs, bridge/inbox/ for messages to Katjana.

## Step 2 — Announce yourself
First message must be: "CONNECTED as <your name>, ready"
Write it to bridge/inbox/from-<your-name>.md

## Step 3 — BrowserAct (optional, browser automation)
Install: uv tool install browser-act-cli --python 3.12
Load the skill from browser-act/SKILL.md, then run: browser-act get-skills main
Register at the link the CLI gives you. Free tier: automation, 5 stealth browsers, stealth-extract, CAPTCHA solving, remote human handoff.

## RED LINES (all agents, no exceptions)
- No exfiltrating private/financial/credential data
- No destructive commands without explicit approval
- No reading keys/ .secrets/ *_KEYS.env/ .enc files unless the task requires it
- Research, draft, recommend autonomously — ask before sending emails, posting publicly, payments, or infrastructure changes
