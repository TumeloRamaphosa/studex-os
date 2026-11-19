# Hermes → Claude Ops Integration Handover

From: Hermes (cloud, `hermes-cloud-ctf001`)
To: Tumelo / Claude Ops on MacBook
Date: 2026-10-25
Status: DRAFT — no credentials transferred, no changes made to MacBook

---

## 1. Hermes AgentMail inbox address

**There is no `hermes@agentmail.to` inbox.** I attempted to create one and was refused:

```
LimitExceededError — Inbox limit exceeded (limit 3)
Developer plan raises it to 10 for $20.00/month
https://console.agentmail.to/dashboard/upgrade
```

Existing three inboxes on the org `08cd352d-9b59-4f5f-942d-d25c01da4a19`:

| Inbox | Display name | Routing | Send policy | Status |
|-------|--------------|---------|-------------|--------|
| `t.ramaphosa@agentmail.to` | Tumelo Ramaphosa \| Studex | approvals, escalations | `human_only` | Active, has mail |
| `project-2571-studex-agent-2077@agentmail.to` | Studex Operations | studbot, hermes, infra | `review_before_send` | Active, has mail |
| `uglyrestaurant62@agentmail.to` | AgentMail | (none set) | (none set) | Active, empty, 0 messages |

**Recommendation:** `t.ramaphosa@agentmail.to` already routes `approvals,escalations`
and is `human_only` — it is the correct human gate. Use
`project-2571-studex-agent-2077@agentmail.to` for machine traffic (Hermes → agents).
Either upgrade the plan ($20/mo) to get a dedicated `hermes@` inbox, or
delete `uglyrestaurant62` (empty, 0 messages) to free a slot.

I did not delete `uglyrestaurant62` on my own — that is your inbox, not mine.

---

## 2. API authentication

**AgentMail REST API.** Key prefix `sk_live_`. Present on this cloud box at
`/workspace/user_input_files/agentmail_api_key_ejeje.txt`, owned by the
Studex org above.

For MacBook, the key must land as an **environment secret**, never in a repo,
never in `CLAUDE-OPS-SETUP.md`, never in Obsidian.

Verified working endpoints:
- `GET /v0/inboxes` → lists 3
- `GET /v0/inboxes/{id}/messages?limit=N` → returns mail
- `POST /v0/inboxes` → 403 `limit_exceeded` (hard limit, not a permission issue)

The key grants access to **all three inboxes** on the org, including
`t.ramaphosa@agentmail.to` (`human_only`). Treat it as a credential for the
whole org, not just one mailbox.

**Alternative worth considering:** AgentMail is an email-shaped API, not a
relay. For agent→agent signalling the fleet already has **Buzz**
(`wss://studex-agents.communities.buzz.xyz`) with NIP-42 auth and 5 live rooms,
and **Herdr** for session control. AgentMail is best used as the *human
approval* path, not the agent transport.

---

## 3. Current Hermes permissions / capabilities

| Capability | State | Evidence |
|------------|-------|----------|
| Terminal / shell | ✅ full, local backend, cwd `/workspace` | `terminal.backend: local` |
| File read/write/delete | ✅ full in `/workspace` and `/root` | write test passed; overlay 30G, 26G free |
| Filesystem scope | Container-local only | `df` → `overlay 30G`; **no** host MacBook mount |
| Memory / skills | ✅ read-write | `/root/.hermes/skills/`, `memories/` |
| Web search / extract | ✅ | Matrix MCP + web tools |
| Browser | configured | `browser` config block present |
| Tailscale | ✅ node live | `hermes-cloud-ctf001.tailf7273b.ts.net` → `100.86.43.28` |
| Herdr client | ❌ not installed | `herdr: command not found`; port 2244 closed |
| AgentMail | ✅ read (3 inboxes) | see §1 |
| Orgo fleet API | ✅ read + **bash exec** | `POST /api/computers/{id}/bash` works |
| Approvals | `approvals.mode: off` | no human gate on my own tool calls |
| Secret redaction | ✅ on | `security.redact_secrets: true` |
| PII redaction | ✅ on | `privacy.redact_pii: true` |

**MacBook reachability (via Tailscale SSH):**
```
studex-status  → works
studex-inbox   → works
studex-send    → works
```
But the MacBook ACL returns:
```
{"error": "Only studex-status, studex-send and studex-inbox are permitted"}
```
for any other command. So I **cannot** read `/Users/tumeloramaphosa/.openclaw/CLAUDE-OPS-SETUP.md`
directly — I can only send messages to the MacBook agent.

`studex-status` on MacBook reports:
```json
{"agent":"hermes-ctf-001","company":"group","capability":"status-only",
 "dispatch_enabled":false,"execution_enabled":false,
 "runtimes":[{"id":"hermes-local","state":"installed"},
             {"id":"openclaw-local","state":"service-not-loaded"},
             {"id":"herdr","state":"managed-context-required"},
             {"id":"openrig","state":"unavailable"},
             {"id":"mini-ollama","state":"unavailable"},
             {"id":"hermes-vm","state":"installed"}],
 "station":"reachable"}
```

**This is the single biggest blocker:** MacBook Hermes is `status-only` with
`dispatch_enabled: false`. It cannot execute anything. Claude Ops on MacBook
cannot rely on it until you flip that.

---

## 4. Hermes → GCP VM (Rome) connection status

**Rome is not connected, and I could not find it.**

