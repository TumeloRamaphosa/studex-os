# StudEx Nexus — Assembly Plane

Date: 2026-10-02
Owner: Tumelo Ramaphosa
Status: engine live. Drive Death Star attached. Orgo path corrected to www.orgo.ai/api. AgentMail inboxes live.

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
| CRM / mail | DenchClaw `:3100` + AgentMail | DenchClaw up; mail send gated |
| Markets VM | Orgo Global Markets | waiting on API |
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

1. Orgo Global Markets computer id (key is on disk as `orgo_live.key`)
2. Confirm AgentMail sends (`AGENTMAIL_SEND=yes` — drafts until then)
3. Discord application/guild/channel IDs for grokbot-os slash worker
4. Buzz membership yes/no for the 8 npubs
5. DROIDDESK_URL + Fold APK install
