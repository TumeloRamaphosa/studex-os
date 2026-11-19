# CODEX-HANDOFF.md

**Purpose:** the entry point for Codex (or any coding agent) joining StudEx.
**Owner of StudEx:** Tumelo Ramaphosa. He is the only approver for consequential external actions.
**Compiled:** 2026-10-28T05:45:56Z

---

## READ FIRST, IN THIS ORDER

1. `/workspace/StudEx Agent Operations/README.md` - what this whole set is.
2. `/workspace/StudEx Agent Operations/AGENT-REGISTRY.md` - section 3 is the onboarding contract you must follow. Section 1 tells you who else is working and what they own.
3. `/workspace/StudEx Agent Operations/PRODUCT-STATUS.md` - what is real vs mockup. Do not build on a mockup without saying so.
4. `/workspace/StudEx Agent Operations/SYSTEM-INVENTORY.md` - what is running, what is blocked, and where the canonical source of truth for each repo is.
5. `/workspace/agent-access-kit/agent-access-kit/AGENT-JOIN.md` - the pre-existing canonical contract. This handoff **extends** it; it does not replace it. Its RED LINES still apply.

---

## 1. Your proposed lane

**Development Studio** - coding, testing, releases, and the CI/test spine that does not yet exist.

Your lane is `results/codex/`. Nothing else is writable to you.

You do **not** own: the registry (`studex-os/registry/`), the Obsidian vault, the game-studio agent briefs, the War Room, client folders (`igh-*`, `studex-auto-meat` client records), or credential files. You may **read** those; you may **write** only inside your lane and inside repos where you are explicitly handed `scope`.

---

## 2. How you send work to Hermes and get results back

Hermes has no inbound network listener, and none will be exposed. Use the file queue plus the MCP bridge.

### 2.1 File queue (durable task IDs - the primary channel)

```
/workspace/StudEx Agent Operations/.queue/
  INBOX/    <- you write TASK-<YYYYMMDD>-<slug>.md here
  OUTBOX/   <- you read RESULT-<task_id>.md from here
```

**Request template - `TASK-20261028-example.md`:**

```markdown
---
task_id: TASK-20261028-example
owner: codex
status: ACCEPTED
scope: Build X. Out of scope: Y, Z.
inputs:
  - /workspace/gaming-platform/orchestrator/roster.py
acceptance_criteria:
  - "pytest tests/test_platform.py exits 0"
  - "no import of redis at module scope outside storage/pipeline.py"
never_touches:
  - /workspace/studex-os/registry/
  - /workspace/studex-os/obsidian/
deadline: 2026-11-01
---

## Notes
Free text for the coordinator.
```

**Result template - `RESULT-TASK-20261028-example.md`:**

```markdown
---
task_id: TASK-20261028-example
status: DONE
evidence: "pytest exited 0; output at /workspace/.../pytest-out.txt"
artifacts:
  - /workspace/gaming-platform/orchestrator/roster.py
cost: not measured
completed_at: 2026-10-28T12:00:00Z
---

## What changed
## How to verify
## What I did NOT do
```

### 2.2 MCP bridge (context read/write - secondary channel)

Already running and working: `/workspace/studex-os-pack/mcp-bridge/studex_mcp_bridge.py`

Seven tools: `studex_list_files`, `studex_read_file`, `studex_write_file`, `studex_search`, `studex_get_status`, `studex_leave_message`, `studex_read_inbox`.

- `studex_get_status` reads `bridge/STATUS.md` - the current operational status. **Poll this at the start of every session.**
- `studex_leave_message` writes to `bridge/inbox/from-<your-name>.md` - use it for short questions and status pings, not for full task payloads.
- Your results lane is `results/codex/`.

### 2.3 The handshake

Your first message must be exactly: `CONNECTED as codex, ready` - written to `bridge/inbox/from-codex.md`. This is the existing `AGENT-JOIN.md` requirement and the coordinator uses it to enrol you. **Do not skip it.** Do not send it until the owner has approved onboarding.

### 2.4 If you need a decision

Put the question in your task file under `## Open questions` and leave a bridge message. Do not block indefinitely: if the question is not answered within one coordinator cycle, mark the task `BLOCKED` with the question recorded, and move to the next task. Escalation ladder: **you -> Hermes (coordinator) -> Tumelo (owner)**.

