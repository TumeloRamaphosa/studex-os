# StudEx Group — Client Deployment Plan

Owner: Tumelo Ramaphosa (CEO) · Drafted by Hermes · Status: DRAFT v1 [TUMELO TO CONFIRM]
Sources: /root/.hermes/skills/devops/{vercel-rest-api-deploy, cloudflare-pages-deploy, orgo-ai-api-reference, orgo-ai-bash-remote-shell, orgo-ai-fleet-check, studex-super-agents-gcp, studex-homelab-fleet}/SKILL.md, studex-os.yaml, studex-auto-meat/board/STUDBOT-PIPELINE.md, infrastructure-guide.md
Date: 5 November 2026 · Currency: ZAR (R) · All timelines are ESTIMATES
**Nothing in this document authorises a deployment. No deploy was performed while writing it.**

---

## 1. The five-stage client delivery model

| # | Stage | What the client receives | Who does it | Approval gate (hard stop) |
|---|---|---|---|---|
| 1 | **Discover** | Hermes intake form (7 fieldsets: about you, project, tier, payment method, references, voice opt-in, POPIA consent) → a reference number and a **generated PRD** | Client (self-serve); Hermes agent captures + structures | Client submits intake → `POST /api/submit`. **Tumelo reviews before any quote is sent.** Two explicit approvals required for anything sent on Tumelo's behalf (LIBRARY.md) |
| 2 | **Blueprint** | Written scope: what changes, what does NOT change (out-of-scope boundary), **testable acceptance criteria**, target room/owner, isolation tier, price | Hermes (analyst station) drafts; Tumelo reviews | **Tumelo signs the scope.** Nothing is built until acceptance criteria are testable — "works" is not an acceptance criterion |
| 3 | **Build** | A diff / draft PR + a build walkthrough, in the 4-station Foreman pipeline | Agent fleet: station-1 classifier → station-2 analyst → station-3 implementer → station-4 reviewer | **Reviewer blocks are hard stops.** Tumelo approves the diff. "Nothing merges, deploys, changes DNS, or spends until Tumelo says yes" (STUDBOT-PIPELINE.md) |
| 4 | **Deploy** | A live URL, a deployment id, a rollback target, a health-check result | Agents deploy; Tumelo/lead executes DNS cutover and secret rotation | **DNS + spend + merge are Tumelo-only.** Reviewer blocks (Claudiou) any diff that touches Vercel projects, Cloudflare zones, DNS records or money |
| 5 | **Operate** | Monitoring + health checks + runbook + monthly ops report + agent registry entry | Agent fleet monitors; Tumelo owns escalations | Monthly ops review with client; change requests re-enter at stage 2 |

### Which stages are agent-only vs human-gated

| Action | Agent can | Agent cannot |
|---|---|---|
| Draft scope, PRD, acceptance criteria | ✅ | — |
| Write code, produce diff | ✅ | — |
| Merge / deploy to production | ✅ (after gate) | Deploy *before* gate |
| Change DNS, Vercel projects, Cloudflare zones | ❌ | Always — hard stop |
| Spend money / add checkout / price / wallet / payment key | ❌ | Always — hard stop (Cryptopia block) |
| Install on Mac mini / start a second gateway / change Hermes config / read keys files | ❌ | Always — hard stop (Adam Smasher block) |
| Read a payment or checkout screen | ❌ | If visible: stop, do not read |

---

## 2. Deployment targets we actually run

### 2.1 Vercel — static sites + serverless (PRIMARY for client sites)

