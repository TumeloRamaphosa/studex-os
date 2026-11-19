# StudEx Group — Product & Offering One-Pager

Owner: Tumelo Ramaphosa (CEO) · Drafted by Hermes · Status: DRAFT v1 [TUMELO TO CONFIRM]
Sources: studex-os.yaml, Meetings--coms (LIBRARY.md, PIPELINE.md, SALES_LEADS.md), infrastructure-guide.md, hermes-intake/, studex-auto-meat/board/
Date: 5 November 2026 · Currency: ZAR (R), ex-VAT unless stated. All prices ex-VAT (15% VAT added on quote).

---

## 1. What StudEx Group is (3 sentences)

StudEx Group is a Johannesburg-founded Black & Gold premium African trade and technology group led by CEO Tumelo Ramaphosa.
It runs four commodity desks — Meat, Coffee, Wheat and Global Markets — that generate the base revenue and the trade relationships.
Its growth line is the AI/agent build business: Super Agents, Dark Factory and the StudEx OS command center, where every client engagement starts as a Hermes intake and ends as a deployed, monitored agent system.

### 3 named client segments and the problem each has

| Segment | Who they are | The problem we sell against |
|---|---|---|
| **African commodity exporters & speciality producers** (coffee, wheat, meat) | Owner-operated exporters, roasters and mills | No digital storefront, no online ordering, no trade/pipeline visibility — every order is a WhatsApp note and every price is a manual quote |
| **Multi-site service operators** (clinics, wellness, professional services) | 2–10 location operators, e.g. Infinite Growth Haven (4 locations, 875K TikTok followers) | No online booking, no WhatsApp automation, no role-based dashboards — revenue leaks (IGH: R145K/mo) that nobody can see or attribute |
| **Enterprise / channel IT buyers** (AIOps, monitoring, agent platforms) | Channel partners reselling into government, semi-government, corporate and MNC accounts (e.g. PwC MEA via Techies Infotech) | No single command center, no Prometheus/Grafana/OTel + Swetrix + agent registry pack they can resell with one contract and one SLA |

---

## 2. The four desks — what each sells, to whom, and the commercial reality

| Desk | What it sells | Buyer | Commercial reality today |
|---|---|---|---|
| **Meat** (StudEx Meat) | Halaal Wagyu biltong; premium African protein | Affluent SA consumers, braai/luxury buyers, retail distributors | `studexmeat.com` is **LIVE** (HTTP 200) — a Shopify storefront with priced products (R350–R650). ⚠ Homepage copy still says "The Shopify counter at studexmeat.com is closed while the shop is reactivated" — **that sentence is factually wrong and must be corrected** |
| **Coffee** | Speciality coffee (Rwanda-linked), café trade | Trade buyers, hospitality, distributors | Sold through desk relationships and Global Markets trade channels; no public checkout on the main site |
| **Wheat** | Grain / wheat volumes | Trade and institutional buyers | **Quoted per contract only** — no standing price, no cart, no list price published |
| **Global Markets** (Statix Global Markets) | African agrifood export brokerage, bilateral trade access, market intelligence | Exporters, African governments, trade ministries (Eswatini, Rwanda), commodity buyers | ⚠ Primary CTA points at `https://global-markets-platform.workers.dev/signup` — **NXDOMAIN, dead conversion path**. Site: `https://markets.studex-group.com` (Vercel project `studex-markets-redirect`) |

### Commercial reality on the main site (all desks)

- **No public checkout anywhere on `studex-group.com`.** The apex CTA is "Write to the desk" → `mailto:t.ramaphosa@studex.dev`.
- **Orders are notes to the desk**, not transactions. Human reply closes the sale.
- ⚠ **Contact inconsistency:** homepage CTA uses `t.ramaphosa@studex.dev`; the brand record (`studex-os.yaml`, LIBRARY.md) is `t.ramaphosa@studex-group.com`. Pick one and make both match.
- ⚠ **Canonical tag** on the apex points to `https://www.studex-group.com/`, but `www` sits behind a Cloudflare challenge while the bare apex serves 200. Canonical should point at the host that actually answers.
- Standalone live Shopify storefront: `studexmeat.com` (Meat only) — the only desk with a working public purchase path today.
- WhatsApp sales line on record: `+27 79 498 8737`. Banking: FNB Studex Group `#62760837610`.

