# Hermes Agent — Handover Pack

**Date:** 2026-10-16
**Agent:** Hermes (AI CTO)
**Runtime:** Cloud sandbox (Minimax provider)
**Model:** auto (primary), Claude/Claude-Sonnet-4 available
**Host:** This cloud sandbox environment
**Coordinated by:** dot (Tumelo Ramaphosa, Agent Lord)
**Access:** Via this chat, terminal, file tools, web tools. No direct SSH to physical machines.

---

## 1. IDENTITY

| Field | Value |
|-------|-------|
| Name | Hermes |
| Role | AI CTO — fleet coordinator, architect, research, deployment agent |
| Runtime | Cloud sandbox (no physical host — stateless between sessions) |
| Model | auto (provider: Minimax) |
| Primary tools | terminal, file read/write, web search, web extract, HTML deploy, TTS, image/video gen |
| Studex projects | All — acts as fleet coordinator across all subsidiaries |

---

## 2. WORK INVENTORY

### WORKING / DEPLOYED

| Item | Purpose | Location | Status | Last Update |
|------|---------|----------|--------|-------------|
| Studex Data Room | Fleet audit, all sites, infra, contacts, repos, architecture | https://alqzuh1gws96.space.mcode.io | Live | 2026-10-16 |
| Discord bot | Fleet comms channel | Running (token in memory, not logged) | Live | 2026-10-16 |
| Buzz relay connection | NIP-01/NIP-42 agent comms relay | wss://studex-agents.communities.buzz.xyz | AUTH challenge received, nsec key needed | 2026-10-15 |
| OpenClaw first-reply draft | Agent status board entry | /workspace/2026-01-12_openclaw_first_reply.md | Draft | 2026-01-12 |
| Studex Dev Hub | Development link aggregator | https://tcz9ls98c77e.space.mcode.io | Live | 2026-09 |

### MISSION LIBRARY (read-only access)

| Item | Content | Location |
|------|---------|----------|
| Contacts | 53 contacts | /workspace/Meetings--coms/Contacts/MISSION_CONTACTS.md |
| Sales leads | 9 active leads | /workspace/Meetings--coms/Contacts/SALES_LEADS.md |
| Eswatini letters | 12 formal letters | /workspace/Meetings--coms/Letters/Eswatini/ |
| Rwanda proposal | RWA blueprint | /workspace/Meetings--coms/Letters/Rwanda/rwanda-proposal.md |
| Email drafts | 10 drafts (DRAFT ONLY — not sent) | /workspace/Meetings--coms/Letters/Email-Drafts/EMAIL_DRAFTS.md |
| Meeting dossiers | Bitfury, Four Seasons, MGIMO | /workspace/Meetings--coms/Meetings/ |
| Pipeline | Opportunities tracker | /workspace/Meetings--coms/Opportunities/PIPELINE.md |
| CodeX Phase 1.5 | App stubs (meeting-bot.ts, email-coordinator.ts) | /workspace/Meetings--coms/src/agents/ |

### PROTOTYPE / DRAFT

| Item | Purpose | Status |
|------|---------|--------|
| STUDBOT Pipeline | 4-station software factory | Ready, no first task routed yet |
| Cloudflare Command Center | Fleet management dashboard | Planned, credentials needed |
| Phone agent (Z Fold 6) | Termux + Tailscale + Ollama | Partial setup, Tailscale blocked by low battery |
| Telegram bot | Second fleet channel | Awaiting Bot Token + User ID from Tumelo |

### PLANNED / BLOCKED

| Item | Blocker | Owner |
|------|---------|-------|
| AutoMEat coordination | Tailscale mesh not live | Tumelo |
| Mac Mini agents | No Tailscale IP | Tumelo |
| LiteLLM router | MiniMax + Kimi API keys | Tumelo |
| Buzz NIP-42 AUTH | nsec key | Tumelo |
| Model House gateway test | Mac Mini access | LLM Engineer |

---

## 3. DEMONSTRATED VALUE

- **Fleet audit:** Data Room provides a single live link showing all live sites, infra, repos, contacts, architecture — verifiable in seconds
- **Mission library access:** 53 contacts, 9 sales leads, pipeline fully indexed — ready to act on Tumelo's direction
- **Deployment:** Vercel and Matrix deploy pipeline ready — new sites go live in minutes
- **Research:** Tooled for deep-dive on regulations, competitors, tools — cited sources, no guesswork
- **Coordination:** Ready to relay tasks to AutoMEat on Legion Go and orchestrate the fleet once Tailscale is live

---

## 4. PROJECT MEMORY

### Verified Facts (2026-10-16)
- Tumelo Ramaphosa, CEO Studex Group. Empire Builder archetype. Black & Gold brand.
- 7 subsidiaries. 10 Orgo AI VMs. Mac Mini, MacBook, Legion Go, Z Fold 6 in fleet.
- AutoMEat (Claude Code) live on Legion Go as peer agent.
- Buzz relay connected (AUTH challenge received). nsec key needed to complete NIP-42.
- Firecrawl CLI installed but key is NOT a Firecrawl key — Orgo workspace key.
- Two-approval email rule: all drafts need TWO Tumelo approvals.
- Laisa Aesthetics: ZERO access, zero actions — hard block.
- Live shop (studexmeat.com): no prices/theme/payfast changes without Tumelo naming it.
- No API keys in chat/prompts/repos.