| Attribute | Detail |
|---|---|
| Used for | Client marketing sites, landing pages, dashboards, the StudEx group properties (`studex-hub` = apex, `superagents-site`, `dark-factory`, `studex-markets-redirect`, `studex-data-analytics`, `studex-control-hub`, `command-center`) |
| Cost posture | Effectively free-to-low for static; metered for serverless functions. Cheapest tier in the plan (Starter cost of goods ≈ R25/mo) |
| Limits | Vercel token may not have project-create permission — deploy to **existing project name + project id** only. `vercel.json` breaks base64 deploys → deploy index.html only. Preview URLs redirect to SSO → deploy with `target: "production"` and attach a custom domain |
| Entry point (API) | `POST https://api.vercel.com/v13/deployments` · `GET https://api.vercel.com/v9/projects` (find name/ID) · `GET https://api.vercel.com/v13/deployments/:id` (status) |
| Auth | `Authorization: Bearer ${VERCEL_TOKEN_ADMIN}` — **admin token, 20 projects, full access.** ⚠ Stored in `studex-os.yaml` in plaintext — treat as compromised on any exposure, rotate before client use |
| Payload shape | `{"name": "<project>", "files": [{"file": "index.html", "data": "<base64 -w0>"}], "project": "prj_XXXXX", "target": "production"}` |
| Status check | `readyState`: `INITIALIZING` (building) → `READY` (deployed) → `ERROR` (build failed) |
| Known project IDs | `studex-hub` `prj_Nm7GT8v42DFr3fVIp1WCAJmOBriD` (serves apex `studex-group.com`; framework `null` = static HTML) · `studex-super-agent` `prj_9KC537quvJ8qLE2922EhQKAgSEce` · `superagents-site` `prj_nePsTSwSZKutEt7QfxAzvGe31xyx` · `dark-factory` `prj_nKaobMsxjZaRTsuDq9SCSRfoYFxv` · `studex-markets-redirect` `prj_XjLot4DsIZuLe7cyty3lVWUTYsCd` · `studex-control-hub` `prj_jINmStAv0k0JvHikVIZBV14y9trv` · `command-center` `prj_rUJG5WZ10wGOCYQ7sn6AIWtuU3VC` · `hermes-intake` `prj_6twtbeEcOr15FT0oy0egZ2kRuppG` |
| Fallback | Matrix mcode.io deployer → returns `{"website_url": "https://xxxxx.space.mcode.io"}` (this is how the IGH demo at `ana12bhkl5m1.space.mcode.io` was produced) |

### 2.2 Cloudflare Pages / Workers

| Attribute | Detail |
|---|---|
| Used for | Static builds on the Cloudflare edge, Workers-based APIs, and the Super Agents command surfaces (e.g. `global-markets-platform.workers.dev` — **currently NXDOMAIN, no DNS record**) |
| Cost posture | Free tier covers most static Pages sites; Workers priced per request |
| Limits | Wrangler must be installed (`npm install -g wrangler`). Project must exist before first deploy or the API returns "does not exist" / "Missing production branch" |
| Entry point (CLI) | `wrangler pages project create PROJECT_NAME --production-branch=main` (first deploy only) → `CLOUDFLARE_ACCOUNT_ID=... wrangler pages deploy ./dist --project-name=PROJECT_NAME` |
| Env vars | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` — ⚠ **values not present in any source file: [VERIFY]** |
| Token verification | `GET https://api.cloudflare.com/client/v4/user/tokens/verify` · `GET https://api.cloudflare.com/client/v4/accounts` |
| Live URL | `https://PROJECT.pages.dev` |

### 2.3 Google Cloud — Super Agents platform (Cloud Run / Firebase / Cloud SQL / Pub/Sub / Secret Manager / Vertex AI)

| Attribute | Detail |
|---|---|
| Used for | The Super Agents platform: 10 agent microservices on Cloud Run, Firebase auth + Firestore + Hosting, Cloud SQL PostgreSQL (agents, clients, tasks, audit log), Pub/Sub agent-to-agent messaging, Secret Manager for all API keys, Vertex AI as last-resort LLM |
| Cost posture | Pay-per-request / scale-to-zero on Cloud Run. This is the **Enterprise tier** path: dedicated isolation + POPIA-grade data separation |
| Limits | ⚠ **The GCP skill states "Orgo VMs are dead/inoperable — Cloud Run + Firebase is the stack."** That is the sanctioned direction: GCP replaces Orgo as the agent host |
| Project ID | `studex-global-markets-6439580303` (Firebase + GCP). `.firebaserc`: `{"projects": {"default": "studex-global-markets-6439580303"}}` |
| Second project | `hidden-cat-493019-i3` (GCP project used by the homelab fleet / Gemini key) |
| Repo | `https://github.com/TumeloRamaphosa/studex-global-markets-mvp` (Firebase already configured; Google Sign-In implemented in `public/index.html`) |
| Code location | `/tmp/super-agents-gcp/` — `Dockerfile.agent`, `requirements.txt`, `agent/{server.py, llm_router.py, db.py, auth.py, tasks.py, pubsub_client.py, secret_client.py, webhooks.py}`, `agent/integrations/{discord.py, whatsapp.py}`, `scripts/deploy_agents.sh` |
| Entry point (CLI) | `scripts/deploy_agents.sh` inside `/tmp/super-agents-gcp/` — ⚠ **that path is a temp path; the durable source location is [VERIFY]** |
| LLM routing | Grok (primary) → NVIDIA (fallback) → Vertex AI (last resort). NVIDIA endpoint `https://integrate.api.nvidia.com/v1`, model `openai/gpt-oss-120b` |
| Credentials needed | Firebase Web API Key · Firebase Admin Service Account JSON · Cloud SQL connection name + password (optional). ⚠ **A GCS bucket name and GCS endpoint are not present in any source file: [VERIFY]** — do not invent one |
| Deploy steps | 1) GCP Console create project → 2) Firebase Console copy Web API Key → 3) Firebase service account private key JSON → 4) GCP Cloud Shell enable APIs + create resources → 5) run deploy script |

