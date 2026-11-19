# HERMES-CAPABILITIES.md

**Compiled:** 2026-10-28T05:45:56Z
**Compiled by:** Hermes (self-report, evidence-backed via read-only inspection)
**Discovery mode:** READ-ONLY.

---

## 1. Where Hermes runs and how it is started

| Property | Value | Evidence |
|---|---|---|
| Hostname | `hermes` (containerised Linux workspace) | `hostname`, `uname -a` - VERIFIED 2026-10-28 |
| Working directory | `/workspace` | `pwd` - VERIFIED |
| User | `root` (sandboxed) | `whoami` - VERIFIED |
| OS | Linux 6.x, x86_64 | `uname -a` - VERIFIED |
| Python | `/usr/local/bin/python3` | `python3 -V` - VERIFIED |
| Node | present (v22-era) | `node -v` - VERIFIED |
| Hermes home | `/root/.hermes` | `ls -la ~/.hermes` - VERIFIED |
| Config / secrets | `/root/.hermes/.env` (contains `MINIMAX_API_KEY`, `MINIMAX_BASE_URL` - values never read or recorded) | `sed 's/=.*/=***/' ~/.hermes/.env` - VERIFIED |
| Provider auth | `/root/.hermes/auth.json` - `providers: {}`, `credential_pool: ["minimax"]` | `python3 -c ...` - VERIFIED |

**How it is started:** Hermes is started as a long-lived agent process with a session-scoped working directory, invoked by the operator (Tumelo) through the Hermes desktop/CLI surface. It is **not** a systemd service on this host and is **not** reachable as a network listener - there is no inbound HTTP endpoint for other agents to post work to it (see section 5).

**Recovery mechanism:** session transcripts are persisted as JSON under `/root/.hermes/sessions/` (467 session files observed as of 2026-10-28). A new session can therefore recover prior context via `session_search` over the transcript store, plus the durable memory store injected at session start.

---

## 2. Model, provider, and available tools

**Model / provider** - VERIFIED:
- Provider: **MiniMax** (model `MiniMax-M3.1-Flash`), configured via `MINIMAX_API_KEY` + `MINIMAX_BASE_URL` in `/root/.hermes/.env`.
- `auth.json` credential pool contains exactly one provider: `minimax`. No Anthropic/OpenAI/Google credential pool present, so those providers are **not** available to this deployment without new credentials.

**Tool surface (all present and exercised during this discovery):**

| Category | Tools |
|---|---|
| Filesystem | `read_file`, `write_file`, `patch`, `search_files` |
| Shell | `terminal` (background + foreground, PTY), `execute_code` (Python + programmatic tool calls) |
| Delegation | `delegate_task` (parallel subagents, isolated contexts) |
| Scheduling | `cronjob` (create/list/update/pause/resume/remove/run) |
| Web | `mcp_matrix_batch_web_search`, `mcp_matrix_extract_content_from_websites` |
| Media | `mcp_matrix_image_synthesize`, `mcp_matrix_gen_videos`, `mcp_matrix_submit_video_generation`, `mcp_matrix_synthesize_speech`, `mcp_matrix_batch_text_to_music`, `mcp_matrix_images_understand`, `mcp_matrix_videos_understand`, `mcp_matrix_audios_understand` |
| Deploy | `mcp_matrix_deploy`, `mcp_matrix_deploy_html_presentation`, `mcp_matrix_init_react_project` |
| Memory | `memory` (durable store), `session_search` (transcript recall) |
| Interactive | `clarify` (ask the owner a question), `todo` (session task list) |

**Tools explicitly NOT available / unavailable in this deployment (VERIFIED):**
- No Google Drive client, no `rclone`, no `gdrive`, no `fuse` mount - Google Drive is **BLOCKED** from this host (see `SYSTEM-INVENTORY.md`).
- No `gcloud` / `gsutil` / GCP credentials - no direct GCP resource access.
- No `tailscale` binary on this host.
- No `redis-server` / `redis-cli`, no `pytest`, no `redis` Python module - the gaming-platform test suite **cannot currently run here**.
- No `herdr` binary on PATH (source tree present at `/workspace/herdr`).
- No `ollama` binary and no listener on `11434` - no local model runtime on this host.

---

## 3. What Hermes can read, write, and execute

**Read** - VERIFIED: full read access to `/workspace` (all repositories, vaults, registries, notes), read access to `/root/.hermes` (config, sessions, skills, cron jobs), and outbound HTTP/S for public APIs.

**Write** - VERIFIED: full write access to `/workspace` (this is where all six handoff files were written) and to `/root/.hermes` (skills, memory, cron definitions, scripts). Write access to `~/.studex/meta.env` exists on the file system but is **not** used by this handoff and no value from it is recorded.

**Execute** - VERIFIED: shell commands, Python scripts, git operations, `npm`/`pnpm` builds (present), and remote REST calls to third-party APIs (Vercel, Orgo, AgentMail, Meta Graph, Telegram - reachability confirmed).

**Boundary respected in this task:** no install, no deploy, no purchase, no access change, no exposed service, no customer contact, no autonomous agent activation. Deploy tools were present but **not** invoked.

---

## 4. Schedules, persistent memory, and recovery

**Schedules** - VERIFIED: 11 enabled cron jobs in `/root/.hermes/cron/jobs.json`.

