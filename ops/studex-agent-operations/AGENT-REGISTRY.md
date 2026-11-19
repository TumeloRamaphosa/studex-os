# AGENT-REGISTRY.md

**Compiled:** 2026-10-28T05:45:56Z
**Method:** read-only inspection. Every row is separated into **CONFIGURED** (a registry/config entry exists) vs **INDEPENDENTLY WORKING** (observed running or observed producing output during this discovery). These are treated as different things on purpose.

Owner of all agents: **Tumelo Ramaphosa** (sole approver).

---

## 1. The roster

| Agent | Purpose | Runtime | Model | Owner | Last verified successful task (evidence) | Workspace / permissions | Status |
|---|---|---|---|---|---|---|---|
| **Hermes** (this process) | AI CTO / master orchestrator; routes work, maintains agent registry, conflict resolution | Hermes runtime on `hermes` container | MiniMax-M3.1-Flash | Tumelo | **VERIFIED 2026-10-28** - produced this handoff set; read 60+ repos, wrote 6 docs, ran 11 cron-config read, probed 5 external APIs | `/workspace` read+write; `/root/.hermes` read+write; `/root/.hermes/.env` readable (values never extracted) | **INDEPENDENTLY WORKING** |
| **Hermes MiniMax fleet** (from `gaming-platform/.env.example`) | 7-agent hackathon fleet: hermes, naledi, openclaw, adam, cashclaw, qa, paperclip | Python bus over Redis + MiniMax | MiniMax-M2 (per `.env.example`) | Tumelo | NONE in this environment - Redis absent, `pytest` absent, module `redis` not installed | `gaming-platform/` - lanes declared in `orchestrator/roster.py` with `owns` / `never_touches` | **CONFIGURED only** |
| **Robusca / War Room** | Chief-of-staff orchestrator; 14-tab War Room app; daily 8PM SAST Shopify report cron; Gmail + AgentMail sync | Node/Express + React (Perplexity Computer) | unspecified | Tumelo | NONE verifiable here - repo cloned to `/tmp/robusca-brain`; route code audited; **no run observed** | `robusca-brain` (upstream remote exists) | **CONFIGURED only** - code audited, not running |
| **OpenClaw** | Coding / execution agent; fleet bridge | Daytona per registry | unspecified | Tumelo | NONE - no service unit, no process | `registry/agents.json` -> `READY` | **CONFIGURED only** |
| **DeerFlow** | Agent framework | Daytona per registry | unspecified | Tumelo | NONE | `registry/agents.json` -> `READY` | **CONFIGURED only** |
| **Sentinel** | Discord communications | Discord bot | n/a | Tumelo | NONE - `NOT_CONNECTED`, OAuth URL present but unused | Discord app `1530551927979511838` | **CONFIGURED only** |
| **Metal** | WhatsApp client-facing | WhatsApp gateway | n/a | Tumelo | NONE verifiable - registry says `ACTIVE`, `apis.json` says `PENDING_KEYS` (**contradiction**) | per-client | **CONFIGURED, status disputed** |
| **Buzz Agents** | 5 per-client agents (dench-client, hourly-reporter, huly-client, openclaw-client, whatsapp-client) | Daytona | n/a | Tumelo | NONE verifiable | per-client separation - good pattern to extend | **CONFIGURED only** |
| **Orgo VMs** | Cloud execution fleet (10 VMs) | Orgo AI REST | n/a | Tumelo | NONE this session - API reachable but unauthenticated; last fleet report 2026-09-09 showed 9/10 RUNNING, 1 ERROR, 2 disks at 88% | 10 VMs, external | **CONFIGURED; last known partly working** |
| **CashClaw** | Finance, invoicing, prize pool | agent impl in `/workspace/cashclaw` | MiniMax | Tumelo | NONE - `apis.json` -> `NO_KEYS` | `cashclaw/` | **CONFIGURED only** |
| **DenchClaw** | CRM + email outreach | agent impl in `/workspace/denchclaw` | MiniMax | Tumelo | NONE verifiable | `denchclaw/` | **CONFIGURED only** |
| **Naledi** | CMO, brand + campaign (Obsidian black + gold) | via `gaming-platform` bus | MiniMax | Tumelo | NONE - bus down | game vault `01-Agents/naledi/AGENT.md` | **CONFIGURED only** |
| **Adam** | CTO, platform code, CI, infra runbooks | via `gaming-platform` bus | MiniMax | Tumelo | NONE | game vault `01-Agents/adam/AGENT.md` | **CONFIGURED only** |
| **Paperclip** | Specialist worker | via `gaming-platform` bus | MiniMax | Tumelo | NONE | game vault `01-Agents/paperclip/AGENT.md` | **CONFIGURED only** |
| **QA** | Test + regression + integration verification | via `gaming-platform` bus | MiniMax | Tumelo | NONE - suite cannot run (no pytest, no redis) | game vault `01-Agents/qa/AGENT.md` | **CONFIGURED only** |
| **Kev** | Named agent | `/workspace/kev` | n/a | Tumelo | NONE verifiable | `kev/` | **CONFIGURED only** |
| **Static-bot** | Named agent | `/workspace/static-bot` | n/a | Tumelo | NONE verifiable | `static-bot/` | **CONFIGURED only** |
| **Portia** | Named agent | not located in this workspace | n/a | Tumelo | NONE | unknown | **PLANNED / unlocated** |
| **Codex** | Coding agent (incoming collaborator) | external CLI / MCP host | OpenAI | Tumelo | NONE - not onboarded | via MCP bridge or file queue | **NOT ONBOARDED - awaiting owner approval** |
| **Grok** | Media / growth agent (x.ai) | x.ai bot API | Grok | Tumelo | NONE - needs a Robusca invite | per `grok-xai-media-api` skill | **NOT ONBOARDED - awaiting owner approval** |
| **Dot** | Named agent | not located in this workspace | n/a | Tumelo | NONE | unknown | **NOT ONBOARDED / unlocated** |
| **Katjana** | Head of Customer Sales, base orchestrator (per AGENT-JOIN) | Base44 superagent HTTP API | n/a | Tumelo | NONE from here - endpoint documented, no key | `AGENT-JOIN.md` names her as pack maintainer | **CONFIGURED (external)** |
| **Cypher Trace** | CTO, Nexus Agents Nest owner-side | external | n/a | Tumelo | NONE | `nexus-agents-nest/` | **CONFIGURED only** |
| **Robusca Prime** | President | external | n/a | Tumelo | NONE | `AGENT-JOIN.md` roster | **CONFIGURED only** |
| **LangChain swarm (9 agents)** | Naledi, EDDIE, Charlie, Kev, Amara, RALF, GIUM, Vera, Zane, Nova | `langchain_connector.py` over herdr + openrig | OPENAI/ANTHROPIC/GEMINI/QWEN/GROK keys | Tumelo | NONE - both endpoints down | `/workspace/.herdr/agents/langchain_connector.py` | **CONFIGURED only** |
| **Edge runner / Super Agents fleet** | 42 cloud agents (email / sales / engineering) | per AGENT-JOIN | n/a | Tumelo | NONE verifiable | `AGENT-JOIN.md` roster | **CONFIGURED only (count unverified)** |
| **Obsidian brain** | Knowledge layer of command centre | `studex-command-center/app/obsidian-brain.jsx` | n/a | Tumelo | NONE verifiable | `studex-command-center/` | **CONFIGURED only** |
| **Google Drive sync** | Knowledge mirror | connector | n/a | Tumelo | NONE - blocked | would need service account | **BLOCKED** |

