---
name: studex-coding-standards
description: Studex Group coding standards for Python, TypeScript/JavaScript, shell and static sites — structure, naming, testing, logging, commits and PR rules. Use whenever writing, changing or reviewing code in any Studex repository.
---

# Studex coding standards

## Everywhere

- Small PRs (≤400 changed lines). One concern per PR.
- Conventional commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `ci:`, `chore:`.
- Every behaviour change ships with a test. Bug fix = failing test first.
- Config from environment variables; document every new variable in the README with a safe example value.
- Never log secret values, tokens, or personal data. Log the key *name* if you must.
- A service exposes `GET /health` returning `{"status":"ok"}` with HTTP 200.
- Times are UTC in storage, `Africa/Johannesburg` only at display.
- Money is integer minor units (cents) plus an ISO currency code (`ZAR`, `USD`, `RWF`). Never floats.

## Python (3.11+)

- Format + lint: `ruff format` and `ruff check` (free, open source). Types: type hints on public functions; `mypy` or `pyright` where configured.
- Tests: `pytest` (or the repo's existing `unittest` files — run them as they are, e.g. `python -m pytest mcp/` or `python mcp/test_engine.py`).
- Prefer the standard library; add a dependency only when it removes real code. Pin in `requirements.txt` or `pyproject.toml`.
- Paths via `pathlib`, roots overridable by env (`STUDEX_OS_ROOT` pattern).

## TypeScript / JavaScript (Node 20+)

- `strict: true` in tsconfig. ESLint + Prettier, or Biome (free) if the repo uses it.
- Tests: Vitest (or the repo's existing Jest).
- Use the lockfile the repo already has (`pnpm-lock.yaml` → pnpm, `package-lock.json` → npm). Don't switch package managers in a feature PR.
- Next.js / React: server components by default, no secrets in `NEXT_PUBLIC_*`.

## Shell

- `#!/usr/bin/env bash` + `set -euo pipefail`. Quote variables. Pass `shellcheck`.
- Scripts are idempotent: safe to run twice.

## Static sites / dashboards

- No build step unless the repo already has one. Keep `index.html` self-contained or with relative assets.
- No API keys in client JS. Call a server/edge function instead.

## Agent files

- Agent identity/prompt files (`agents/*/IDENTITY.md`, `INDUCTION_PROMPT.txt`, `seats.json`, `businesses.json`) are product data: change them only when the issue asks, and keep JSON valid (`python -m json.tool file.json`).

## Definition of done

- [ ] Tests + lint pass locally and in CI (output pasted in PR)
- [ ] README/docs updated for new commands, env vars or endpoints
- [ ] No secrets, no personal data in the diff
- [ ] PR template filled in, including rollback
