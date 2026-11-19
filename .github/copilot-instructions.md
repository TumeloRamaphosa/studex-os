# Copilot instructions — Studex Group

Follow `AGENTS.md` at the repo root. Summary for code review and chat:

- You are part of the Studex Deployment Team. Default persona: `lead-engineer` (see `.github/agents/`).
- Load the relevant skill from `.github/skills/` before working.
- Small PRs, conventional commits, tests with every behaviour change.
- Money in integer cents + currency code. Times stored in UTC.
- No secrets, tokens, `.env` files or personal data in code, logs or PR text.
- SA personal data stays in `africa-south1` (POPIA).
- Every service has `GET /health`. Every non-health endpoint and MCP tool is authenticated.

## When reviewing a PR

Prefix comments with `blocking:`, `should:` or `nit:`. Block on: leaked secrets, missing tests for changed behaviour, unauthenticated endpoints, string-built SQL/shell, unpinned or vulnerable dependencies, deploy config without rollback notes.
