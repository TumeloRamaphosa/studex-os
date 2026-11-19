---
name: Ape Claw + OpenClaw Framework
type: integration
framework: OpenClaw
status: READY_TO_INSTALL
last_updated: 2025-08-19
---

# Ape Claw — OpenClaw Skill for AI Agent Operations

## What Is Ape Claw?

A safety-first CLI and native OpenClaw skill for ApeChain NFT operations.
Built ON TOP of OpenClaw — so it demonstrates how our agents should work.

## Key Architecture We Should Copy

### The Pod — Persistent Workspace Harness
```
┌─────────────────────────────────────────────────────┐
│  THE POD (OpenClaw workspace)                        │
│                                                      │
│  AI Backend (Claude/OpenAI)                          │
│  ├── Parses tasks                                    │
│  ├── Writes states + journals                        │
│  └── Executes via CLI                               │
│                                                      │
│  Onchain Registry (SkillRegistry, ReceiptRegistry)   │
│  ├── Shared ground truth                            │
│  └── Durable memory                                 │
│                                                      │
│  Skills Library                                      │
│  ├── 10,000+ skills on-chain (ERC-721)               │
│  └── Installed via ape-claw install                 │
│                                                      │
│  Safety Gates (8 gates)                              │
│  ├── Simulations before actions                     │
│  ├── Confirmation phrases                           │
│  ├── Daily spend caps                               │
│  ├── Allowlists                                     │
│  └── Replay protection                              │
└─────────────────────────────────────────────────────┘
```

### Our Version — StudeX Pod
```
STUDEX POD (on Daytona)
├── AI Backend: Claude (via OpenClaw)
├── Shared Ground Truth: Obsidian vault (our wiki)
├── Durable Memory: Zep Cloud + local files
├── Skills Library: Our agent skills
├── Safety Gates: 
│   ├── Tumelo approval for >$500 decisions
│   ├── Confirmation for client emails
│   ├── Daily action limits
│   └── Test mode before live
└── 8 Safety Gates adapted for us
```

## Ape Claw's V2 Architecture — What We Learn

### The Pod Workspace (adopt for StudeX)
```bash
# Install OpenClaw
npm install -g openclaw

# Initialize StudeX Pod
openclaw pod init studex-pod

# Install skills
openclaw skills add vercel-labs/agent-skills
openclaw skills add ape-claw  # NFT operations

# Run the pod
python3 run_agent.py  # Pod runner script
```

### Clawbot Verification (adopt for our agents)
Each agent gets:
- Unique ID
- Shared API keys
- Persistent identity
- Cross-bot chat capability

For us:
```
HERMES-CTO (Clawbot ID: studex-001)
├── Identity: CTO of StudeX Group
├── API keys: Stitch, ORGO, Discord, AgentMail
├── Memory: Obsidian vault
└── Permissions: Full except >$500 without Tumelo approval

SENTINEL-DISCORD (Clawbot ID: studex-002)
├── Identity: Discord operations agent
├── API keys: Discord bot token
├── Memory: Discord message history
└── Permissions: Read/write Discord, escalate to Hermes

METAL-WHATSAPP (Clawbot ID: studex-003)
├── Identity: WhatsApp client agent
├── API keys: WhatsApp API
├── Memory: WhatsApp conversations
└── Permissions: Client comms, escalate to Hermes
```

## OpenClaw Skills — How We Use It

### Our Skill Library
```bash
# OpenClaw skills directory structure
~/.openclaw/skills/
├── vercel-agent-skills/       # Code review, deploy
├── studex-website-monitor/    # OUR skill: monitors site
├── studex-discord-ops/        # OUR skill: Discord ops
├── studex-agentmail/          # OUR skill: email campaigns
├── studex-stitch-payments/    # OUR skill: payment ops
└── ape-claw/                  # NFT operations (example)
```

### Create Our Own Skills
```bash
# Create a skill for website monitoring
mkdir -p ~/.openclaw/skills/studex-website-monitor
cd ~/.openclaw/skills/studex-website-monitor

# SKILL.md
cat > SKILL.md << 'EOF'
# Studex Website Monitor Skill

## When to use this skill
Use when Tumelo asks to:
- Check website status
- Monitor site uptime
- Report on website health
- Investigate website issues

## How to use
1. Check: curl -s -o /dev/null -w "%{http_code}" https://superagents.studex-group.com
2. Measure: time curl -s https://superagents.studex-group.com
3. Report: Post to Discord #studex-os-operations
4. Escalate: If HTTP != 200, alert immediately

## Output format
```
Website Status Report
URL: superagents.studex-group.com
HTTP: [code]
Load: [X]ms
Issues: [none/list]
```

## Related skills
- vercel-agent-skills/vercel-optimize
- studex-discord-ops
EOF

# Install the skill
openclaw skills add ./studex-website-monitor
```
