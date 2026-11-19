---
name: Razor + Lenovo Setup Guide
type: integration
status: PLANNING
last_updated: 2025-08-19
---

# Razor + Lenovo Setup — Step by Step

## Razor Laptop — MiroFish-O

### Day 1: Install Docker
1. Go to: https://docs.docker.com/desktop/install/
2. Download Docker Desktop for your OS (Windows/Mac)
3. Install and launch Docker Desktop
4. Wait for "Docker Desktop is running" in menu bar

### Day 1: Clone and Configure MiroFish
```bash
# Open terminal (PowerShell on Windows, Terminal on Mac)
git clone https://github.com/666ghj/MiroFish ~/MiroFish
cd ~/MiroFish
cp .env.example .env

# Edit .env with your API keys:
# Get Claude API key: https://console.anthropic.com/
# Or use DeepSeek (cheaper): https://platform.deepseek.com/

# For Zep Cloud memory (has free tier):
# Sign up: https://www.getzep.com/
# Create project, get API key
```

### Day 1: Launch MiroFish
```bash
# If Docker installed:
docker compose up -d

# If running from source:
npm run setup:all
npm run dev

# Check it's running:
curl http://localhost:5001/health
# Should return: {"status":"ok"}

# Open browser:
# http://localhost:3000 (MiroFish UI)
```

### Day 2: Inject Business Context
1. Open http://localhost:3000
2. Create new simulation project: "Super Agents Growth"
3. Inject the business context from mirofish-autoresearch.md
4. Run first simulation question

---

## Lenovo Laptop — AutoResearch + DeepSeek Harness

### Day 1: Install Dependencies
```bash
# Install uv (fast Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install Git (if not installed)
# Windows: download from git-scm.com
# Mac: comes pre-installed

# Install Node.js (for some tools)
# Mac: brew install node
# Windows: download from nodejs.org

# Clone AutoResearch
git clone https://github.com/karpathy/autoresearch ~/AutoResearch
cd ~/AutoResearch

# Setup
uv sync
uv run prepare.py  # Downloads data, runs once
```

### Day 1: Configure Business Research
```bash
# Create program.md with business questions
cat > program.md << 'ENDOFFILE'
# Business Research Agent

You are an autonomous business research agent for Studex Group.
Your mission: Find ways to grow revenue and evolve the business.

Research tasks (run in order):
1. Find all AI agent SaaS companies in Africa (2024-2025)
2. Analyze pricing strategies of Manychat, Wati, TARS, Botpress
3. Identify top 10 revenue opportunities for Super Agents SaaS
4. Find new markets for African B2B SaaS (Kenya, Ghana, Nigeria)
5. Research best B2B email outreach strategies

For each task:
- Search the web for data
- Compile findings in /tmp/research-findings.md
- Include specific numbers, URLs, dates
- End with actionable recommendation

Run all 5 tasks, then summarize top 3 action items.
ENDOFFILE

# Run with a coding agent (Claude Code or Cursor):
# cd ~/AutoResearch
# Open Claude Code: claude
# Paste: "Read program.md and run the research loop"
```

### Day 2: Install DeepSeek Harness
```bash
# DeepSeek Harness — NEW open-source (60k stars)
git clone https://github.com/deepseek-ai/deepseek-harness ~/DeepSeekHarness
cd ~/DeepSeekHarness
pip install -e .

# Initialize
deepseek-harness init

# Configure API keys in ~/.deepseek-harness/config.yaml:
# deepseek_api_key: your_key
# claude_api_key: your_key
# openai_api_key: your_key
```

### Day 2: Create Business Growth Config
```bash
cat > ~/DeepSeekHarness/business-growth.yaml << 'ENDOFFILE'
name: studex-growth-loop
description: Business growth research and execution loop

agents:
  - name: researcher
    model: deepseek-v3
    role: Research market opportunities
    
  - name: strategist
    model: claude-sonnet-4
    role: Analyze research and create action plans
    
  - name: executor
    model: claude-sonnet-4
    role: Execute approved plans (build, email, deploy)

workflow:
  - agent: researcher
    task: Research AI agent SaaS Africa market
    
  - agent: strategist  
    task: Analyze findings, create 3 growth options
    
  - agent: executor
    task: Execute top option via AgentMail + code
    
  - loop: true
    max_iterations: 10
    until: revenue_increased > 20%

tools:
  - web_search
  - file_write
  - http_request
  - agentmail_send
ENDOFFILE
```

---

## Connect Both Laptops to StudeX OS

```
Razor (MiroFish) ──→ Orgo VM: Global Markets (research data)
Lenovo (AutoResearch) ──→ Orgo VM: DARK F@CT0Ry (execution)
Both ──→ Daytona: LLM Wiki (knowledge graph)
Both ──→ Discord Sentinel (notifications)
```

### On Daytona (already set up):
```bash
# The LLM Wiki lives on Daytona
~/obsidian-vault/
├── raw-sources/      # MiroFish reports, research PDFs
├── wiki/            # LLM-written summaries
└── CLAUDE.md       # Rules for all agents
```

---

## Daily Loop — How It Runs

### Every Morning (6 AM SAST):
```
1. MiroFish (Razor) — runs overnight simulation
   → New prediction report in ~/MiroFish/reports/
   
2. AutoResearch (Lenovo) — ran 100+ experiments
   → Findings in /tmp/research-findings.md
   
3. DeerFlow (Orgo VM) — compiled market intelligence
   → Saved to Daytona ~/obsidian-vault/research/

4. Hermes (me) — aggregates everything
   → Email report to Tumelo (6 AM SAST)
   → Video summary via NotebookLM
```

### Every Day (Continuous):
```
MiroFish → predicts opportunity
    ↓
Research agents → validate with data
    ↓
DeepSeek Harness → creates execution plan
    ↓
Claude Code (via Orgo) → builds/content/emails
    ↓
AgentMail → sends to target companies
    ↓
Results → feed back into MiroFish
    ↓
Loop repeats with learning
```