### 2.4 Orgo AI cloud desktops — 10 VMs (⚠ CURRENTLY FROZEN — NOT A DELIVERY TARGET)

| Attribute | Detail |
|---|---|
| Used for | Legacy persistent workloads on full Ubuntu desktops: Discord bot hub, Gitea, WhatsApp harness, Hermes Gateway, Business Ghost. **Computer-use agents** (browsing, form-filling) need a full desktop, not a container |
| Cost posture | Per desktop-hour (Orgo pricing model). Higher than serverless; justified only for always-on + full-computer workloads |
| Fleet | 10 VMs. Workspace id `a4977a1c-cde4-410d-878e-fb5675d55995`. Verified desktop IDs (Oct 2026): Global Markets `0f28f3a2-2b26-4260-bff7-262885c86c28`, Auto-Meat `343f4c0d-137c-4e1a-bff4-8b1178db32f3` |
| ⚠ Status | **All 10 frozen; D@RK F@CT0Ry in ERROR_STATE since Sep 8.** All ports unreachable externally including 9000 and 22937. Services (Discord bot, Gitea, WhatsApp, Hermes Gateway) are DOWN |
| ⚠ Wake path | **No programmatic wake exists.** Resume endpoints return HTML (the Orgo web app), not JSON. The only wake is a human opening a VNC session at `https://app.orgo.ai` |
| Agent API (per-VM) | Port **9000**, agent version `v0.3.34`. `GET /health` → `{"status":"ok","version":"v0.3.34"}` (no auth). `POST /bash` with body `{"command": "df -h /"}` — **requires a VNC-session Bearer token**, which is different from the Orgo API key |
| Workspace-level bash | ⚠ **`POST /api/computers/{id}/bash` DOES NOT EXIST at workspace level.** It returns 404 (OpenAPI spec) / 405 Method Not Allowed. The `studex-os.yaml` field `bash_endpoint: POST /api/computers/{id}/bash` is **stale/incorrect** and must not be used as a runbook instruction |
| Working bash path | Create a **computer-scoped key**: `POST {BASE}/keys` with body `{"computer_id": "<desktop-uuid>", "name": "hermes-shell"}`, `Authorization: Bearer <workspace sk_live_...>` → then `POST {BASE}/computers/{CID}/bash` with `{"command": "...", "timeout": 60}` using that key. ⚠ **Key-creation procedure verified Oct 2026; it is untested against the currently frozen fleet** |
| Base URL | `https://www.orgo.ai/api` · Auth `Authorization: Bearer sk_live_...` · OpenAPI spec at `https://www.orgo.ai/openapi.json` |
| Desktop API ports | 22937 (Super Agents Command, SA) and 23931 (Global Markets) — Desktop API, `/health` open, version `a186397-dirty`. ⚠ SA 22937 is the only externally reachable one in the last audit |
| Working endpoints | `GET /api/workspaces` · `GET /api/workspaces/{workspace_id}/desktops/{desktop_id}` · `GET /api/computers/{uuid}` (returns instance_details, vnc_password, connection_url) |
| Non-existent endpoints | `POST /desktops/{id}/resume` (405/HTML) · `POST /desktops/{id}/wake` · `POST /freeze` / `/unfreeze` · `POST /actions` · `GET /ssh-keys` (auth error) · `/api/desktops`, `/api/controls` (404) |
| Cost of waiting | A frozen VM still bills desk-hours; wake requires a human with a browser. **Never schedule a client SLA against Orgo until the fleet is unfrozen and a live health sweep passes.** |

