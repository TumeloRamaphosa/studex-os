---
name: 24-Hour Operation Plan
type: system
status: PLANNING
last_updated: 2025-08-19
---

# StudeX OS — 24-Hour Operation

## Overview
The company never sleeps. Agents work around the clock across:
- 10 Orgo AI cloud desktops (always running)
- OpenMausBot on MacBook (always connected)
- Buzz agents (scheduled automation)
- DeerFlow research (continuous monitoring)
- Discord Sentinel (always listening)

## Time Zones
```
SAST (Tumelo's time):
  6:00 AM  = 00:00 UTC  → Morning check-in
  9:00 AM  = 03:00 UTC  → Board report to Rabuka
 12:00 PM  = 06:00 UTC  → Midday operation report
  6:00 PM  = 10:00 UTC  → Evening review
 12:00 AM  = 18:00 UTC  → Night operations check

UTC (internal agent time):
  00:00 UTC → Morning VM health check
  03:00 UTC → Board report delivered
  06:00 UTC → Midday report
  10:00 UTC → Evening report
  18:00 UTC → Night operations
```

## The 4 Daily Report Blocks

### Block 1: 6:00 AM SAST — Morning Intelligence Briefing
```
WHAT: All systems wake up. VMs health check. Overnight research.
WHO RECEIVES: Tumelo (email + WhatsApp)
CONTENT:
  • VM Status: All 10 Orgo desktops — online/offline/warnings
  • Overnight activity: What Buzz agents did while we slept
  • Research brief: What competitors and AI space did overnight
  • Today's priorities: Top 3 things to execute today
  • Risk flags: Anything that needs immediate attention

OUTPUT FORMAT:
  [STUDEX OS — MORNING BRIEF — DATE]
  VM STATUS: 10/10 ✓
  OVERNIGHT: [Buzz agent activity]
  RESEARCH: [3-5 key findings from DeerFlow]
  TODAY: [Top 3 priorities]
  RISKS: [Flagged items]
  ---
  Video summary: [NotebookLM link]
```

### Block 2: 12:00 PM SAST — Midday Operations Report
```
WHAT: Midday pulse check. What's working. What's blocked.
WHO RECEIVES: Tumelo (email)
CONTENT:
  • Progress update: What was completed this morning
  • In-progress: What's being worked on right now
  • Blockers: What's stuck and needs decision
  • Client updates: Any client activity (StudexMeat, pilots)
  • Course progress: What Tumelo learned this morning

OUTPUT FORMAT:
  [STUDEX OS — MIDDAY PULSE — DATE]
  DONE: [Completed items]
  DOING: [Current work]
  BLOCKED: [Stuck items + what I need]
  CLIENTS: [Status update]
  LEARNING: [Course notes]
```

### Block 3: 6:00 PM SAST — Evening Strategic Review
```
WHAT: End of business day. Strategic insights. Next day prep.
WHO RECEIVES: Tumelo (email)
CONTENT:
  • Day summary: What was accomplished
  • Market intelligence: What the research found today
  • Competitor moves: What other SaaS/AI companies did today
  • Viral content: What content performed well
  • Tomorrow prep: What's ready to go tomorrow
  • Decisions needed: Anything for tomorrow's board

OUTPUT FORMAT:
  [STUDEX OS — EVENING REVIEW — DATE]
  ACHIEVED: [Day's wins]
  INTELLIGENCE: [Market findings]
  CONTENT: [Viral wins]
  TOMORROW: [Ready to go]
  DECISIONS: [Need Tumelo input]
```

### Block 4: 12:00 AM SAST — Night Operations Report
```
WHAT: Deep work report. What agents built while Tumelo sleeps.
WHO RECEIVES: Tumelo (email + logged to Obsidian)
CONTENT:
  • Work done: Code built, deployments, automations
  • Research completed: DeerFlow deep dives
  • Content created: Drafts ready for review
  • Agent performance: How each agent performed
  • System health: Any overnight issues handled
  • Morning brief prep: Morning report is queued

OUTPUT FORMAT:
  [STUDEX OS — NIGHT REPORT — DATE]
  BUILT: [What was created]
  RESEARCH: [Completed deep dives]
  CONTENT: [Drafts ready]
  AGENTS: [Performance summary]
  HEALTH: [System status]
  READY: [Morning brief queued]
```

## Agent Roles in 24-Hour Operation

### Orgo VM: Super Agents Command
```
Operating hours: 24/7 (always on)
Role: Command center + Hermes brain
Tasks per block:
  6AM: Health check all systems, generate morning brief
  12PM: Midday pulse, update priorities
  6PM: Evening review, prepare tomorrow
  12AM: Night operations, build/deploy
```

