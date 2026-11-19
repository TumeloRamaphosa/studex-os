# STUDBOT TASK PIPELINE — OPERATING NOTE
Owner: Hermes (CTO) | StudEx Meat | studex-auto-meat/board/
Reference: FDE Roadmap (pierpaolo28/Awesome-FDE-Roadmap) + eve-software-factory-template
Status: DRAFT v1

---

## OVERVIEW

A Studbot task moves through four sequential stations. Each station is a separate pass — a different agent reads the task at that station, does one job, and passes it on. No station reads the implementer's notes. No station approves the draft. Only Tumelo approves a draft to leave the board.

The run ends in a draft pull request. Nothing merges, deploys, changes DNS, or spends until Tumelo says yes.

---

## STATION 1 — CLASSIFIER

**Who:** The General (coordinator agent) or any agent that receives a task.
**Job:** Read the task. Answer one question: is this actionable?

**Three outcomes:**

- **ACTIONABLE** → route to Station 2. Tag the task: `[ACTIONABLE]`
- **NOT ACTIONABLE** → archive it. Tag: `[DROPPED]` with a one-line reason. No draft.
- **AMBIGUOUS** → return to the sender. Tag: `[NEEDS CLARITY]` with the specific question. No draft yet.

**What this station does NOT do:** plan, code, estimate, or judge the business value. Just classify.

---

## STATION 2 — ANALYST

**Who:** Hermes (CTO agent) or the lead analyst assigned to the room.
**Job:** Read the task. Answer: what is the change, and how do we know it worked?

**Deliverable — a brief that answers:**

1. **What changes** — the gap between the current state and the desired state, in plain language.
2. **What does NOT change** — explicit scope boundary. Anything not listed here is out of scope.
3. **Acceptance criteria** — concrete, testable conditions. "Works" is not an acceptance criterion. "Returns HTTP 200 with valid JSON" is.
4. **Which room owns this** — Global Markets / Meat / Super Agents / Dark Factory / Arcade / Countries.
5. **Specialty blocks triggered** — list which of the six agents must review (see BLOCKS section below).

**This station does NOT:** write code, write a PR, or open a branch.

---

## STATION 3 — IMPLEMENTER

**Who:** The agent assigned by the room's seat (per the COMMAND JOIN ORDER).
**Job:** Read the Analyst's brief. Make only the change described. Deliver a diff.

**Rules:**

- Change only what the acceptance criteria says to change. Nothing extra.
- No API keys in prompts, comments, or files. Name env vars only.
- Do not install anything on the Mac Mini. Do not start a second gateway next to ClawX.
- Do not change Hermes config. Do not switch the local model.
- Do not read the Obsidian vault or any keys file.
- No Payfast, Stitch, bank, Shopify, or crypto wallet login.
- If a payment or checkout screen is visible: stop. Do not read it.
- Do not change studexmeat.com. Cafe Noir is not a product in this pass.
- Leave the repo cleaner than you found it. No debug logs, no commented-out code in the diff.

**Deliverable:** A diff (the changed files, with context). Not a deployment, not a merge.

---

## STATION 4 — REVIEWER

**Who:** One agent, one review pass. The reviewer reads the diff only — not the implementer's notes.
**Job:** Judge the diff. State whether it passes or blocks.

**Reviewer blocks (each is a hard stop — Tumelo must approve before anything proceeds):**

| Reviewer | Blocks diffs that... |
|---|---|
| **Claudiou** | Change GitHub repos, Vercel projects, Cloudflare zones, DNS records, or spend money. |
| **Cryptopia** | Add a checkout, a price, a refund, a wallet, or a payment key. |
| **Adam Smasher** | Install on Mac Mini, start a gateway, change Hermes, or read a keys file. |
| **AutoMEat** | Change studexmeat.com, the theme, a price, a product, or Payfast. |
| **Robusca** | Read the Obsidian vault, change a memory note, or edit Hermes config. |
| **Coffee** | Add a coffee checkout, a roast city, a farm name, a shipping claim, or a live coffee price. |

**Other agents stay in the Export room and do not build.**

**Reviewer outcomes:**

- **PASS** → diff is clean for this reviewer. Move to next reviewer or to Tumelo.
- **BLOCK** → return to Implementer with the specific line or file. Do not continue. Tag: `[BLOCKED by <Reviewer>]`.
- **N/A** → this reviewer does not apply to this task. Note it and skip.

**Order of reviewer passes:** Claudiou → (specialty reviewer) → Tumelo.
The specialty reviewer (AutoMEat, Cryptopia, Adam Smasher, Robusca, or Coffee) runs after Claudiou and before Tumelo.

**This station does NOT:** approve the draft. It only judges the diff.

---

## TUMELO APPROVAL

**Who:** Tumelo Ramaphosa (Agent Lord).
**Job:** Review the draft. Decide to approve, reject, or request changes.

**Tumelo's approval is required for:**

- Any diff that merges, deploys, changes DNS, or spends money.
- Any diff that touches a payment system, checkout, or price.
- Any diff that installs on Mac Mini, starts a gateway, or changes core config.
- Any diff blocked and then resubmitted after review.

**After Tumelo approves:** the run is complete. The PR can be opened or the change can be applied.

---

## DIFF STATES

| Tag | Meaning |
|---|---|
| `[ACTIONABLE]` | Classifier has accepted this task |
| `[DROPPED]` | Classifier rejected it — no draft |
| `[NEEDS CLARITY]` | Returned to sender for more info |
| `[IN PIPELINE]` | In the Analyst's queue |
| `[IN REVIEW]` | With a reviewer |
| `[BLOCKED by <Reviewer>]` | Reviewer flagged an issue — return to Implementer |
| `[DRAFT READY]` | All reviewers passed — awaiting Tumelo |
| `[APPROVED]` | Tumelo approved — ready to apply |
| `[ARCHIVED]` | Abandoned or superseded |

---

## REPOSITORY RULE

Studex works like two references, without copying either repo. No repository is picked until Tumelo names one. No repo is modified without Tumelo's explicit approval.

---

## EXAMPLE TASK RUN

```
TASK received: "Update the contact form on the homepage"

Station 1 — Classifier:
  Tag: [ACTIONABLE]
  Route: Global Markets room

Station 2 — Analyst:
  Change: Replace static mailto: link with a form that POSTs to /api/contact
  Does NOT change: Theme, colors, nav, footer, pricing, Shopify
  Acceptance: Form submits → HTTP 200 → JSON {ok: true} logged
  Room: Global Markets
  Blocks: Claudiou only

Station 3 — Implementer (Global Markets agent):
  Writes: contact-form.html + api/contact handler
  Delivers: diff of 2 files

Station 4 — Reviewer:
  Claudiou: PASS (no GitHub/Vercel/Cloudflare changes)
  Result: [DRAFT READY]

Station 5 — Tumelo:
  Decision: APPROVED
  Tag: [APPROVED]

  → PR opened or change applied
```

---

## NOTES FOR AGENTS

- The four stations are separate passes. Do not combine them.
- The reviewer judges the diff only. Not the implementer's notes, not the brief, not the task description.
- An agent cannot approve its own draft.
- Tumelo approves. An agent does not.
- Keep the repo clean. No keys, no debug logs, no commented-out secrets.
- If you are unsure whether a diff triggers a specialty block — ask before you write the diff.
