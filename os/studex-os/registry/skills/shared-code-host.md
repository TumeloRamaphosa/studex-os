---
name: shared-code-host
description: "Pipeline for hosting shared code: clone GitHub repos to /workspace, deploy static sites to Vercel via REST API, mirror to Google Drive, update the unified portal. Use when asked to host, deploy, or share code repositories."
triggers: ["deploy code", "clone repo", "push to drive", "mirror repository", "host static site", "share code", "vercel deploy", "github clone"]
---

# Shared Code Host Pipeline

## Quick Reference

### Repos Cloned
- `/workspace/daytona-agentic-os` → github.com/KbWen/agentic-os (AI agent governance)
- `/workspace/data-analytics-skills` → github.com/nimrodfisher/data-analytics-skills (31 data skills)

### Live Deployments
- **www.studex-group.com** → unified portal (both platforms + analytics)
- **studex-data-analytics.vercel.app** → analytics skills portal
- **factory.studex-group.com** → Dark Factory v3
- **superagents.studex-group.com** → Super Agents SaaS
- **markets.studex-group.com** → Russia Trade Week

### Vercel Credentials
```
Token (admin): ${VERCEL_TOKEN_ADMIN}
Token 2:       ${VERCEL_TOKEN_2}
```

## Pipeline

### Step 1: Clone Repo
```bash
git clone https://github.com/OWNER/REPO.git /workspace/REPO
```

### Step 2: Deploy to Vercel
```python
import urllib.request, json, base64, os, time

TOKEN = "${VERCEL_TOKEN_ADMIN}"
PROJECT_ID = "prj_kI7BKY4NZ41gGJ6Yhd3WuP8CECnC"  # find via GET /v6/projects
DIST = "/path/to/dist/"

def api(method, path, data=None):
    url = f"https://api.vercel.com{path}"
    headers = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}
    req = urllib.request.Request(url, method=method, headers=headers)
    if data: req.data = json.dumps(data).encode()
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read()), r.status
    except urllib.error.HTTPError as e:
        return json.loads(e.read()), e.code

files_data = {}
for fname in os.listdir(DIST):
    with open(os.path.join(DIST, fname), "rb") as f:
        files_data[fname] = base64.b64encode(f.read()).decode()

resp, code = api("POST", f"/v13/deployments?projectId={PROJECT_ID}", {
    "name": "project-name",
    "target": "production",
    "files": [{"file": k, "data": v} for k, v in files_data.items()]
})
# Poll GET /v13/deployments/{id} until ready
```

### Step 3: Mirror to Google Drive
Use gdrive CLI or rclone to copy repo to Drive folder `1iEL2dGPG3aeYSK6yVr8DCPDeEPrZoX4q`

### Step 4: Update Unified Portal
Edit `/workspace/studex-unified/dist/index.html` then redeploy to `prj_Nm7GT8v`
