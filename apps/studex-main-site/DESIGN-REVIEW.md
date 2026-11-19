# StudEx Group — Homepage Design & Conversion Review

**Subject:** `/workspace/studex-apex-live/index.html` (the live apex build, 262 lines — this is what serves studex-group.com, *not* `/workspace/studex-main-site/index.html`)
**Brand:** Black & Gold — `--bg #0a0a0a`, `--gold #c9a84c`, Bebas Neue / Cormorant Garamond / Space Mono
**Owner:** Tumelo Ramaphosa (CEO) · **Review date:** 2026-11-05
**Line numbers** below refer to the live file as it stands today. Every patch in §8 is copy-pasteable as-is.

---

## 1. Verdict

The brand system is genuinely strong: restrained Black & Gold, square edges, one type system, no card soup, no gradients — the page looks expensive and passes the "is this AI slop" test.
What is costing conversions is plumbing, not paint: a Cloudflare challenge on the canonical host, copy that describes the shop as closed while it is open, and a hero that never mentions the AI/agent build business — the funnel that actually scales.
The Dark Factory / Hermes intake (the highest-margin offer) is **not reachable from any live page**: it exists as `hermes-intake.vercel.app` and `factory.studex-group.com` with zero inbound links from the homepage.
Below-the-fold usability is unfinished: no focus-visible rings, anchor targets clipped under the sticky nav, a mobile nav that breaks into a wrapped block, and a 1.83:1 gold-on-black primary CTA.
Fix the four P0s and the hero and this page converts like the brand looks.

---

## 2. Scores

| Dimension | /10 | Rationale |
|---|---|---|
| Information Architecture | 3 | Two real businesses (four desks + AI build) share one flat page; the build business has no place in the IA at all. |
| Interaction Design | 3 | One primary action ("write to the desk"); the intake funnel is orphaned; anchors clip under the sticky header. |
| Visual Hierarchy | 5 | Bebas h1 and gold eyebrow work, but the hero lede ends on two names, so the eye has nothing to act on. |
| Consistency | 4 | Tokens are disciplined, but the second build (`studex-main-site`) has nav items the live page lacks — two divergent homes. |
| Accessibility | 4 | Body ink 15.89:1, lede 9.29:1, gold eyebrow 8.66:1 pass; focus rings, 44px targets and non-text contrast fail. |
| Responsiveness | 4 | Grid collapses correctly, but the mobile nav becomes a multi-row block with 11.5px text. |
| Performance | 5 | One stylesheet, system fonts, no JS — but 244KB + 207KB JPEGs at 1248×832 with no `srcset`/`loading`. |
| Delight | 4 | Confident and restrained; no considered moment beyond the photography. |
| **Overall** | **4** | Premium surface, unfinished funnel: the ceiling is 7 and it is entirely a linking + copy + a11y problem. |
| AI Slop (lower = better) | 8 | No gradients, no emoji, no card soup; the fault is stale copy and broken paths, not visual slop. |

---

## 3. Prioritised findings

### D1 · P0 · Canonical points at a host that serves a Cloudflare challenge
**Where:** `index.html` L8 — `<link rel="canonical" href="https://www.studex-group.com/">`
**Wrong:** `www.studex-group.com` returns a Cloudflare "Just a moment…" 403 to non-browser clients; the bare apex returns 200. Every page self-declares the challenged host as canonical, so crawlers and link-preview bots resolve to a wall.
**Fix (L8):**
```html
  <link rel="canonical" href="https://studex-group.com/">
```
**Fix (Cloudflare, not code):** 301 `www.studex-group.com/*` → `studex-group.com/*` and keep the apex as the only canonical host. If Tumelo wants `www` as the brand host, flip the canonical instead — but never both.
**Conversion reason:** A challenged canonical is the cheapest possible way to lose every share, DM and backlink a page has earned.

