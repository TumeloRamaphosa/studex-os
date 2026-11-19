---
name: Composio
type: AI-agent-tools
provider: Composio
status: BROKEN (HTTP 410)
last_updated: 2025-08-19
---

# Composio

AI agent tools platform. Connects AI agents to 250+ tools.

## Status: ❌ BROKEN — HTTP 410 Gone

Key is expired or revoked. Needs regeneration.

## Credentials (CURRENT — BROKEN)
```
Key:      ak_x5Jb5ixRdp0xSdJQ17Kt
Workspace: tumelor001_workspace
Project:   tumelor001_workspace_first_project
Dashboard: https://dashboard.composio.dev
Backend:   backend.composio.dev/api
```

## SDK
```bash
pip install composio-core  # Works
```

## Bot App ID (for Discord integration)
`1530551927979511838`

## Action: Regenerate Key
1. Login to dashboard.composio.dev
2. Go to API Keys
3. Create new key
4. Replace in all configs:
   - Discord bot .env
   - Daytona ~/projects/studex-agent-sentinel/.env
5. Test: `composio login`
