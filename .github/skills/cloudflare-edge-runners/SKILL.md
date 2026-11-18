---
name: cloudflare-edge-runners
description: Build and deploy on Cloudflare for Studex — Workers, Pages, R2, KV/D1, Durable Objects, DNS — and run ephemeral GitHub Actions runners in Cloudflare Sandboxes for agent CI. Use for wrangler config, Workers deploys, DNS changes, edge MCP endpoints, or self-hosted Cloudflare runners.
---

# Cloudflare edge + runners (Studex)

## Workers deploy (GitHub Actions)

```yaml
permissions: { contents: read }
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production          # Tumelo approves
    steps:
      - uses: actions/checkout@v4
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ vars.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy
```

- `wrangler.jsonc` in git; secrets via `wrangler secret put NAME` (never in `vars`).
- API token scoped to the single account + only the permissions needed (Workers Scripts:Edit, etc.).
- Preview: `wrangler versions upload` then `wrangler versions deploy` for gradual rollouts; rollback with `wrangler rollback`.

## Edge MCP endpoint

Cloudflare's `agents` SDK (open source, `cloudflare/agents`) can host a remote MCP server on Workers with Durable Objects for state. Follow `mcp-server-builder` tool rules: auth on everything but `/health`, `confirm` on write tools.

## Cloudflare runners (ephemeral CI)

Pattern: a small Worker exposes `POST /runners`; each call starts a Cloudflare Sandbox, fetches a short-lived GitHub runner registration token and registers an **ephemeral** runner that takes exactly one job, then dies.

- Needs: Workers Paid plan, a GitHub App or fine-grained token with Administration:write on the target repos (stored as a Worker secret), a `CONTROL_TOKEN` to call the Worker.
- Label runners `self-hosted, cloudflare`. Jobs opt in with:
  ```yaml
  runs-on: [self-hosted, cloudflare]
  ```
- Trigger: a `workflow_job` webhook (queued) → Worker → start sandbox. Start with manual `POST /runners` until it's proven.
- Only for trusted repos. **Never** use self-hosted runners on public repos that accept fork PRs.
- Free fallback: actions-runner-controller (ARC) on any k3s box, or GitHub-hosted runners.

Cloudflare also ships `@cloudflare/ci` (TypeScript CI on Workflows). It's not a drop-in for Actions YAML — use it only for new pipelines and write an ADR first.

## DNS

- Change records via PR to an `infra/cloudflare/` OpenTofu config or a documented `wrangler`/API script. Write before/after in the PR.
- Proxied (orange cloud) by default for web; DNS-only for mail records.