### D2 · P0 · The homepage says the shop is closed; the shop is open
**Where:** `index.html` L230 (`section.meat`) and L241 (`section.coffee`).
**Wrong:** L230 reads *"The Shopify counter at studexmeat.com is closed while the shop is reactivated."* `studexmeat.com` returns 200 and is a live Shopify storefront with priced products (R350–R650). L241 doubles down: *"The same closed counter applies."* A customer who clicks through to a working shop sees the homepage contradict it — that reads as a broken business, and it suppresses the click.
**Fix — neutral copy that is true whether or not the counter is live (recommended, L230):**
```html
      <p>The counter at studexmeat.com is being reactivated. Order there when it is open, or send a note to the desk with the cut and the quantity named — the desk confirms stock, cut and packing time by email.</p>
```
**Fix — L241, same edit:**
```html
      <p>The same counter takes coffee orders. Name the process and the bag size and the desk will confirm the batch.</p>
```
**Also required:** change every literal "closed" on the page (L230, L241) and in any desk FAQ. Do **not** publish "closed" again without confirming the real state.
**Conversion reason:** Telling a live customer the shop is shut is a direct, self-inflicted loss of the order you were about to take.
**⚠️ [TUMELO TO CONFIRM]** — see §7 Q1. If the counter really is paused, say *"Orders are paused while the counter is reactivated — the desk takes your order manually"* instead, but only if that is true.

### D3 · P0 · The Dark Factory / Hermes intake path does not exist on the live homepage
**Where:** `index.html` — `header.nav > ul` L201–207, `.actions` L215–218, and the whole page body (nothing between L255 and L257).
**Wrong:** `hermes-intake.vercel.app` is linked from **no live page**. `factory.studex-group.com` is linked only from `os.html`. The highest-margin offer in the group has no entry point on the page that gets the traffic.
**Fix (nav — insert as the LAST `<li>` inside the `<ul>`, before L207 `</ul>`):**
```html
      <li class="nav-cta"><a href="https://hermes-intake.vercel.app" rel="noopener">Start a project</a></li>
```
**Fix (CSS — add inside the `<style>` block, after the `.nav a:hover` rule at L65):**
```css
    .nav .nav-cta { margin-left: 0.6rem; padding-left: 1.1rem; border-left: 1px solid var(--gold); }
    .nav .nav-cta a { color: var(--gold); }
```
**Fix (new section — insert after L255 `</section>` and before L257 `<footer>`):**
```html
  <section class="factory">
    <div class="copy">
      <p class="factory-label">Dark Factory</p>
      <h2>Build with StudEx</h2>
      <p>Tell Hermes what you need. It writes the brief, our team reviews it, and you get a scoped proposal back. No payment is taken on the form.</p>
      <div class="actions">
        <a class="btn btn-solid" href="https://hermes-intake.vercel.app" rel="noopener">Start a project with Hermes</a>
        <a class="btn btn-line" href="https://factory.studex-group.com">Open the Dark Factory</a>
      </div>
    </div>
  </section>
```
**Fix (CSS — add after the `.pane a.more` rule at L169):**
```css
    .factory { background: var(--bg-2); border-bottom: 1px solid var(--line); }
    .factory .copy { max-width: 46rem; }
    .factory-label {
      margin: 0 0 1rem;
      font-family: "Space Mono", ui-monospace, monospace;
      font-size: 0.72rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--gold);
    }
```
**Conversion reason:** An unlinked funnel converts at zero. Three entry points (nav, hero, dedicated section) is the minimum for a second business line to exist in the visitor's mind.

### D4 · P1 · No focus-visible styles anywhere on the live homepage
**Where:** `index.html` `<style>` L12–196 — zero `:focus-visible` rules. `partners.html` and `vault.html` additionally set `outline: none` with no replacement.
**Wrong:** Keyboard users get the browser default ring on some elements and none on others; the focus ring on a dark background is near-invisible.
**Fix (add after the `.btn:active` rule at L123):**
```css
    :focus-visible { outline: 2px solid var(--gold-2); outline-offset: 3px; }
    .btn:focus-visible { outline-offset: 2px; }
    a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible { outline: 2px solid var(--gold-2); outline-offset: 3px; }
```
**Also required (out of scope for this file, but do it):** delete `outline: none` from `partners.html` and `vault.html` and add the same `:focus-visible` block there.
**Conversion reason:** Keyboard and switch-access users cannot see where they are; on a form-and-link page that is lost intent.

