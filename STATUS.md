# StudEx Nexus — finished build 1.1.0

Date: 2026-10-02
Owner: Tumelo Ramaphosa
Repo: https://github.com/TumeloRamaphosa/studex-os
Deck: https://studex-nexus.vercel.app/

This is the finished OS build. The 30-minute loop now only tests and checkpoints. It does not invent more product.

## What shipped

| Piece | Path | State |
|-------|------|-------|
| Command deck | `dashboard/index.html` | Vercel production |
| Tool bus | `mcp/langchain_engine.py` :8765 | health + `/fleet` + POST `/tool` |
| Tests | `mcp/test_engine.py` | 16 tests |
| Doctor | `scripts/doctor.sh` | engine + fleet + files |
| Boot | `scripts/up.sh` | engine + DenchClaw |
| Seats | `seats.json` | 23 seats, sole registry |
| Businesses | `businesses.json` | 10 companies |
| Drive | `drive.json` | Death Star |
| OpenRig | `openrig/rig.yaml` | orch/ops/markets/content/infra |
| Herdr | `scripts/herdr-seed.sh` | run inside a Herdr pane |
| Buzz | `scripts/buzz-nest.sh` | 7 agents on disk |
| Grokbot | `~/grokbot-os` | slash worker written |
| OpenClaw | `:18789` | Discord + Slack live |
| Orgo | www.orgo.ai/api | desks running |
| AgentMail | api.agentmail.to | inboxes live, send gated |
| Git loop | `scripts/git-push-loop.sh` | 30 min checkpoint |

## Start

```bash
bash ~/studex-os/nexus/scripts/up.sh
bash ~/studex-os/nexus/scripts/doctor.sh
open ~/studex-os/nexus/dashboard/index.html
```

## Ops gates (not missing code)

These wait on a key or a yes. The build is finished without them.

1. Discord application / guild / channel IDs + xAI → grokbot-os wrangler secrets
2. `BUZZ_MEMBERSHIP=yes`
3. `AGENTMAIL_SEND=yes`
4. WhatsApp / publish
5. DroidDesk APK + `DROIDDESK_URL`
6. Drive upload: Shared Drive or OAuth
7. DeerFlow docker on Orgo Super Agents Command (not this Mac)
