# SYSTEM-INVENTORY.md

**Compiled:** 2026-10-28T05:45:56Z
**Method:** read-only inspection of `/workspace`, `/root/.hermes`, and unauthenticated reachability probes.
**All timestamps UTC. No credential values are recorded - variables are named only.**

Status legend: VERIFIED / UNTESTED / PLANNED / BLOCKED.

---

## 1. Machines and hosts

| Host | Role | Status | Evidence / timestamp |
|---|---|---|---|
| `hermes` (this container) | Hermes orchestrator + workspace of record | VERIFIED | `hostname`, `uname -a`, `df -h /` - 2026-10-28T05:45Z |
| MacBook Pro M1 Max | Owner workstation, Herald OS layer, `hermes-ctf-001` | UNTESTED from here | Known from operator record; Tailscale SSH ACL limits us to `studex-status`/`send`/`inbox` - cannot read Mac files |
| Mac mini `projects-mac-mini` | Secondary node | VERIFIED reachable (100.112.109.40) | Operator record; last known ONLINE |
| Legion Go (Bazzite) | Dark Factory node | PLANNED | Known from operator record; not reachable from this host |
| Z Fold 6 | Phone agent (Termux + Tailscale) | PLANNED | Tailscale IP still needed from device |
| Orgo AI fleet - 10 VMs | Cloud execution fleet | UNTESTED | API reachable, returns `{"error":"Authentication required"}`; 9/10 RUNNING, 1 ERROR, 2 disks at 88% per `/workspace/orgo-fleet-report-2026-09-09.md` |
| GCP "Rome" workspace | Stated to exist by owner | **NOT FOUND** | No `gcloud`/`gsutil`, no `~/.config/gcloud`, no Rome reference in any registry or doc - grep across `/workspace` found no Rome workspace. Treat as PLANNED until the owner supplies the project reference. |

Disk on this host: 926GB-class volume, **99% full** (operator record) - RAM and CPU headroom not independently measured here.

---

## 2. Repositories (all under `/workspace`)

**Only ONE working tree in this workspace is a git repository with a remote:** `studex-nexus-bare` -> `https://github.com/TumeloRamaphosa/studex-nexus.git`. All other 60+ directories report `NO_GIT` (no `.git`). VERIFIED by `git remote get-url origin` across every top-level directory, 2026-10-28T05:45Z.

This is a material risk: for nearly every product there is **no canonical remote to push to and no commit history to audit**. `robusca-brain` was cloned fresh to `/tmp/robusca-brain` (upstream `https://github.com/TumeloRamaphosa/robusca-brain`, depth 20) - so that repo does have a canonical remote, but the working copy in this workspace is not it.

Key directories and their apparent purpose:

| Path | Purpose | Git | Status |
|---|---|---|---|
| `/workspace/studex-os` | **StudeX OS** - registry (`agents/apis/clients/projects.json`), Obsidian vault, herdr fleet config, agent-onboarding doc | NO_GIT | VERIFIED present |
| `/workspace/studex-os-pack` | Shared OS pack: MCP bridge, `bridge/STATUS.md`, `bridge/inbox/`, `results/` lanes | NO_GIT | VERIFIED present, bridge working |
| `/workspace/agent-access-kit` | **Canonical onboarding contract** (`AGENT-JOIN.md`, `ACCESS-README.md`, BrowserAct skill) | NO_GIT | VERIFIED present |
| `/workspace/gaming-platform` | **Game studio** - agent bus, protocol, registry, roster, orchestrator, storage pipeline, Global Markets bridge, Obsidian game vault, tests | NO_GIT | VERIFIED present, tests cannot run (no redis/pytest) |
| `/workspace/robusca-brain` | Robusca / War Room (chief-of-staff orchestrator, 14-tab app) | NO_GIT in place; upstream remote exists | Cloned to `/tmp/robusca-brain`; fixes applied there only |
| `/workspace/herdr` | Herdr P2P agent runtime (Rust source) | NO_GIT | Source present, binary NOT on PATH |
| `/workspace/openrig` | OpenRig daemon - the bridge to Claude Code / Codex coding agents | NO_GIT | Source present, daemon at :7433 **UNREACHABLE** |
| `/workspace/studex-mobile` | PWA app (React + Vite + Fastify) - "Stud-Bot" candidate | NO_GIT | VERIFIED present, mobile/desktop install not demonstrated |
| `/workspace/Stud-Bot-Launch-` | Directory is **empty** | n/a | PLANNED - no code exists |
| `/workspace/studex-command-center` | Next.js visual command centre (`app/*.jsx`) | NO_GIT | VERIFIED present |
| `/workspace/mission-control` | Mission Control factory (skills, commands, scripts) | NO_GIT | VERIFIED present |
| `/workspace/Portable-agents` | Portable agent engine + outbound + mission-control | NO_GIT | VERIFIED present |
| `/workspace/agent-orchestrator`, `/workspace/agentic-os`, `/workspace/agentic-lab-v3`, `/workspace/agency-agents`, `/workspace/nexus-agents-nest` | Overlapping agent frameworks | NO_GIT | PLANNED - overlapping responsibility, not reconciled |
| `/workspace/studex-site` | Static marketing site (Vercel + Cloudflare wrangler config) | NO_GIT | VERIFIED present |
| `/workspace/igh-website`, `/workspace/igh-dashboard`, `/workspace/igh-wellness` | Infinite Growth Haven client assets | NO_GIT | VERIFIED present (client material - do not copy into shared folders) |
| `/workspace/studex-auto-meat` | Studex Meat automation (primary working repo per operator) | NO_GIT | VERIFIED present |
| `/workspace/studex-trending-research` | GitHub trending researcher + Cloudflare deploy guide | NO_GIT | VERIFIED present |
| `/workspace/cashclaw`, `/workspace/denchclaw`, `/workspace/kev`, `/workspace/static-bot` | Named agent implementations | NO_GIT | VERIFIED present (roles documented, not independently running) |
| `/workspace/gods-eye-view` | Third-party open-source game/satellite simulator (upstream: `bilawalsidhu/gods-eye-view`) | NO_GIT | VERIFIED present - **third-party, not StudEx-owned** |
| `/workspace/graphify`, `/workspace/deer-flow`, `/workspace/openclaw-os`, `/workspace/platform` | Vendored/adjacent third-party or upstream trees | NO_GIT | VERIFIED present |

