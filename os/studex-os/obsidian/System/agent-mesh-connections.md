---
name: Agent Mesh — Mouse Part + Buzz + Base44 Connections
type: system
status: PLANNING
last_updated: 2025-08-19
---

# Agent Mesh Connections

## All Agent Groups We Connect

### 1. StudeX OS Agents (Primary — On Daytona + Orgo)
```
Hermes (Me) — orchestrator, runs on Daytona
├── Sentinel Discord Bot — Discord ops (NOT CONNECTED YET)
├── Metal WhatsApp — WhatsApp ops
├── Buzz Agents (5)
│   ├── dench-client — StudexMeat automation
│   ├── hourly-reporter — hourly reports
│   ├── huly-client — Software Factory builds
│   ├── openclaw-client — OpenClaw coordination
│   └── whatsapp-client — WhatsApp automation
├── Orgo VMs (10 desktops)
│   ├── Super Agents Command — command center
│   ├── Global Markets — research + analytics
│   ├── DARK F@CT0Ry — development + builds
│   ├── SGM-CLIENTS — client management
│   ├── Rwanda — Rwanda ops + Women in AI
│   ├── Ryde 1 RSA — rides business automation
│   ├── Auto-Meat — meat business automation
│   ├── Neledi-CMO — CMO operations
│   ├── Solo-Prenure — solopreneur tools
│   └── NTechLab — tech experiments
├── OpenClaw — code builder on Daytona
└── DeerFlow — research agent on Daytona
```

### 2. Buzz Group (Active Agent Mesh)
```
Buzz Group agents — separate agent mesh
• dench-client (already in our Buzz agents)
• hourly-reporter (already in our Buzz agents)
• huly-client (already in our Buzz agents)
• openclaw-client (already in our Buzz agents)
• whatsapp-client (already in our Buzz agents)
• [More from Buzz Group — TBD]
```

### 3. Mouse Part Group (New — TBD)
```
What is Mouse Part Group?
→ Tumelo to clarify: Who are they? What agents do they run?
→ Connection method: OpenMausBot team profile
→ Likely: Another agent mesh Tumelo has access to
→ Connection: Add as team in OpenMausBot
→ Reports to: Hermes (me) as CTO
```

### 4. Base 44 Agents (New — TBD)
```
What is Base 44?
→ Tumelo's sales arm — own OS, own agents
→ Run on separate Orgo VMs (Rwanda, Solo-Prenure, NTechLab)
→ Have their own client base
→ Report status to Hermes (me) daily

Integration:
→ Each Base 44 agent gets OpenMausBot profile
→ Base 44 OS connects to StudeX OS via:
  - Shared Discord channel (Sentinel)
  - Shared Obsidian vault (Daytona)
  - OpenMausBot group chat
  - Webhook to Hermes

What agents does Base 44 have?
→ Tumelo to define
```

### 5. Agency Agents (msitarzewski — 200+ specialists)
```
Installed into: Claude Code, Cursor, Copilot, OpenClaw
Purpose: One-off specialist tasks
• Engineering agents: Frontend Dev, Backend Architect, DevOps, Security
• Marketing agents: LinkedIn Creator, TikTok Strategist, Email Marketing
• Sales agents: Sales Outreach, Deal Strategist
• Product agents: Sprint Prioritizer, Trend Researcher
• And 200+ more

Installed as needed for specific tasks.
Not continuous agents — called for specialist work.
```

## OpenMausBot Team Structure

```
OpenMausBot (on Tumelo's MacBook)
├── StudeX OS Team
│   ├── Hermes (Me) — primary contact
│   ├── Sentinel — Discord ops
│   ├── Metal — WhatsApp ops
│   ├── Buzz Dench — meat business
│   ├── Buzz Huly — software factory
│   ├── DeerFlow — research
│   └── OpenClaw — code builder
├── Buzz Group Team
│   ├── [Tumelo to add agent names]
│   └── Reports to: Hermes
├── Mouse Part Group Team
│   ├── [Tumelo to add agent names]
│   └── Reports to: Hermes
└── Base 44 Team
    ├── [Tumelo to define agents]
    └── Reports to: Hermes

Each agent:
• Has own Orgo VM (cloud desktop)
• Has own personality + instructions
• Has own memory/knowledge
• Can run tasks autonomously
• Asks permission before big actions
• Reports to Hermes (me)
```

## GitHub Connection via OpenMausBot

```
OpenMausBot shell permissions → GitHub:
• StudeX OS code: github.com/studex-ai/studex.git
• Agents: github.com/studex-ai/agents.git
• Campaigns: github.com/studex-ai/campaigns.git
• Platform: github.com/studex-ai/studex-platform.git

Each agent can:
• Read repos
• Create branches
• Submit PRs
• Review code
• Deploy via GitHub Actions

Setup:
1. Generate GitHub PAT (needs from Tumelo)
2. Add to OpenMausBot credentials
3. Configure git global on each Orgo VM
4. Set up GitHub Actions workflows
```

## How All Agents Connect to Each Other

```
                    Tumelo (CEO)
                         │
              OpenMausBot (MacBook Hub)
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   StudeX OS         Buzz Group       Base 44
   (Me = Hermes)    (TBD agents)     (TBD agents)
        │
        ├── Discord Sentinel ←→ All agents (notify)
        ├── WhatsApp Metal ←→ Clients
        ├── Orgo VMs (10) ←→ Execute everything
        ├── OpenClaw ←→ Build software
        ├── DeerFlow ←→ Research
        ├── AgentMail ←→ 1M emails
        ├── Stitch ←→ Payments
        └── GitHub ←→ Code backup

Each group:
• Reports status to Hermes (me) every 6 hours
• Handles their vertical autonomously
• Escalates decisions to Tumelo via Hermes
• Logs everything to Obsidian knowledge graph
```
