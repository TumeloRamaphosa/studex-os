# DECISIONS-AND-BLOCKERS.md

**Compiled:** 2026-10-28T05:45:56Z
**Everything here needs Tumelo.** Nothing here was decided or actioned during this discovery.

---

## PART A - BLOCKERS (technically cannot proceed without something from you)

### A1. Google Drive write access - BLOCKED
**Evidence (2026-10-28):** no `rclone`, `gdrive`, `rclone.conf`, `fuse` mount, or OAuth/service-account file anywhere on the host. `GET https://www.googleapis.com/drive/v3/files` -> HTTP 403. The known StudEx Meat folder (`1xWpBqvEknMn6PyzbI1RqKUgaK1Ub9OpZ`) returns HTTP 200 but the body is `Sign in` / `not found` - a wall, not content.

**What unblocks it (choose one):**
- (a) A Google service-account JSON with write scope to that one folder, plus the folder shared to the service account's address. Fastest and most contained.
- (b) An installed `rclone` remote with an OAuth token.
- (c) Stop using Drive as the handoff destination and use the Obsidian vault + the file queue instead. **This costs nothing and is what I did for this handoff.**

**My recommendation:** (a) if Drive is genuinely the destination; (c) if it is not. Right now the files live in the Obsidian vault at `/workspace/studex-os/obsidian/` plus this folder.

### A2. "Rome" workspace - NOT FOUND
**Evidence:** no `gcloud`, no `gsutil`, no `~/.config/gcloud`. A grep across `/workspace` for `rome` found only noise (`from`, `chrome`, `room`). No Rome reference in any registry, vault note, or config.

**What unblocks it:** the GCP project id and region, plus a service-account key. Or confirm that Rome is planned rather than live - in which case it should be struck from the mental model, because right now it is an assumption nobody has verified.

### A3. Herdr SA Command + OpenRig daemon - DOWN
**Evidence:** `http://127.0.0.1:2244/health` (and fleet-config target `10.0.0.1:2244`) -> no response. `http://127.0.0.1:7433/healthz` -> empty. No `herdr` binary on PATH (source at `/workspace/herdr`). No `openclaw` process and no `*.service` unit in `/workspace/openclaw-os`.

**Consequence:** `/workspace/.herdr/agents/langchain_connector.py` - the 9-agent connector (Naledi, EDDIE, Charlie, Kev, Amara, RALF, GIUM, Vera, Zane, Nova) - cannot reach either endpoint and is **non-functional as written**. The private-network layer that your whole "all VMs connect as agent nodes" plan depends on is currently dark.

**What unblocks it:** start the SA Command on the Orgo Super Agents VM (port 2244) and the OpenRig daemon (7433), or approve an alternative collaboration channel (the file queue in `CODEX-HANDOFF.md` already works and needs nothing).

### A4. Redis for the game-studio agent bus - NOT INSTALLED
**Evidence:** `redis-server` and `redis-cli` not found; the `redis` Python module is not importable; `pytest` is not installed. `gaming-platform/tests/test_platform.py` would skip rather than pass.

**Consequence:** the 7-agent game-studio fleet has **never been proven to run**. The code and governance are good; the runtime is missing.

**What unblocks it:** a Redis instance (local or managed) and `pytest`. Both are small installs that I did not perform because this task forbade installs.

### A5. Local model runtime (Ollama) - NOT INSTALLED
**Evidence:** no `ollama` binary, nothing listening on `11434`.

**Consequence:** offline/local-model capability is aspirational. Note the host disk is **99% full** (926GB volume), so any local model install needs a disk-clean decision first.

**What unblocks it:** a disk cleanup decision, then an install decision, then a model choice.

### A6. Git remotes - MISSING for ~60 of ~65 repos
**Evidence:** looped `git remote get-url origin` over every top-level directory in `/workspace`. Only `studex-nexus-bare` -> `https://github.com/TumeloRamaphosa/studex-nexus.git` returned a remote. Everything else: `NO_GIT`.

**Consequence:** for almost every product there is no canonical remote, no commit history, no audit trail, and no rollback. This is the single biggest structural gap for an agent fleet - an agent that cannot commit to a remote is an agent that cannot be reviewed.

**What unblocks it:** a decision on the canonical remote per product, plus write credentials to push. There are ~65 candidates; I need you to name which products are real and which are archive.

### A7. Paid generation services - NOT ASSUMED
**Evidence:** no subscription credential found for image/video generation on this host. The `mcp_matrix_*` media tools are cloud-backed and were deliberately **not** exercised.

**What unblocks it:** confirm which generation provider is paid for and active (the `grok-xai-media-api` skill path appears to be the intended one), and confirm the budget ceiling.

---

## PART B - DECISIONS ONLY YOU CAN MAKE (no technical blocker)

### B1. The four studios - which are real?
The evidence splits them:
- **Game Studio** - genuine code skeleton (`gaming-platform`): orchestrator, roster, protocol, storage pipeline, Global Markets bridge, Obsidian vault, tests. Missing: runtime + any shipped work.
- **Development Studio** - real front-ends (`studex-command-center`, `mission-control`, `openrig`), no test/CI spine.
- **Media Studio** - mostly intent (`studex-trending-research` is real code; `gods-eye-view` is third-party upstream, not yours).
- **Business Operations Studio** - the War Room; 14 tabs of real UI, 8 workflow skills, 42-agent fleet described, but not running and not committed to a remote.

