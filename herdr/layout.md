# Herdr floor — studex-nexus

This agent is not inside Herdr (`HERDR_ENV` unset). Do not drive the focused
Herdr session from outside. Open Herdr, then run the seed from a pane.

## Target layout

Workspace: `studex-nexus`

| Tab | Panes |
|-----|-------|
| orch | grok (this seat) · openclaw-main |
| ops | hermes-ops · denchclaw |
| markets | orgo-gm · cryptopia |
| content | naledi · content |
| infra | hermes-core · ollama-logs |

## Seed (run inside Herdr)

```bash
test "${HERDR_ENV:-}" = 1 || { echo "open a Herdr pane first"; exit 1; }
cd ~/studex-os/nexus
herdr workspace create --name studex-nexus --cwd "$PWD"
# then split tabs/panes and start agents with unique names:
# herdr agent start grok-orch --kind grok --pane <pane-id>
# herdr agent prompt grok-orch "$(cat JOIN-THE-OS.md)"
```

Page to keep open beside the floor: `dashboard/assembly.html`
