---
name: Hourly Report System
type: system
status: READY_TO_DEPLOY
last_updated: 2025-08-19
---

# Hourly Report System — 24/7 Website + Agent Monitoring

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     HOURLY REPORT LOOP                       │
│                                                               │
│  Vercel Eve Agent (FREE tier) ──cron: "0 * * * *"──┐        │
│  superagents-monitor                                   │        │
│  ├── check_website (HTTP GET)                         │        │
│  ├── check_cloudflare (Pages deploy status)            │        │
│  ├── check_analytics (signups, traffic)                │        │
│  └── post_discord (hourly report)                     │        │
│          │                                              │        │
│          ↓                                              │        │
│  Discord #studex-os-operations                         │        │
│  @Tumelo gets pinged every hour                       │        │
│          │                                              │        │
│          ↓                                              │        │
│  Obsidian vault (Daytona) ──logs saved                 │        │
│                                                               │
│  Second agent: superagents-deploy-agent                    │
│  ├── Watches GitHub push                                 │
│  ├── Auto-deploys to Cloudflare Pages                    │
│  └── Reports deployment status                           │
└──────────────────────────────────────────────────────────────┘
```

## Cron Schedule (UTC)

| Hour (UTC) | SAST | Report Type |
|-----------|------|-------------|
| 0 | 6:00 AM | Morning brief + website status |
| 1 | 7:00 AM | Website status |
| 2 | 8:00 AM | Website status |
| 3 | 9:00 AM | Website status |
| 4 | 10:00 AM | Website status |
| 5 | 11:00 AM | Website status |
| 6 | 12:00 PM | Midday report |
| 7 | 1:00 PM | Website status |
| 8 | 2:00 PM | Website status |
| 9 | 3:00 PM | Website status |
| 10 | 4:00 PM | Website status |
| 11 | 5:00 PM | Website status |
| 12 | 6:00 PM | Evening report |
| 13 | 7:00 PM | Website status |
| 14 | 8:00 PM | Website status |
| 15 | 9:00 PM | Website status |
| 16 | 10:00 PM | Website status |
| 17 | 11:00 PM | Website status |
| 18 | 12:00 AM | Night report |
| 19 | 1:00 AM | Website status |
| 20 | 2:00 AM | Website status |
| 21 | 3:00 AM | Website status |
| 22 | 4:00 AM | Website status |
| 23 | 5:00 AM | Website status |

## Report Templates

### Hourly Status Report (Discord)
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[STUDEX OS — HOURLY STATUS]
Time: [HH:00 UTC] = [HH:00 SAST]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 WEBSITE: superagents.studex-group.com
   Status: ✅ ONLINE | ⚠️ SLOW | ❌ DOWN
   Load: [XXX]ms
   Last deploy: [time]
   
👥 GROWTH
   Discord members: [X]
   Signups today: [X]
   Email opens: [X]%
   
🤖 AGENTS
   Orgo VMs: [X/10] online
   Sentinel: ✅ Active
   Metal: ✅ Active
   
📊 ANALYTICS
   Visitors: [X] this hour
   Top page: [path]
   
⚡ ALERTS
   [none / list issues]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Next report in 1 hour
```

### 6 AM / 12 PM / 6 PM / 12 AM (Full Report)
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[STUDEX OS — [MORNING/MIDDAY/EVENING/NIGHT] REPORT]
Time: [HH:00 UTC] = [HH:00 SAST] | [DATE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 WEBSITE
   Uptime: [X.XX]%
   Total visitors today: [X]
   Signups: [X]
   Top pages: [list]
   Load avg: [X]ms
   Deployments: [X]

👥 COMMUNITY
   Discord members: [X] (+[X] today)
   Active channels: [X]
   Messages today: [X]

📧 OUTREACH (AgentMail)
   Sent: [X]
   Opens: [X] ([X]%)
   Clicks: [X]
   Replies: [X]
   Pipeline: [X] leads

🤖 AGENT STATUS
   Orgo VMs: [X/10] online
   Super Agents Cmd: [status]
   Global Mkts: [status]
   DARK F@CT0Ry: [status]
   [others...]

📈 GROWTH INSIGHTS
   [Top 3 observations]
   [What's working]
   [What needs attention]

🎯 NEXT BLOCK PRIORITIES
   1. [priority]
   2. [priority]
   3. [priority]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Deploy Steps (Do Today)

```bash
# Step 1: Install Eve CLI
npm install -g eve

# Step 2: Create monitor agent
npx eve@latest init superagents-monitor
cd superagents-monitor

# Step 3: Add Vercel Agent Skills
npx skills add vercel-labs/agent-skills

# Step 4: Write instructions.md (copy from above)

# Step 5: Add tools (copy from above)

# Step 6: Add Discord channel
# Create discord.ts channel file

# Step 7: Configure vercel.json for cron
# (see vercel.json above)

# Step 8: Set environment variables
# Vercel dashboard → Environment Variables:
# ANTHROPIC_API_KEY=sk-ant-...
# DISCORD_BOT_TOKEN=MTUzMDU1MTky...
# DISCORD_CHANNEL_ID=your-channel-id

# Step 9: Deploy
npx eve deploy --name superagents-monitor

# Step 10: Verify cron is running
# Check Vercel dashboard → cron jobs
```

## Discord Channel Setup

Create these channels in your Discord server:

1. **#studex-os-operations** — Hourly status reports
2. **#studex-alerts** — Immediate alerts (errors, downtime)
3. **#studex-deployments** — GitHub → Cloudflare deploys
4. **#studex-website** — Website-specific discussion

Get channel IDs:
```bash
# In Discord Developer Mode, right-click channel → Copy Channel ID
# Use that ID as DISCORD_CHANNEL_ID in Vercel env vars
```

## Vercel Free Tier Limits

| Feature | Free Limit | Our Usage |
|---------|-----------|-----------|
| Cron jobs | 2 per project | 2 (hourly + daily) |
| Cron executions | 2,000/month | 1,440 (hourly) |
| Serverless functions | 100K requests/day | <1K/day |
| Build minutes | 6,000/month | Low |
| Bandwidth | 100GB/month | <5GB/month |

**We need 2 Eve projects for all cron jobs:**
- `superagents-monitor` — hourly website checks
- `superagents-reports` — 6AM, 12PM, 6PM, 12AM full reports
