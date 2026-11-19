# PRODUCT-STATUS.md

**Compiled:** 2026-10-28T05:45:56Z
**Purpose:** One place that says, for every product StudEx claims to have: what is real, what is a demo, what is a mockup, and where the canonical source of truth lives.

---

## 1. The four studios

### 1.1 Game Studio - **strongest foundation, not yet running**

Canonical source: `/workspace/gaming-platform/`

What actually exists:
- `orchestrator/hermes.py` - orchestrator with `AGENT_PRIORITY`, `FORBIDDEN_ACTIONS`, and a `consensus` path for multi-agent agreement. Real code, not a stub.
- `orchestrator/roster.py` - per-agent lanes with `owns` / `never_touches` separation.
- `orchestrator/protocol.py` - agent bus message schema.
- `storage/pipeline.py` - file-pipeline storage.
- `bridge/global_markets.py` - Global Markets business bridge.
- `agents/` - 7 agent briefs.
- `vault/Studex-Game-Vault/` - Obsidian vault: `01-Agents` (hermes, naledi, openclaw, adam, cashclaw, qa, paperclip), `02-Tasks`, `03-Playbooks`, `04-Mode`, `05-Data`, `06-Decisions`, `07-Reference`, `08-Archive`. Notes carry `type` + `updated` frontmatter.
- `tests/test_platform.py` - a real test file exists.
- `.env.example` - 7 agent definitions with `owns`/`never_touches` and a `MINIMAX_*` key.

What is NOT true yet:
- **The agent bus cannot run here.** No `redis-server`/`redis-cli`, no `redis` Python module, no `pytest`. The test suite would skip rather than pass.
- **`02-Tasks` is empty** - no task has ever been filed through the vault.
- No evidence any game has been shipped or monetised.

**Verdict: DEMONSTRATED-SKELETON.** The code and governance layer are real and worth building on. The runtime and the work are missing.

### 1.2 Development Studio - **real front-ends, no test/CI spine**

Canonical source: `/workspace/studex-command-center/` (Next.js), `/workspace/mission-control/`, `/workspace/openrig/`, `/workspace/agent-orchestrator/`

- `studex-command-center/app/*.jsx` - multiple working React screens.
- `mission-control/skills`, `mission-control/commands`, `mission-control/scripts` - a factory pattern for skill/command/script packaging.
- `openrig` - the bridge intended to drive Claude Code / Codex coding agents (daemon on :7433, currently **unreachable**).
- `agent-orchestrator/` - another orchestrator implementation (overlaps `gaming-platform`).

**Verdict: DEMONSTRATED-SKELETON.** Screens and patterns exist; there is no single tested pipeline from task to merged release.

### 1.3 Media Studio - **mostly intent**

- `/workspace/studex-trending-research/` - GitHub trending researcher with a Cloudflare Pages deploy guide. Real code.
- `grok-xai-media-api` skill - the intended media generation path (Grok XAI API for text, images, video).
- `/workspace/gods-eye-view/` - **third-party** upstream project (`bilawalsidhu/gods-eye-view`), not StudEx-owned. Should not be presented as a StudEx product without attribution.
- `gaming-platform` `naledi` brief - brand + campaign ownership (black + gold).

**Verdict: CONFIGURED / INTENT.** No running media pipeline, no verified generation subscription on this host.

### 1.4 Business Operations Studio - **the War Room**

Canonical source: `/workspace/robusca-brain` (upstream `https://github.com/TumeloRamaphosa/robusca-brain`), `/workspace/studex-os/obsidian/`

- War Room = a 14-tab React app. Route inventory verified during this audit: Dashboard, Clients, Pipeline, Tasks, Calendar, Inbox, Payments, Content, Reports, Analytics, Team, CalendarSync, AgentFleet, `grok-marketing`, `legal`, `jobs`, `pricing`, `settings`, plus `/chat`, `/vault`, `/api/*`.
- A daily 8PM SAST Shopify report cron with SAST->UTC conversion (`22:00` UTC = midnight SAST).
- AgentMail + Gmail sync routes.
- 8 workflow skills: `client-onboarding`, `content-pipeline`, `payment-processing`, `agent-hiring`, `weekly-report`, `lead-scoring`, `social-posting`, `invoice-generation`.
- `AGENT-JOIN.md` describes a 42-agent cloud fleet.

**Verdict: DEMONSTRATED-SKELETON, code audited but not running.** This repo was cloned fresh to `/tmp/robusca-brain` during this audit (depth 20) so the route code could be read; the fixes described below live only in that temp clone.

---

## 2. Product / app matrix

