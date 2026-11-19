---
name: Connections Master v3
type: system
status: ACTIVE
last_updated: 2026-08-26
---

# Connections Master v3 — StudEx Ecosystem

## WORKING SYSTEMS (26 Aug 2026)
- ✅ Discord Sentinel bot online (gateway OK)
- ✅ Orgo AI API working (8/10 VMs online)
- ✅ Super Agents SaaS live (factory.studex-group.com, superagents.studex-group.com)
- ✅ Dark Factory live (factory.studex-group.com)
- ✅ KbWen/agentic-os cloned at /workspace/daytona-agentic-os
- ✅ Unified portal built at /workspace/studex-unified/index.html

## PENDING CREDENTIALS
- ⏳ Vercel token → to deploy portal to www.studex-group.com
- ⏳ Queen API key → Discord integration
- ⏳ Croc API key → Discord integration
- ⏳ CashClaw key → Finance agent
- ⏳ WhatsApp gateway → OpenWA or Meta Business API
- ⏳ GitHub PAT → clone all private repos

## Orgo AI — 10 VMs (8 ONLINE as of 26 Aug 2026)

```
API Key:  ${ORGO_API_KEY}
Base:     https://www.orgo.ai/api
Workspace: Studex Wildlife's workspace (a4977a1c-cde4-410d-878e-fb5675d55995)
Owner:    tumelor001@gmail.com
```

| Name                  | ID                                   | Disk  | RAM   | Status |
|-----------------------|--------------------------------------|-------|-------|--------|
| Super Agents Command  | 333de3f8-0801-430b-a541-aad458e896b5 | **95%** ⚠️ | 28%   | ⚠️ CRITICAL |
| Global Markets        | 0f28f3a2-2b26-4260-bff7-262885c86c28 | **88%** ⚠️ | 28%   | ⚠️ WARNING |
| TH# D@RK F@CT0Ry     | 44991831-da7d-4a5b-8cf6-9347ef638712 | ~15% est | 13% | ⚠️ df broken |
| SGM-CLIENTS           | d95d7f15-5845-4fc6-ad12-7e3aae55e57c | —     | —     | ❌ OFFLINE |
| Rwanda                | 1a624546-2947-4974-a6ba-6d0e246c9b46 | 17%   | 14%   | ✅ OK |
| Ryde 1 RSA            | c58657ad-9223-4bd5-b37c-9b897fa6cfc7 | 37%   | 14%   | ✅ OK |
| Auto-Meat             | 343f4c0d-137c-4e1a-bff4-8b1178db32f3 | 12%   | 7%    | ✅ OK |
| Neledi-CMO            | 06cf4136-7847-458e-a263-508654f565bd | 13%   | 12%   | ✅ OK |
| Solo-Prenure          | 57832482-9e5c-439f-9da1-6d088adc127e | 20%   | 7%    | ✅ OK |
| NTechLab-NTECHJ       | 0f25104d-1243-42d5-8eec-4e9b08dbfa81 | 19%   | 13%   | ✅ OK |

**Disk cleanup commands (run on affected VMs):**
```
docker system prune -a -f && apt-get clean && journalctl --vacuum-time=7d
```

## Discord Sentinel Bot
```
Token:    ${DISCORD_BOT_TOKEN}
App ID:   1530551927979511838
Gateway:  wss://gateway.discord.gg ✅ ONLINE
Guild:    1324970568498188288
Status:   WORKING — awaiting Queen + Croc API keys
```

## Vercel Deployments
```
www.studex-group.com    → studex-super-agents project (Next.js)
factory.studex-group.com → [check Vercel project]
markets.studex-group.com → redirect to pplx.app
```
Token needed at: https://vercel.com/account/tokens

## Daytona Workspace
```
Repo:     github.com/KbWen/agentic-os
Local:    /workspace/daytona-agentic-os (cloned)
SSH:      git@ssh.app.daytona.io:2222 (blocked from here, use local machine)
HTTPS token: D26IPzf8EP150DwT2bWJasxbEgg4hgSN
Status:   CLONED — governance framework for AI coding agents
```

## Platform URLs
```
StudEx Ecosystem Hub:  www.studex-group.com       (→ studex-super-agents Vercel)
Dark Factory v3:        factory.studex-group.com   (BMAD product, OGRE v3.0)
Super Agents SaaS:      superagents.studex-group.com (8 Renaissance agents)
Africa Davos:           markets.studex-group.com    (→ pplx.app)
Unified portal temp:    https://rflrk2kig7h1.space.mcode.io
```

## Tailscale
```
Auth Key: tskey-auth-kCwAg5huu721CNTRL-U6ZSsmLDcigSkfiNsXxUigEgWBD6wGnBK
Dashboard: https://login.tailscale.com/admin/machines
Status: ACTIVE — connects all VMs and devices
```
