---
name: security-secrets-review
description: Security and secrets review for Studex code — leaked keys, .env files, dependency CVEs, auth on endpoints and MCP tools, injection, and POPIA personal-data handling. Use before merging any PR, when touching auth/keys/env/CI secrets/dependencies, or when asked for a security audit.
---

# Security + secrets review

## 1. Secrets (run first)

```bash
# gitleaks — free, open source
docker run --rm -v "$PWD:/repo" zricethezav/gitleaks:latest detect --source /repo --no-banner --redact
# or, without docker:
pip install detect-secrets && detect-secrets scan --all-files
```
Also grep the diff for: `sk-`, `ghp_`, `AKIA`, `AIza`, `xox[bp]-`, `-----BEGIN`, `password=`, `api_key=`, `secret=`, `.env`.

Found one? Follow the security-officer playbook: report (never paste the value) → Tumelo rotates → then remove. Deleting in a new commit does not un-leak it.

`.gitignore` must cover: `*.env`, `.env*` (except `.env.example`), `secrets.*`, `*.pem`, `*.key`, `service-account*.json`, `.vercel`.

## 2. Dependencies

| Stack | Command (all free) |
|---|---|
| Python | `pip-audit` or `osv-scanner -r .` |
| Node | `npm audit --omit=dev` / `pnpm audit` |
| Containers | `trivy image <image>` / `trivy fs .` |
| Code patterns | `semgrep --config p/default` (Semgrep CE) |

Critical/high with a fix available = blocking.

## 3. Auth + input

- Every HTTP route and MCP tool except `/health` checks a token or session.
- Write/money-moving MCP tools require `confirm=true` (see mcp-server-builder).
- No string-built SQL, shell commands or HTML with user input — parameterise / escape. No `eval`, no `shell=True` with user data.
- CORS is not `*` on authenticated APIs.
- Webhooks verify signatures (Shopify HMAC, Stripe signature, etc.).

## 4. POPIA / personal data

- Identify personal info in the diff: names, SA ID numbers, phone numbers, emails, addresses, bank details.
- Stored in `africa-south1`, encrypted at rest (default on GCP) and in transit.
- Not logged, not in analytics, not in prompts to external models unless the PR says why and what is minimised.
- Retention stated for new tables/collections.

## 5. CI secrets

- GitHub Actions: `permissions:` set to least privilege at the top of each workflow.
- Third-party actions pinned to a version tag (or SHA for sensitive jobs).
- No `pull_request_target` with checkout of PR code.

## Output

A checklist comment with each section ✅ / ❌ and file:line references, ending with `SECURITY: pass` or `SECURITY: blocking (n issues)`.