---

## 3. Rules you must follow

1. **One owner per task.** Never accept or create a task with two owners.
2. **Never grant yourself permissions.** Permission and access changes are the owner's action.
3. **Never approve your own consequential external action.** These are forbidden without explicit owner approval, in writing, for that specific task: `publish`, `email_customer`, `call_blotato`, `edit_shopify`, `provision_vm`, `deploy_production`, `settle`. (Source: `gaming-platform/orchestrator/hermes.py` `FORBIDDEN_ACTIONS`.)
4. **Never read or write credential files.** `~/.hermes/.env`, `~/.studex/meta.env`, `*.pem`, `*.key`, `*.json` service-account files, and anything with `SERVICE_ACCOUNT` / `API_KEY` / `SECRET` in the name. Read the **variable name** if you need it, never the value.
5. **Never write into a client workspace** unless a task explicitly names it as an input.
6. **Commit or state it.** Every change you make must either be committed to a repo with a remote, or listed in your result's `artifacts`. Currently most repos have **no remote** - so if you are assigned a repo, ask for the canonical remote before you rely on git for anything.
7. **Evidence, not assertion.** "It works" is not evidence. A command, an exit code, an artefact path, a test output - that is evidence.
8. **Do not touch the PayFast key.** It is currently exposed client-side (see `PRODUCT-STATUS.md` defect 1). Do not propagate it. Do not publish the War Room app until the owner confirms rotation.
9. **Do not touch `gods-eye-view`** as a StudEx product - it is third-party upstream (`bilawalsidhu/gods-eye-view`).
10. **Do not deploy to production** without explicit owner approval per task.

---

## 4. The repo landscape you will land in

Most of the workspace has **no git remote**. Only `studex-nexus-bare` -> `github.com/TumeloRamaphosa/studex-nexus.git` does. `Meetings--coms` -> `github.com/TumeloRamaphosa/Meetings--coms` and `robusca-brain` -> `github.com/TumeloRamaphosa/robusca-brain` exist upstream but have no working tree remote in place.

The three places you are most likely to be useful:

| Where | Why | State |
|---|---|---|
| `/workspace/gaming-platform` | Real agent bus, roster, protocol, orchestrator, tests, vault. The only place with a genuine multi-agent architecture. | Bus cannot run (no redis/pytest) - you would be the one who makes it run. |
| `/workspace/studex-command-center` | Next.js command centre with real screens. | No test/CI spine. |
| `/workspace/openrig` | The bridge to Claude Code / Codex coding agents. Daemon unreachable at :7433. | Bringing this up is a high-leverage, low-ambiguity task. |

Do not start with the Oracle-brain / War Room repo until the owner decides where its canonical remote is.

---

## 5. Tools available to you

- Full read of `/workspace`.
- Write inside your lane (`results/codex/`) and inside repos where a task grants `scope`.
- Shell, Python, Node, git, `npm`/`pnpm`.
- Network egress to public APIs (Vercel, GitHub, Telegram, Meta Graph, Orgo, AgentMail - all confirmed reachable 2026-10-28).
- Deploy tooling is present but **production deploys need owner approval per task**.

Not available: Google Drive access, GCP/gcloud, Tailscale binary, Redis, Ollama, a Herdr binary, an OpenRig daemon, a pytest install. If you need any of these, that is a request to the coordinator, not something you install silently.

---

## 6. The first three things worth doing

1. **Bring `gaming-platform` tests to green.** Install/enable Redis and pytest, run `tests/test_platform.py`, report honestly what passes and what skips. Highest proof-value, lowest ambiguity.
2. **Stand up OpenRig (:7433)** so Codex and Claude Code can actually be driven from this workspace.
3. **Add a CI spine** to `studex-command-center` / `gaming-platform` - lint, test, build on every commit, with results written to your lane.

Each of these should be filed as a task with a `task_id` from the coordinator (Hermes) before you start. If you are being onboarded directly by the owner, file it yourself with `owner: codex` and `status: ACCEPTED`, and leave a bridge message so the coordinator knows it exists.
