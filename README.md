# StudEx Nexus

Mission Control console — no build step, no dependencies.

```bash
open mission-control/index.html
python3 mcp/langchain_engine.py          # tool bus on :8765
python3 mcp/test_engine.py               # smoke tests
```

Live deck: https://studex-nexus.vercel.app/assembly.html

Harnesses:
- [DeerFlow](https://github.com/bytedance/deer-flow) — super-agent, checkout `~/deer-flow`
- [DroidDesk](https://github.com/orailnoor/DroidDesk) — Fold desk, vendored in `~/grokbot-os/vendor/droiddesk`

Do not commit secrets. Put keys in `~/.studex-os/secrets.env`.