---

## 3. The AI / agent offering as a real product

### Named delivery model: **Hermes Intake → Foreman Build → Command Center**

```
Prospect
  │
  ▼
[1] HERMES INTAKE  (hermes-intake)  — web form + ElevenLabs voice, POPIA consent,
  │                                   POST /api/submit  →  client PRD + reference number
  ▼
[2] BLUEPRINT      — scope, acceptance criteria, room ownership, tier, quote
  ▼
[3] FOREMAN BUILD  (Dark Factory v3, "BMAD — Build Me An App")
  │   station-1-classifier → station-2-analyst → station-3-implementer → station-4-reviewer
  │   (4-station pipeline; nothing merges or deploys without Tumelo's approval)
  ▼
[4] COMMAND CENTER (StudEx OS) — Mission Control, dashboards, agent registry, audit log
  ▼
[5] OPERATE        — monitors, alerts, runbooks, monthly ops report
```

### Component map

| Component | What it is | Where it lives | Commercial basis |
|---|---|---|---|
| **Hermes intake** | AI intake agent. Web form (7 fieldsets: about you, project, tier, payment method, references, voice opt-in, POPIA consent) + optional voice call. Generates a **customer PRD**. "No payment is taken on this form." | `hermes-intake/` (`src/public/index.html`, `app.js`, `src/api/submit.js`, `voice-intake.js`) | Free funnel; quote follows human review |
| **Dark Factory v3** | 8 build agents: BMAD (App Builder, **R149–599/mo**), Cipher Trace (Security Auditor), OGRE v3.0 (Code Review), Cyber Scribe (Documentation), Neural Forge (ML Pipeline), Quantum Weaver (Optimization), Oracle v3 (Strategy), Sentinel (Discord Monitor) | `factory.studex-group.com` · Vercel `dark-factory` = `prj_nKaobMsxjZaRTsuDq9SCSRfoYFxv` | Per-agent subscription band R149–599/mo |
| **Super Agents** | 8 Renaissance Agents for African Business: Michelangelo (Strategy & Planning, from R3,500/mo), Raphael (Sales Automation, from R3,500/mo), Leonardo (Creative Design, from R4,500/mo), Donatello (Research & Analysis, from R4,500/mo), Botticelli (Marketing & Content, from R3,500/mo), Titian (Web Development, from R4,500/mo), Veronese (Data Science, from R4,500/mo), Caravaggio (TradeBot, from R4,500/mo) | `superagents.studex-group.com` · Vercel `superagents-site` = `prj_nePsTSwSZKutEt7QfxAzvGe31xyx` | SaaS band R599–R2,500/mo; individual agents from R3,500/mo |
| **StudEx OS command center** | Mission Control dashboard (8787), Harness Manager / Control Hub API (42069), Fleet Bridge (18789, OpenAI-compatible `/v1/chat/completions`), Gitea (3000), Huly (8087), OpenWebUI (3001) | `studex-os/` + `master-command-center/` + `control-hub/` | Enabler of Enterprise tier |
| **Agent fleet** | ~25 agents incl. DenchClaw (CRM), OpenClaw (execution), Naledi (content), Goose (builder), Cypher Trace (CTO), plus a Hermes fleet of 42 cloud agents on Qwen | `studex-auto-meat/board/`, `mission-crm/` (agents.json, agent-assignments.json, agent-keypairs.json) | Bundled into tier price |
| **Obsidian / Herdr / Buzz infrastructure** | Obsidian vault = system of record (API, Agents, Clients, Company, Integrations, Knowledge, Missions, Projects, System, VMs, Workflows). Herdr = P2P agent mesh (`herdr.dev/install.sh`, `herdr agent --server 10.0.0.1:2244`). Buzz = agent→agent message relay rooms. AgentMail = email-shaped, **human approval only**. | `studex-os/obsidian/`, `studex-os/herdr/fleet-config.toml`, `studex-os/buzz-agents/agent-client.py` | Cost of goods, not sold separately |

