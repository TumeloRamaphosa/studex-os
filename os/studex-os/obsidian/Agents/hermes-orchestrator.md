---
name: Hermes Orchestrator
type: agent
platform: miniMax
status: ACTIVE
role: Primary orchestrator
last_updated: 2025-08-19
---

# Hermes Orchestrator

Primary AI agent for StudeX OS. Coordinates all agents, handles technical execution.

## About
- Runs on miniMax AI infrastructure (this agent)
- Has persistent memory across sessions
- Loads skills on demand from skill library
- Connects to Daytona VM for heavy lifting
- Accesses Discord via Sentinel bot token
- Design: JetBrains Mono terminal aesthetic

## Capabilities
- Full code execution (Python, Node.js, Bash)
- Web research and API testing
- File system operations
- Deployments (Vercel, Matrix, Cloudflare)
- Git operations
- Terminal access to Daytona (when available)
- Discord bot management
- Website building and redesign

## Memory
- Persistent across sessions
- Stores: user preferences, API keys, agent configs, project state
- Synced to Obsidian vault on Daytona

## Current Tasks
1. StudeX OS build — knowledge graph, chat widget, VM panel
2. Website redesign — Renaissance + cyberpunk merge
3. Sentinel Discord bot — connect to server
4. API integrations — Queen, Croc, CashClaw, WhatsApp

## Files
- This vault: /workspace/studex-os/obsidian/
- Registry: /workspace/studex-os/registry/
- Website: /workspace/studex-site/
- Discord bot: /workspace/studex-agent-sentinel/
- Daytona code: ~/projects/ (on Daytona VM)
