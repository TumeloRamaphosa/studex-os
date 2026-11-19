---
name: StudeX OS Agent Registry
type: index
last_updated: 2025-08-19
---

# StudeX OS Agent Mesh

All AI agents in the StudeX operating system. Coordinated via Daytona VM brain.

| # | Agent | Platform | Status | Role | Connect |
|---|-------|----------|--------|------|---------|
| 1 | **Hermes** (Me) | miniMax | 🟢 ACTIVE | Orchestrator | here |
| 2 | **Sentinel** | Discord | 🔴 NOT CONNECTED | User comms + webhooks | OAuth pending |
| 3 | **Metal** | WhatsApp | 🟢 ACTIVE | Client-facing agent | openwa |
| 4 | **Buzz Agents** | Daytona | 🟢 ACTIVE | Per-client automation | dench/huly/whatsapp/openclaw |
| 5 | **Orgo VMs** | Orgo AI | 🟢 ACTIVE | 10 execution desktops | REST ✓ / MCP ✗ |
| 6 | **OpenClaw** | Daytona | 🟢 READY | AI coding agent | CLI on Daytona |
| 7 | **DeerFlow** | Daytona | 🟢 READY | Agent framework | ~/deer-flow-deploy/ |

## Communication Flow

```
User → Discord (Sentinel) → Hermes → Daytona (OpenClaw/DeerFlow/Buzz)
                          → Orgo VMs (execution)
                          → WhatsApp (Metal agent)
                          → Website (Chat Widget)
```

## Status Summary

- 🟢 Active: 6/7 agents
- 🟡 Pending keys: Queen API, Croc API, CashClaw, Composio (regen)
- 🔴 Needs action: Sentinel Discord bot (OAuth join), Composio key regen
