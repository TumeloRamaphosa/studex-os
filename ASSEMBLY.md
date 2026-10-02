# StudEx Nexus — Assembly Plane

Date: 2026-10-02
Owner: Tumelo Ramaphosa
Status: shipped. Engine, Orgo desks, AgentMail inboxes, Drive list/read, Vercel deck live. Gated items in STATUS.md.

## Decision

One operating system. Herdr is the live agent floor. OpenRig is the durable
seat topology. Vercel is the public command deck. Cloudflare Tunnel is the
private ingress. LangChain MCP is the shared tool bus for OpenClaw and Hermes.
Orgo is the Global Markets VM. AgentMail is fleet mail. Local models are default.

No second registry. `seats.json` stays source of truth.

## Planes

| Plane | Role | Live now |
|-------|------|----------|
| Command deck | `studex-os/nexus/dashboard` → Vercel `studex-nexus.vercel.app` | yes |
| Agent floor | Herdr workspace `studex-nexus` | seed spec written; launch from a Herdr pane |
| Seat topology | OpenRig rig `studex-nexus` | spec in `openrig/rig.yaml` |
| Tool bus | LangChain MCP engine `:8765` | `mcp/langchain_engine.py` |
| CRM / mail | DenchClaw `:3100` + AgentMail | DenchClaw UI down; 10 inboxes live; send gated |
| Markets VM | Orgo Global Markets | 5 desks running |
| Models | Ollama `:11434`, LM Studio, mesh-llm `:3131` | Ollama listening |
| Ingress | Cloudflare tunnel `hermes-dashboard` | tunnel up; some backends 502 |
| Memory | `~/studex-os/shared-memory.db` + Obsidian + ChromaDB | present |
| Work sink | `nexus/work/` + Drive Death Star | list/read live; service-account upload 403 (no quota) — write locally until shared-drive/OAuth |
| DeerFlow | Super-agent harness (`~/deer-flow`) | checkout present; run on Orgo Super Agents (Mac RAM too tight) |
| DroidDesk | Fold roaming Linux desk | vendored; APK + heartbeat URL pending |

## Pods (Herdr tabs + OpenRig pods)

1. **orch** — Robusca, OS Kernel, Chief of Staff
2. **ops** — Coffee, Delivery, Charlie, DenchClaw CRM
3. **markets** — Cryptopia + Orgo Global Markets VM
4. **content** — Naledi, Amara, Content, Infulencial
5. **infra** — Hermes, Cloud Orchestrator, LLM Engineer, Claudio-CTO
6. **floor** — Herdr panes for Grok / Claude / Codex / OpenClaw main

## Work contract

Local write:

```
~/studex-os/nexus/work/<agent-or-lane>/YYYY-MM-DD-<artifact>
```

Drive Death Star is the fleet push target. Lane IDs live in `drive.json`. Agents keep the same local paths.

## Secrets

Never in git. Engine reads:

- `ORGO_API_KEY` + `ORGO_BASE_URL` + optional `ORGO_COMPUTER_ID`
- `AGENTMAIL_API_KEY`
- existing OpenClaw / Hermes keys already on disk

Drop the Orgo API into `~/.studex-os/secrets.env` (not the repo).

## Next human inputs

See `STATUS.md`. Orgo key is live. Remaining: Discord slash IDs, Buzz membership, AGENTMAIL_SEND, DroidDesk URL, Drive upload quota.