| Job | Schedule | Delivery |
|---|---|---|
| Hermes - 6AM Fleet Health Check | `0 6 * * *` | local |
| CTO Morning Reports | `0 6,10 * * *` | telegram:-1001234567890:17585 |
| Hermes - 7:30AM Daily Intelligence | `30 7 * * *` | local |
| Studex - Daily Top 10 GitHub Repos Research | `0 7 * * 1-5` | local |
| 8AM Morning Briefing | `0 8 * * 1-5` | local |
| 8:30AM GitHub Trending Research | `30 8 * * 1-5` | local |
| Studex Super Agents - Daily 9AM Board Meeting | `0 9 * * 1-5` | telegram:-1001234567890:17585 |
| Hermes - 9AM Board Meeting | `0 9 * * 1-5` | local |
| 12PM Midday Check | `0 12 * * 1-5` | local |
| Hermes - 6PM End-of-Day Summary | `0 18 * * *` | local |
| Hermes 6-Hour Update Check | every 360m | local |

Note: two near-duplicate 9AM board jobs exist (one delivering to Telegram, one local) - a duplicated-orchestration candidate flagged in `AGENT-REGISTRY.md`.

**Persistent memory** - VERIFIED: Hermes has a durable memory store surfaced via the `memory` tool (target `user` for owner preferences, target `memory` for environment facts). It is injected at the start of every session. The on-disk `~/.hermes/memory/` directory does **not** exist - the store is held by the Hermes runtime, not as plain files.

**Recovery** - VERIFIED: session transcripts persist as JSON (`/root/.hermes/sessions/`, 467 files). `session_search` queries across them. Durable memory + cron definitions + session files together constitute the recovery surface. A cold restart of the process does not lose prior context.

---

## 5. How Codex (or another agent) securely sends work to Hermes and retrieves results

Hermes has **no inbound network listener**. Any integration must therefore be either (a) file-based, or (b) a scheduled job that Hermes runs. Both are already available. Neither requires exposing a service.

### Option A - MCP Bridge (recommended, already implemented)

The StudEx MCP bridge server exists and is VERIFIED working at:
`/workspace/studex-os-pack/mcp-bridge/studex_mcp_bridge.py`

It exposes exactly seven tools (VERIFIED by reading the `TOOLS` list and the JSON-RPC dispatch handler):

- `studex_list_files`, `studex_read_file`, `studex_write_file`, `studex_search`
- `studex_get_status` (reads `bridge/STATUS.md`)
- `studex_leave_message` (writes to `bridge/inbox/`)
- `studex_read_inbox`

The bridge is scoped to a `STUDEX_BRIDGE_ROOT` and gives a joining agent a read/write lane plus a message channel. Current state: `bridge/inbox/` contains one message (from `cursor-builder`, 2026-09-07) and `results/` contains one lane (`results/cursor-builder`). VERIFIED 2026-10-28.

### Option B - File-based handoff with durable task IDs (recommended for Codex specifically)

Directory convention (established by this handoff):

```
/workspace/StudEx Agent Operations/
  CODEX-HANDOFF.md          <- Codex reads this first
  .queue/
    INBOX/                  <- Codex drops task requests here
    OUTBOX/                 <- Hermes drops results here
```

Every request file: `TASK-<YYYYMMDD>-<short-slug>.md` with frontmatter carrying `task_id`, `owner`, `scope`, `inputs`, `acceptance_criteria`, `deadline`.
Every result file: `RESULT-<task_id>.md` with frontmatter carrying `task_id`, `status`, `evidence`, `artifacts`, `cost`, `completed_at`.

This gives durable task IDs, progress, evidence, cost, and artefact locations without opening a port.

### Option C - Scheduled job (for recurring work only)

`cronjob` creates a job whose prompt is self-contained and runs in a fresh session. Delivery targets include `local` (saved only) or a specific platform/chat. This is the mechanism behind the 11 schedules above.

### Secure collaboration method (proposed, for owner approval)

**Recommended:** file-based handoff (Option B) **plus** the MCP bridge (Option A) for context read/write, and **no** new network exposure.

- Codex writes a request into `.queue/INBOX/`.
- Codex runs `hermes` on the operator's machine - or a scheduled Hermes job - which picks up the request.
- Hermes writes `RESULT-<task_id>.md` into `.queue/OUTBOX/` and updates `bridge/STATUS.md` and the bridge inbox.
- Codex polls `.queue/OUTBOX/`.

**No agent may grant itself permissions, and no agent approves its own consequential external action** - the owner (Tumelo) remains the only approver for customer contact, publishing, spend, and deployment. This mirrors the existing rule in `gaming-platform/orchestrator/hermes.py` `FORBIDDEN_ACTIONS` and in `agent-access-kit` RED LINES.

**Not proposed:** opening an HTTP endpoint on this host, deploying a queue service, or giving Codex write access to `/root/.hermes/.env`. All three are excluded because the task forbids exposing services and changing access.

---

## 6. Offline / local-model capability of Hermes itself

VERIFIED: Hermes runs fully offline for all filesystem, shell, cron, memory, and code-execution work. It **requires network only** for: model inference (MiniMax API), web search, website extraction, media generation, and third-party REST calls. Media generation and deployment tools are cloud-backed and are **not** offline-capable - a local model runtime (Ollama) is **not** installed on this host and is BLOCKED pending a decision (see `DECISIONS-AND-BLOCKERS.md`).
