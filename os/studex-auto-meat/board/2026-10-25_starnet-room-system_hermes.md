# Starnet-Style Room System — DRAFT (Hermes proposal)

Status: DRAFT for Tumelo review. No credentials. No keys. Not deployed.
Prepared by: Hermes (cloud, hermes-cloud-ctf001)
Date: 2026-10-25

---

## 0. Why I am NOT proposing a new web UI (yet)

The fleet already has two working primitives. A new room web app would be a third
system doing the same job. Recommendation: **CLI-first, rooms as transport + Obsidian as state.**

Existing primitives:
- **Buzz relay** — `wss://studex-agents.communities.buzz.xyz`, already 5 rooms
  (NEST OS, Herald Station, AutoMEat, Mission Control, StudEx Bot).
  Message bus + NIP-42 auth. This is the room transport.
- **Herdr** — Rust agent runtime, Socket API, persistent sessions across machines.
  This is the room *execution surface* (each room = a Herdr session).
- **Obsidian vault** — `/workspace/studex-os/obsidian` is live and structured
  (API, Agents, Clients, Company, Integrations, Knowledge, Missions, Projects,
  System, VMs, Workflows). This is shared state, not a transport.

So: room = Buzz room + Herdr session + Obsidian folder.
Web UI later, only as a read-only observability panel over the same state.

---

## 1. Proposed rooms

| Room | Purpose | Transport | Herdr session | Obsidian folder |
|------|---------|-----------|---------------|------------------|
| `command` | Orchestration, task routing, escalations | Buzz: NEST OS | `room-command` | `Missions/` |
| `research` | Source gathering, drafts, citations | Buzz: Mission Control | `room-research` | `Knowledge/research/` |
| `content` | RALF loop, drafts, copy | Buzz: StudEx Bot | `room-content` | `Workflows/content/` |
| `approval` | Two-approval gate before anything leaves | Buzz: (new) | `room-approval` | `Missions/approvals/` |
| `posting` | Publish/schedule to approved channels only | Buzz: (new) | `room-posting` | `Workflows/posting/` |
| `infra` | GPU, storage, VM fleet, sync | Buzz: (new) | `room-infra` | `System/infra/` |
| `meat` | AutoMEat company lane, isolated | Buzz: AutoMEat | `room-meat` | `Company/meat/` |

Company lanes stay isolated. `meat` is the only room AutoMEat enters by default.

---

## 2. Agent roster per room

| Agent | Machine | Rooms | Role |
|-------|---------|-------|------|
| Robusca | cloud | command, approval | Orchestrator, routes tasks |
| Hermes | cloud | command, research, infra | Co-CTO, exec + research + fleet |
| OpenClaw | MacBook | command, content, posting | Orchestration, RALF, publishing |
| NEXUS | cloud | command, infra | Connectivity, audit |
| AutoMEat | Auto-Meat VM | meat (only) | Company peer agent |
| Bee / Bee2 | Mac Mini | research | Research workers |
| Nozi | Mac Mini | research | Research worker |
| Grok | GrokBot | content | Content/media |
| Tumelo | human | approval | **Human gate — required** |

Hard rules encoded in the roster:
- `approval` cannot be written by agents alone. Two-approval email rule applies
  to anything that leaves the system.
- `posting` agents have no permission to post to `laisa_aesthetics`.
  Hard block, not a convention.
- `meat` room: no cross-company agents without Tumelo's explicit approval.

---

## 3. Web UI or CLI?

**CLI.** Reasoning:
1. Every agent already has a runtime (Herdr) and a bus (Buzz).
2. A web UI adds auth surface, a deploy target, and a maintenance burden for
   zero new capability.
3. Tumelo's stated preference: bold design + speed. A single Black & Gold
   status board (read-only, one page, Vercel) gives the visibility without
   becoming a second control plane.

Proposed v1 CLI verbs (Herdr session wrappers on each agent box):
```
room ls
room join <room> --agent hermes
room post <room> --text "..." --file path
room watch <room>
room approve <request-id> --as tumelo
```
Room state persisted to Obsidian, one file per message:
`Obsidian/<Folder>/YYYY-MM-DD_HHMM_agent.md` (frontmatter: room, agent, ts, hash).

Black & Gold (obsidian `#0A0A0A`, gold `#C9A84C`) for any dashboard surface.

---

## 4. Prerequisites (all currently blocking)

| Prereq | State | Owner |
|---------|-------|-------|
| Hermes AgentMail inbox (`hermes@...`) | Does not exist — must be created | Tumelo |
| AgentMail API key on MacBook | Key exists cloud-side; needs to land on MacBook as env secret | Tumelo |
| OpenClaw service on MacBook | `service-not-loaded` | Tumelo |
| MacBook dispatch enabled | `dispatch_enabled: false`, `execution_enabled: false`, capability `status-only` | Tumelo |
| Tailscale node for GCP Rome VM | Rome not found in tailnet | Tumelo |
| Windows GPU PC online | `msi` offline 92d, `razor-blade` 64d, `sapien` 35d | Tumelo |
| Mac Mini | ONLINE — `projects-mac-mini` `100.112.109.40` | ready |
| Herdr server on agent boxes | not yet running | Hermes + Tumelo |

---

## 5. Rollout order

1. Tumelo creates `hermes@agentmail.to` inbox, sets routing + send policy.
2. Tumelo loads AgentMail key into MacBook env (never in repo).
3. Tumelo enables OpenClaw service + dispatch on MacBook.
4. Hermes brings up Herdr server on cloud + Mac Mini.
5. Hermes creates the three new Buzz rooms, seeds Obsidian folders.
6. Hermes registers room rosters from `registry/agents.json`.
7. Run a two-room smoke test: `command` -> `research`, one artifact each way.
8. Only then add `infra` / `posting` / `approval`.

---

## 6. Open questions for Tumelo

1. Should `approval` be a Buzz room, or a dedicated webhook that only
   `t.ramaphosa@agentmail.to` can answer?
2. Do we need `meat` visible to `command`, or strictly one-way inbound?
3. Is one Herdr server per agent box, or a single central server with remote clients?
4. Should the read-only Black & Gold board be built now, or after the CLI works?
