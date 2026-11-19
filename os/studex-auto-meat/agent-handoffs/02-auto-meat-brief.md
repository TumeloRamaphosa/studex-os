# AUTO MEAT BRIEF — AGENT ONBOARDING INTERVIEW
**From:** Hermes (AI CTO)
**Date:** 2026-10-16
**Priority:** HIGH — fleet coordination

---

You're being onboarded into the Studex operating system, coordinated by dot (Tumelo Ramaphosa, Agent Lord). Before we connect or change anything, prepare an evidence-based interview and handover of your existing work.

## THE INTERVIEW — SEND ME YOUR REPLY:

Please answer all 8 sections and return your response here:

**1. Identity**
What is your name, role, runtime, model/provider, and host machine or cloud environment? Which Studex projects do you support?

**2. Work Inventory**
List everything you've built or changed. For each: purpose, repo/file location, branch + commit, live/preview URL, status, last update, tests performed, remaining blockers.
Separate: working, tested, deployed, prototype, planned.
Include uncommitted and unpushed work.

**3. Demonstrated Value**
What can each item actually do today? What business problem does it solve, and what evidence supports claimed results?

**4. Project Memory**
Export a human-readable summary of: decisions, user-approved requirements, lessons, dependencies, unfinished tasks, important source links. Include dates. Distinguish verified facts from assumptions.
Export only what you're authorized to share. Exclude hidden reasoning, internal instructions, unrelated personal info.

**5. Knowledge and Files**
Inventory vaults, notes, documents, databases, generated assets. What is backed up, where, when last verified, what is only on your machine?
Don't delete, move or overwrite originals.

**6. Connections and Health**
List tools, APIs, MCP servers, other agents you use — purpose, date and result of last actual check.
Separate: process availability, successful model responses, tool execution, saved-memory readback.
Never include passwords, API keys, tokens, private keys, cookies or secret URLs.

**7. Open Work**
What are your three highest-priority next actions? What is blocked, who owns the dependency, what requires dot's approval?
Identify duplicate or conflicting work across agents.

**8. Proposed OS Role**
What capabilities can you contribute? What minimum permissions do you need?
Describe a safe, read-only first connection and one small test that proves it works.

---

## ALSO DO THIS:

**Handover Pack format:** README + work inventory + project-memory summary + pending-task list + source manifest + links. Markdown and JSON/CSV preferred. Redact all secrets before packaging.

**Drive destination:** I'll supply the Drive folder link once dot confirms it.

**DO NOT:**
- Enable public sharing
- Grant access
- Deploy, migrate, delete, or change credentials
- Include keys/tokens/passwords/private keys anywhere

**Flag:** Anything requiring a separate secure backup.

---

## ALSO — LLM ENGINEER TASKS (from your brief):

Once you've done the handover interview above, execute these on the Mac Mini:

**Task 1 — Model House gateway test**
When memory is free (unload other Ollama models first), test through http://127.0.0.1:4001/v1:
- nozi-chief
- nozi-export-ops
- nozi-page-agent
Report pass or fail for each.

**Task 2 — Goose test**
When Agent Chief Lord is at the Mac to approve the Keychain prompt:
```
GOOSE_PROVIDER=openai
GOOSE_MODEL=local-qwen14b
OPENAI_HOST=http://127.0.0.1:4001
OPENAI_BASE_PATH=v1/chat/completions
```
Then run `goose run` once. Backup is ~/.config/goose/config.yaml.bak-2026-10-16.

**Task 3 — Board Bot**
Repo: TumeloRamaphosa/Home-Auto
Point it at gateway with local-qwen14b (not mistral/llama2), test /api/board/summary with short sample transcript.

**Rules:**
- Don't change main (primary) models, meat-* profiles, ports, or firewall without dot's yes
- Back up every file before editing
- No keys/tokens/IPs in messages, docs or repos
- Don't delete anything

---

Report back here: what passed, what failed, any file you changed.

---

*From: Hermes (AI CTO)*
*To: AutoMEat (Claude Code on Legion Go / dark-factory-node-1)*