### Key Decisions
- AutoMEat is a peer agent, not a subordinate — coordinate, don't instruct
- OOMMU for persistent memory, Ollama for inference — different systems
- Bazzite is correct OS for Legion Go — immutable, toolchain: brew/distrobox/podman/flatpak/ujust
- 9GB RAM ceiling on Legion Go — ONE model OR ONE VM at a time
- Google Drive folders seeded in memory (8 folders across Studex Meat / Super Agents / Agent Bus / Agent Registry / Base44 OS / Hermes Backup / AutoMEat×OpenClaw)

### Assumptions
- Mac Mini Tailscale IP will be provided
- MiniMax API key will be provided for LiteLLM router
- Cloudflare credentials will be provided for command center

### Unfinished Tasks
- Telegram bot setup (waiting on Bot Token + User ID)
- AutoMEat Tailscale coordination
- Buzz NIP-42 AUTH completion
- Model House gateway testing (waiting on Mac Mini access)
- Cloudflare command center build
- LiteLLM router deployment
- Z Fold 6 Tailscale fix

---

## 5. KNOWLEDGE AND FILES

| Vault | Location | Last Verified | Backup |
|-------|----------|--------------|--------|
| Fleet audit | https://alqzuh1gws96.space.mcode.io | 2026-10-16 | In memory + local file |
| Mission library | /workspace/Meetings--coms/ | 2026-10-16 | GitHub (Meetings--coms repo) |
| Studex Auto-Meat | /workspace/studex-auto-meat/ | 2026-10-16 | GitHub (studex-auto-meat repo) |
| Agent skills | ~/.hermes/skills/ (via skill_view) | Ongoing | OOMMU skill system |
| Cryptopia docs | /workspace/Cryptopia/ | 2026-10-16 | GitHub (Cryptopia repo) |
| Discord bot token | In session memory only | Not logged or committed | Session only |

---

## 6. CONNECTIONS AND HEALTH

| Tool/API | Purpose | Last Check | Status |
|----------|---------|-----------|--------|
| Discord bot | Fleet comms | 2026-10-16 | Available |
| Orgo AI Desktop API | 10 VM fleet management | 2026-10-16 | Workspace endpoint live (401 without token) |
| SA Command Desktop API | Secondary VM | 2026-10-16 | Live (401 without token) |
| Buzz relay | Agent mesh comms | 2026-10-15 | AUTH challenge received, nsec needed |
| Vercel | Static site deploys | 2026-10-16 | Project studex-hub live |
| Matrix deploy | HTML deploys | 2026-10-16 | Data room + dev hub live |
| Firecrawl CLI | Web scraping | 2026-10-16 | Installed, wrong key (not Firecrawl) |
| Ollama | Local models (Legion Go) | Unknown | AutoMEat reports hermes3:8b loaded |

---

## 7. OPEN WORK — THREE HIGHEST PRIORITY

**1. Telegram bot setup** — Waiting on Bot Token + User ID. Small task, immediate value.

**2. AutoMEat Tailscale coordination** — Unblock the peer agent connection. Blocked on: Mac Mini Tailscale IP, Z Fold 6 battery, AutoMEat's own `tailscale up` result.

**3. Model House gateway testing** — Awaiting Mac Mini access via LLM Engineer or AutoMEat relay. Tests: nozi-chief, nozi-export-ops, nozi-page-agent, Goose, Board Bot.

**Conflicts/Duplicates:** None identified. AutoMEat and Hermes cover separate domains (Legion Go shell vs cloud coordination).

---

## 8. PROPOSED OS ROLE

**Capabilities I contribute:**
- Fleet coordination and routing (STUDBOT pipeline)
- Research and cited evidence (no guesswork)
- Deployment automation (Vercel, Matrix, Cloudflare)
- Mission library management (contacts, leads, letters, pipelines)
- Agent onboarding and handoff management
- Architecture design and decision documentation

**Minimum permissions needed:**
- Continue current access (terminal, file, web, deploy tools)
- Tailscale bridge to Mac Mini (read Mac Mini agent status)
- Access to Drive folder for handover archives
- AutoMEat coordination channel (Buzz relay or terminal relay)

**Safe first connection (proposed):**
- Send me this onboarding interview brief via chat
- I acknowledge receipt and confirm I understand the structure
- We verify one small shared fact (e.g., confirm a known Drive link)
- Connection proven: I return a one-paragraph status summary

**Small test:**
- Tumelo sends: "Confirm your OS role in one sentence."
- I reply with my confirmed role.
- Done — connection verified.

---

## REDACTED SECRETS

The following were handled correctly and are NOT included in this pack:
- Discord bot token — session-only, never logged or committed
- Orgo Desktop API key — workspace endpoint only, never in chat/docs
- Firecrawl key — noted as wrong, flagged not used
- No API keys, passwords, private keys, or secret-bearing URLs in this document

---

*Hermes — AI CTO, Studex Group*
*Prepared: 2026-10-16*
*Next: Awaiting AutoMEat handover response and Drive folder link from dot*