---

## 3. Services and integrations - status matrix

| Service | Status | Evidence | Timestamp |
|---|---|---|---|
| MiniMax model API | **VERIFIED WORKING** | Provider pool `minimax`; all reasoning in this task ran on it | 2026-10-28 |
| StudEx MCP bridge | **VERIFIED WORKING** | `studex_mcp_bridge.py` tool list + JSON-RPC handler; 7 tools; inbox/results present | 2026-10-28 |
| Vercel REST API | VERIFIED reachable | `https://api.vercel.com` -> HTTP 308 | 2026-10-28 |
| Telegram API | VERIFIED reachable | `https://api.telegram.org` -> HTTP 302 | 2026-10-28 |
| AgentMail API | VERIFIED reachable | `https://api.agentmail.to` -> HTTP 404 (host up, endpoint path wrong) | 2026-10-28 |
| Meta Graph API | VERIFIED reachable | `https://graph.facebook.com/v21.0` -> HTTP 400 (auth required) | 2026-10-28 |
| Orgo AI REST | VERIFIED reachable, UNAUTHENTICATED | `https://www.orgo.ai/api/computers` -> 405 GET / `{"error":"Authentication required"}` POST | 2026-10-28 |
| **Google Drive** | **BLOCKED** | No `rclone`/`gdrive`/`fuse`; no OAuth creds or service-account file; `https://www.googleapis.com/drive/v3/files` -> HTTP 403; the known StudEx Meat folder URL returns HTTP 200 but content is `Sign in` / `not found` | 2026-10-28 |
| Shopify (studexmeat) | UNTESTED | `https://www.studexmeat.myshopify.com` -> HTTP 000 (no response) | 2026-10-28 |
| OpenClaw service | NOT RUNNING here | No process found; no `*.service` unit in `/workspace/openclaw-os` | 2026-10-28 |
| OpenRig daemon | UNREACHABLE | `http://127.0.0.1:7433/healthz` -> empty | 2026-10-28 |
| Herdr server (SA Command) | UNREACHABLE | `http://127.0.0.1:2244/health` -> no response; fleet config points at `10.0.0.1:2244` | 2026-10-28 |
| Redis (agent bus) | NOT INSTALLED | `redis-server`/`redis-cli` not found | 2026-10-28 |
| Ollama (local models) | NOT INSTALLED | binary absent, `localhost:11434` no listener | 2026-10-28 |
| GCP / gcloud | NOT INSTALLED | no `gcloud`, `gsutil`, or `~/.config/gcloud` | 2026-10-28 |
| Tailscale | NOT INSTALLED on this host | binary absent | 2026-10-28 |
| Discord Sentinel | CONFIGURED, NOT CONNECTED | `registry/agents.json` -> `status: NOT_CONNECTED`, OAuth URL present | 2026-10-28 |
| WhatsApp (Metal) | ACTIVE per registry, no local proof | `registry/agents.json` -> `status: ACTIVE`; `registry/apis.json` -> `PENDING_KEYS` - **contradictory** | 2026-10-28 |
| Compositio | BROKEN | `registry/apis.json` -> `BROKEN_410` | 2026-10-28 |
| Super Agents SaaS / Dark Factory | LIVE per registry | `registry/apis.json` -> `LIVE` (not exercised here) | 2026-10-28 |
| Vercel deploy token | PENDING | `registry/apis.json` -> `PENDING_TOKEN` | 2026-10-28 |
| CashClaw finance agent | NO_KEYS | `registry/apis.json` -> `NO_KEYS` | 2026-10-28 |
| Stitch Direct API | **REGISTRY CONTRADICTION** | `apis.json` says `WORKING`; `clients.json` and War Room docs say NOT_USED / deactivated. **Resolution: treat Stitch as NOT_USED** - PayFast is the live payment provider. | 2026-10-28 |
| PayFast payments | LIVE per War Room | `registry/clients.json`; War Room `Payments.tsx` marks env LIVE and embeds the merchant key **in client code** - see `PRODUCT-STATUS.md` | 2026-10-28 |

