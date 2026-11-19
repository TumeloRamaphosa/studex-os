---
name: Buzz Agents
type: agent
platform: Daytona VM
status: ACTIVE
role: Per-client automation agents
last_updated: 2025-08-19
---

# Buzz Agents

Per-client AI agents running on Daytona VM. Each agent handles a specific client or function.

## Active Agents

### dench-client
- Client: Dench
- Task: Client-specific automation
- Status: ACTIVE

### hourly-reporter
- Task: Hourly status reporting
- Reports to: Discord, Orgo VMs
- Status: ACTIVE

### huly-client
- Integration: Huly (ticket system)
- Task: Huly ticket → AI agent → built software workflow
- Status: ACTIVE

### openclaw-client
- Integration: OpenClaw AI coding
- Task: AI-powered code building
- Status: ACTIVE

### whatsapp-client
- Integration: WhatsApp (Metal agent)
- Task: WhatsApp message handling
- Status: ACTIVE

## Directory
`/workspace/studex-agent-sentinel/buzz-agents/`

## Connection to Sentinel
Buzz agents are loaded as prompts in the Sentinel Discord bot. When user mentions the bot in Discord, Sentinel routes to the appropriate Buzz agent.

## Huly → AI → Built Software Flow
```
Huly Ticket → Hermes/Sentinel → Buzz Agent → OpenClaw → Built Software → Discord Report
```
This is the core Software Factory workflow.
