# Z FOLD 6 — OPENCLAW BRIDGE FOR HERMES
**From:** Hermes (AI CTO) → Crestodian (OpenClaw agent on Tumelo's Z Fold 6)
**Date:** 2026-10-16

---

## SITUATION

Tumelo wants Hermes (AI CTO, cloud node `hermes-cloud-ctf001`, Tailscale IP 100.86.43.28)
connected to the OpenClaw agent running on his Samsung Z Fold 6.

Hermes is already in the Tailscale tailnet `tailf7273b.ts.net`.

**BLOCKER:** The Z Fold 6 node is registered as **OFFLINE** in the tailnet.
- Node: `Tumelo's Z Fold6`
- Tailscale IP: 100.86.176.86
- DNS: tumelos-z-fold6.tailf7273b.ts.net
- OS: android
- LastSeen: 2026-09-11T01:04:57Z

All common OpenClaw ports tested and refused/closed: 22, 3000, 8080, 8799, 18789, 3032.

## WHAT CRESTODIAN MUST DO

### Step 1 — Confirm the phone is awake on the tailnet
```bash
tailscale status
tailscale ip -4
```
Expected: `100.86.176.86`. If Tailscale is stopped, start it:
```bash
termux-open
tailscaled &
```
(Or open Tailscale app → connect. Android may kill the daemon when the app is swiped away —
disable battery optimisation for Termux: Settings → Apps → Termux → Battery → Unrestricted.)

### Step 2 — Bind the OpenClaw gateway to the tailnet interface
The gateway currently listens on `127.0.0.1` only ("private to this machine").
It must bind the Tailscale address so other tailnet nodes can reach it.

Find the gateway config (typically `~/.openclaw/config.json` or `~/.openclaw/openclaw.json`):
```bash
ls -la ~/.openclaw/
cat ~/.openclaw/config.json
```
Set the listen host to the tailnet IP, e.g.:
```json
{ "gateway": { "host": "100.86.176.86", "port": 18789 } }
```
Then restart the gateway so the bind takes effect.

### Step 3 — Verify locally before exposing
```bash
curl -s -o /dev/null -w "loopback=%{http_code}\n" http://127.0.0.1:18789/health
curl -s -o /dev/null -w "tailnet=%{http_code}\n" http://100.86.176.86:18789/health
```

### Step 4 — Report back (no secrets in chat)
Reply with:
1. Confirmed Tailscale IP
2. Gateway bind address + port
3. `/health` HTTP status on both loopback and tailnet
4. Any error text verbatim
5. **The token goes in a FILE, not in chat.** Write it to a path on the phone and tell Hermes
   the path + filename. Hermes will read it over the tailnet bridge. Do not paste the token
   into a message, doc, or repo.

## SECURITY RULES (from Agent Chief Lord)

- No keys, tokens, passwords or private keys in chat, docs or repos. Secrets only via a
  1:1 secure prompt or a file read over the bridge.
- Bind to the Tailscale address only. **No public ports.** No Funnel.
- Do not expose the gateway to the public internet.
- Do not delete or overwrite existing OpenClaw config — back it up first:
  ```bash
  cp ~/.openclaw/config.json ~/.openclaw/config.json.bak-2026-10-16
  ```
- No auto-merge, deploy, DNS, spend or external send without Agent Chief Lord's yes. Drafts only.
- Sanctions-hold parties stay on hold.
- Do not use Laisa Aesthetics. Do not touch live shop prices, theme or Payfast.
- Shared files: "Grok Bot Agents" Drive folder (Shared, Inbox). Never the Nest Git repo.

## IF ACCESS IS MISSING

State the exact supported connection step. Never ask Tumelo to paste a password or API key
into chat. Never work around denied access.

## RETURN

- Task ID
- Timestamp
- Output: the exact steps you ran + their results
- Remaining blockers

---

*From: Hermes (AI CTO)*
*To: Crestodian (OpenClaw, Z Fold 6)*
*Orchestrator: Robusca*
