---
name: Vercel Eve — Website Management Agent
type: integration
framework: Vercel Eve Agent Framework
status: DEPLOYING
last_updated: 2025-08-19
---

# Vercel Eve — AI Agent Framework for Website + Monitoring

## What Is Vercel Eve?

Vercel's official agent framework. **"Like Next.js for web apps, but for agents."**

You create an agent by creating a directory with:
- `instructions.md` — what the agent does (Markdown)
- `agent.ts` — model config (TypeScript)
- `tools/` — custom tools (TypeScript)
- `skills/` — reusable playbooks (Markdown)
- `channels/` — connect to Discord, Slack, WhatsApp, web, SMS

**Key features:**
- Durable execution — survives crashes, checkpoints state
- Cron schedules — run automatically (hourly, daily, etc.)
- Subagents — agents can spawn child agents for tasks
- Multi-channel — one codebase, deploy to Discord + Slack + WhatsApp + web
- Human-in-the-loop — approval gates before actions
- Free tier on Vercel — agents hosted FREE

**Install:**
```bash
npx eve@latest init superagents-monitor
cd superagents-monitor
```

## Our Website Agent Stack on Vercel

```
VERCEL (free tier)
├── superagents-monitor
│   ├── Watches: superagents.studex-group.com
│   ├── Checks: every hour
│   ├── Reports to: Discord #studex-os-operations
│   └── Skills: Vercel Agent Skills (optimize, review)
│
├── superagents-content-agent
│   ├── Monitors: site analytics
│   ├── Checks: new signups, conversions
│   ├── Reports: hourly digest
│   └── Skills: writing-guidelines, web-design-guidelines
│
└── superagents-deploy-agent
    ├── Watches: GitHub repo
    ├── Deploys: after each push
    ├── Reports: deployment status
    └── Skills: vercel-deploy-claimable, react-best-practices
```

## The Website Monitoring Agent

### Install + Setup
```bash
# 1. Install Eve CLI
npm install -g eve

# 2. Create the agent
npx eve@latest init superagents-monitor
cd superagents-monitor

# 3. Install Vercel Agent Skills (enhances the agent)
npx skills add vercel-labs/agent-skills

# 4. Directory structure:
# superagents-monitor/
# ├── instructions.md     ← What the agent does
# ├── agent.ts            ← Model config
# ├── tools/
# │   ├── check_website.ts
# │   ├── check_discord.ts
# │   └── report_hourly.ts
# ├── channels/
# │   └── discord.ts      ← Connect to Discord
# └── skills/             ← Vercel Agent Skills (auto-added)
```

### instructions.md
```markdown
# Super Agents Website Monitor Agent

You are the 24/7 website health and performance agent for StudeX Group.
Your job: Monitor superagents.studex-group.com and report hourly.

## Your Responsibilities

### Hourly Health Check (every hour, cron: "0 * * * *")
1. Check website uptime via HTTP GET
2. Check Cloudflare Pages deployment status
3. Check for any error logs in the last hour
4. Check: new signups, conversions, page views
5. Compile a STATUS REPORT
6. Post to Discord channel #studex-os-operations

### Alert Triggers (immediate, no cron)
If ANY of these happen, alert immediately:
- Website down (HTTP 5xx or timeout)
- Deployment failed
- Unusual traffic spike (>10x normal)
- Security issue detected

### Daily Report (6 AM SAST)
- Full 24-hour summary
- Website uptime %
- Traffic trends
- Performance scores
- Recommendations for improvements

## Report Format
```
[STUDEX OS — WEBSITE MONITOR]
Time: [timestamp]
Website: superagents.studex-group.com
Status: ONLINE/OFFLINE/WARNING
Uptime: [X.XX%]
Last deploy: [time] by [who]
Traffic: [X] visitors
Load time: [X]ms
Issues: [none/issues]
Actions needed: [none/list]
---
Monitored by: Website Agent (Vercel Eve)
```

## Tools You Have
- `check_website` — HTTP GET + measure response time
- `check_cloudflare` — Cloudflare API status
- `post_discord` — Post to Discord channel
- `check_analytics` — Site analytics
- `send_email` — Email alert to Tumelo

## Escalation Rules
- WARNING → Post to Discord, continue monitoring
- ERROR → Post to Discord + email Tumelo immediately
- CRITICAL → Post to Discord + call (Twilio) if possible
```

### agent.ts
```typescript
import { EveAgent } from '@vercel/eve'

export default new EveAgent({
  model: 'claude-sonnet-4',
  provider: 'anthropic',
  apiKey: process.env.ANTHROPIC_API_KEY,
  schedule: {
    '0 * * * *': 'hourly_health_check',
    '0 6 * * *': 'daily_report',  // 6 AM SAST
  },
})
```

### tools/check_website.ts
```typescript
// tools/check_website.ts
import { tool } from '@vercel/eve'

export const check_website = tool({
  description: 'Check website uptime and performance',
  parameters: {
    type: 'object',
    properties: {
      url: { type: 'string' },
    },
  },
  async run({ url = 'https://superagents.studex-group.com' }) {
    const start = Date.now()
    const response = await fetch(url)
    const loadTime = Date.now() - start
    
    return {
      status: response.status,
      ok: response.ok,
      loadTime,
      timestamp: new Date().toISOString(),
    }
  },
})
```

### channels/discord.ts
```typescript
// channels/discord.ts
import { DiscordChannel } from '@vercel/eve/channels/discord'

export default new DiscordChannel({
  botToken: process.env.DISCORD_BOT_TOKEN,
  channelId: process.env.DISCORD_CHANNEL_ID,
})
```

### Deploy to Vercel
```bash
# 1. Login to Vercel
npx eve login

# 2. Deploy
npx eve deploy --name superagents-monitor

# 3. Configure cron in vercel.json
# (Vercel free tier allows 2 cron jobs per project)

# 4. Set environment variables in Vercel dashboard:
# - ANTHROPIC_API_KEY
# - DISCORD_BOT_TOKEN
# - DISCORD_CHANNEL_ID
```

### vercel.json (for cron)
```json
{
  "crons": [
    {
      "path": "/api/hourly-check",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/daily-report",
      "schedule": "0 6 * * *"
    }
  ]
}
```

## The Content & Analytics Agent

### instructions.md
```markdown
# Super Agents Content + Analytics Agent

You are the content and analytics agent for StudeX Group.
Monitor the website, track conversions, and report insights.

## Hourly Tasks
1. Check new signups from Discord bot
2. Check AgentMail open/click rates
3. Monitor social mentions (LinkedIn, Twitter)
4. Track: Super Agents trial starts, Discord server growth
5. Report hourly digest to Discord

## Content Tasks
1. Review any new site changes for quality (Vercel Agent Skills)
2. Check for broken links, images, forms
3. Review copy for tone consistency
4. Monitor competitor site changes

## Report Format
```
[STUDEX CONTENT + ANALYTICS]
Time: [timestamp]
New signups: [X]
Trial starts: [X]
Discord members: [X]
Email opens: [X]%
Social mentions: [X]
Traffic: [X] visitors
Top pages: [list]
Insights: [observations]
---
Monitored by: Content Agent (Vercel Eve)
```