### ⚠ Capacity honesty (must appear in any client-facing description)

- **The Orgo AI fleet is frozen.** 10 VMs: 9 `frozen`, 1 `ERROR_STATE` (D@RK F@CT0Ry, since Sep 8). Frozen VMs are unreachable — port 9000 `/health` returns nothing.
- **There is no programmatic wake.** The only wake path is a human opening a VNC session at `https://app.orgo.ai`. Resume endpoints return HTML, not JSON.
- **Therefore: do NOT promise "24/7 live agents"** until the fleet is unfrozen and a runbook proves uptime. Promise instead: *"agents are provisioned per client on isolated compute and monitored from the StudEx OS command center."*
- Also currently degraded: WhatsApp bridge (no session file — needs QR re-auth), Ollama on Super Agents Command (no models loaded), Super Agents Command disk at 88%.

---

## 4. Engagement & pricing — 3 tiers (SA context)

### Published band (from `studex-os.yaml` + `infrastructure-guide.md`)

| Tier | Price / month | Isolation | Cost of goods (guide estimate) | Who it fits |
|---|---|---|---|---|
| **Starter** | **R3,500/mo** | Docker container, isolated namespace | ~R25/mo | One owner, one channel, one agent |
| **Business** | **R7,500/mo** | microVM, own kernel (Firecracker-class) | ~R80/mo | SME with a team, several channels, 2–4 agents |
| **Enterprise** | **R15,000/mo** | Dedicated Linux VM per client | ~R200/mo | Regulated data (POPIA), channel/reseller, always-on requirement |

### Add-ons and other published price points

| Item | Price | Source |
|---|---|---|
| Super Agents SaaS | R599 – R2,500/mo | LIBRARY.md |
| Individual Super Agents agent | from R3,500/mo (Leonardo/Donatello/Titian/Veronese/Caravaggio from R4,500/mo) | studex-os.yaml |
| Dark Factory agent (e.g. BMAD) | R149 – 599/mo | studex-os.yaml |
| IGH enterprise band (**reference only — not a list price**) | Cloud R6,937,500 setup + R35K/mo · Bare Metal R10,175,000 + R55K/mo · Two Practices R15,725,000 + R85K/mo | PIPELINE.md / SALES_LEADS.md |
| KiloClaw managed OpenClaw (reference) | $55/mo per instance; 20 clients ≈ $1,100/mo vs R150,000/mo revenue | infrastructure-guide.md |

### ⚠ Pricing conflict to resolve — [TUMELO TO CONFIRM]

The live Hermes intake form shows a **different** set of tier cards, labelled "Draft pricing", ex-VAT, pending approval:
`Starter R1,500` · `Company R2,800` · `Agentic Rise R4,500` · `Custom — Quoted` · `Not sure — Recommend one`.
These do **not** match the R3,500 / R7,500 / R15,000 tiers above. One set must be retired before the site publishes prices.
Recommended: keep **Starter / Business / Enterprise** as the commercial tiers, and re-label the intake cards as "indicative build scope" or delete them. [TUMELO TO CONFIRM]

### Governance rules that price this offering

- **Two-approval email rule** (LIBRARY.md): no email on Tumelo's behalf goes out without two separate explicit approvals of the finalized text; **any edit resets both approvals**. Draft by default.
- **No recommendation without evidence**: if an agent cannot read the data it stops and says so.
- Quote currency: ZAR, ex-VAT, 15% VAT added on quote. Payment links issued after human review; the intake form never takes money.

