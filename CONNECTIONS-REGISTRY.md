# STUDEX NEXUS — PLATFORM CONNECTIONS REGISTRY

> Discovered from OpenClaw (`~/.openclaw/`), Hermes, and the filesystem on 2026-09-13.
> Status legend: 🟢 connected · 🟡 partial (needs a key/step) · 🔴 not connected

## Channels (from openclaw.json)
- 🟢 **Discord** — enabled, token present, groupPolicy=allowlist
- 🟢 **Slack** — socket mode, enabled, bot+app tokens present (account "etherdoge")

## Model providers (13 wired in OpenClaw)
| Provider | Status | Models |
|----------|--------|--------|
| Claude (Anthropic) | 🟢 | sonnet-4, opus-4 |
| GPT (OpenAI) | 🟢 | gpt-4.1, gpt-4.1-mini, o3 |
| Ollama (local) | 🟢 | deepseek-v4-flash, kimi-k2.6, glm-5.1, qwen3.5, gemma4, phi4-mini |
| Hermes (Nous) | 🟢 | Hermes-4-405B |
| Minimax / Mimo | 🟢 | MiniMax-M2, mimo-v2.5 |
| OpenRouter | 🟢 | claude-sonnet-4, gpt-4.1 |
| Perplexity | 🟢 | sonar-pro |
| Cursor | 🟢 | cursor-large |
| Opencode (zen) | 🟢 | minimax-m2.5-free |

## Keys found in ~/.openclaw/keys/ (names only, values redacted)
- 🟢 **Base44** (agent id + key + url) → WhatsApp/QuickBooks superagents
- 🟢 **Stripe** (`stripe_live.key`) → payments
- 🟢 **Stitch Payments** (username/password/host) → ZA payments
- 🟢 **Pulumi** (access token) → infra-as-code
- 🟢 **Tailscale** (TS_AUTH_KEY + TS_API_KEY)
- 🟢 **Google Drive** (email/password)
- 🟢 **AgentMail** (api key) → agent email relay
- 🟢 **Honcho** (api key) → memory
- 🟢 **HYRVE / Ollama ext / Railway SSH** (`agent_keys.env`)
- 🟢 **Buzz 7 agents** (npub/nsec + relay `wss://studex-agents.communities.buzz.xyz`)
- 🟢 **Model Warehouse** (Ollama multi-node: Mac Mini, Cloud PC, Windows, MaxHermes, SuperAgent + OpenAI/Anthropic/Google/Mistral/Cohere/Minimax/SambaNova/Orgo/Devin/NVIDIA keys)

## Your named platforms — status
| Platform | Status | What's needed |
|----------|--------|---------------|
| Notion | 🔴 | `NOTION_API_KEY` (ntn_) — NOT set. Need integration token |
| ClickUp | 🔴 | `CLICKUP_API_KEY` empty in ~/.clickup.env |
| Email (Gmail/Workspace) | 🟡 | google-workspace skill present but `google_token.json` missing → OAuth setup |
| Calendar | 🟡 | same OAuth as email |
| To-do list | 🟡 | ClickUp list / Notion todo — blocked on those keys |
| Calling features | 🟡 | OpenJarvis has `text_to_speech` tool; no telephony yet |
| OpenJarvis | 🟢 | running, morning digest 07:00 SAST, TTS=openai nova |
| Obsidian vault | 🟢 | `~/StudEx-Vault` (plain md) + `~/Documents/Obsidian Vault` (real) |
| Brian (brain-api.py) | 🟢 | FastAPI on :8000 — decisions/conversations/leads/context |
| LLM Wiki | 🟢 | llm-wiki skill available; `WIKI_PATH` unset (defaults ~/wiki) |
| Gitea | 🟡 | config exists, server at 100.95.66.29:3000 but NOT reachable now |

## Tailscale (from `tailscale status`)
- 🟢 **macbook-pro-5** = `100.95.66.29` (this machine, the OS control plane)
- 🟢 **projects-mac-mini** = `100.112.109.40` (online)
- 18 other nodes OFFLINE (dark-factory-vm, naledi-cmo, robusca-sandbox, orgo-desktop, etc.)

## Cloudflare
- 🟢 `cloudflared` 2026.3.0 installed
- 🟢 Tunnel `da2e06a7-...` with ingress:
  - `hermes.studex-group.com` → localhost:8085
  - `maus.studex-group.com` → 127.0.0.1:18799
- 🟡 `~/.cloudflared/config.yml` is still boilerplate (the real tunnel lives in `hermes-dashboard.yml`)

## MCP bridges available
- 🟢 `~/mcp-bridge.py` — unified FastAPI gateway (routes to brain/gmail/calendar/buzz)
- 🟢 `~/mcp-servers/base44-bridge/` — TypeScript MCP for Base44 (WhatsApp/QuickBooks)
- 🟢 `~/mcp-servers/studex-os-bridge/src/index.ts` — StudEx OS MCP (EMPTY stub)
- 🟢 `~/mcp-base44-nostr.py` — Base44 ↔ Nostr relay
- 🟢 `~/studex-mcp-config.json` — MiroFish :8001 + Open Gen AI :8006

---
