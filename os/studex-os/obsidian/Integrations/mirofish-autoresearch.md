---
name: MiroFish + AutoResearch Money Machine
type: integration
status: PLANNING
last_updated: 2025-08-19
---

# MiroFish + AutoResearch — Business Growth Engine

## The Three Tools

### MiroFish — Business Prediction Engine
https://github.com/666ghj/MiroFish

**What it is:** A "Universal Swarm Intelligence Engine" — simulates thousands of AI agents in a sandbox that interact, evolve, and predict outcomes. Think: digital twin of a business environment.

**How it works — 5 steps:**
1. Graph Building — inject seed info (our business data, market info)
2. Environment Setup — generate agent personas (competitors, customers, markets)
3. Simulation — run thousands of agents interacting in parallel
4. Report Generation — ReportAgent creates prediction report
5. Deep Interaction — chat with any simulated agent to drill down

**Tech stack:** Node.js (port 3000/5001) + Python 3.11+ + Docker + Zep Cloud + GraphRAG

**Key for us:** Supports OpenAI SDK format → can use Claude, DeepSeek, Qwen as the brain

**Use case for us:**
- Simulate "what if we price at X vs Y?"
- Predict competitor responses to our moves
- Model customer behavior changes
- Test marketing campaign outcomes before launching
- Find new revenue opportunities

### AutoResearch — Autonomous Research Loop
https://github.com/karpathy/autoresearch

**What it is:** Karpathy's autonomous ML research agent. Runs 5-minute experiments overnight. The agent modifies code, trains a model, checks improvement, iterates. 100+ experiments while you sleep.

**How it works:**
```
Human edits program.md (instructions)
    ↓
Agent reads program.md
    ↓
Agent modifies train.py (code changes)
    ↓
Runs 5-minute training cycle
    ↓
Checks val_bpb metric (lower = better)
    ↓
Keeps good changes, discards bad
    ↓
Repeats ~100 times overnight
```

**For us:** Not just ML research. Apply to BUSINESS research:
- "Research the best SaaS pricing models for Africa"
- "Find all AI agent startups that raised funding in 2024-2025"
- "Discover new markets for Super Agents"

### Karpathy's LLM Wiki — Persistent Knowledge Graph
https://gist.github.com/karpathy/442a6bf555914893e9891c19de94f.js

**What it is:** A compounding knowledge base. Three layers:
1. Raw sources (articles, papers, reports — immutable)
2. LLM wiki (agent-written summaries, concept pages)
3. Schema (CLAUDE.md — rules for how agents work)

**How it works:**
- Ingest: Add raw source → agent writes summary → updates cross-references → logs it
- Query: Ask question → agent reads wiki → synthesizes answer
- Lint: Periodic health-check for contradictions

**For us:** The LLM Wiki IS our knowledge graph on Daytona. Agents contribute to it, query from it.

## The Razor + Lenovo Setup

### Razor — MiroFish-O Business Simulation Engine
```
Role: Business prediction sandbox
Hardware: Your Razor laptop
OS: Linux (via WSL2) or dual boot

Setup:
1. Install Docker: https://docs.docker.com/desktop/install/
2. git clone https://github.com/666ghj/MiroFish ~/MiroFish
3. cd ~/MiroFish
4. cp .env.example .env
5. Edit .env:
   - LLM_API_KEY=sk-... (Claude API or DeepSeek API)
   - ZEP_CLOUD_API_KEY=... (Zep Cloud for memory — has free tier)
6. docker compose up -d
   OR
7. npm run setup:all (if running from source)
8. Frontend: http://localhost:3000
   Backend: http://localhost:5001

Business contexts to inject:
- Super Agents SaaS: pricing, features, target market
- African tech landscape: SA, Rwanda, Nigeria
- Competitors: Manychat, Wati, TARS, Botpress
- Customer personas: African SMBs, startups, enterprises
- Revenue models: subscription, usage-based, freemium
```