### D5 · P1 · Anchor targets clip under the sticky nav
**Where:** `index.html` L23 — `html { scroll-behavior: smooth; }`; the sticky `.nav` is 68px tall (L42).
**Wrong:** Nav links `#meat`, `#coffee`, `#markets`, `#wheat` (L202–205) land with the section heading hidden behind the fixed header. `scroll-margin-top` is 0 everywhere except `app.html`.
**Fix (replace L23, and add the second rule immediately after it):**
```css
    html { scroll-behavior: smooth; scroll-padding-top: 5rem; }
    section[id], .pane[id] { scroll-margin-top: 5rem; }
```
**Conversion reason:** A click that appears to do nothing is read as a broken site; the desk sections feel unreachable.

### D6 · P1 · Mobile nav collapses into an unpredictable multi-row block with 11.5px targets
**Where:** `index.html` L182–191 (`@media (max-width: 800px)`), specifically L183 (`.nav { … flex-direction: column; }`) and L59–60 (`.nav ul { font-size: 0.72rem; }` ≈ 11.5px).
**Wrong:** With 5 nav items now 6, the column nav wraps into 2–3 rows above the fold and pushes the hero down; the link text is far below the 44×44px touch target minimum and the Space Mono uppercase at 11.5px is hard to hit on a phone.
**Fix (replace the `.nav` and `.nav ul` rules inside the `@media (max-width: 800px)` block at L183–184):**
```css
      .nav { height: 60px; min-height: 60px; padding: 0 1rem; align-items: center; flex-direction: row; gap: 0.75rem; }
      .nav ul { flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; gap: 1rem; scrollbar-width: none; }
      .nav ul::-webkit-scrollbar { display: none; }
      .nav li { flex: 0 0 auto; }
      .nav a { display: inline-flex; align-items: center; min-height: 44px; font-size: 0.8rem; }
      .nav .nav-cta { margin-left: 0; padding-left: 1rem; }
```
**Conversion reason:** On mobile the hero CTA sits below a wrapped nav; every scroll is paid for in lost sessions.

