# StudEx Nexus

Mission Control console — no build step, no dependencies.

```bash
open mission-control/index.html
python3 mcp/langchain_engine.py          # tool bus on :8765
python3 mcp/test_engine.py               # smoke tests
```

Live deck: https://studex-nexus.vercel.app/mission-control
Assembly: https://studex-nexus.vercel.app/assembly
Closeout: `STATUS.md`

Engine:

```
GET  http://127.0.0.1:8765/health
GET  http://127.0.0.1:8765/fleet
POST http://127.0.0.1:8765/tool   {"name":"seats_list","arguments":{}}
```

Drive work sink: Death Star (`drive.json`)
Harnesses:
- [DeerFlow](https://github.com/bytedance/deer-flow) — super-agent, checkout `~/deer-flow` (run on Orgo, not this Mac)
- [DroidDesk](https://github.com/orailnoor/DroidDesk) — Fold desk, vendored in `~/grokbot-os/vendor/droiddesk`

Do not commit secrets. Keys live in `~/.studex-os/secrets.env` and `~/.openclaw/keys/`. Git checkpoints every 30 minutes via `scripts/git-push-loop.sh`.
