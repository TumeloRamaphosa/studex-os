# StudEx Agent Operations

**Purpose:** Single source of truth for the operational foundation of StudEx — the AI-native business operated by coordinated agents under the owner (Tumelo Ramaphosa) as sole decision-maker.

**Owner:** Tumelo Ramaphosa (CEO, StudEx Group) — final authority on all consequential external actions.

**Compiled by:** Hermes (AI CTO / orchestrator), 2026-10-28T05:45:56Z
**Discovery mode:** READ-ONLY. No installs, deployments, purchases, permission changes, customer contact, or autonomous agent activation were performed.

## Navigation

| File | Purpose |
|---|---|
| `HERMES-CAPABILITIES.md` | Who Hermes is, where it runs, what it can do, and how other agents securely hand work to it and retrieve results |
| `SYSTEM-INVENTORY.md` | Machines, repositories, services, storage, and integration status with evidence + timestamps |
| `AGENT-REGISTRY.md` | Every known agent: purpose, runtime, model, owner, last verified success, permissions |
| `PRODUCT-STATUS.md` | Apps, prototypes, source code, designs — demonstrated vs mockup vs proposal; canonical source of truth per product |
| `CODEX-HANDOFF.md` | The handoff document intended for Codex: entry points, rules, where to write, what to read first |
| `DECISIONS-AND-BLOCKERS.md` | Open decisions requiring the owner, and hard blockers with evidence |

## Status legend

- **VERIFIED** — observed working or observed present, with a command/artefact cited and a timestamp.
- **UNTESTED** — configuration or credentials exist but the path was not exercised during this discovery.
- **PLANNED** — documented intent or scaffold only; no working implementation observed.
- **BLOCKED** — cannot proceed until the owner supplies a credential, permission, or decision.

## Ground rules encoded in these documents

1. One accountable coordinator per task. No task has two owners.
2. No agent may grant itself permissions, or approve its own consequential external actions.
3. Separated client workspaces; least-privilege access per agent lane.
4. Durable task IDs, progress, evidence, and artefact locations recorded for every task.
5. Clear handoff, retry, cancellation, and escalation rules.
6. No API keys, passwords, tokens, private keys, or full environment dumps are recorded in any of these files. Credentials are named by variable only, never valued.

## Related canonical sources (not duplicated here)

- `/workspace/studex-os/registry/` — agent / API / client / project registry (JSON)
- `/workspace/studex-os/obsidian/` — StudEx knowledge vault (Obsidian-format Markdown)
- `/workspace/agent-access-kit/agent-access-kit/AGENT-JOIN.md` — canonical agent onboarding protocol
- `/workspace/studex-os-pack/mcp-bridge/studex_mcp_bridge.py` — MCP bridge (read/write channel between agents)
- `/workspace/robusca-brain` — Robusca / War Room (chief-of-staff orchestrator)
