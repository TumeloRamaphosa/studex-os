---
name: StudeX OS Architecture
type: system
last_updated: 2025-08-19
---

# StudeX OS Architecture

## Vision
Personal AI operating system for running Studex Group. Coordinates all AI agents, manages knowledge, builds software, handles client work.

## Core Components

### 1. Brain (Daytona VM)
- 24/7 cloud VM
- Knowledge graph (Obsidian vault)
- Agent mesh coordination
- Git repos for all code
- OpenClaw + DeerFlow for coding

### 2. Communication Layer (Discord Sentinel)
- User ↔ OS bridge
- Commands from Discord
- Reports back to Discord
- Buzz agent relay

### 3. Execution Layer (Orgo VMs)
- 10 desktops running 24/7
- Browser-based automation
- Per-desktop specialized tasks

### 4. Client Layer (Metal + WhatsApp)
- WhatsApp agent for clients
- Per-client Buzz agents
- OpenClaw builds their software

### 5. Interface Layer (Website + Chat Widget)
- superagents.studex-group.com
- Floating terminal chat widget
- VM deployment panel
- Payments via Stitch

## Design System
- **Primary:** StudEx OS Cyberpunk
  - bg: #070a0c
  - ink: #39ffaa
  - pink: #ff2ec4
  - border: rgba(57,255,170,0.22)
  - font: JetBrains Mono + Space Grotesk
- **Secondary:** Renaissance (for marketing site)
  - Cinzel + Cormorant Garamond + JetBrains Mono
  - Venetian Gold #C9A962
  - Merge into cyberpunk for redesigned site

## Knowledge Graph Structure
```
~/obsidian-vault/
├── Agents/        — agent configs, prompts, status
├── Clients/      — client info, onboarding
├── API/          — API keys, endpoints, integration docs
├── VMs/          — VM configs, Orgo desktop details
├── Projects/     — active projects, status
├── System/       — architecture, workflows
└── Workflows/    — standard operating procedures
```

## Sync Strategy
- Primary: Daytona VM (always synced)
- Backup: Local MacBook (user syncs periodically)
- Git: All code in bare repos on Daytona, HTTP server on port 9090

## Communication Flow
```
User Message
    ↓
Discord (Sentinel bot)
    ↓
Hermes Orchestrator (me — this agent)
    ↓
┌──→ Daytona (OpenClaw/DeerFlow/Buzz) — heavy tasks
├──→ Orgo VMs — execution, automation
├──→ Website — updates, chat widget
└──→ WhatsApp (Metal) — client responses
    ↓
Discord Report
```