### 2.5 MacBook / Mac mini homelab tier (Tailscale + Herdr + Buzz)

| Attribute | Detail |
|---|---|
| Used for | Lowest-cost tier hosting, local models (Ollama 11434), agent mesh, control surfaces. Also the place where a self-hosted agent (Hermes in a cloud sandbox) joins the tailnet |
| Cost posture | Zero marginal cloud cost — power + time. Cheapest possible margin, best for a trial |
| Machine inventory | Steam Deck `steam-deck` (Bazzite) · Legion Go `bazzite` (Bazzite, **Dark Factory node — HERMES LIVE**, user `tumel`) · MSI Claw 8 `msi-claw` (Win11+WSL2) · Razer Edge `razer-edge` (Android/Termux) · Z Fold 6 `zfold-agent` · MacBook `macbook-tumelo` · Mac mini `mac-mini` (macOS, "Coming online") · Amlogic G12A box (needs Armbian) |
| Known IPs | Tailscale: Steam Deck `10.0.0.1` · MSI Claw `10.0.0.2` · Razer Edge `10.0.0.3` · Lenovo `10.0.0.4` · Desktop `10.0.0.5` · Z Fold `10.0.0.6` · MacBook `10.0.0.7` · Mac mini `10.0.0.8`. Hub: `macbook-pro-5` = `100.95.66.29`; `gcp-arcade-agents` = `100.95.79.75` |
| Tailnet | `tailf7273b.ts.net`. MagicDNS name for the MacBook: `macbook-pro-5.tailf7273b.ts.net` |
| Control surfaces on the hub | Mission Control `8787` · Control Hub / Harness Manager API `42069` · Fleet Bridge `18789` (OpenAI-compatible `http://100.95.66.29:18789/v1/chat/completions`) · OpenWebUI `3001` · Gitea `3000` · Huly `8087` · Mission Control alt `3002` |
| Other entry points | OpenClaw gateway `18789` · n8n `5678` · Ollama `11434` (`GET /api/tags`) · HHD API `5335` (`/api/v1/state`, `/api/v1/profile/list`, `POST /api/v1/state` with Bearer) · `herdr agent --server 10.0.0.1:2244` (install: `curl -fsSL https://herdr.dev/install.sh \| sh`) · Buzz relay rooms via `buzz-agents/agent-client.py` (`studex-status`, `studex-send --data '{"message":{"text":"...","room":"NEST OS"}}'`, `studex-inbox`) |
| ⚠ Limits | ⚠ `*.tailf7273b.ts.net` DNS names fail to resolve from some environments → **use tailnet IPs directly (`100.x.y.z`)**. Z Fold 6 Tailscale pkg is broken (use F-Droid). Bazzite: `pkg install tailscale` fails (rpm-ostree) — use `brew`/`ujust`. ⚠ `herdr` is NOT installed on the cloud box. ⚠ Do not install a second gateway next to ClawX, do not change Hermes config, do not switch the local model, do not read the Obsidian vault or keys files |
| Cost of waiting | Mac mini listed as "Coming online" — **the homelab tier cannot be sold as available until the Mac mini is confirmed online and a full fleet sweep passes** |

### Target selection rule (one line)

Static/marketing → **Vercel**. Edge/API → **Cloudflare Pages/Workers**. Always-on regulated agent platform → **GCP (Cloud Run + Firebase)**. Full-computer/browser-use → **Orgo** *(blocked: fleet frozen — use GCP until unfrozen)*. Trial/cheapest → **MacBook/Mac mini homelab** *(blocked: Mac mini "coming online")*.

---

## 3. Standard client deployment checklist (signed scope → live URL)