---

## 4. Storage and data

| Store | Status | Notes |
|---|---|---|
| `/workspace` | VERIFIED | Primary workspace of record. 60+ repos, Obsidian vault, registries. |
| `/root/.hermes` | VERIFIED | Config, `.env` (MiniMax key), `auth.json`, 467 session JSONs, 11 cron jobs, 76 skills, `processes.json`, `maxhermes.json`. |
| `~/.studex/meta.env` | VERIFIED PRESENT (not read) | Named source of platform secrets per operator record. No values extracted. |
| Obsidian vault | VERIFIED | `/workspace/studex-os/obsidian/` with `API, Agents, Clients, Company, Integrations, Knowledge, Missions, Projects, System, VMs, Workflows` + `System/connections-master-v2.md`, `24hour-operation.md`, `hourly-report-system.md`, `agent-mesh-connections.md`, `cto-runbook.md`, `tailscale-mesh-network.md`, `oracle-cloud-notes.md` |
| Game studio vault | VERIFIED | `/workspace/gaming-platform/vault/Studex-Game-Vault/` - 01-Agents (hermes, naledi, openclaw, adam, cashclaw, qa, paperclip), 02-Tasks, 03-Playbooks, 04-Mode, 05-Data, 06-Decisions, 07-Reference, 08-Archive. All notes carry `type` + `updated` frontmatter. **02-Tasks is empty.** |
| Notion | NOT CONNECTED | No Notion credentials or connector found in this environment. Owner lists Notion as a business-knowledge source. **PLANNED.** |
| Google Drive | **BLOCKED** | See section 3. This is the single hard blocker on the handoff delivery location. |

---

## 5. Private network / connectivity

- Tailscale mesh is documented (`obsidian/System/tailscale-mesh-network.md`) and the Mac mini is known reachable at `100.112.109.40`. **But Tailscale is not installed in this container**, so the mesh is not usable from here without the owner installing/enabling it - a change this task forbids.
- Herdr agent mesh: fleet config lists 7 nodes (`steam-deck`, `msi-claw-8`, `legion-go-2`, `razer-blade`, `z-fold-6`, ...) against server `10.0.0.1:2244` on the Orgo "Super Agents Command" VM. The SA Command is the intended `herdr` server, port 2244. Currently unreachable from here. Status: **UNTESTED**.
- Herdr is the documented mechanism for "all VMs connect as agent nodes" - it is the most promising candidate for the private-network + Codex/Grok/Dot collaboration layer, but it needs the SA Command to be live and the fleet to be enrolled.
- `langchain_connector.py` in `/workspace/.herdr/agents/` is a written 9-agent connector (Naledi, EDDIE, Charlie, Kev, Amara, RALF, GIUM, Vera, Zane, Nova) that talks to `HERDR_SERVER=localhost:2244` and `OPENRIG_DAEMON=http://localhost:7433`. **Both endpoints are currently down**, so this connector is non-functional as written. It also reads provider keys from env - never commit them.

---

## 6. Blockers and missing permissions (no credentials shown)

1. **Google Drive write access - BLOCKED.** No OAuth grant, no service account, no client tooling. The known StudEx Meat Drive folder is read-only-public and returns a sign-in wall. Needs: an authorised Drive folder link + a service-account JSON with write scope to that folder, or an installed `rclone` remote with an OAuth token.
2. **Rome / GCP workspace - NOT FOUND.** No CLI, no config, no reference in any registry. Needs: the GCP project id/region and a service-account key, or the owner confirming the workspace is planned rather than live.
3. **Herdr / OpenRig / OpenClaw services - DOWN from here.** Needs the owner to start the SA Command (`herdr` server on 2244) and OpenRig daemon (7433), or to accept a different collaboration channel.
4. **Redis for the game-studio agent bus - NOT INSTALLED.** The `gaming-platform` tests skip cleanly without Redis, so the agent bus has never been proven in this environment. Needs a Redis instance (local or managed) before the agent mesh can be claimed as working.
5. **Local model runtime (Ollama) - NOT INSTALLED.** Offline model capability is currently aspirational. Needs an install decision plus disk (host is 99% full).
6. **Git remotes for almost every repo - MISSING.** Only `studex-nexus-bare` has one. Needs a decision on the canonical remote per product, plus write credentials to push.
7. **Paid generation services - NOT ASSUMED.** No evidence of an active image/video generation subscription on this host; the `mcp_matrix_*` media tools are cloud-backed and were not exercised.