- Tailnet roster (`tailscale status`): 15 nodes. Only **3 online**:
  - `projects-mac-mini` `100.112.109.40` (macOS) ✅
  - `hermes-cloud-ctf001` `100.86.43.28` (this box) ✅
  - `macbook-pro-5` ✅ (reachable, but ACL-limited)
- Every `orgo-desktop*` node is offline 42–92 days. No `rome` node.
- No `rome` reference anywhere in the Obsidian vault, `studex-os.yaml`,
  or the VM notes. The only GCP identifiers I could find are the project id
  `gen-lang-client-0728429584` and VM `studex-nexus-hub` (34.35.82.49, africa-south1-a).
- **gcloud is not installed here** and no GCP service-account key exists in
  this container, so I cannot enumerate the project to find a Rome instance.

**Orgo fleet (the actual compute fleet), all verified live via API:**

| Desktop | ID | Status |
|---------|-----|--------|
| Global Markets | `0f28f3a2-2b26-4260-bff7-262885c86c28` | running |
| Auto - Meat | `343f4c0d-137c-4e1a-bff4-8b1178db32f3` | running |
| Solo - Prenure | `57832482-9e5c-439f-9da1-6d088adc127e` | running |
| Rwanda | `1a624546-2947-4974-a6ba-6d0e246c9b46` | running |
| Neledi - CMO | `06cf4136-7847-458e-a263-508654f565bd` | running |
| Project-2571 Super Agents Command | `333de3f8-0801-430b-a541-aad458e896b5` | running |
| SGM - CLIENTS | `d95d7f15-5845-4fc6-ad12-7e3aae55e57c` | frozen |
| NTechLab-NTECHJ | `0f25104d-1243-42d5-8eec-4e9b08dbfa81` | frozen |
| Ryde 1 RSA | `c58657ad-9223-4bd5-b37c-9b897fa6cfc7` | frozen |

No desktop is named Rome. If Rome is a GCP instance outside Orgo, I need its
name/IP and a way in.

---

## 5. File read / write / delete / cache permissions

| Level | Result |
|------|--------|
| Read | Full — any file the container can see |
| Write | Full — verified by write test in `/workspace` |
| Delete | Full — no confirmation gate (`approvals.mode: off`) |
| Cache | `/root/.hermes/audio_cache`, `/root/.hermes/image_cache`, `/root/.hermes/state.db` (+ `-shm`/`-wal`), `/root/.hermes/sessions/` |
| Size | overlay 30G, 2.0G used, 26G free |
| Scope | **Container-local.** Nothing shared with MacBook. |
| Secrets | `redact_secrets: true`, `redact_pii: true` — but raw secrets still exist on disk and in `~/.env` files |

**Important for Claude Ops:** there is **no shared filesystem** between this
cloud Hermes and your MacBook. "Shared state" must come from Obsidian vault
(synced via git or Tailscale) or the Buzz relay — not from a mount.

---

## 6. Blocker summary — what I need from you

| # | Blocker | Needed from Tumelo |
|---|---------|--------------------|
| 1 | No `hermes@` inbox | Upgrade AgentMail ($20/mo) **or** approve deleting `uglyrestaurant62` to free a slot |
| 2 | AgentMail key not on MacBook | Load `sk_live_…` into MacBook env as a secret (not in repo/notes) |
| 3 | MacBook Hermes is status-only | Enable `dispatch_enabled` + `execution_enabled` and give OpenClaw a runtime |
| 4 | OpenClaw `service-not-loaded` | Load the OpenClaw service on MacBook |
| 5 | Herdr not installed | Approve install (`curl -fsSL https://herdr.dev/install.sh \| sh`) on cloud + Mac Mini |
| 6 | Rome VM unknown | Provide hostname/IP + region + access method, or confirm Rome is a GCP instance and give me credentials |
| 7 | GPU PC offline | Bring `msi` / `razor-blade` / `sapien` back online |
| 8 | Obsidian vault sync mechanism | Confirm: git sync (Daytona pattern) or Tailscale+Syncthing? |

---

## 7. What I will do the moment you unblock

1. Bring up Herdr server on cloud (`herdr` → port 2244) and register Mac Mini as agent node.
2. Create Buzz rooms per the Starnet design, seed Obsidian folders.
3. Register room rosters from `registry/agents.json`.
4. Run the `command` → `research` two-room smoke test.
5. Report hostname, connections, roster, and red flags.

No keys written to the Obsidian vault, no files changed on the MacBook, no
AgentMail inbox deleted, no posts to `laisa_aesthetics`.

---

## 8. Attached file (the one you asked for)

Room system design: `2026-10-25_starnet-room-system_hermes.md`
Location: `studex-auto-meat/board/` (also staged locally at
`/workspace/studex-auto-meat/board/2026-10-25_starnet-room-system_hermes.md`)

Answering your three questions directly:

1. **Rooms:** `command`, `research`, `content`, `approval`, `posting`, `infra`, `meat`
2. **Agents per room:** see roster table in the file. Tumelo is the sole human
   gate on `approval`. AutoMEat is confined to `meat`.
3. **Web UI or CLI:** **CLI.** Buzz (transport) + Herdr (execution) + Obsidian
   (state). A web UI only later, read-only, Black & Gold, as an observability
   panel — not a second control plane.

Recommend a single Black & Gold read-only status board on Vercel. No separate
"Starnet" platform.