### Lenovo — AutoResearch + Deep Research Loop
```
Role: Autonomous business research + ML experiments
Hardware: Your Lenovo laptop

Setup Option 1: AutoResearch (ML research)
1. Install uv: curl -LsSf https://astral.sh/uv/install.sh | sh
2. git clone https://github.com/karpathy/autoresearch ~/AutoResearch
3. cd ~/AutoResearch
4. uv sync
5. uv run prepare.py
6. Configure program.md with business research tasks
7. Run: uv run train.py (with a coding agent watching)

Setup Option 2: Business AutoResearch (modified for us)
- Modify program.md to direct agent to research:
  * "Research all AI agent SaaS companies in Africa"
  * "Find the best lead gen strategies for B2B SaaS"
  * "Discover new product opportunities for Super Agents"
  * "Analyze pricing models of successful African SaaS"

Setup Option 3: Deep Research Loop (our custom version)
- Python script that:
  1. Defines a research question
  2. Calls DeerFlow (on Daytona) to research
  3. Calls MiroFish to simulate outcomes
  4. Calls AgentMail to act on findings
  5. Logs results to LLM Wiki
  6. Repeats with refined questions
```

## The Money-Making Loop

```
┌─────────────────────────────────────────────────────────────────┐
│                    THE GAUNTLET LOOP                             │
│                                                                 │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────────┐   │
│  │ MiroFish-O  │───▶│ Research     │───▶│ DeepSeek        │   │
│  │ (Razor)     │    │ Agents       │    │ Harness +       │   │
│  │ Simulation  │    │ (Orgo VMs)  │    │ Claude Code     │   │
│  │ Sandbox     │    │              │    │ (Execution)      │   │
│  └─────────────┘    └──────────────┘    └──────────────────┘   │
│        ↑                   ↑                    │               │
│        │                   │                    ↓               │
│        │              ┌────────────┐     ┌──────────────┐       │
│        └──────────────│ LLM Wiki   │◀────│ AgentMail    │       │
│                       │ Knowledge  │     │ (1M emails)  │       │
│                       │ Graph      │     └──────────────┘       │
│                       │ (Daytona)  │           │               │
│                       └────────────┘           ↓               │
│                                             MONEY               │
└─────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Money-Making Process

**Step 1: MiroFish Simulates (Razor)**
```
Inject into MiroFish:
- Our business: Super Agents SaaS, StudexMeat, Software Factory
- Our market: African SMBs, startups in SA, Rwanda, Nigeria
- Our competitors: Manychat, Wati, TARS, Botpress
- Our resources: 10 Orgo VMs, Discord, WhatsApp, AgentMail

Run simulation questions:
- "What pricing model maximizes revenue for Super Agents in Africa?"
- "What features do African SMBs most want from AI agents?"
- "What would happen if we entered the Nigerian market?"
- "How would Manychat respond if we undercut their price by 30%?"
- "What new product could we launch in 90 days with our current infrastructure?"

Output: Detailed prediction report from ReportAgent
```

**Step 2: Research Agents Investigate (Orgo VMs)**
```
Global Markets VM runs:
- DeerFlow research on each MiroFish prediction
- Find real data to validate/invalidate predictions
- Search: African tech news, funding rounds, competitor pricing
- Look for: market gaps, customer pain points, new opportunities

Specific searches:
- "AI agent SaaS Africa 2024 2025 funding revenue"
- "Manychat pricing features alternatives"
- "African SMB automation market size growth"
- "B2B SaaS pricing strategies Africa"
- "WhatsApp business automation Africa"
```

**Step 3: DeepSeek Harness + Claude Code Execute (Lenovo + Orgo)**
```
DeepSeek Harness (on Lenovo):
- Orchestrates the execution loop
- Calls Claude Code as a sub-agent for complex tasks
- DeepSeek V3 for research, Claude for execution

Tasks for the harness:
1. "Build a landing page variant for the new pricing"
2. "Write 50 personalized outreach emails using AgentMail"
3. "Create a demo video for the new feature"
4. "Research and list 500 target companies"
5. "Build a pricing calculator for Super Agents"
```

**Step 4: AgentMail Acts (on Orgo VM)**
```
AgentMail API (cypher-trace-cto-superagents@studex-group.com)

Automated outreach pipeline:
1. Research agents compile 500 target companies
2. MiroFish predicts which will convert
3. DeepSeek Harness generates personalized emails
4. AgentMail sends in batches (avoid spam)
5. Responses route to Discord Sentinel
6. Conversions → Stripe/Stitch payments

