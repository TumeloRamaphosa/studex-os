---
name: OpenMausBot Integration
type: integration
source: https://github.com/milind-soni/OpenMausBot
status: PLANNING
last_updated: 2025-08-19
---

# OpenMausBot — Analysis & Integration Plan

## What It Is
Open-source local-first AI agent hub. Chat with multiple AI agents like contacts in a messaging app. Each agent has its own personality, VM, memory, and connected apps.

## Key Features
- **Model Picker**: Switch Claude/Codex/Grok mid-conversation per agent
- **Dedicated Computers**: Every agent spins up its own cloud Linux desktop with live screen preview
- **Permission Broker**: Agents ask "Allow/Deny" before running shell commands or editing files
- **App Integrations**: 500+ connected apps via Composio (Gmail, Slack, GitHub, Notion, Linear, etc.)
- **Voice**: ElevenLabs TTS — bots read answers aloud, voice calls, macOS dictation
- **Routines & Webhooks**: Schedule tasks or trigger via local webhook receiver
- **Local Credential Storage**: API keys persist locally, hot-reload instantly
- **Chat Management**: Pin, hide, mark unread, edit profiles, duplicate agents

## How It Works (Architecture)
```
┌─────────────────────────────────────────────────────┐
│  OpenMausBot App (Electron — runs on MacBook)       │
│  ┌──────────────────────────────────────────────┐   │
│  │  Agent Chat Interface (like WhatsApp)        │   │
│  │  Agent profiles, permissions, live preview    │   │
│  └──────────────────────────────────────────────┘   │
│                        ↕ HTTP + SSE                 │
│  ┌──────────────────────────────────────────────┐   │
│  │  Harness Server (localhost:127.0.0.1)        │   │
│  │  - Runs Claude CLI, Codex CLI, Grok CLI      │   │
│  │  - Manages credentials                        │   │
│  │  - Permission brokering                       │   │
│  │  - Composio app connections                   │   │
│  │  - ElevenLabs voice                           │   │
│  └──────────────────────────────────────────────┘   │
│          ↓                     ↓                     │
│  ┌──────────────┐    ┌──────────────────────────┐  │
│  │  Orgo VMs    │    │  500+ SaaS Apps          │  │
│  │  (cloud      │    │  (Gmail, Slack, GitHub,  │  │
│  │   desktops)  │    │   Notion, Linear, etc.)  │  │
│  └──────────────┘    └──────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## How OpenMausBot Connects to StudeX OS

### 1. MacBook Connection — SOLVED
OpenMausBot runs on Tumelo's MacBook. This IS the MacBook sync.
- MacBook runs the Electron app + Harness Server (localhost)
- Each StudeX OS agent gets its own bot profile in OpenMausBot
- Agents run on Orgo VMs (cloud desktops) with live screen preview
- All agent credentials stored locally on MacBook, hot-reloads instantly

### 2. Agent Profiles in OpenMausBot (One Per Agent)
| Agent | Bot Name | Model | VM | Personality |
|-------|----------|-------|-----|-------------|
| Hermes (Me) | Hermes CTO | Claude | Orgo Super Agents Cmd | Strategic, operational |
| Sentinel Discord | Sentinel | Claude | Orgo Super Agents Cmd | Community, Discord |
| Metal WhatsApp | Metal | Claude | Orgo Super Agents Cmd | Client comms |
| Buzz — dench | Dench | Claude | Orgo SGM-CLIENTS | Meat business |
| Buzz — huly | Huly Builder | Claude | Orgo DARK F@CT0Ry | Software factory |
| Buzz — hourly | Hourly Reporter | Claude | Orgo Global Mkts | Analytics |
| DeerFlow Research | Research | Claude | Orgo Global Mkts | Research |
| OpenClaw Builder | Code Builder | Codex | Orgo DARK F@CT0Ry | Engineering |

### 3. Composio Connection — 500+ Apps
OpenMausBot connects to Composio (which we already have `ak_x5Jb5ixRdp0xSdJQ17Kt`).
Once Composio is regenerated:
- GitHub → code reviews, PR management
- Gmail → email automation
- Slack → team notifications
- Notion/Obsidian → knowledge graph updates
- Linear → project tracking
- 500+ more apps

### 4. Voice Reports — ElevenLabs
- Agents can read their reports aloud via ElevenLabs
- For the 4 daily email reports (6am, 12pm, 6pm, midnight)
- Tumelo can LISTEN to reports instead of reading

### 5. Data Room — Reports at Each Time Block
At 6am, 12pm, 6pm, midnight SAST — agents produce:
- **PDF report file** → stored in data room
- **NotebookLM video** → AI video summary
- **Email with attachments** → sent to Tumelo
- **Notion/Obsidian entry** → saved to knowledge graph

### 6. Mouse Part Group Connection
OpenMausBot has a team/group concept. Mouse Part Group = another team of agents in OpenMausBot.
- Add Mouse Part agents as bot profiles
- They report to Hermes through OpenMausBot
- Buzz Group = separate team in OpenMausBot

### 7. Base 44 Agents Connection
Base 44 agents get their own profiles in OpenMausBot.
- Run on separate Orgo VMs (Rwanda, Solo-Prenure, NTechLab)
- Report status to Hermes through OpenMausBot
- Tumelo chats directly with Base 44 agents when needed

### 8. GitHub Integration
OpenMausBot's shell permission system can:
- Run git commands on Daytona repos
- Push/pull code
- Create branches for features
- Review PRs with agents

## Install Plan
1. `git clone https://github.com/milind-soni/OpenMausBot ~/OpenMausBot`
2. `cd ~/OpenMausBot && pnpm install && pnpm dev`
3. Configure Composio (regenerate key first)
4. Set up agent profiles for each StudeX OS agent
5. Connect to Orgo VMs for cloud desktops
6. Set up 4 daily routines (6am, 12pm, 6pm, midnight)

## Next Steps
1. Regenerate Composio key (dashboard.composio.dev)
2. Clone OpenMausBot to MacBook
3. Configure each agent profile
4. Connect Orgo VMs as cloud desktops
5. Set up webhook receiver for StudeX OS integration