| # | Step | Owner | Concrete action | Done when |
|---|---|---|---|---|
| 1 | Scope signed | Client + Tumelo | Blueprint accepted: changes, non-changes, testable acceptance criteria, tier, price | Written approval on file; quote issued after review |
| 2 | Project/namespace opened | Tumelo | Vercel: `GET /v9/projects` → confirm existing project name + `prj_` id. CF: `wrangler pages project create <NAME> --production-branch=main`. GCP: Firebase project `studex-global-markets-6439580303` | Project exists and is named to the client (`<client>-studex`) |
| 3 | Secrets minted, not typed into prompts | Agent | Every key created in the provider (Vercel env, GCP Secret Manager). Agents **name env vars only — never place API keys in prompts, comments or files** | No secret value appears in any diff, log or commit |
| 4 | Env vars wired | Agent | Set production env vars on the target; confirm the build sees them | `env` listing shows the var present on the target |
| 5 | Build green | Agent | Static: base64 encode with `base64 -w0`, **no `vercel.json`**. `studex-hub` requires `framework: null` (static); if it resets to nextjs, `PATCH /v2/projects/studex-hub {"framework": null}` | Build returns `readyState: READY` |
| 6 | Deploy to production | Agent (post-gate) | `POST https://api.vercel.com/v13/deployments` with `target: "production"` + `project` id. CF: `wrangler pages deploy ./dist --project-name=<NAME>` | Deployment id (`dpl_…`) recorded in the client file |
| 7 | Domain + DNS cutover | **Tumelo only** | Attach the custom domain to the project, then A/CNAME the client domain to the target. **DNS changes are a hard-stop agent action** | Apex and `www` resolve to the target; TTL lowered before the change |
| 8 | TLS + canonical sanity | Agent | Confirm HTTPS cert issued; canonical tag points at the host that actually answers 200 (⚠ `www.studex-group.com` sits behind a Cloudflare challenge while the bare apex serves 200 — do not copy that pattern) | `curl -sI` returns 200 on the final host |
| 9 | Health check | Agent | Verify the app route (not just the root) and the app's own health endpoint. ⚠ Gitea on the Global Markets VM answers 404 on `/api/health` — the app was up while its health endpoint was wrong; always test the real route | Live URL returns the expected content, not a framework splash |
| 10 | Secrets scrubbed from the client-visible build | Agent | Confirm no key, token or `.env` reached the deployed output | `curl` the deployed bundle and grep for key prefixes |
| 11 | Client smoke test | Client | Client walks the acceptance criteria from stage 2, on the live URL, on a phone if it is mobile | Client confirms in writing |
| 12 | Rollback target recorded | Tumelo | Record the previous deployment id / previous project state **before** the cutover. Rollback = promote the prior known-good deployment | Rollback id is written in the client file, not just in chat history |
| 13 | Monitoring registered | Agent | Add the URL to the command center + health check; add an alert path for the client | Alert fires on a deliberate failure test |
| 14 | Registry + docs | Agent | Create/refresh the client entry in the agent registry (`studex-os/` Clients folder) + Obsidian client vault note; link PRD, deployment id, rollback id | A new team member can find and roll back the site from the vault alone |
| 15 | Handover pack sent | Tumelo | URLs, credentials handed over via a secure channel (never in the deployment email body), runbook, support contact | Client acknowledges; support path named |

**Standing rule for every step:** the agent stops and reports when a step touches DNS, spend, checkout/pricing, keys files, the vault, or the Mac mini. It never proceeds past a hard stop on its own.

---

## 4. Timeline by package — ALL NUMBERS ARE ESTIMATES

| Stage | Pilot | Production | Enterprise |
|---|---|---|---|
| Discover (intake → PRD) | 1 day | 2–3 days | 3–5 days |
| Blueprint (scope, acceptance criteria, quote) | 2 days | 3–5 days | 5–8 days |
| Build (build + review cycles) | 4–6 days | 8–12 days | 15–25 days |
| Deploy (deploy, DNS, TLS, health check, smoke test) | 2 days | 3–5 days | 5–8 days |
| Operate (monitoring + handover pack) | 1 day | 2 days | 5 days |
| **Total (estimate, calendar days)** | **10–12** | **18–27** | **33–51** |
| Indicative price anchor | Dark Factory agent R149–599/mo, or Starter R3,500/mo | Business R7,500/mo | Enterprise R15,000/mo, or IGH-scale band R6,937,500 + R35K/mo (reference only) |

