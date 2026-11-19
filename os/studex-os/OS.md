# STUDEX OS — HERDR + EVE + LAYA + LANGCHAIN ARCHITECTURE
Generated: 2026-09-23

---

## THE CORE INSIGHT

Every AI OS needs 3 layers:

```
┌──────────────────────────────────────────────────────┐
│  LAYER 1: DECISION MODELS (System 1 — Fast/Bound)   │
│  Laya (421M, Apache 2.0) + Kev (0.8B, Apache 2.0)  │
│  Route, classify, score — 200x faster than LLMs       │
├──────────────────────────────────────────────────────┤
│  LAYER 2: REASONING LLMs (System 2 — Slow/Broad)   │
│  Qwen API (Alibaba) + Grok API (xAI) + Gemini      │
│  Generate, analyze, write, decide complex cases      │
├──────────────────────────────────────────────────────┤
│  LAYER 3: AGENT ORCHESTRATION (LangChain MCP)       │
│  Eve Foreman (software factory)                     │
│  + Orca ADE (coding fleet)                         │
│  + Herdr (distributed runtime)                     │
│  + Google Spark (3 marketing agents)               │
└──────────────────────────────────────────────────────┘
```

---

## DECISION MODEL COMPARISON

| Model | Size | Type | License | Deployment | Speed | Best For |
|-------|------|------|---------|-----------|-------|----------|
| **Laya** | 421M | ModernBERT | Apache 2.0 | Local (browser/cPU/GPU) | Fastest | Email routing, lead scoring, intent detection, content moderation |
| **Kev** | 0.8B | Qwen3.5 + LoRA | Apache 2.0 | Local GPU | Fast | Commodity classification, sanctions screening, trade routing |
| **Jev** | ?B | Proprietary | Closed API | TypeSafe cloud | Fast | Frontier accuracy (no local option) |

**Decision: Use Laya + Kev locally. Jev as fallback API for complex decisions.**

**Laya wins** for Studex because:
- Runs in a browser tab (zero infrastructure)
- 421M params — fits on ANY machine (MacBook, Z Fold 6, Steam Deck)
- Apache 2.0 — can fine-tune on trade data commercially
- Already multilingual — critical for African markets
- 512-token context for short inputs (emails, tickets, HS codes)
- Acts as a cheap filter — only escalate complex cases to Qwen/Grok

**Kev wins** for Studex because:
- Larger context (Qwen base = 32K tokens)
- LoRA adapters — can fine-tune on commodity data, sanctions lists, trade documents
- Apache 2.0 — commercial use allowed
- Multiple sizes (0.8B, 4B, 9B) — pick based on hardware

---

## EVE SOFTWARE FACTORY — STUDENT ADAPTATION

Original = GitHub issues → 4 stations → PR
Studex version = Trade opportunities → 4 stations → Deal

```
                    ┌─────────────────────────────────┐
                    │     STUDENT FACTORY BRAIN       │
                    │   (Crucix + Crucix scanner)    │
                    └──────────────┬──────────────────┘
                                   │
        ┌──────────┬──────────────┼──────────────┬──────────┐
        ▼          ▼              ▼              ▼          ▼
   ┌─────────┐ ┌─────────┐  ┌─────────┐  ┌─────────┐ ┌──────────┐
   │STATION 1│ │STATION 2│  │STATION 3│  │STATION 4│ │STATION 5 │
   │CLASSIFIER│ │ANALYST │  │IMPLEMENTER│ │REVIEWER │ │DEAL CLOSE│
   │         │ │         │  │         │  │         │ │          │
   │Route to │ │Turn into│  │Research │  │Score &  │ │Generate  │
   │division │ │deal memo│  │source,  │  │red flag │ │proposal, │
   │         │ │         │  │validate │  │check    │ │send to   │
   │Hot/Warm/│ │Opport-  │  │numbers, │  │comply,  │ │client,   │
   │Cold     │ │unity    │  │confirm  │  │verify   │ │track in  │
   │         │ │brief    │  │partner  │  │buyer    │ │Huly CRM  │
   └─────────┘ └─────────┘  └─────────┘  └─────────┘ └──────────┘
```

Each station = separate Eve agent with its own instructions.md

---

## ORCA ADE — FLEET DEPLOYMENT

Orca = Agent Development Environment for running parallel coding agents

```
┌─────────────────────────────────────────────────────────────┐
│                    ORCA FLEET ADE                          │
│                                                             │
│  MSI Claw 8 AI+ ──► Orca Desktop (WSL2/Linux)             │
│  Legion Go 2 ─────► Orca Mobile                           │
│  Orgo VM #1 ───────► Orca Remote Runtime                  │
│  Orgo VM #2 ───────► Orca Remote Runtime                  │
│  Razer Blade ──────► Orca GPU Node                        │
│                                                             │
│  All connected via Herdr mesh. Same codebase.              │
│  Each machine runs different agent types in parallel.        │
└─────────────────────────────────────────────────────────┘
```