Weekly campaign:
- Monday: Research + target list
- Tuesday: Email batch 1 (100 companies)
- Wednesday: Email batch 2 (100 companies)
- Thursday: Follow-up emails
- Friday: Results analysis
```

**Step 5: Results Feed Back Into MiroFish (Loop)**
```
After each campaign:
- What opened? What clicked? What converted?
- Feed results back into MiroFish
- New simulation = more accurate predictions
- Loop accelerates: predictions → execution → data → better predictions
```

## DeepSeek Harness — This Is the Key Connector

DeepSeek Harness just launched (60k stars, 6 days ago). It's the NEW open-source Claude Code rival that can call Claude Code as a sub-agent. This is perfect for us:

```
DeepSeek Harness (on Lenovo)
├── Orchestrates the full loop
├── Uses DeepSeek V3 (cheap, fast) for research
├── Calls Claude Code (via OpenClaw/Orgo) for execution
├── Calls MiroFish API for simulations
├── Uses AgentMail for outreach
└── Logs everything to LLM Wiki on Daytona

Install:
git clone https://github.com/deepseek-ai/deepseek-harness
cd deepseek-harness
pip install -e .
deepseek-harness init
```

## FREE Open Source Tools — Full Stack

### Agent Frameworks (FREE)
```
CREWAI — best for role-based agents (FREE)
• pip install crewai crewai-tools
• Our use: Marketing crew (researcher + writer + editor)
• Our use: Sales crew (prospector + emailer + closer)
• Our use: Product crew (researcher + builder + tester)

AUTOGEN — Microsoft multi-agent (FREE)
• pip install autogen-agentchat
• Our use: Complex multi-agent conversations
• Our use: Code generation + review loops

LANGGRAPH — stateful orchestration (FREE)
• pip install langgraph
• Our use: The gauntlet loop (state machine)
• Our use: Orchestrating MiroFish + research + execution

GOOGLE ADK — enterprise agents (FREE)
• pip install google-adk
• Our use: Production-grade agent deployment

OPENAI AGENTS SDK — simple agents (FREE)
• pip install openai-agents-python
• Our use: Quick agent prototypes

SYNPHONIA/SMOLAGENTS — lightweight (FREE)
• pip install smolagents
• Our use: Lightweight agents on Orgo VMs

DIFY — visual workflow (FREE self-hosted)
• docker compose up -d
• Our use: Non-technical team members build workflows
• Our use: Visual pipeline for content creation
```

### Data & Storage (FREE tiers)
```
QDRANT — vector DB (FREE self-hosted)
• docker run -p 6333:6333 qdrant/qdrant
• Our use: RAG for all our knowledge

CHROMA — vector DB (FREE self-hosted)
• pip install chromadb
• Our use: Quick local RAG setup

SUPABASE — Postgres + auth (FREE tier)
• supabase.com
• Our use: Client data, agent memory, analytics

METABASE — business intelligence (FREE self-hosted)
• docker run -p 3000:3000 metabase/metabase
• Our use: Dashboard for business metrics

N8N — workflow automation (FREE self-hosted)
• docker compose up -d
• Our use: Connect all our tools visually
```

### Monitoring & Observability (FREE)
```
GRAFANA — dashboards (FREE self-hosted)
• docker run -p 3000:3000 grafana/grafana
• Our use: Agent performance monitoring

LANGFUSE — LLM observability (FREE self-hosted)
• docker compose up -d
• Our use: Track agent conversations, costs, quality

LLM API — for agents
• DeepSeek API: api.deepseek.com ( cheapest, $0.27/M tokens)
• Grok API: console.x.ai (via our account)
• Our Ollama (Daytona): already hosting 19 models FREE
```

### CI/CD & Deployment (FREE)
```
GITHUB ACTIONS — CI/CD (FREE for public repos)
• Our use: Auto-deploy from git push

CLOUDFLARE — hosting (FREE tier)
• Our use: Already using for superagents.studex-group.com

FLY.IO — containers (FREE tier)
• fly.io/free
• Our use: Deploy agent services globally
```

## Installation Commands for Razor + Lenovo

### On Razor (MiroFish-O)
```bash
# 1. Install Docker Desktop
# Download from: https://docs.docker.com/desktop/install/

# 2. Clone MiroFish
git clone https://github.com/666ghj/MiroFish ~/MiroFish
cd ~/MiroFish

# 3. Configure
cp .env.example .env
nano .env  # Add Claude API key or DeepSeek API key

