# StudEx Nexus — Cloudflare + Vercel Wiring

> How the 16-seat Nexus Command Deck is exposed on the public internet.
> Built and verified 2026-09-13.

## ✅ LIVE NOW — Vercel

| Thing | Value |
|-------|-------|
| Dashboard | **https://studex-nexus.vercel.app** |
| Registry | `https://studex-nexus.vercel.app/seats.json` |
| Status | ✅ HTTP 200, 16 seats served |
| Project | `stud-ex-s-projects/studex-nexus` |

**Redeploy after editing `seats.json`:**
```bash
cd ~/studex-os/nexus/dashboard
cp ~/studex-os/nexus/seats.json ./seats.json
vercel deploy --prod --yes
```

> Note: Vercel "Deployment Protection" (team SSO) is ON for the `.vercel.app` preview
> URLs (they 302 to a login). The canonical `studex-nexus.vercel.app` alias is public.
> To add your own domain (`nexus.studex-group.com`) run `vercel domains add`.

## 🟡 Cloudflare — tunnel running, ingress ready to extend

Running tunnel: `da2e06a7-...` ("hermes-dashboard"), 2 live connections.

Current ingress (serving):
- `hermes.studex-group.com` → `localhost:8085`  ⚠️ backend DOWN → returns 502
- `maus.studex-group.com` → `127.0.0.1:18799`  ⚠️ backend DOWN

To add the Nexus + MCP bridge + brain, merge the blocks in
`dashboard/cloudflare-ingress.md` into `~/.cloudflared/hermes-dashboard.yml`,
then `sudo cloudflared service restart`.

| Hostname | Local service | Purpose |
|----------|---------------|---------|
| `nexus.studex-group.com` | :8787 | Command Deck dashboard |
| `mcp.studex-group.com` | :8000 | MCP bridge (FastAPI) |
| `brain.studex-group.com` | :8000 | Brian shared-knowledge API |
| `ollama.studex-group.com` | :11434 | Local inference ⚠️ Zero Trust only |

## 🔴 Blockers (need action to finish Cloudflare path)

1. **`wrangler` not authenticated** — run `wrangler login` to deploy Workers
   (OpenMaus gateway, Twilio IVR).
2. **`terraform` missing** — `brew install terraform` for DNS/Access/Email Routing.
3. **`hermes.studex-group.com` is 502** — its backend `localhost:8085` isn't running.
   Start the Hermes dashboard service to clear it.

## Related stacks already in `~/studex-cloudflare/`

- `workers/openmaus-gateway/` — OpenAI-compatible `/v1/chat/completions` Worker
- `workers/twilio-webhook/` — Twilio IVR Worker (needs `account_id` + KV id filled)
- `tencentdb-memory/` — Cloudflare Containers memory (needs deploy)
- `terraform/` — DNS + Zero Trust + Email Routing (needs `terraform` binary)
- `DEPLOY_PROMPT.md` — full hand-off prompt for any coding agent
