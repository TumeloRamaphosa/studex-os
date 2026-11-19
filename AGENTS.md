# AGENTS.md — Studex Group

Read by GitHub Copilot, Claude Code, Cursor, Codex and any agent that follows the AGENTS.md standard.

## Who's who

- **Owner / sole human approver:** Tumelo Ramaphosa (founder & chairman, Studex Group).
- **Engineering:** the Studex Deployment Team: (1) GitHub Copilot — lead engineer, (2) Google Gemini Spark — Google Cloud lane, (3) Vercel Foreman — Vercel lane, (4) Cloudflare runners — edge + CI lane, (5) Supabase team — data lane. Agent profiles: `.github/agents/`. Skills: `.github/skills/` (source of truth: the Skills Vault in TumeloRamaphosa/Deployment-team). Routing labels: `agent:*` and `lane:google|vercel|cloudflare|supabase`.

## Ground rules for every agent

1. Work on a branch, open a PR, never push to `main`, never merge your own PR.
2. Load the matching skill before you start (`studex-coding-standards` for any code; `mcp-server-builder`, `gcp-deploy`, `vercel-deploy`, `cloudflare-edge-runners`, `supabase-data`, `security-secrets-review` when relevant).
3. No secrets or personal data in git, logs or prompts. Keys live in Secret Manager / Actions secrets / `~/.studex-os/secrets.env`.
4. Tests and lint must pass; paste the output in the PR.
5. Destructive or production actions are written up for Tumelo, not executed.
6. Prefer popular free open-source tools; name the open-source alternative whenever you choose a paid one.

## Repo-specific notes

StudEx Nexus — the agentic OS (build 1.1.0). See `README.md` and `STATUS.md`.
- Install: none — Python 3 stdlib only, no compile step.
- Test: `python -m pytest -q mcp` (or `python mcp/test_engine.py`) — 17 tests.
- Run locally: `bash scripts/up.sh` then `bash scripts/doctor.sh`. Engine on `127.0.0.1:8765` (`/health`, `/fleet`, `POST /tool`).
- Deploy target: Vercel (`dashboard/` command deck → studex-nexus.vercel.app). Engine runs on local machines, not in the cloud.
- Data files `seats.json`, `businesses.json`, `drive.json` are the registries — keep them valid JSON; change only when an issue asks.
- Agent identities live in `agents/<name>/` (IDENTITY.md, INDUCTION_PROMPT.txt, state.json).
- Secrets: `~/.studex-os/secrets.env` and `~/.openclaw/keys/` — never in this repo.
