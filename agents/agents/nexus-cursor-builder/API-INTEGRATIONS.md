# Hermes — API Integration Spec

## Queen API — DashScope (Qwen/Alibaba Cloud)
**Type:** LLM API (OpenAI-compatible)
**Purpose:** Primary AI model for Discord bot and War Room
**Setup:**
1. Get key: https://dashscope.console.aliyun.com → API-KEY → Create
2. Base URL: https://dashscope.aliyuncs.com/compatible-mode/v1
3. Model: qwen-max or qwen-plus
4. Env var: `DASHSCOPE_API_KEY=sk-...`
**Discord Bot Integration:**
```python
# In discord-bot/index.js, add Qwen as fallback model:
# When Grok fails → route to DashScope Qwen
```
**Current Issue:** Wrong key stored (LTAI5... = Alibaba IAM, not DashScope)

---

## Croc API — xAI Grok
**Type:** LLM API
**Purpose:** Grok bot inside Discord server
**Setup:**
1. Get key: https://console.x.ai → API Keys → Create
2. Base URL: https://api.x.ai/v1
3. Model: grok-2, grok-2-v1212, grok-beta
**Discord Bot Integration:**
```python
# In discord-bot/index.js, primary model = Grok
client = OpenAIClient(api_key=os.getenv("XAI_API_KEY"), base_url="https://api.x.ai/v1")
```
**Discord App Directory:** https://discord.com/discovery/applications/1370575739442696324
**Current Issue:** All x.ai endpoints return "Incorrect API key"

---

## CashClaw — Finance Agent (NOT an API)
**Type:** OpenClaw agent with skills
**GitHub:** https://github.com/ertugrulakben/cashclaw
**Website:** https://cashclawai.com
**What it does:** Autonomous freelance agent — finds work, quotes prices, does jobs, gets paid via Stripe
**In Studex Nest:** `nexus-agents-nest/etb-cashclaw/` (submodule — needs init)
**11 Mission Types:** Research, cold outreach, content, design, SEO, web, app, data, admin, social, custom
**HYRVE/Moltlaunch Integration:** CashClaw connects to HYRVE AI marketplace for mission sourcing
**Status:** CashClaw = Finance agent in Studex roster, NOT an API to integrate

---

## WhatsApp — OpenWA Gateway
**Type:** Messaging API
**Integration:** openwa-whatsapp-gateway skill (already reviewed)
**Setup:**
1. Run OpenWA on Super Agents Command (already installed, PID 3110)
2. Authenticate via QR scan on VNC :99
3. Use Meta Cloud API for business messaging
**Phone Number IDs (from 2026-06-22 log):**
- 599570915061463
- 749827870391669
**Current Issue:** DISCONNECTED — needs re-auth via VNC

---

## Integration Stack (Discord Bot on Super Agents Command)
```
Priority: Grok (Croc/xAI) → Qwen (Queen/DashScope) → GPT-4o (OpenAI)
Queue: Queen → Croc → OpenAI (fallback chain)
```

**Env vars needed on Super Agents Command:**
```
XAI_API_KEY=           # Croc (Grok) — NEED FRESH KEY
DASHSCOPE_API_KEY=     # Queen (Qwen) — NEED FRESH KEY
OPENAI_API_KEY=        # Fallback
WHATSAPP_SESSION=      # Needs re-auth
```