**Decision needed:** which studio each of Codex, Grok, and Dot owns, and what the first deliverable of each is. `Dot` in particular has no defined role anywhere in the registry or vault.

### B2. Codex, Grok, Dot - onboard, and on what terms?
Proposed lanes in `AGENT-REGISTRY.md` section 3.4:
- Codex -> Development Studio (coding, tests, releases)
- Grok -> Media Studio (campaigns, images, video, SEO) - needs a Robusca invite per your note
- Dot -> Business Operations (client work, pipeline) - role undefined, needs one

**Decision needed:** approve or amend the lanes, and confirm the connection method (file queue + MCP bridge, no new services exposed).

### B3. Consolidate the duplicate schedules
Two 9AM board jobs and two GitHub-trending jobs in `/root/.hermes/cron/jobs.json`. **Decision needed:** which to keep, and which delivery target (Telegram vs local) is correct. I have not touched any job.

### B4. Correct the registry contradictions
- `registry/apis.json` says Stitch = `WORKING`; `registry/clients.json` and the War Room say Stitch NOT_USED and PayFast live. **I resolved this in favour of PayFast** in `PRODUCT-STATUS.md` - confirm, and I will correct the JSON.
- `registry/agents.json` says WhatsApp `ACTIVE`; `registry/apis.json` says `PENDING_KEYS`. Which is true?
- `registry/agents.json` says Orgo `mcp_status: BROKEN`. Confirmed - the Orgo API responds `{"error":"Authentication required"}` and the MCP path is dead. Which credential restores it?

### B5. Knowledge source of truth
Three stores: the **Obsidian vault** (working, in-repo, git-less), **Notion** (no connector found here), and the **Google Drive** meat drive (read-only, blocked). Plus the `gaming-platform` game vault.
**Decision needed:** a declared order of authority, and whether Notion is in or out.

### B6. Which knowledge system is the war room's source?
The War Room has `/vault` and `obsidian-brain.jsx`; the OS has an Obsidian vault; the game studio has its own vault. **Decision needed:** one canonical vault, with the others as read-only mirrors.

### B7. Fix the PayFast credential leak - this one is time-sensitive
`Payments.tsx` in the War Room embeds the PayFast merchant key in client-side code. That key is now public to anyone who loads the page.
**Decision needed:** approve key rotation and a server-side fix. I have deliberately not touched the file or the key.

### B8. Client workspace separation - approve the standard
Proposed standard, matching the existing Buzz per-client split: an agent working Infinite Growth Haven must not read Studex Meat client data, and vice versa. Client records never get pasted into shared folders; agents write their output to their own lane and the owner publishes.
**Decision needed:** approve, and tell me which agents are client-facing.

### B9. The `hermes` naming collision - rename?
`hermes` currently means: (1) this cloud instance, (2) the `gaming-platform` fleet orchestrator, (3) the `gaming-platform` roster entry, (4) the "Hermes fleet - 42 cloud agents" in `AGENT-JOIN.md`. Four different things, one name.
**Decision needed:** rename three of them, or accept the ambiguity deliberately. I recommend renaming the game-studio one (e.g. `game-hermes`) and the 42-agent one (e.g. `saas-fleet`).

### B10. Merge the overlapping orchestrators
`gaming-platform/orchestrator/`, `agent-orchestrator/`, `agentic-os/`, and `robusca-brain` all claim coordination. **Decision needed:** which is the coordinator of record for what. My recommendation: Hermes is the single coordinator; the others become domain-scoped workers that file tasks rather than routing tasks.

### B11. Drive, Git, or Obsidian as the code handoff location?
For Codex specifically. Options: (a) Drive (blocked today), (b) GitHub - make the repos real and push (fixes A6 at the same time), (c) the Obsidian vault + file queue (works today, no dependency).
**Decision needed:** pick. My recommendation is (c) now, (b) as the destination once remotes exist, and treat Drive as a mirror.

### B12. Do you want a real first deliverable this week?
Concretely available now, with no blocker:
- Bring `gaming-platform` tests to green (needs Redis + pytest - small, and needs your go-ahead to install).
- Stand up OpenRig on :7433 so Codex and Claude Code are drivable from this workspace.
- Add a CI spine to `gaming-platform` + `studex-command-center`.
- Fix the PayFast leak and rotate the key.
**Decision needed:** which one, or something else.

---

## PART C - WHAT I DID NOT DO (deliberately)

Because the instruction was read-only discovery with no installs, deploys, purchases, permission changes, customer contact, or autonomous activation:
- No software installed (no Redis, no pytest, no Ollama, no `herdr`, no gcloud, no rclone).
- No deployment of any kind (the `mcp_matrix_deploy` tools were available and were not used).
- No account, key, credential, or subscription purchased or changed.
- No permission or access changed anywhere.
- No service or port exposed; nothing listening was started.
- No agent messaged, invited, connected, or activated. Grok was not invited to Robusca. Codex was not installed or started.
- No customer contacted. No email, message, or post sent.
- No credential value read out of any `.env`, `auth.json`, `meta.env`, or key file.
- No cron job created, paused, resumed, or removed.
- No file outside `/workspace/StudEx Agent Operations/` (plus a read-only clone at `/tmp/robusca-brain`) was modified.
