# STUDEX NEXUS — DELEGATION PLAN (Who Does What)

> **Owner:** Agent Lord (Tumelo Ramaphosa)
> **Date:** 2026-09-13
> **Rule:** One seat = one clear ownership. No overlap, no orphaned work.

## Phase 0 — Foundation (build the backbone first)

| Seat | Agent | Owns | First deliverable |
|------|-------|------|-------------------|
| OS KERNEL | OS KERNEL | `seats.json`, file system, heartbeats | Live registry + heartbeat loop |
| CLOUD ORCHESTRATOR | CLOUD ORCHESTRATOR | Docker, GCP, Tailscale mesh | Bring 99.99% ICVMS uptime |
| CLAUDIO-CTO | CLAUDIO-CTO | Cloud Run + Firestore, POPIA | Secure scalable backend |
| DELIVERY | DELIVERY | CI/CD → GCP | GitHub push auto-deploys |
| HERMES | HERMES | Ollama routing, token budget | Zero-latency local inference |

## Phase 1 — Operations & Money

| Seat | Agent | Owns |
|------|-------|------|
| COFFEE | COFFEE | Runbooks, GCP budget (<R500), cost alerts |
| CRYPTOPIA | CRYPTOPIA | Cross-border payments, SAHPRA/NAFDAC blockchain |
| CASHCLAW* | CashClaw | Stripe invoicing, payments (existing Buzz agent) |

## Phase 2 — Clients & Growth

| Seat | Agent | Owns |
|------|-------|------|
| KATJANA | KATJANA | Inbound leads, WhatsApp/email qualification |
| BOHLALE | BOHLALE | Client onboarding, Obsidian deployment docs |
| NALEDI | NALEDI | Content calendar, B2B campaigns |
| CONTENT | CONTENT | Long-form docs, blog, video scripts |
| INFULENCIAL | INFULENCIAL | Sentiment, competitor intel, partnerships |
| PRODUCT | PRODUCT | Stud-Bot + Dark Factory roadmap (R2,599/mo value) |

## Phase 3 — Intelligence & Command

| Seat | Agent | Owns |
|------|-------|------|
| LLM ENGINEER | LLM ENGINEER | Muse Glimmer 30B fine-tune datasets |
| ADAM SMASHER | ADAM SMASHER | Fleet health, prompt-injection scan, memory-leak hunt |
| ROBUSCA | ROBUSCA | Coordinate fleet, War Room schedule, filter noise for Agent Lord |

## Existing agents (from OpenClaw) — already wired, keep them

- **Nikita** — Chief Orchestrator (kimi-coding/k2p6)
- **Kato** (Sales), **Zara** (Social), **Amara** (Market Intel), **Lux** (Creative) — deepseek-v4-pro
- **Buzz fleet (7):** Robusca-Prime, OpenClaw, Goose, Naledi, CashClaw, Auto-Meat, Cypher-Trace — ollama/qwen2.5-coder:7b

## Reporting cadence

| Frequency | Agent | Action |
|-----------|-------|--------|
| Every 3h | all | Report to Robusca via gateway bridge (18789) |
| Every 6h | all | Push progress to Gitea (`docs/progress-{agent}.md`) |
| Daily 07:00 SAST | OpenJarvis | Morning digest (voice TTS) |
| Daily | OS KERNEL | Vault sync to Gitea |

---
*CASHCLAW already exists in the Buzz fleet — the COFFEE seat focuses on *infrastructure* ops, CashClaw on *payments*. No collision.
