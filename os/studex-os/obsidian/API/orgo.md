---
name: Orgo AI
type: cloud-infrastructure
provider: Orgo AI
status: WORKING (REST)
last_updated: 2025-08-19
---

# Orgo AI

Cloud desktop infrastructure. 10 browsers running 24/7.

## Credentials
```
Key:  ${ORGO_API_KEY}
Base: https://www.orgo.ai/api
```

## Status
| Service | Status | Notes |
|---------|--------|-------|
| REST API | ✅ WORKING | Works great |
| MCP | ❌ 401 | Key expired/revoked |
| Browser VNC | ✅ | Via dashboard.orgo.ai |

## Endpoints
- Workspaces: `GET /api/workspaces`
- Workspace details: `GET /api/workspaces/{id}`
- Desktops: in workspace data as `desktops[]` array

## MCP Regeneration
1. Go to dashboard.orgo.ai
2. Navigate to API keys
3. Create new key
4. Update all agent configs with new key

## Bot Client
`/workspace/studex-agent-sentinel/clients/orgo-client.js`