Assumptions behind the estimates: client supplies content and sign-off within 2 business days per gate; no third-party paid API onboarding delay; DNS access is available at deploy time; no POPIA impact assessment or security audit cycle is included (add 10–15 days for Enterprise if the client requires one).

---

## 5. RACI-lite

| Activity | Tumelo (human) | Agent fleet | Client |
|---|---|---|---|
| Intake capture + PRD | A | R | C |
| Scope, acceptance criteria, price | **A / R** | R (drafts) | C |
| NDA / contract | **A / R** | I | C |
| Code build + diff | I | **A / R** | I |
| Review pass | C | **R** | I |
| Merge to production | **A** | R (executes after approval) | I |
| DNS / custom domain cutover | **A / R** | I | C (must grant DNS access) |
| Secret creation + rotation | **A** (approves) | R | C (owns the keys) |
| Deployment execution | C | **A / R** | I |
| Health check + monitoring | I | **A / R** | C |
| Rollback decision | **A** | R (executes) | C |
| Client content + sign-off | C | I | **A / R** |
| Incident response | **A** | R (detect, triage, propose) | C |
| Monthly ops report | C | **A / R** | C (review) |
| Spend / new vendor commitment | **A** | I | C |

R = Responsible · A = Accountable · C = Consulted · I = Informed.

**Two rules that override the table:** (1) Tumelo approves every email on his own behalf, twice, and any edit resets both approvals. (2) Tumelo is Accountable for DNS, spend and rollback — no agent may perform those.

---

## 6. The 5 most common ways client deployments fail — and the guardrail for each

| # | Failure mode | What it looks like | Guardrail (enforced at which step) |
|---|---|---|---|
| 1 | **Deploying into the wrong Orgo path** | Automating `POST /api/computers/{id}/bash` at workspace level → 404/405, or worse, a script that "succeeds" against a frozen VM and reports false health | The workspace-level bash endpoint **does not exist**. The only sanctioned remote path is per-VM Agent API on **port 9000 with a VNC-session token**, or a computer-scoped key from `POST /api/keys` with `computer_id`. **Never write a runbook that calls the workspace-level endpoint.** Any Orgo step is blocked until the fleet is unfrozen and a live sweep passes |
| 2 | **The Orgo fleet is frozen and there is no programmatic wake** | Client SLA promises uptime; VMs are `frozen`; port 9000 `/health` returns nothing; the only fix is a human opening `https://app.orgo.ai` | Orgo is **not a delivery target today**. Two hard rules: (a) never sell Orgo-hosted uptime; (b) every morning the Orgo sweep is a runbook line — if any VM is frozen, Orgo is out of the plan for that week and the workload moves to GCP Cloud Run |
| 3 | **Secrets in prompts, commits or the deployed bundle** | API keys found in a diff, a log line, a `dist/` file | Stage 3 rule: *no API keys in prompts, comments or files — name env vars only*. Step 3 mints secrets in the provider. Step 10 scrubs the deployed bundle. Deploy tokens (Vercel `vcp_…`, Cloudflare `CLOUDFLARE_API_TOKEN`) are currently stored in plaintext in `studex-os.yaml` — **rotate before any client project uses them** |
| 4 | **DNS/cutover done by an agent, or the wrong canonical** | Zone edited without approval; apex serves 200 but `www` returns a Cloudflare challenge; canonical points at a host that does not answer | DNS is a Tumelo-only action (Claudiou block, step 7). Before cutover, `curl -sI` **both** apex and `www` and pick the host that answers; set canonical to that host. Lower TTL 24h before the change, keep the old target live for rollback (step 12) |
| 5 | **"Health check" that only tests the root** | Site returns 200 but the actual app route 404s (precedent: Gitea on the Global Markets VM answered 404 on `/api/health` while the web UI was up); or the deploy returns `READY` but a function fails at runtime | Test the **real user route** and the app's own health endpoint, not the root. After deploy, `GET /v13/deployments/:id` → `readyState: READY` is necessary but not sufficient. Step 13 requires a **deliberate failure test** to prove the alert fires before the client is told we monitor them |

