# Studex OS — Daily Routines

## 8AM Morning Briefing (Mon-Fri)
Cron: `0 8 * * 1-5`

Posts to Discord + saves to Gitea:
- Fleet health (all 10 VMs)
- Client project status
- Build progress
- Top 3 actions for Tumelo
- GitHub trending highlights

## 12PM Midday Check
Cron: `0 12 * * 1-5`

Posts to Discord:
- What got done this morning
- What's still in progress
- Blockers flagged
- Robusca + ADAM status update
- Tumelo's attention items

## Setup

```bash
# Set environment variables
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
export ORGO_API_KEY="${ORGO_API_KEY}"
export LINEAR_API_KEY="lin_api_..."

# Run manually
python3 morning_briefing.py
python3 midday_check.py
```

## Files
- `morning_briefing.py` — 8AM main briefing
- `midday_check.py` — 12PM progress check
- GitHub trending researcher: `/workspace/studex-trending-research/github_trending_researcher.py`
