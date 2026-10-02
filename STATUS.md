# StudEx Nexus — shipped

Date: 2026-10-02
Owner: Tumelo Ramaphosa
Repo: https://github.com/TumeloRamaphosa/studex-os
Deck: https://studex-nexus.vercel.app/mission-control

This OS is live. Remaining items below need Agent Lord keys or a yes.

## Live

| Plane | Where | State |
|-------|-------|-------|
| Command deck | Vercel `studex-nexus` | production |
| Mission Control | `mission-control/index.html` (zero build) | local + Vercel |
| Tool bus | `127.0.0.1:8765` | health, `/fleet`, POST `/tool` |
| Seats | `seats.json` | sole registry |
| OpenClaw | `:18789` | Discord + Slack enabled |
| AgentMail | api.agentmail.to | 10 inboxes, send gated |
| Orgo | www.orgo.ai/api | 5 desks running (Global Markets 2c/16g) |
| Drive Death Star | `drive.json` | list/read; upload blocked on SA quota |
| Buzz | `~/.openclaw/keys/buzz-agents` | 7 key files on disk |
| Grokbot-os | `~/grokbot-os` | checkout; slash IDs pending |
| Hermes | local CLI | installed |
| Businesses | `businesses.json` | 10 companies |
| Git loop | `scripts/git-push-loop.sh` | every 30 min |

## Tests

```
python3 mcp/test_engine.py
```

16 tests. No secrets in git.

## Gated — dump or say yes

1. Discord application / guild / channel IDs + xAI key → grokbot-os slash
2. Extra Slack channel IDs (etherdoge socket already live)
3. Buzz membership yes/no for the npubs
4. `AGENTMAIL_SEND=yes` before any mail
5. WhatsApp / publish — still no until you say yes
6. `DROIDDESK_URL` + Fold APK
7. Drive upload: share Death Star with the service account as a Shared Drive, or switch to OAuth
8. DeerFlow docker stays off this Mac — run on Orgo Super Agents Command

## Run

```bash
open mission-control/index.html
python3 mcp/langchain_engine.py
python3 mcp/test_engine.py
bash scripts/git-push-loop.sh
```

Work writes to `work/<lane>/`. No secrets. No partner/NDA decks in git.
