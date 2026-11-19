# Hermes Daily Intelligence Skill

## Purpose
Daily GitHub + skills review for the Hermes Army. Keeps all agents sharp, skills fresh, and memory current.

## Trigger
Run daily at 7:30 AM (before 9AM board meeting) and at 6PM (end of day).

## Steps

### 1. GitHub Updates Check
```bash
# Check latest commits on all monitored repos
cd /workspace/nexus-agents-nest && git fetch origin && git log --oneline -3
cd /workspace/studex-nexus-temp && git fetch origin && git log --oneline -3

# Check for any new repos
curl -s "https://api.github.com/users/TumeloRamaphosa/repos?sort=updated&per_page=10" | jq '.[] | {name, updated_at, html_url}'
```

### 2. Hermes Skills Audit
```bash
# List all skills
ls ~/.hermes/skills/

# For each skill, check if it needs updating:
# - Has it been used in the last 7 days?
# - Is it still accurate?
# - Are there missing steps or wrong commands?
```

### 3. Nexus Agents Nest Updates
```bash
cd /workspace/nexus-agents-nest
git fetch --all --recurse-submodules
git submodule update --init --recursive
```

### 4. Memory Audit
Check memory entries — remove stale ones, update outdated ones.

### 5. Obsidian Vault Sync
Save daily log to:
- /workspace/nexus-agents-nest/studex-obsidian-vault/daily/YYYY-MM-DD.md
- /workspace/nexus-agents-nest/memory/YYYY-MM-DD-hermes.md

### 6. Fleet Status Quick Check
```bash
curl -s -H "Authorization: Bearer ${ORGO_API_KEY}" \
  "https://www.orgo.ai/api/v1/desktops" | jq '.'
```

## Output Format
Daily intelligence report saved to:
- nexus-agents-nest/studex-obsidian-vault/daily/YYYY-MM-DD.md
- nexus-agents-nest/memory/YYYY-MM-DD-hermes.md

## Key Skills to Monitor
- studex-super-agents-ops (CTO reports, Discord status)
- orgo-ai-fleet-check (VM health)
- studex-discovery-call-framework (sales)
- openwa-whatsapp-gateway (WhatsApp)
- vercel-rest-deploy (deployments)
- larry-marketing-skill (TikTok automation)

## Pitfalls
- Don't overwrite previous days' logs
- Always append to existing memory, don't replace
- Check submodule status before reading submodule code
- Orgo API rate limits: max ~60 req/min on free tier