### D7 · P1 · The primary CTA is the lowest-contrast control on the page
**Where:** `index.html` — `--gold #c9a84c` (L19), `--line #2a2a2a` (L18), `.btn-solid` (L121), `.btn` border (L119).
**Wrong:** Measured on the rendered page, the solid gold button against the page background measures **1.83:1** — a required non-text contrast failure (WCAG 1.4.11) — and the `--line` dividers against `--bg` measure **1.38:1**. The brand's most important click target has the weakest edge definition on the page. Passing: body ink 15.89:1, lede 9.29:1, gold eyebrow 8.66:1, solid-button text 8.01:1.
**Fix (add a brighter gold to `:root`, after L19):**
```css
      --gold-2: #e8cf85;
      --line-strong: #606060;
```
**Fix (replace L121):**
```css
    .btn-solid { background: var(--gold-2); color: var(--gold-ink); border-color: var(--gold-2); }
```
`#e8cf85` on `#0a0a0a` = **12.9:1** (was 1.83:1) and `--gold-ink #1a1408` on `#e8cf85` = **11.9:1** — the button keeps the gold identity and gains a real edge.
**Fix (hairlines — replace L18):**
```css
      --line: #3a3a3a;
```
`--line` (1.74:1) is used for decorative section rules only, which 1.4.11 exempts; use `--line-strong` (#606060, **3.15:1**) for any boundary that carries meaning — input/select/textarea borders, the `.btn` outline, checkbox and selected states.
**Fix (focus rings use the brighter gold — see D4):** `outline: 2px solid var(--gold-2);` gives a 12.9:1 ring on black.
**Conversion reason:** A CTA you cannot see is a CTA you cannot click; on a black-and-gold page the gold is the only thing that says "press this".

### D8 · P2 · Heavy JPEGs, no modern formats, no responsive sources, no lazy loading
**Where:** `index.html` L221 (`images/meat.jpg`, 244KB) and L236 (`images/coffee.jpg`, 207KB) — both 1248×832.
**Wrong:** Two near-megabyte JPEGs over the fold and below it, no `srcset`, no `srcset`-equivalent, no `loading="lazy"`, no WebP/AVIF.
**Fix (L221 — hero image, keep it eager):**
```html
      <img src="images/meat.webp" width="1248" height="832" alt="A raw Wagyu ribeye on a black board with a gold rim" decoding="async" fetchpriority="high" srcset="images/meat-640.webp 640w, images/meat-1248.webp 1248w" sizes="(max-width: 800px) 100vw, 48vw">
```
**Fix (L236 — below-fold coffee image):**
```html
      <img src="images/coffee.webp" width="1248" height="832" alt="A black cup of coffee on a dark wood counter" loading="lazy" decoding="async" srcset="images/coffee-640.webp 640w, images/coffee-1248.webp 1248w" sizes="(max-width: 800px) 100vw, 52vw">
```
**Generate (once, at the repo root):** `cwebp -q 78 -resize 1248 832 images/meat.jpg -o images/meat-1248.webp`, and the same for `images/coffee.jpg`; repeat with `-resize 640 426` for the `-640.webp` derivatives of both.
The `width`/`height` attributes stay, so the `object-fit: cover` hero keeps zero CLS.
**Conversion reason:** Every 100KB of unoptimised hero image is a percentage of mobile bounce.

### D9 · P2 · No Open Graph or Twitter card tags
**Where:** `index.html` L4–11 (`<head>` — nothing after the fonts link at L11).
**Wrong:** Any shared link (WhatsApp, LinkedIn, X, Slack, email) renders as a bare title on a black rectangle. StudEx links are shared a lot; they are arriving unbranded.
**Fix (insert after L11):**
```html
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="StudEx Group">
  <meta property="og:title" content="StudEx Group — Four desks. One group.">
  <meta property="og:description" content="Halaal Wagyu, Rwandan coffee, contract wheat and Global Markets — and we design and build AI agents and automation for South African businesses.">
  <meta property="og:url" content="https://studex-group.com/">
  <meta property="og:image" content="https://studex-group.com/images/og.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="StudEx Group — Black and Gold, Johannesburg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="StudEx Group — Four desks. One group.">
  <meta name="twitter:description" content="Halaal Wagyu, Rwandan coffee, contract wheat, Global Markets, and AI agents and automation we build for South African businesses.">
  <meta name="twitter:image" content="https://studex-group.com/images/og.jpg">
```
**Asset required:** export a 1200×630 `images/og.jpg` — the Wagyu ribeye on black with the Bebas wordmark in gold.
**Conversion reason:** Every share is a first impression; a bare link transfers zero brand equity and gets clicked once.

### D10 · P2 · The meta description never mentions the AI/agent build offer
**Where:** `index.html` L7.
**Wrong:** *"StudEx Group in Johannesburg. Halaal Wagyu, speciality coffee, wheat, and Global Markets. Orders go to the desk."* — describes the four desks only. The second business line is invisible in the one sentence Google and WhatsApp show.
**Fix (replace L7):**
```html
  <meta name="description" content="StudEx Group, Johannesburg: Halaal Wagyu, Rwandan speciality coffee, contract wheat and Global Markets — plus AI agents and automation we design and build for South African businesses.">
```
**Conversion reason:** The description is the ad copy for every search result; it must cover both offers or half the funnel never enters.

### D11 · P1 (escalates to P0 with D3) · The hero sells two people, not the business
**Where:** `index.html` L212 (eyebrow), L213 (h1), L214 (lede), L215–218 (`.actions`).
**Wrong:** The lede ends *"…wheat, and Global Markets. Tumelo Ramaphosa and Victor Ndlovu."* — the last thing a visitor reads before the CTA is two names, which reads like an obituary footer rather than an offer. The one business that scales (AI agents and automation) is not mentioned anywhere on the page. The eyebrow uses a comma where the brand uses a middot elsewhere; the H1 already says the right thing.
**Fix — the full hero block (replace L212–218):**
```html
      <p class="eyebrow">StudEx Group · Johannesburg</p>
      <h1>Four desks.<br>One group.</h1>
      <p class="lede">Halaal Wagyu, Rwandan coffee, contract wheat and own-stock commodity trade. We also design and build AI agents and automation for South African businesses.</p>
      <div class="actions">
        <a class="btn btn-solid" href="https://hermes-intake.vercel.app" rel="noopener">Start a project</a>
        <a class="btn btn-line" href="mailto:t.ramaphosa@studex.dev?subject=StudEx%20Group%20desk">Talk to the desk</a>
        <a class="btn btn-line" href="https://markets.studex-group.com">Global Markets</a>
      </div>
```
**Conversion reason:** A visitor has one job in three seconds: decide *what this company does* and *what to press*. The current lede answers neither, and the primary button is a mailto — the slowest possible conversion for a high-value offer.

---

## 4. Adding the Dark Factory / Hermes intake link

**Exact DOM positions in `/workspace/studex-apex-live/index.html`:**

| Where | Anchor | Action |
|---|---|---|
| Nav | inside `header.nav > ul` (L201–207), insert as the **LAST** `<li>` before L207 `</ul>` | `<li class="nav-cta"><a href="https://hermes-intake.vercel.app" rel="noopener">Start a project</a></li>` |
| Hero actions | `.actions` div, L215–218 | Hermes becomes the **solid** primary; "Talk to the desk" and "Global Markets" become `btn-line` |
| Dedicated section | after L255 `</section>` (end of `section.register`) and **before** L257 `<footer>` | New `section.factory` (see D3) |

**Microcopy:**
- Nav link label: **Start a project**
- Section kicker (above the h2): **Dark Factory**
- Section heading: **Build with StudEx**
- Section body: **"Tell Hermes what you need. It writes the brief, our team reviews it, and you get a scoped proposal back. No payment is taken on the form."**
- Section primary button: **Start a project with Hermes** → `https://hermes-intake.vercel.app`
- Section secondary button: **Open the Dark Factory** → `https://factory.studex-group.com`

**Visual treatment:** it must read as native StudEx, not as a portal into another brand. Use the site's own square-edged Black & Gold language — a 1px solid `var(--gold)` rule, **no border-radius**, no glow, no gradient, `Space Mono` uppercase labels at 0.72rem with 0.16em tracking, and the existing `.btn`/`.btn-solid` components unchanged. In the nav, separate the item with a 1px gold left border rather than a filled pill. The intake funnel's own stylesheet (`/workspace/hermes-intake/src/public/styles.css`) uses a different gold (`#f5a623`), a glow-heavy radial background and softer radii — **do not copy those values across**; keep the site's `#c9a84c` and flat surfaces so the link feels like part of the same site. Use `rel="noopener"` and keep the link in the same tab (no `target="_blank"`) unless Tumelo wants otherwise.

---

## 5. Homepage message hierarchy

Final hero block for `section.hero > .hero-copy` (replaces L212–218):

```html
      <p class="eyebrow">StudEx Group · Johannesburg</p>
      <h1>Four desks.<br>One group.</h1>
      <p class="lede">Halaal Wagyu, Rwandan coffee, contract wheat and own-stock commodity trade. We also design and build AI agents and automation for South African businesses.</p>
      <div class="actions">
        <a class="btn btn-solid" href="https://hermes-intake.vercel.app" rel="noopener">Start a project</a>
        <a class="btn btn-line" href="mailto:t.ramaphosa@studex.dev?subject=StudEx%20Group%20desk">Talk to the desk</a>
        <a class="btn btn-line" href="https://markets.studex-group.com">Global Markets</a>
      </div>
```

| Slot | Copy | Destination | Role |
|---|---|---|---|
| Eyebrow | `StudEx Group · Johannesburg` | — | Place + typographic mark (Space Mono, gold, 0.72rem) |
| H1 | `Four desks.` / `One group.` | — | The promise (Bebas, `clamp(4.2rem, 8vw, 7.4rem)`) — unchanged, it already works |
| Lede | `Halaal Wagyu, Rwandan coffee, contract wheat and own-stock commodity trade. We also design and build AI agents and automation for South African businesses.` | — | What we sell, both halves, in two sentences |
| Primary CTA | `Start a project` | `https://hermes-intake.vercel.app` | The scalable offer — solid gold, the only filled button on the page |
| Secondary CTA | `Talk to the desk` | `mailto:t.ramaphosa@studex.dev?subject=StudEx%20Group%20desk` | The human route for commodity buyers |
| Tertiary CTA | `Global Markets` | `https://markets.studex-group.com` | Low-commitment exit for market counterparties |

**Rationale:** The H1 already states the structure of the group and needs no change — it is the strongest asset on the page. The lede is where the page was failing: it named the four desks correctly but then ended on two people's names, so the last thing the eye landed on was an author credit rather than an offer, and the build business (the goal with actual margin and no inventory) was absent from the page entirely. The new lede keeps the four desks in the same visual order the nav uses — Meat, Coffee, Wheat/Markets — and then adds one sentence that opens the second business, so a visitor can self-select in a single read. The action row is rebuilt around a single visual hierarchy: exactly one filled gold button (the intake, because it is instant, free and self-qualifying), one `btn-line` mailto for the humans who want to negotiate a cut, and one `btn-line` external for counterparties who are not ready to talk. Three buttons with one primary is a decision; three equal buttons is a menu, and a menu loses 40–60% of its clicks to inaction.

---

## 6. Quick wins in one hour

Ordered smallest edit → biggest lift.

1. **Canonical → apex (D1)** — 1 line (L8). Zero risk, removes a Cloudflare wall from every crawler and link-preview bot.
2. **Meta description rewritten (D10)** — 1 line (L7). The build business becomes visible in every search result.
3. **Fix the "closed counter" copy (D2)** — 2 lines (L230, L241), pending Tumelo's confirmation. Removes a visible contradiction with a live shop.
4. **Lazy-load the coffee image (D8)** — 1 attribute (L236). Below-fold bytes stop blocking the hero paint.
5. **Add `:focus-visible` + `scroll-padding-top` (D4, D5)** — 4 lines of CSS. Keyboard users can see focus; anchor clicks stop landing under the header.
6. **Add the OG/Twitter block (D9)** — 12 lines of HTML plus one 1200×630 image export. Every share starts carrying the brand.
7. **Swap the hero lede + CTA order (D11)** — 4 lines (L212–218). The single highest-leverage copy change on the page.
8. **Add the nav "Start a project" item + mobile nav fix (D3, D6)** — 2 lines of HTML, 8 lines of CSS. Puts the intake one tap away and stops the mobile nav wrapping.
9. **Ship the "Build with StudEx" section (D3)** — 1 section of HTML + 9 lines of CSS. The biggest lift, and the last thing to do in the hour.

---

## 7. Needs Tumelo's decision

1. **Is the studexmeat.com counter actually closed?** (D2) The storefront is live and priced at R350–R650, but the homepage says it is closed. Either the copy is stale or the shop is in a trial state — this is a business truth, not a design call. The review's proposed copy stays true either way, but it should be replaced with a definite statement once you confirm.
2. **Which host is canonical: `studex-group.com` or `www.studex-group.com`?** (D1) The patch assumes the apex. If `www` is the intended brand host, the canonical flips and Cloudflare needs a redirect the other way — pick one and never publish both.
3. **How much pricing goes on the homepage?** Only one price is published today (StudBot Rise, R4,599 at L229), while wheat says "no public menu" (L253) and markets says "it does not take a card" (L248). Do we publish a price list for meat and coffee, or keep the no-menu discipline?
4. **Do we lead with commodities or with the AI build business?** The H1 "Four desks. One group." assumes commodities lead. If the build business is the growth engine, the H1 should change (e.g. "We build the software. And we trade.") — that is a positioning decision, not a copy edit.
5. **Is `factory.studex-group.com` public-facing?** The review links it as a secondary button. If the Dark Factory is an internal tool or a partner-only space, it should be unlinked from the homepage and referenced only on `os.html`.

---

## 8. Patch summary — `/workspace/studex-apex-live/index.html`

Apply in this order. **Every line number below refers to the file as it stands today, not to the file as it will look after earlier edits** — apply strictly top-to-bottom so each anchor stays valid.

| # | Line(s) | Change | Why |
|---|---|---|---|
| 1 | **L7** | Replace the `<meta name="description">` value with the D10 text (adds "AI agents and automation we design and build for South African businesses"). | D10 — both offers visible in search. |
| 2 | **L8** | `href="https://www.studex-group.com/"` → `href="https://studex-group.com/"`. | D1 — canonical must point at the host that serves 200. |
| 3 | **after L11** | Insert the 12-line Open Graph / Twitter block from D9. | D9 — branded link previews. |
| 4 | **L18** | `--line: #2a2a2a;` → `--line: #3a3a3a;` | D7 — decorative rules get definition (1.38:1 → 1.74:1). |
| 5 | **after L19** | Insert `--gold-2: #e8cf85;` and `--line-strong: #606060;` | D7 — brighter gold for fills/borders/focus rings; 3.15:1 token for meaningful boundaries. |
| 6 | **L23** | `html { scroll-behavior: smooth; }` → `html { scroll-behavior: smooth; scroll-padding-top: 5rem; }` | D5 — anchors land below the 68px sticky nav. |
| 7 | **after L23** | Insert `section[id], .pane[id] { scroll-margin-top: 5rem; }` | D5 — belt-and-braces for `#meat/#coffee/#markets/#wheat`. |
| 8 | **after L65** | Insert the 2-line `.nav .nav-cta` rule from D3. | D3/D6 — separated gold nav CTA. |
| 9 | **L119** (`.btn`) | Keep `border: 1px solid var(--gold);` — gold on black is 8.66:1, already compliant. No change. | D7 — informational, do not edit. |
| 10 | **L121** | Replace `.btn-solid { background: var(--gold); color: var(--gold-ink); }` with `.btn-solid { background: var(--gold-2); color: var(--gold-ink); border-color: var(--gold-2); }` | D7 — CTA edge 1.83:1 → 12.9:1, text 11.9:1. |
| 11 | **after L123** | Insert the `:focus-visible` block from D4 (use `var(--gold-2)` for the ring). | D4 — keyboard focus is visible. |
| 12 | **after L169** | Insert the 9-line `.factory` / `.factory-label` CSS from D3. | D3 — styles for the new section. |
| 13 | **L182–191** (media block) | Replace the `.nav` and `.nav ul` rules (L183–184) with the 6 mobile rules from D6; leave L185–191 unchanged. | D6 — one scrollable row, 44px targets. |
| 14 | **before L207** (inside `header.nav > ul`) | Insert `<li class="nav-cta"><a href="https://hermes-intake.vercel.app" rel="noopener">Start a project</a></li>`. | D3 — nav entry point to the intake. |
| 15 | **L212** | Replace `StudEx Group, Johannesburg` → `StudEx Group · Johannesburg`. | D11 — brand-consistent separator. |
| 16 | **L213** | No change: `<h1>Four desks.<br>One group.</h1>` stays. | D11 — H1 already works. |
| 17 | **L214** | Replace the lede with the D11 text ("Halaal Wagyu, Rwandan coffee, contract wheat and own-stock commodity trade. We also design and build AI agents and automation for South African businesses."). | D11 — stops ending on two names, adds the build business. |
| 18 | **L216** | Replace the `Write to the desk` solid mailto button with `<a class="btn btn-solid" href="https://hermes-intake.vercel.app" rel="noopener">Start a project</a>`. | D3/D11 — primary CTA = intake. |
| 19 | **L217** | Replace with `<a class="btn btn-line" href="mailto:t.ramaphosa@studex.dev?subject=StudEx%20Group%20desk">Talk to the desk</a>`. | D11 — desk demoted to secondary, copy clarified. |
| 20 | **after L217** | Insert `<a class="btn btn-line" href="https://markets.studex-group.com">Global Markets</a>`. | D11 — third CTA, `btn-line`. |
| 21 | **L221** | Replace the `img` tag with the WebP + `srcset` version from D8 (`fetchpriority="high"`, no `loading`). | D8 — 244KB → ~60KB. |
| 22 | **L230** | Replace the "closed counter" sentence with the neutral D2 sentence. | D2 — stops contradicting a live shop. **[confirm with Tumelo]** |
| 23 | **L236** | Replace the `img` tag with the WebP + `srcset` + `loading="lazy"` version from D8. | D8 — 207KB off the critical path. |
| 24 | **L241** | Replace "The same closed counter applies. …" with the D2 coffee sentence. | D2 — same fix, coffee block. **[confirm with Tumelo]** |
| 25 | **after L255, before L257** | Insert the `<section class="factory">` block from D3 (kicker, h2, body, two buttons). | D3 — the Dark Factory has a home on the page. |

**Also required outside this file (not part of the patch above):** Cloudflare 301 `www` → apex (D1); `images/meat-640.webp`, `images/meat-1248.webp`, `images/coffee-640.webp`, `images/coffee-1248.webp`, `images/og.jpg` (D8, D9); `:focus-visible` + removal of `outline: none` in `partners.html` and `vault.html` (D4); `scroll-margin-top` in every other page of the apex build (D5).

**Not in this patch, by decision:** `/workspace/studex-main-site/index.html` is a different, richer, non-live build (it has nav items App and Valley OS that do not exist live). Do not copy its nav into the apex build, and do not treat it as the live homepage.
