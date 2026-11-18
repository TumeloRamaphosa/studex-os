---
name: gcp-deploy
description: Deploy Studex services to Google Cloud — Cloud Run containers, Artifact Registry, Secret Manager, Firestore/Cloud SQL, GitHub Actions with Workload Identity Federation, canary rollouts and rollbacks. Use for any Dockerfile, Cloud Run, gcloud, Cloud Build or GCP infrastructure task.
---

# Google Cloud deploy (Studex)

## Defaults

| Thing | Default |
|---|---|
| Region | `africa-south1` (Johannesburg) — required for SA personal data (POPIA). `europe-west1` only for workloads with no SA personal data that need a feature missing in africa-south1. |
| Compute | Cloud Run (service). Cloud Run Jobs for batch. GKE only with an ADR. |
| Images | Artifact Registry: `africa-south1-docker.pkg.dev/$PROJECT/studex/<service>:<git-sha>` |
| Secrets | Secret Manager, mounted as env vars (`--set-secrets`). Never in images or git. |
| CI auth | GitHub Actions → Workload Identity Federation. No JSON keys. |
| IaC | OpenTofu (free, open source) or plain `gcloud` scripts in `infra/`. |

## Dockerfile (Python example)

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
USER 1000
ENV PORT=8080
CMD ["python", "server.py"]
```
Listen on `$PORT`. Expose `/health`. Non-root user. Pin the base image minor version.

## GitHub Actions deploy job

```yaml
permissions: { contents: read, id-token: write }
jobs:
  deploy:
    environment: production        # protected: Tumelo approves
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ vars.GCP_WIF_PROVIDER }}
          service_account: ${{ vars.GCP_DEPLOY_SA }}
      - uses: google-github-actions/setup-gcloud@v2
      - run: gcloud auth configure-docker africa-south1-docker.pkg.dev --quiet
      - run: |
          IMAGE=africa-south1-docker.pkg.dev/${{ vars.GCP_PROJECT }}/studex/${{ vars.SERVICE }}:${{ github.sha }}
          docker build -t "$IMAGE" . && docker push "$IMAGE"
          gcloud run deploy ${{ vars.SERVICE }} --image "$IMAGE" --region africa-south1 \
            --no-traffic --tag "sha-${GITHUB_SHA::7}" \
            --set-secrets "MCP_AUTH_TOKEN=mcp-auth-token:latest"
```

## Canary + rollback

```bash
# smoke test the tagged revision URL first
curl -fsS "https://sha-abc1234---<service>-<hash>.a.run.app/health"
gcloud run services update-traffic <service> --region africa-south1 --to-tags sha-abc1234=10
gcloud run services update-traffic <service> --region africa-south1 --to-latest   # 100%
# rollback
gcloud run revisions list --service <service> --region africa-south1
gcloud run services update-traffic <service> --region africa-south1 --to-revisions <previous-rev>=100
```

## One-time setup (Tumelo runs, documented in the PR)

```bash
gcloud services enable run.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com iamcredentials.googleapis.com
gcloud artifacts repositories create studex --repository-format=docker --location=africa-south1
# Workload Identity Federation for GitHub: see google-github-actions/auth README ("Direct WIF" or "via service account")
```

## Cost guardrails

- `--min-instances 0` unless latency demands it; `--max-instances` always set (start at 5).
- Set a billing budget alert. Put the monthly estimate in the PR.
- Open-source fallback for any managed service you add (e.g. Cloud SQL → self-hosted Postgres; Firestore → Supabase/Postgres).

## Never

- `gcloud ... delete` on production resources, or `--allow-unauthenticated` on anything except a public website — flag it for Tumelo instead.