---

## 5. Homepage-ready hero copy (3 tiers)

> Copy below is final-draft. Prices are **ex-VAT**. Every line marked [TUMELO TO CONFIRM] must be approved before publishing.

### Tier 1 — Starter
- **Name:** Starter
- **One-line promise:** One always-on agent, on its own isolated workspace, running your business from day one.
- **Who it is for:** Single-owner businesses, consultants and solo traders who need one competent operator — not a platform.
- **Starting price:** **R3,500 / month** (ex-VAT)

### Tier 2 — Business
- **Name:** Business
- **One-line promise:** A microVM-isolated agent fleet with a shared command center — sales, content, research and web, all reporting to one screen.
- **Who it is for:** SMEs with a team and more than one channel to run: WhatsApp, web and social, with someone accountable for output.
- **Starting price:** **R7,500 / month** (ex-VAT)

### Tier 3 — Enterprise
- **Name:** Enterprise
- **One-line promise:** A dedicated Linux VM per client — hardware-level isolation, POPIA-grade data separation, and an agent registry your auditors can read.
- **Who it is for:** Regulated and multi-site operators, and channel partners reselling managed agents under their own brand.
- **Starting price:** **R15,000 / month** (ex-VAT)

### Recommended hero block (site-wide)
> **Four desks. One group.** Halaal Wagyu, speciality coffee, wheat and Global Markets — and now an AI operations layer for the businesses that move product.
> **Start with Hermes:** tell us what you should be built, get a PRD and a quote. No card details. No call required. — *CTA: "Start your project" → `hermes-intake`; secondary CTA: "Write to the desk" → `mailto:` (address to be unified)*
> ⚠ The two live CTAs must both be verified live before this block ships. [TUMELO TO CONFIRM]

---

## 6. Proof points — claimable now vs. not yet

### ✅ We can claim today

| Proof | Evidence |
|---|---|
| Live corporate site serving the four-desk brand | `studex-group.com` apex returns 200; nav Meat / Coffee / Markets / Wheat / OS |
| A working e-commerce storefront | `studexmeat.com` live on Shopify with priced products R350–R650 |
| A production AI intake funnel that outputs a PRD | `hermes-intake` (`index.html` + `app.js` + `src/api/submit.js`), `POST /api/submit`, POPIA consent gate, reference number returned |
| Two agent product lines with published, named agents and prices | 8 Super Agents (from R3,500/mo), 8 Dark Factory agents (BMAD R149–599/mo) |
| A repeatable build pipeline with a hard human gate | 4-station Foreman (classifier → analyst → implementer → reviewer); "Nothing merges, deploys, changes DNS, or spends until Tumelo says yes" |
| Proven one-command deployment capability | Vercel REST API deploy (`POST /api.vercel.com/v13/deployments`, admin token, 20 projects), Cloudflare Pages via `wrangler pages deploy` |
| A live agent command surface | Mission Control (8787), Control Hub API (42069), Fleet Bridge (18789), Gitea (3000), Huly (8087), OpenWebUI (3001) |
| A real agent fleet and knowledge base | ~25 agents incl. DenchClaw, OpenClaw, Naledi, Goose, Cypher Trace + Hermes fleet of 42 cloud agents on Qwen; Obsidian vault with 11 populated folders |
| A working homelab mesh | Tailscale tailnet `tailf7273b.ts.net`; MacBook Pro 5 `100.95.66.29`; HHD API on port 5335; Ollama on 11434; Herdr agent runtime |
| A live enterprise demo | IGH dashboard `ana12bhkl5m1.space.mcode.io`; client profile: 4 locations, 875K followers, R145K/mo leakage quantified |
| Channel-validated enterprise interest | PwC MEA AIOps via Anurag Byala (Techies Infotech) — full spec match: Mission Control + Swetrix + Prometheus/Grafana/OTel + Agent Registry; NDA ready |
| Trade desk reach | Saudi sheep RFQ (100 tons Grade AAA lamb, Jordan/CIF Aqaba), Eswatini letters to PM / ICT Minister / Huawei / Alibaba, Rwanda reference build |