---

## 2. Duplicated responsibilities and conflicting orchestration (VERIFIED)

1. **Two 9AM board jobs** - "Studex Super Agents - Daily 9AM Board Meeting" (Telegram delivery) and "Hermes - 9AM Board Meeting" (local). Same intent, two schedules. Needs consolidation.
2. **Two GitHub-trending jobs** - "Studex - Daily Top 10 GitHub Repos Research" (`0 7 * * 1-5`) and "8:30AM GitHub Trending Research" (`30 8 * * 1-5`). Same job, two schedules.
3. **Three overlapping agent orchestrators** - `gaming-platform/orchestrator/hermes.py`, `agent-orchestrator/`, `agentic-os/`, plus `robusca-brain` (War Room). Each claims routing/coordination. **Needs a single accountable coordinator per task.**
4. **"Hermes" means three different things** - this cloud instance; the `gaming-platform` fleet orchestrator (also named hermes, MiniMax-M2); and the `gaming-platform` roster entry for `hermes`. The agent-access-kit already refers to a separate "Hermes fleet - 42 cloud agents". Naming collision is a real coordination risk.
5. **Two payment providers documented** - `apis.json` says Stitch `WORKING`; `clients.json` + War Room say Stitch NOT_USED, PayFast live. **Resolved here in favour of PayFast**; `apis.json` still needs correcting.
6. **Two WhatsApp statuses** - `agents.json` `ACTIVE` vs `apis.json` `PENDING_KEYS`.
7. **Two knowledge systems** - Obsidian vault (working) and Notion (no connector found). Plus a third, the Google Drive meat drive (read-only). Needs a declared source-of-truth order.
8. **Two of the four declared studios have thin foundations** - Game Studio has a real code skeleton (`gaming-platform`) but no running bus and empty task queue; Development Studio has a command centre but no test/CI spine. Media Studio and Business Operations are largely registry entries and client folders.

---

## 3. Onboarding contract (proposed - for owner approval, not yet applied)

This **extends** the existing canonical contract at `/workspace/agent-access-kit/agent-access-kit/AGENT-JOIN.md` (RED LINES, "CONNECTED as \<name\>, ready" handshake, `results/<agent-name>/` lanes). It does not replace it.

### 3.1 Required contract fields for every task