### Orgo VM: Global Markets
```
Operating hours: 24/7
Role: Research + analytics
Tasks per block:
  6AM: Market intelligence brief (competitors, AI news)
  12PM: Midday metrics update
  6PM: Evening intelligence summary
  12AM: Deep research dive, trend analysis
```

### Orgo VM: DARK F@CT0Ry
```
Operating hours: 24/7
Role: Software Factory — building
Tasks per block:
  6AM: Review overnight builds
  12PM: Progress on current builds
  6PM: Deploy daily builds
  12AM: Heavy development sprint
```

### Orgo VM: SGM-CLIENTS
```
Operating hours: 24/7
Role: Client management
Tasks per block:
  6AM: Client health check
  12PM: Client support summary
  6PM: Client report prep
  12AM: Background client work
```

### Orgo VM: Rwanda
```
Operating hours: 24/7
Role: Rwanda operations + Women in AI prep
Tasks per block:
  6AM: Rwanda market brief
  12PM: Event prep update
  6PM: Coordination report
  12AM: Background ops
```

### Orgo VMs: Ryde 1 RSA, Auto-Meat, Neledi-CMO, Solo-Prenure, NTechLab
```
Operating hours: Scheduled (not 24/7)
Role: Vertical-specific agents
Tasks: Business-specific automations
```

## Research Pipeline (24-Hour)

### What We're Researching Continuously
```
1. COMPETITOR MONITORING
   • Super Agents competitors: Manychat, Wati, TARS, Botpress
   • SaaS pricing changes
   • New features launched
   • Marketing tactics
   
2. AI AGENT LANDSCAPE
   • New agent frameworks (AutoGen, CrewAI, LangGraph updates)
   • New models (Claude, GPT, Gemini, Grok)
   • Multi-agent orchestration trends
   
3. MARKET INTELLIGENCE
   • African tech news (TechCabal, WeeTracker, Disrupt Africa)
   • Funding rounds in AI/SaaS
   • Regulatory changes in SA, Rwanda, Nigeria
   
4. CONTENT RESEARCH
   • Viral posts in AI agent space
   • Trending topics on LinkedIn, Twitter
   • YouTube videos gaining traction
```

### Research Delivery at Each Block
```
6AM: Market intelligence brief → email + Obsidian
12PM: Quick pulse (3 bullet points)
6PM: Evening deep dive (1 topic)
12AM: Full research report for tomorrow
```

## Content Pipeline (24-Hour)

### Content Created Each Day
```
06:00 AM SAST: LinkedIn post (scheduled)
09:00 AM SAST: Twitter thread draft
12:00 PM SAST: TikTok/Reel script
06:00 PM SAST: Email newsletter draft
12:00 AM SAST: Video script for next day
```

## Video Reports — NotebookLM Integration

### How It Works
```
At each report block (6am, 12pm, 6pm, midnight):
1. Hermes generates text report
2. Report is saved as .txt file
3. NotebookLM API creates video/audio summary
4. Video link attached to email
5. Tumelo can LISTEN to reports

NotebookLM: Google's AI research assistant
• Creates AI-hosted videos from text
• Sends public URL
• Audio narration
• Interactive timeline
```

### Report → Video Pipeline
```
1. Text report generated by Hermes (Orgo VM)
2. Saved to ~/reports/YYYY-MM-DD/HH-00-report.txt
3. Python script calls NotebookLM API
4. NotebookLM generates video summary
5. Video URL → email body
6. Also saved to Obsidian knowledge graph
```

## Data Room

### What Goes in the Data Room
```
~/data-room/
├── daily-reports/
│   ├── 2025-08-19/
│   │   ├── 06-00-morning.txt + .mp4
│   │   ├── 12-00-midday.txt + .mp4
│   │   ├── 18-00-evening.txt + .mp4
│   │   └── 00-00-night.txt + .mp4
│   └── 2025-08-20/
│       └── ...
├── research/
│   ├── competitors/
│   ├── market-intelligence/
│   └── ai-landscape/
├── client-data/
│   ├── super-agents-saas/
│   ├── studex-meat/
│   └── pilot-clients/
├── financial/
│   ├── revenue/
│   ├── burn-rate/
│   └── projections/
└── agent-logs/
    ├── buzz-agents/
    ├── discord-sentinel/
    └── orgo-vms/
```

### Data Room Access
- Daytona VM: `~/data-room/` (primary)
- MacBook: Synced via OpenMausBot
- Cloud backup: GitHub private repo (needs PAT)