# 4. For memory (Zep Cloud — has free tier)
# Sign up: https://www.getzep.com/
# Add ZEP_CLOUD_API_KEY to .env

# 5. Launch
docker compose up -d
# OR from source:
npm run setup:all
npm run dev

# 6. Access
# Frontend: http://localhost:3000
# API: http://localhost:5001
```

### On Lenovo (AutoResearch + DeepSeek Harness)
```bash
# 1. Install uv (package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# 2. Clone AutoResearch
git clone https://github.com/karpathy/autoresearch ~/AutoResearch
cd ~/AutoResearch
uv sync
uv run prepare.py

# 3. Configure program.md for business research
cat > program.md << 'EOF'
You are a business research agent. Your job:
1. Research AI agent SaaS companies in Africa
2. Find pricing strategies for B2B SaaS
3. Discover market opportunities
4. Write findings to /tmp/research-findings.md
Focus on actionable insights, not summaries.
EOF

# 4. Run with a coding agent watching
# Open Claude Code or Cursor in the ~/AutoResearch directory
# Paste: "Run program.md research loop"

# 5. Clone DeepSeek Harness (NEW — just released)
git clone https://github.com/deepseek-ai/deepseek-harness ~/DeepSeekHarness
cd ~/DeepSeekHarness
pip install -e .

# 6. Configure
deepseek-harness init
# Add API keys: DeepSeek + Claude

# 7. Run the money loop
deepseek-harness run --config business-growth.yaml
```

## What to Inject Into MiroFish (Business Context)

```
COMPANY: Studex Group — AI operating system for African businesses
PRODUCTS:
  1. Super Agents SaaS — AI agents for African businesses
     - Price: R499-R1999/month (ZAR)
     - Features: Discord bot, WhatsApp, automation, analytics
     - Target: SA, Rwanda, Nigeria SMBs
  2. Software Factory — Huly + AI → built software
     - Price: Project-based
  3. StudexMeat — Sunday Biltong pilot
     - 500 packs sold

MARKET CONTEXT:
- African tech: TechCabal, WeeTracker, Disrupt Africa
- Competitors: Manychat (free-€99/mo), Wati (₹499-₹1999/mo), TARS, Botpress
- Opportunity: Africa's 50M+ SMBs need automation
- Challenges: Payment infrastructure, trust, support

COMPETITORS TO SIMULATE:
- Manychat: Free-€99/mo, 500k+ users, global
- Wati.io: ₹499-₹1999/mo, WhatsApp focus, India
- TARS: Chatbot builder, pricing unknown
- Botpress: Open-source, self-hosted

REVENUE MODELS TO TEST:
- Freemium (1 free agent, paid for more)
- Usage-based (pay per conversation)
- Flat subscription (R499-R1999/month)
- Hybrid (subscription + usage)
```

## What AutoResearch Should Research (program.md)

```
INITIAL QUESTIONS:
1. What are the top 20 AI agent SaaS companies in Africa 2024-2025?
2. What pricing models do successful B2B SaaS companies use in Africa?
3. What are the biggest pain points for African SMBs that AI agents solve?
4. How do Manychat, Wati, TARS differ? What's their market share?
5. What new product features would increase Super Agents conversion by 50%?
6. What markets should Super Agents enter next (Kenya, Ghana, Ethiopia)?
7. What partnerships could 10x our distribution?
8. How can we use WhatsApp automation to reach 1M African businesses?
9. What content marketing strategy drives most B2B SaaS signups?
10. What acquisition channels are cheapest for African SaaS?

FOR EACH QUESTION:
- Search web + research
- Find 5-10 data points
- Write actionable recommendation
- Tag: #revenue #marketing #product #market #partnerships
```

## Expected Money-Making Outcomes

```
SHORT TERM (Week 1-4):
• MiroFish identifies top 3 revenue opportunities
• AutoResearch finds 500 target companies
• AgentMail sends 1M emails → pipeline builds
• First conversions from email campaign

MEDIUM TERM (Month 1-3):
• Pricing optimization via MiroFish simulation
• New product features from customer research
• New market entry (Nigeria/Kenya) validated
• Partnership opportunities discovered

LONG TERM (Month 3-6):
• Full gauntlet loop running autonomously
• MiroFish → Research → Execute → Learn → Repeat
• Revenue predictions accurate enough to plan
• Competitive moat: AI-driven business intelligence
```