| Field | Rule |
|---|---|
| `task_id` | Durable, `TASK-<YYYYMMDD>-<slug>`, never reused |
| `owner` | Exactly ONE accountable coordinator. Two owners = invalid task, returned unstarted. |
| `scope` | One sentence. What is in, and explicitly what is out. |
| `inputs` | Exact paths / repos / documents. Not "the workspace". |
| `acceptance_criteria` | Testable statements. "Builds" is not testable; "`npm run build` exits 0 and `dist/index.html` exists" is. |
| `never_touches` | Copied from the agent's lane spec (see `gaming-platform/orchestrator/roster.py` for the existing pattern). |
| `evidence` | Artefact path + how to re-verify it. |
| `cost` | Token spend or API cost where measurable; else "not measured". |
| `artifacts` | Absolute paths. Never pasted commercial records into shared folders. |
| `status` | `PROPOSED -> ACCEPTED -> IN_PROGRESS -> REVIEW -> DONE` / `BLOCKED` / `CANCELLED` |

### 3.2 Access model (least privilege)

- Each agent gets ONE lane directory: `results/<agent-name>/`. Nothing else writable.
- Client workspaces stay separated. An agent working IGH must not read Studex Meat client data, and vice versa. This matches the existing Buzz per-client split (`dench-client`, `huly-client`, etc.) and is the pattern to standardise.
- Read access is granted per-repo, not per-workspace.
- **No agent may grant itself permissions.** Permission changes are an owner action, always.
- **No agent approves its own consequential external action.** The forbidden set is already codified in `gaming-platform/orchestrator/hermes.py`:
  `publish`, `email_customer`, `call_blotato`, `edit_shopify`, `provision_vm`, `deploy_production`, `settle`.
  Recommendation: adopt that exact tuple fleet-wide as `FORBIDDEN_ACTIONS`.

### 3.3 Handoff, retry, cancellation, escalation

- **Handoff:** the owner of a task hands off by (a) closing the current task with `status: DONE` or `BLOCKED`, (b) writing the new task file with `owner` set to the receiver, (c) leaving a bridge message via `studex_leave_message`, (d) never abandoning a task in `IN_PROGRESS` without a note.
- **Retry:** max 2 automatic retries, only for transient transport errors. A retry that changes the *plan* is a new task with a new `task_id`. Retries must be logged.
- **Cancellation:** any agent may cancel its own task, or escalate to the owner. Only the owner may cancel an in-flight task owned by another agent.
- **Escalation ladder:** agent -> coordinator (Hermes) -> owner (Tumelo). Escalate immediately on: any forbidden-action attempt, any need to change permissions, any customer-facing message, any spend, any production deploy, or any credential the agent cannot access.
- **Conflict resolution:** no LLM tie-break. Fixed priority order, logged with reasoning. Already implemented in `gaming-platform/orchestrator/hermes.py` (`AGENT_PRIORITY`) - reuse it rather than inventing a second rule.

### 3.4 Proposed roster and connection method (PRESENT ONLY - nothing activated)

| Agent | Lane / role | Connect method | State |
|---|---|---|---|
| **Codex** | Development Studio - coding, testing, releases | MCP bridge (read/write to OS pack) + file queue for task/results | **PROPOSED - awaiting owner approval** |
| **Grok** | Media Studio - campaigns, images, video, SEO | x.ai bot API, invoked by Hermes via the `grok-xai-media-api` skill; needs a Robusca invite | **PROPOSED - awaiting owner approval** |
| **Dot** | Business Operations - client work, pipeline | file queue + MCP bridge; specific scope TBD by owner | **PROPOSED - awaiting owner approval, role undefined** |
| **Hermes** | Coordinator for all of the above; owns `AGENT-REGISTRY.md`, `SYSTEM-INVENTORY.md`, `DECISIONS-AND-BLOCKERS.md` | always-on | WORKING |
| **Paperclip** | Specialist worker - game assets, QA, packaging | `gaming-platform` bus (once Redis exists) | PROPOSED |
| **QA** | Verification of every pilot stage | `gaming-platform` bus | PROPOSED |
| **Adam** | Development Studio - platform code, CI, infra | `gaming-platform` bus | PROPOSED |
| **Naledi** | Media - brand, copy, campaign | `gaming-platform` bus | PROPOSED |
| **CashClaw** | Finance - budget, prize pool, sponsorship drafts | `gaming-platform` bus | PROPOSED |

**Explicitly NOT done, per instruction:** no agent was messaged, invited, connected, or activated. No Grok bot was invited to Robusca. No Codex install was attempted. No Bot token was requested.

### 3.5 Announcement handshake (existing, to be reused)

`AGENT-JOIN.md` requires the first message to be exactly: `CONNECTED as \<your name\>, ready`, written to `bridge/inbox/from-<name>.md`. VERIFIED that the mechanism exists (inbox dir + `studex_leave_message` tool + one prior example from `cursor-builder`, 2026-09-07).
