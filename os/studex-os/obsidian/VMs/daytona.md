---
name: Daytona VM
type: vm
provider: Daytona
status: ACTIVE
role: Primary brain
last_updated: 2025-08-19
---

# Daytona Sandbox — Primary Brain VM

24/7 cloud VM. Brain of StudeX OS.

## Connection
```
Host:     ssh.app.daytona.io
Port:     2222
User:     daytona
SSH Key:  ~/.ssh/id_ed25519.pub (on sandbox)
```

## Specs
- **RAM:** 755GB
- **Node.js:** 25.8.0
- **Python:** 3.14.1
- **Claude Code:** 2.1.19
- **OpenAI Codex:** 0.128.0
- **OpenClaw:** 2026.7.1-2
- **Bun:** 1.3.6

## Ports
| Port | Service |
|------|---------|
| 2222 | SSH |
| 9090 | Python HTTP git server (serving ~/repos/) |
| 2280 | Node.js health API server |
| 33333 | Node.js HTML server |

## Git Repos (bare)
- ~/repos/studex.git
- ~/repos/agents.git
- ~/repos/campaigns.git
- ~/repos/studex-platform.git

## Directories
- ~/obsidian-vault/ — knowledge graph
- ~/projects/ — all code projects
- ~/studex-os/ — OS dashboard files
- ~/deer-flow-deploy/ — DeerFlow framework

## Known Issues
- SSH to GitHub (port 22) BLOCKED — use HTTPS
- Direct SSH from this agent blocked — use HTTP git sync

## Backup
Local MacBook — user syncs from Daytona for redundancy.
