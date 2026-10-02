# STUDEX NEXUS — Agent Roll Call

> Purpose: register every agent in the fleet. Agent Lord sends this prompt to
> each agent (Hermes profiles, OpenClaw agents, Buzz fleet, Base44, external
> CLI agents). Their replies get filed into the data room under Agents/.
>
> Source of truth for fleet state afterwards: `~/studex-os/nexus/seats.json`
> (heartbeats update it; roll call fills it).

---

## THE PROMPT (copy-paste, agent-agnostic)

```text
[STUDEX NEXUS — AGENT ROLL CALL]

You are being formally registered in the StudEx Nexus operating system.
The Agent Lord (Tumelo Ramaphosa) is consolidating every agent into one
fleet registry. Respond to this roll call with EXACTLY the following,
in this order. Be honest about status — "broken" or "not set up" are
valid answers. Do not invent capabilities you don't have.

1. IDENTITY
   - Agent name:
   - Seat / role (one line):
   - Who built you / what framework runs you (Hermes, OpenClaw, Claude Code, Base44, other):

2. FUNCTION
   - What is your job in one sentence?
   - Your three most important capabilities:
   - What you DO NOT do (boundaries):

3. CURRENT STATE
   - Status right now (online / idle / broken / not deployed):
   - Where you run (which machine, VM, or cloud):
   - Current task, if any:

4. CONNECTIONS
   - What platforms/tools you can actually reach (email, WhatsApp, calendar, GitHub, etc.):
   - What credentials/access you are missing:

5. REPORTING
   - Reply-to address / channel where the fleet can reach you:
   - How often you report and to whom:

6. ONE THING
   - The single most valuable task you could do for StudEx in the next 24 hours:

END OF ROLL CALL — return answers in plain text. You will be saved to the
StudEx data room registry. Agent Lord has final approval on your seat.
```

---

## File replies here

- Save each reply as `~/studex-os/nexus/inbox/rollcall-<agent-name>.md`
- After review: update `seats.json`, then file the approved profile in the
  data room (Notion Command Center Drive → Clients/ or a new Agents/ folder)
- Data room rule (from the Notion OS): **no secrets in these files** — reply
  text should never include keys/tokens; if an agent leaks one, redact before
  filing and flag for rotation.

## Roll-call targets (who to send it to)

1. Hermes profiles on this Mac: creative-lead, data-scientist, devops, qa, qwen-scribe, support, swe
2. OpenClaw main agent + gateway
3. Buzz fleet (7): Katjana, OpenClaw, CashClaw, Naledi, Goose, Auto-Meat, Cypher Trace (+ Robusca-Prime)
4. Base44 WhatsApp agent (+1 703-457-1882)
5. External CLI agents: Claude Code, Codex, OpenCode sessions
6. StudBot architect agent (via handoff doc — already sent)

---
*Created by QA-Bot, 2026-09-14. Agent Lord approves final registry.*