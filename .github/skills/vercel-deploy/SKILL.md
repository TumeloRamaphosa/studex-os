---
name: vercel-deploy
description: Ship Studex front-ends, dashboards and static sites on Vercel — project linking, preview vs production deploys, env vars, domains, rollbacks, and working alongside the Foreman software factory. Use for any vercel.json, Next.js deploy, Vercel env var, domain or rollback task.
---

# Vercel deploy (Studex)

## Defaults

- Git integration: every PR gets a preview deployment; merging to `main` deploys production.
- Static command decks (plain `index.html`): no build step; set Framework Preset = Other, output directory = repo root or `dashboard/`.
- Next.js: App Router, Node 20, `NEXT_PUBLIC_*` only for non-secret values.
- Region for functions: `cpt1` (Cape Town) when the data or users are South African; otherwise default.

## CLI (free)

```bash
npm i -g vercel
vercel link                      # once per repo
vercel env pull .env.local       # local dev only — .env.local is gitignored
vercel                           # preview
vercel --prod                    # production (only from main, only with approval)
vercel rollback <deployment-url> # instant rollback
```

## GitHub Actions (when not using the Git integration)

```yaml
permissions: { contents: read }
env:
  VERCEL_ORG_ID: ${{ vars.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ vars.VERCEL_PROJECT_ID }}
steps:
  - uses: actions/checkout@v4
  - run: npm i -g vercel
  - run: vercel pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
  - run: vercel build --token=${{ secrets.VERCEL_TOKEN }}
  - run: vercel deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }}
```

## PR checklist

- [ ] Preview URL pasted and clicked through
- [ ] New env vars added in Vercel for Preview **and** Production, documented in README
- [ ] No secrets in client bundle (`grep -r "sk-\|secret" .next/static` returns nothing)
- [ ] Rollback target noted (current production deployment URL)

## Foreman (Vercel eve software factory)

- Template: `vercel-labs/eve-software-factory-template` (MIT). Deploy it to the Studex Vercel team, connect GitHub (and Linear if used) through Vercel Connect.
- It works issues labelled `factory`, opens **draft** PRs and fixes its own red CI. Merge stays human.
- Point Foreman's "factory brain"/instructions at this repo's `AGENTS.md` and `.github/skills/` so it follows the same standards as Copilot.
- Check the template README for current setup steps; it is new and changes often.