### ❌ We must NOT claim yet

| Do not say | Why |
|---|---|
| "24/7 live agents" / "always running" | Orgo fleet frozen 9/10, 1 ERROR_STATE; no programmatic wake; port 9000 unreachable on frozen VMs |
| "Our Global Markets platform is live — sign up" | `global-markets-platform.workers.dev/signup` = NXDOMAIN |
| "The meat shop is closed while we reactivate it" | `studexmeat.com` is live with priced products — homepage copy is wrong today |
| "Enterprise-grade isolation / POPIA certified" | Isolation tiers are the target design; per-client microVM/VM provisioning is not yet proven end-to-end. POPIA *consent* in the intake form is real; certification is not |
| "We are deploying for PwC" | NDA ready, call not yet held. Say "NDA-ready, spec-matched" |
| "IGH is a signed client" | Proposal drafted; **client email missing from records**; no NDA/PRD sent |
| "We can supply 100 tons of lamb" | Supply side not confirmed on record |
| "WhatsApp bot is answering customers 24/7" | whatsapp.js has no session file; needs QR re-auth |
| Any uptime %, SLA or revenue figure | No measured baseline exists; do not publish numbers we cannot evidence |
| "Buy on the website" for Coffee/Wheat/Global Markets | No public checkout; wheat is quoted per contract |

---

## 7. The single biggest conversion risk — and the fix

**Risk: the site has no working self-serve conversion path, and it points people at two different price books.**

Today a visitor on `studex-group.com` can either (a) click "Write to the desk" and get a `mailto:` that depends on a human reading email, or (b) click "Global Markets" and land on `global-markets-platform.workers.dev/signup` — **NXDOMAIN**. The only real funnel (Hermes intake, which produces a PRD and a quote) is not the main site's primary CTA, and the two tier cards on that funnel contradict the published R3,500 / R7,500 / R15,000 tiers. Meanwhile the one thing that *is* live and transactable — `studexmeat.com` — is described on the homepage as closed. We are paying for traffic into a funnel with a broken second step, an inconsistent price book, and a credibility error sitting on the hero.

**Fix (one sprint, ordered):**
1. **Make Hermes intake the single primary CTA on the apex** — "Start your project" → the live intake URL, with "Write to the desk" demoted to a secondary text link.
2. **Repair or replace the Global Markets CTA** — point to `https://markets.studex-group.com` until a real signup host exists; add a UTM so clicks are measurable.
3. **Correct the meat copy** — replace "The Shopify counter at studexmeat.com is closed" with a live "Shop the counter at studexmeat.com" link (R350–R650 products).
4. **Unify one price book** on the page: Starter R3,500 / Business R7,500 / Enterprise R15,000 ex-VAT. Delete the conflicting R1,500 / R2,800 / R4,500 intake cards or re-label them clearly as build-scope indicators. [TUMELO TO CONFIRM]
5. **Unify the contact address** — pick `t.ramaphosa@studex-group.com` (brand record) or `t.ramaphosa@studex.dev` (live CTA) and use it everywhere, including canonical/structured data.
6. **Fix the canonical tag** to the host that answers 200 without a Cloudflare challenge.
7. **Instrument it**: one analytics event on intake submit (`POST /api/submit` already returns a reference id) and one on desk-click, so we can prove which desk converts instead of guessing.

Ship 1–3 before any new traffic spend. Nothing else on the site matters until the funnel does not dead-end.

---

*Prepared from the StudEx record set. Every price, ID, domain and endpoint above is copied from a source file; items I could not verify in the sources are marked [VERIFY] or [TUMELO TO CONFIRM].*