---

## LANGCHAIN MCP — THE INTEGRATION LAYER

LangChain MCP = Model Context Protocol hub that connects everything:

```
┌──────────────────────────────────────────────────────────┐
│                    LANGCHAIN MCP                         │
│                                                          │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────┐   │
│  │ Laya       │  │ Kev        │  │ Qwen API        │   │
│  │ (local)    │  │ (local)    │  │ (Alibaba Cloud) │   │
│  └────────────┘  └────────────┘  └─────────────────┘   │
│                                                          │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────┐   │
│  │ Grok API   │  │ Gemini API │  │ Ollama (local)  │   │
│  │ (xAI)      │  │ (GCP)      │  │ (Razer Blade)   │   │
│  └────────────┘  └────────────┘  └─────────────────┘   │
│                                                          │
│         ▲            ▲            ▲            ▲          │
│         │            │            │            │          │
│         └────────────┴────────────┴────────────┘          │
│                          │                                 │
│              ┌───────────┴───────────┐                   │
│              │   LangChain MCP Hub    │                   │
│              │                       │                   │
│              │  • Tool calling       │                   │
│              │  • Memory/retrieval   │                   │
│              │  • Agent orchestration│                   │
│              │  • Multi-model switch │                   │
│              └───────────┬───────────┘                   │
│                          │                                 │
│         ┌────────────────┼────────────────┐               │
│         │                │                │               │
│  ┌──────┴──────┐  ┌─────┴─────┐  ┌──────┴──────┐      │
│  │ Eve Foreman │  │ Orca ADE  │  │ Herdr Fleet │      │
│  │ (factory)   │  │ (coding)  │  │ (runtime)   │      │
│  └─────────────┘  └───────────┘  └─────────────┘      │
└──────────────────────────────────────────────────────────┘
```

---

## GOOGLE SPARK — 3 MARKETING ENGINEERING AGENTS

Google Spark = Google's 24/7 always-on personal AI agent (announced I/O 2026)

**3 Spark-style agents for Studex (built on our stack):**

```
┌──────────────────────────────────────────────────────────┐
│              GOOGLE SPARK AGENTS × 3                    │
│                                                          │
│  ┌─────────────────┐  ┌─────────────────┐              │
│  │ SPARK-1         │  │ SPARK-2         │              │
│  │ CONTENT ENGINEER │  │ OUTREACH AGENT  │              │
│  │                 │  │                 │              │
│  │ • Write LinkedIn│  │ • Find prospects│              │
│  │   posts daily   │  │   via Crucix    │              │
│  │ • Generate blog │  │ • Warm emails   │              │
│  │ • Create case   │  │ • Follow-up     │              │
│  │   studies       │  │   sequences     │              │
│  │ • Video scripts │  │ • WhatsApp      │              │
│  │                 │  │   outreach      │              │
│  └─────────────────┘  └─────────────────┘              │
│                                                          │
│  ┌─────────────────┐                                    │
│  │ SPARK-3         │                                    │
│  │ ANALYTICS AGENT │                                    │
│  │                 │                                    │
│  │ • Track all KPIs│                                    │
│  │ • Weekly report │                                    │
│  │ • A/B test ideas│                                    │
│  │ • Funnel audit  │                                    │
│  │ • Client dash   │                                    │
│  └─────────────────┘                                    │
└──────────────────────────────────────────────────────────┘
```

**Deploy on:**
- Google Cloud Run (Orgo VM 1 + 2) 
- Or locally: Razer Blade + Legion Go 2

---

## PHYSICAL MACHINE ALLOCATION

| Machine | Role | Software | Models |
|---------|------|----------|--------|
| **MacBook** | Hermes Desktop + LangChain MCP Hub | Hermes app, LangChain, Eve CLI | Qwen/Grok API |
| **Razer Blade 2017** | GPU Node + Laya/Kev | Ollama (CUDA), Laya, Kev | llama3.3:70b, kev-0.8b, laya |
| **Lenovo Legion Go 2** | Mobile ADE + Coding | Orca, Eve, Docker | qwen2.5:14b |
| **MSI Claw 8 AI+** | Mobile ADE + Marketing | Orca, Eve, Docker | qwen2.5:14b |
| **Steam Deck** | Dev Workstation | Ollama, Herdr agent, Git | qwen2.5-coder:7b |
| **Z Fold 6** | Phone Agent | Termux, Ollama, Herdr | qwen2.5-coder:7b |
| **Desktop (2x GPU)** | GPU Server | Ollama CUDA, Huly, Docker | llama3.3:70b, deepseek-r1:70b |
| **Orgo VM 1 (Super Agents)** | Herdr Server + Foreman | Herdr server:2244, Eve factory, Foreman | Qwen API |
| **Orgo VM 2 (Global Markets)** | Gitea + Laya API + Eve | Gitea, Laya server, Eve stations | Laya + Qwen |
| **Orgo VM 3 (Rwanda)** | Spark-1 Content | Docker, Eve agent, LangChain MCP | Qwen + Grok |
| **Orgo VM 4 (SGM CLIENTS)** | Spark-2 Outreach | Docker, Eve agent, WhatsApp | Qwen + Grok |
| **Orgo VM 5 (Auto Meat)** | Spark-3 Analytics | Docker, Eve agent, Cron | Qwen + Grok |
| **GCP (hidden-cat)** | Overflow + Gemini | Cloud Run, Gemini API | Gemini 2.5 |

