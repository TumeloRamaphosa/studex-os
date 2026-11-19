---
name: Honcho Persistent Memory
type: integration
framework: Honcho MCP
status: NEED_API_KEY
last_updated: 2025-08-19
---

# Honcho — Persistent Memory for Every AI Tool

## What Is Honcho?

MCP server that gives any AI tool persistent memory. Connect once, and every AI tool remembers Tumelo, StudeX, clients, preferences, past decisions.

**Server URL:** `https://mcp.honcho.dev`

## Our Integration Plan

```
┌──────────────────────────────────────────────────────────────┐
│                    HONCHO MEMORY HUB                         │
│                                                               │
│  Workspace: studex-group                                     │
│  API Key: hch-... (get from app.honcho.dev)                  │
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Claude Code │  │   Cursor    │  │ Windsurf    │        │
│  │ DARK F@CT0Ry│  │   Anywhere  │  │  Anywhere   │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                 │                 │                │
│         └────────────────┬┴─────────────────┘                │
│                          │                                    │
│                   Honcho MCP Hub                             │
│                   https://mcp.honcho.dev                    │
│                          │                                    │
│              ┌────────────┴────────────┐                      │
│              │                         │                      │
│     ┌────────▼────────┐     ┌─────────▼────────┐           │
│     │ Studex Memory   │     │  Tumelo Personal │           │
│     │ - Agent state   │     │  - Preferences   │           │
│     │ - API keys      │     │  - Work style    │           │
│     │ - Clients       │     │  - Goals         │           │
│     │ - Decisions     │     │                  │           │
│     └─────────────────┘     └──────────────────┘             │
└──────────────────────────────────────────────────────────────┘
```

## Setup Per Tool

### Claude Desktop (Tumelo's MacBook)
Edit: `~/Library/Application Support/Claude/claude_desktop_config.json`
```json
{
  "mcpServers": {
    "honcho": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp.honcho.dev", "--header", "Authorization:${AUTH_HEADER}"],
      "env": { "AUTH_HEADER": "Bearer hch-your-key-here" }
    }
  }
}
```
Full quit and relaunch Claude Desktop after saving.

### Claude Code (Orgo VMs, DARK F@CT0Ry)
```bash
claude mcp add honcho   --transport http   --url "https://mcp.honcho.dev"   --header "Authorization: Bearer hch-your-key-here"
```

### Cursor (anywhere)
Add to `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "honcho": {
      "url": "https://mcp.honcho.dev",
      "headers": { "Authorization": "Bearer hch-your-key-here" }
    }
  }
}
```

### Windsurf
Add to `~/.codeium/windsurf/mcp_config.json`:
```json
{
  "mcpServers": {
    "honcho": {
      "serverUrl": "https://mcp.honcho.dev",
      "headers": { "Authorization": "Bearer hch-your-key-here" }
    }
  }
}
```

### VS Code (Copilot Chat)
Add to User Settings JSON:
```json
{
  "mcp": {
    "servers": {
      "honcho": {
        "type": "http",
        "url": "https://mcp.honcho.dev",
        "headers": { "Authorization": "Bearer hch-your-key-here" }
      }
    }
  }
}
```

### Cline
Add to `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`:
```json
{
  "mcpServers": {
    "honcho": {
      "url": "https://mcp.honcho.dev",
      "headers": { "Authorization": "Bearer hch-your-key-here" }
    }
  }
}
```

## The Memory Loop (How It Works)

```
1. RECALL → Agent asks "What does Tumelo know about X?"
   ↓
2. RESPOND → Agent answers based on memory + current context
   ↓
3. RECORD → Agent saves important facts back to memory
   ↓
4. REPEAT → Next session, agent recalls everything
```

## Workspace Setup

Create workspace for StudeX Group:
```bash
# Using the Honcho tools once connected:
# - list_workspaces → find studex-group workspace
# - create_workspace → create if doesn't exist
# - workspace_id: "studex-group"
```

## What Gets Remembered

| Memory Type | Examples |
|------------|---------|
| Tumelo Preferences | "Prefers action over planning", "Launch NOW", course time 10-12 |
| Business Context | "Super Agents is an AI agent SaaS for Africa", "Target: SMEs" |
| Client Info | "Super Agents SaaS client: law firm in Sandton", "budget R50k/mo" |
| Agent State | "Discord Sentinel bot deployed but not in server yet" |
| API Keys | Encrypted in memory, recalled when needed |
| Decisions | "Tumelo approved Vercel Eve for hourly monitoring", etc. |
| Lessons Learned | "Daytona SSH blocked from sandbox", "ORGO MCP returns 401" |

## Free vs Paid

| Feature | Free | Paid |
|---------|------|------|
| MCP connections | 1 | Unlimited |
| Memory | Basic | Advanced |
| Cross-tool sync | No | Yes |
| API calls | Limited | Unlimited |

**Get API key:** https://app.honcho.dev

## Verification

After setup, ask any connected AI:
> "What do you know about Tumelo Ramaphosa?"

First time: Not much
After a few sessions: Full context
