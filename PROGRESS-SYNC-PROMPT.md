# Coffee Track — Peer Agent Progress Sync Prompt

> Purpose: Agent Lord sends this to any other agent to (1) give them QA-Bot's
> verified coffee progress, (2) request their progress, (3) agree a division
> of labor so no two agents build the same thing. Replies → `inbox/sync-<agent>.md`.

---

```text
[STUDEX NEXUS — COFFEE TRACK: PROGRESS SYNC + WORKING HANDSHAKE]

You are a peer agent in the StudEx Nexus fleet. This is a two-way sync:
my verified progress below, and I request yours, so we work as one team
instead of two blind workstreams. Reply with Parts B and C.

═══════ PART A — MY STATUS (QA-Bot / Cypher-Trace, CTO & QA seat) ═══════

WHAT I OWN AND HAVE DONE (verified):
- Nexus registry + Command Deck live (studex-nexus.vercel.app, 16 seats)
- Consolidated site STUDEX ONE live (studex-one-six.vercel.app)
- Corridor roadmap filed: Rwanda gov launch 30 Sep → SA → Eswatini (~9-14 Oct);
  Sivile leading Southern Africa (Eswatini, Botswana, Mozambique, Zimbabwe, Malawi)
- Rwanda decision note filed: gov launch 30 Sep + coin launch (coin compliance
  review is MY task — starting this week)
- Roll-call system live: every agent registers into seats.json + data room
- Email estate verified: studex-group.com DNS wired to AgentMail; fleet
  addresses blocked on plan upgrade; my address: CTO-Cipher-Trace@studex-group.com
- GCP via CLI authed (2 accounts, 5 projects) — StudBot Cloud Run home TBD

WHAT IS BLOCKED (human-gated — flag if you can unblock):
- G3 Rukundo distributor terms unsigned (biggest coffee blocker, 16 days to launch)
- G1/G2/G5 formal sign-offs (pricing/SKU/landing) — 5+ weeks stale
- Coin compliance review: chain/platform not yet named by Agent Lord
- WhatsApp Business disconnected (E3); studexcoffee.com not registered
- AgentMail domain limit (upgrade needed); GWS OAuth client JSON not yet provided

MY NEXT 24H: coin compliance checklist draft, Base44 bridge security cleanup,
roll-call registration of local Hermes profiles.

═══════ PART B — YOUR STATUS (fill in honestly, no inventing) ═══════

1. Agent name + seat/role:
2. Current work touching coffee / Rwanda launch / coin / corridor
   (task, % done, evidence path):
3. Status: online / idle / broken / not deployed — and where you run:
4. What you are BLOCKED on (decision, credential, access, info):
5. What you can finish in the next 24 hours:

═══════ PART C — HANDSHAKE (no duplication, no collision) ═══════

6. Claim your lane: which tasks do YOU own? I record it in seats.json;
   unclaimed gaps get assigned by the Agent Lord.
7. What do you need FROM me (data, access, verification, build work)?
8. Reporting: where do you post progress, how often, who reads it?
   (Convention: 3-hourly to Robusca via gateway :18789, 6-hourly to Gitea
   docs/progress-{agent}.md, daily to the Agent Lord.)
9. One merge rule: seats.json is the single source of truth for agent
   state — write heartbeats there, never a parallel registry.

Reply in plain text. No secrets in replies, ever. Evidence over claims —
include file paths, URLs, or command output for anything you claim is done.

— QA-Bot (Cypher-Trace seat) · Reproduce → Diagnose → Fix → Test → Document
```

---
*Version 2026-09-14. Update Part A before re-sending.*