---

## EVENTS ARCHITECTURE — HOW IT ALL CONNECTS

```
Trade Lead arrives
       │
       ▼
  ┌─────────────────┐
  │ Laya (421M)     │ ← Fast filter: route to division
  │ "What division?" │   Hot/Warm/Cold score
  │ Choice: 5 opts  │   Is this sanctioned?
  └────────┬────────┘
           │ Hot + No sanctions
           ▼
  ┌─────────────────┐
  │ Kev (0.8B)      │ ← Deeper analysis: HS code,
  │ "HS code?"      │   tariff rate, restricted list,
  │ "Approve deal?" │   compliance score
  └────────┬────────┘
           │ Complex case
           ▼
  ┌─────────────────┐
  │ Qwen API        │ ← Full deal analysis: write proposal,
  │ (Alibaba)       │   market research, negotiation strategy
  └────────┬────────┘
           │ Engineering task
           ▼
  ┌─────────────────┐
  │ Eve Foreman     │ ← Software factory: classify → analyze
  │ (4 stations)    │   → implement → review → deploy
  └────────┬────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌────────┐  ┌────────┐
│Orca ADE│  │Herdr   │
│(coding)│  │Fleet   │
└────────┘  └────────┘
```

---

## LANGCHAIN MCP CONFIGURATION

```python
# studex_mcp_config.py — LangChain MCP hub configuration
from langchain_mcp_adapters.client import MultiServerMCPClient

mcp_servers = {
    # Decision Models
    "laya": {
        "command": "python", 
        "args": ["-m", "laya_server"],
        "url": "http://10.0.0.5:8080"  # Razer Blade
    },
    "kev": {
        "command": "ollama",
        "args": ["serve"],
        "url": "http://localhost:11434"  # Local Ollama
    },
    
    # LLMs
    "qwen": {
        "type": "openai-compatible",
        "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
        "api_key": "QWEN_API_KEY"
    },
    "grok": {
        "type": "openai-compatible", 
        "base_url": "https://api.x.ai/v1",
        "api_key": "GROK_API_KEY"
    },
    "gemini": {
        "type": "google-genai",
        "api_key": "GEMINI_API_KEY"
    },
    
    # Agent Runtimes
    "eve_foreman": {
        "command": "eve",
        "args": ["run", "foreman"],
        "cwd": "/workspace/studex-factory"
    },
    "herdr": {
        "command": "herdr",
        "args": ["agent", "--server", "10.0.0.1:2244"]
    },
    "orca": {
        "command": "orca",
        "args": ["start"],
        "url": "http://localhost:9090"
    },
}
```

---

## IMPLEMENTATION ROADMAP

### Phase 1: Core OS — Week 1-2
- [ ] Connect MacBook to Hermes via LangChain MCP
- [ ] Install Laya on Razer Blade (GTX 1080) — run as local API
- [ ] Install Kev on Steam Deck via Ollama
- [ ] Deploy Eve Foreman on Super Agents Command (Orgo VM 1)
- [ ] Configure LangChain MCP to route to Laya → Kev → Qwen

### Phase 2: Agent Fleet — Week 3-4
- [ ] Install Orca ADE on Legion Go 2 + MSI Claw 8
- [ ] Configure Eve 4 stations on Global Markets (Orgo VM 2)
- [ ] Set up Herdr agent on all physical machines
- [ ] Connect Tailscale mesh across all machines

### Phase 3: Marketing Agents — Week 5-6
- [ ] Deploy 3 Google Spark-style agents on Orgo VMs 3-5
- [ ] Build content pipeline (Spark-1) → outreach pipeline (Spark-2) → analytics (Spark-3)
- [ ] Connect to WhatsApp + Discord + email

### Phase 4: Revenue — Month 2+
- [ ] Productize: Laya lead scorer API → sell as $500/mo subscription
- [ ] Productize: Commodity classifier → sell as $1k/mo API
- [ ] Build Foreman software factory for clients
- [ ] Launch Africa Intelligence Report productized service

---

## FILES CREATED

- `/workspace/homelab-fleet/PROVISIONING.md` — machine roles
- `/workspace/homelab-fleet/install.sh` — universal install
- `/workspace/homelab-fleet/studex_hhd_client.py` — HHD control
- `/workspace/homelab-fleet/tailscale_fleet_scan.py` — fleet scan
- `/workspace/studex-os/OS.md` — this architecture doc