**Two runners-up worth naming:**
- **Price/format drift between the funnel and the site** — the intake form advertises Starter R1,500 / Company R2,800 / Agentic Rise R4,500 while the published tiers are R3,500 / R7,500 / R15,000. A client that reads the form and is quoted the site price loses trust. Guardrail: one price book, published once, with the form reading from it. [TUMELO TO CONFIRM]
- **The Mac mini / homelab tier is sold before it is online.** `mac-mini` is "Coming online" and `herdr` is not installed on the cloud box. Guardrail: the homelab tier is not offered to a paying client until the node has passed a live health sweep and a rollback test.

---

## Appendix — endpoint & credential quick card (all copied from source files)

| Target | Endpoint / command | Credential | Source file |
|---|---|---|---|
| Vercel | `POST https://api.vercel.com/v13/deployments` | `Bearer ${VERCEL_TOKEN_ADMIN}` | vercel-rest-api-deploy/SKILL.md |
| Vercel | `GET https://api.vercel.com/v9/projects` · `GET https://api.vercel.com/v13/deployments/:id` | same | vercel-rest-api-deploy/SKILL.md |
| Vercel | `PATCH /v2/projects/studex-hub {"framework": null}` | same | studex-os.yaml |
| Cloudflare | `wrangler pages project create <N> --production-branch=main` · `wrangler pages deploy ./dist --project-name=<N>` | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` ([VERIFY]) | cloudflare-pages-deploy/SKILL.md |
| Cloudflare | `GET https://api.cloudflare.com/client/v4/user/tokens/verify` · `/client/v4/accounts` | same | cloudflare-pages-deploy/SKILL.md |
| GCP | `scripts/deploy_agents.sh` in `/tmp/super-agents-gcp/` | Firebase Web API Key + Admin SA JSON | studex-super-agents-gcp/SKILL.md |
| GCP | Project `studex-global-markets-6439580303` · `.firebaserc` default project | — | studex-super-agents-gcp/SKILL.md |
| GCP | `https://integrate.api.nvidia.com/v1` (fallback LLM) | `nvapi-…` | studex-os.yaml |
| Orgo | `GET https://www.orgo.ai/api/workspaces` | `Bearer sk_live_…` | orgo-ai-api-reference/SKILL.md |
| Orgo | `GET /api/computers/{uuid}` · `GET /api/workspaces/{ws}/desktops/{id}` | same | orgo-ai-api-reference/SKILL.md |
| Orgo | `POST /api/keys` body `{"computer_id":"<uuid>","name":"hermes-shell"}` → computer-scoped key | workspace key | orgo-ai-bash-remote-shell/SKILL.md |
| Orgo | `POST /api/computers/{CID}/bash` body `{"command":"...","timeout":60}` | computer-scoped key | orgo-ai-bash-remote-shell/SKILL.md |
| Orgo | `GET http://<vm-ip>:9000/health` → `{"status":"ok","version":"v0.3.34"}` | none | orgo-ai-fleet-check/SKILL.md |
| Orgo | `GET http://<vm-ip>:22937/health` → version `a186397-dirty` | none | orgo-ai-fleet-check/SKILL.md |
| Orgo | `https://www.orgo.ai/openapi.json` · `https://app.orgo.ai` (VNC wake) | — | orgo-ai-api-reference/SKILL.md |
| Homelab | `http://100.95.66.29:8787` (Mission Control) · `:42069` (Control Hub API) · `:18789/v1/chat/completions` (Fleet Bridge) | — | orgo-ai-fleet-check/SKILL.md |
| Homelab | `http://<ip>:5335/api/v1/state` (HHD) | Bearer token | studex-homelab-fleet/SKILL.md |
| Homelab | `herdr agent --server 10.0.0.1:2244` · `curl -fsSL https://herdr.dev/install.sh \| sh` | — | studex-homelab-fleet/SKILL.md |
| Homelab | `buzz-agents/agent-client.py` → `studex-status` / `studex-send --data '{"message":{"text":"...","room":"NEST OS"}}'` / `studex-inbox` | — | claude-ops-integration/SKILL.md |
| Intake | `POST /api/submit` (returns `{ok, id}` reference) | — | hermes-intake/src/public/app.js |

---

*Prepared from the StudEx record set. Every endpoint, ID, project name, port and domain above is copied from a source file. Items I could not verify in the sources are marked [VERIFY]. No deployment was executed and no file outside this document was modified.*
