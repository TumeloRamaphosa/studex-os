---
name: supabase-data
description: Studex database work on Supabase — schema design, migrations, row-level security, generated types, edge functions, storage and auth, using the Supabase CLI and branches. Use for any change under supabase/, any SQL migration, RLS policy, or Supabase edge function.
---

# Supabase data (Studex)

Supabase also publishes its own agent skills — install them alongside this one: `npx skills add supabase/agent-skills`.

## Local loop (free, open source CLI)

```bash
npm i -g supabase            # or: brew install supabase/tap/supabase
supabase init                # once
supabase start               # local Postgres + Studio in Docker
supabase migration new add_orders
# edit supabase/migrations/<ts>_add_orders.sql
supabase db reset            # rebuild local DB from all migrations + seed
supabase gen types typescript --local > src/types/database.ts
supabase test db             # pgTAP tests in supabase/tests/
```

## Migration rules

- One concern per migration, forward-only. Never edit a migration that has run in production.
- Every new table in `public` (or any exposed schema):
  ```sql
  alter table public.orders enable row level security;
  create policy "owner can read" on public.orders for select using (auth.uid() = user_id);
  ```
- Money: `bigint` cents + `text` currency. Times: `timestamptz` default `now()`.
- Indexes for every foreign key and every column used in a frequent `where`.
- Destructive change = two PRs: (1) add new + backfill + dual-write, (2) drop old after Tumelo confirms.

## Deploy (GitHub Actions)

```yaml
permissions: { contents: read }
steps:
  - uses: actions/checkout@v4
  - uses: supabase/setup-cli@v1
  - run: supabase link --project-ref ${{ vars.SUPABASE_PROJECT_REF }}
    env: { SUPABASE_ACCESS_TOKEN: "${{ secrets.SUPABASE_ACCESS_TOKEN }}", SUPABASE_DB_PASSWORD: "${{ secrets.SUPABASE_DB_PASSWORD }}" }
  - run: supabase db push
    env: { SUPABASE_ACCESS_TOKEN: "${{ secrets.SUPABASE_ACCESS_TOKEN }}", SUPABASE_DB_PASSWORD: "${{ secrets.SUPABASE_DB_PASSWORD }}" }
  - run: supabase functions deploy
    env: { SUPABASE_ACCESS_TOKEN: "${{ secrets.SUPABASE_ACCESS_TOKEN }}" }
```
Run against a preview branch first; production job sits behind the protected `production` environment.

## Keys

- `service_role` / secret keys: server, edge functions and CI only.
- Browser/mobile: publishable (anon) key + RLS. If RLS is off, the table is public — treat as blocking.

## Checks before PR

- [ ] `supabase db reset` clean locally
- [ ] RLS enabled + at least one policy per new table
- [ ] Types regenerated and committed
- [ ] Supabase advisors (security + performance) show no new errors