| Product | Path | Canonical source of truth | Demonstrated? | Evidence |
|---|---|---|---|---|
| StudEx OS | `/workspace/studex-os` | registry JSON + Obsidian vault | Partly | `registry/*.json` and 11 vault folders present; **no git repo** |
| Black & Gold OS dashboard | `https://www.studex-group.com` | Vercel project `studex-hub`, single `index.html` | Live (per operator) | deploy endpoint known; project id `prj_Nm7GT8v42DFr3fVIp1WCAJmOBriD` |
| Command Centre | `/workspace/studex-command-center` | repo | Screens exist | `app/*.jsx` |
| War Room | `/workspace/robusca-brain` | repo | Screens exist, not running | route audit in `/tmp/robusca-brain` |
| Stud-Bot (PWA) | `/workspace/studex-mobile` | repo | Built, install not demonstrated | React + Vite + Fastify, `src/` present |
| Stud-Bot-Launch | `/workspace/Stud-Bot-Launch-` | n/a | **EMPTY DIRECTORY** | `find` returned nothing |
| Infinite Growth Haven site | `/workspace/igh-website` | repo | Live (per operator) | demo `https://zqjy41whi2rt.space.mcode.io`, dashboard `https://ana12bhkl5m1.space.mcode.io` |
| IGH dashboard | `/workspace/igh-dashboard` | repo | Live (per operator) | as above |
| Studex Meat | `/workspace/studex-auto-meat` | repo (primary working repo per operator) | Unknown | Shopify domain unreachable (HTTP 000) |
| Static site | `/workspace/studex-site` | repo | Deployable | Vercel + Cloudflare wrangler config |
| Code Portal | `/workspace/studex-code-portal` | repo | Unknown | present |
| Data Room | `/workspace/studex-data-room` | repo | Unknown | present |
| Standup | `/workspace/studex-standup` | repo | Unknown | present |
| Nexus | `/workspace/studex-nexus` (+ `studex-nexus-bare` with git remote) | `studex-nexus-bare` -> `github.com/TumeloRamaphosa/studex-nexus.git` | Unknown | only repo with a remote |
| CashClaw | `/workspace/cashclaw` | repo | Unknown | `apis.json` -> `NO_KEYS` |
| DenchClaw | `/workspace/denchclaw` | repo | Unknown | present |
| UltraLearn / Onboarding | `/workspace/agency-agents` | repo | Unknown | present |
| Agentic Lab v3 | `/workspace/agentic-lab-v3` | repo | Unknown | present |
| Cryptopia | `/workspace/Cryptopia` | repo | Unknown | present (operator: correct repo) |
| Meetings--coms | `/workspace/Meetings--coms` | `github.com/TumeloRamaphosa/Meetings--coms` | Unknown | contacts, leads, letters, proposals, dossiers, pipeline |
| Mobile-Harness | `/workspace/Mobile-Harness` | repo | Unknown | present |
| Phone agent | `/workspace/studex-phone-agent` | repo | Unknown | Z Fold 6 Termux target |
| Hercules | `/workspace/nesa` | repo | Unknown | present |
| Crucix / SGM-RWA-1 / hh / kudu / vphone-ws / denchclaw / cashclaw | various | repos | Unknown | present |
| Gods Eye View | `/workspace/gods-eye-view` | **third-party upstream** | n/a | not a StudEx product |

---

## 3. Defects found during this audit (all VERIFIED, none fixed in place)

| # | Defect | Location | Severity | Note |
|---|---|---|---|---|
| 1 | **PayFast merchant key embedded in client-side code** | War Room `Payments.tsx` (in `/tmp/robusca-brain`) | **HIGH** | A payment credential shipped to the browser. Must be server-side; rotate the key. |
| 2 | `registry/apis.json` says Stitch is `WORKING` | `/workspace/studex-os/registry/apis.json` | MEDIUM | Contradicts `clients.json` + War Room, which say NOT_USED / PayFast live. |
| 3 | WhatsApp status contradiction | `registry/agents.json` (`ACTIVE`) vs `registry/apis.json` (`PENDING_KEYS`) | MEDIUM | |
| 4 | Two 9AM board jobs | `/root/.hermes/cron/jobs.json` | MEDIUM | Duplicate orchestration. |
| 5 | Two GitHub-trending jobs | same file | MEDIUM | Duplicate orchestration. |
| 6 | 60+ repos with **no git remote** | `/workspace/*` | **HIGH** | No canonical source of truth, no audit trail, no rollback. |
| 7 | Game-studio test suite cannot execute | `/workspace/gaming-platform` | HIGH | No redis, no pytest, no `redis` module. |
| 8 | `02-Tasks` empty | `gaming-platform/vault/Studex-Game-Vault/02-Tasks` | MEDIUM | The vault has no work in it. |
| 9 | Google Drive write path blocked | whole environment | HIGH | No OAuth, no service account, no client tooling. |
| 10 | Herdr / OpenRig / OpenClaw endpoints down | `10.0.0.1:2244`, `127.00.0.1:7433` | HIGH | `langchain_connector.py` is non-functional as written. |
| 11 | No `redis-server` installed | host | MEDIUM | Agent bus prerequisite. |
| 12 | `Stud-Bot-Launch-` empty | `/workspace/Stud-Bot-Launch-` | LOW | |
| 13 | Obsidian vault + Notion + Drive = 3 knowledge stores | `studex-os/obsidian`, n/a, Drive | MEDIUM | Needs a declared source-of-truth order. |
| 14 | No `gcloud`/`gsutil`, no Rome reference anywhere | whole environment | MEDIUM | "Rome" workspace is unfindable. |

---

## 4. Recommended sequencing (owner decision required)

1. **Fix the PayFast credential leak** (defect 1) - security first, before any client demo.
2. **Declare one git remote per product** - fixes defects 6 and gives every downstream agent a canonical target to read from and write to.
3. **Stand up Redis + pytest** and run `gaming-platform/tests/test_platform.py` - first executable proof of the game-studio bus.
4. **Bring up Herdr SA Command (:2244) + OpenRig (:7433)** - unblocks the private-network layer and the 9-agent langchain connector.
5. **Unblock Google Drive** with a service account scoped to the StudEx Meat drive folder - unblocks the intended handoff delivery location.
6. **Consolidate the duplicate cron jobs** and reconcile the registry contradictions (defects 2, 3, 4, 5).
7. **Then** onboard Codex / Grok / Dot against the contract in `AGENT-REGISTRY.md` section 3.
