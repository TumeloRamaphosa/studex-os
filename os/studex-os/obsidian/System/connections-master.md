---
name: Connections Master
type: system
status: ACTIVE
last_updated: 2025-08-19
---

# Connections Master — All Systems Connected

## THE STACK

```
HERMES AGENT (this sandbox)
└── StudeX OS command center → 8yiaqkomkrlr.space.mcode.io
└── Orchestrates everything

DAYTONA (755GB RAM) — SSH via web UI
└── Obsidian vault (knowledge graph)
└── Bare git repos: studex.git, agents.git, campaigns.git, studex-platform.git
└── Ports: 9090 (Python), 2280 (Node), 33333 (VNC)

ORGO AI (10 cloud desktops, 24/7)
└── api.stitch.money/graphql
└── DeerFlow research agent
└── All accessible via Tailscale

Tailscale mesh (NEW!) — connect all devices
└── Auth key: tskey-auth-kCwAg5huu721CNTRL-U6ZSsmLDcigSkfiNsXxUigEgWBD6wGnBK
└── Dashboard: https://login.tailscale.com/admin/machines

Honcho memory (NEW!) — persistent memory for every AI tool
└── Get API key: https://app.honcho.dev (starts hch-)
└── Works with: Claude Code, Cursor, Windsurf, VS Code, Cline, Goose

Vercel Eve agents (FREE tier)
└── superagents-monitor — hourly website checks
└── Deploy: npx eve deploy --name superagents-monitor

RAZOR LAPTOP
└── MiroFish-O — business simulation engine
└── git clone https://github.com/666ghj/MiroFish

LENOVO LAPTOP
└── AutoResearch — 100 overnight experiments
└── DeepSeek Harness — orchestrates Claude as sub-agent
```

## API CREDENTIALS

| Service | Key | Status |
|---------|-----|--------|
| ORGO AI REST | ${ORGO_API_KEY} | ACTIVE |
| ORGO AI MCP | same key | 401 (use REST instead) |
| Stitch GraphQL | qnvTfERktd44FPUpskKoZBUtrzMXJ1jIBXPsDiz5wQ2z0z0zd2qAp2QR2vyM69Fz | ACTIVE |
| Discord Bot | MTUzMDU1MTkyNzk3OTUxMTgzOA | AUTH PENDING |
| Tailscale | tskey-auth-kCwAg5huu721CNTRL-U6ZSsmLDcigSkfiNsXxUigEgWBD6wGnBK | DEPLOYING |
| Honcho | hch-... | NEED KEY |
| Composio | ak_x5Jb5ixRdp0xSdJQ17Kt | EXPIRED → regen |
| AgentMail | Unknown | VERIFY |
| Queen API | [NOT PROVIDED] | PENDING |
| Croc API | [NOT PROVIDED] | PENDING |
| CashClaw | [NOT PROVIDED] | PENDING |
| WhatsApp | [NOT PROVIDED] | PENDING |

## PENDING ACTIONS

| Task | Owner | Status |
|------|-------|--------|
| Get Honcho API key | Tumelo | → app.honcho.dev |
| Install Tailscale on MacBook | Tumelo | DO TODAY |
| Install Tailscale on Razor | Tumelo | DO TODAY |
| Install Tailscale on Lenovo | Tumelo | DO TODAY |
| Install Tailscale on all Orgo VMs | Tumelo | SSH in + run install |
| Connect Discord bot to server | Tumelo | OAuth link ready |
| Regenerate Composio key | Tumelo | dashboard.composio.dev |
| Verify AgentMail endpoint | Hermes | PENDING |
| Set up Queen/Croc/CashClaw | Tumelo | PROVIDE KEYS |
| Set up WhatsApp | Tumelo | PROVIDE METHOD |
| Get GitHub PAT | Tumelo | github.com/settings/tokens |
| Daytona GUI URL | Tumelo | GET FROM DAYTONA UI |
| Push code to Daytona git | Tumelo | HTTPS git push |

## TAILSCALE DEVICE HOSTNAMES
```
hermes.tailnet         ← This sandbox (not yet connected)
daytona.tailnet         ← 755GB RAM VM
studex-macbook.tailnet  ← Tumelo's MacBook
studex-razor.tailnet    ← MiroFish laptop
studex-lenovo.tailnet   ← AutoResearch laptop
superagents-cmd.tailnet ← Orgo: Discord bot
global-mkts.tailnet     ← Orgo: Research + Gitea
dark-factory.tailnet    ← Orgo: Claude Code
sgm-clients.tailnet     ← Orgo: Clients
rwanda.tailnet          ← Orgo: Rwanda
ryde-rsa.tailnet        ← Orgo: Ryde
auto-meat.tailnet       ← Orgo: Auto-Meat
neledi-cmo.tailnet      ← Orgo: Neledi-CMO
solo-prenure.tailnet    ← Orgo: Solo-Prenure
ntechlab.tailnet        ← Orgo: NTechLab
```

## PENDING CREDENTIALS (for Tumelo to provide)
```
Queen API: _______________ (what does it do?)
Croc API: _______________ (what does it do?)
CashClaw: _______________ (what does it do?)
WhatsApp: _______________ (OpenWA self-hosted OR Meta Business API?)
GitHub PAT: ghp_... (for HTTPS git push)
```
