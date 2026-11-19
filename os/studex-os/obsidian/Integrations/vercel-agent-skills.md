---
name: Vercel Agent Skills
type: integration
framework: Vercel Agent Skills
status: READY_TO_INSTALL
last_updated: 2025-08-19
---

# Vercel Agent Skills — Free Skills for All Our Agents

## What Are They?
Vercel's curated collection of skills for AI coding agents. Install once, every agent gets smarter.

## Available Skills (FREE)

| Skill | What It Does | Who Uses It |
|-------|-------------|------------|
| `vercel-optimize` | Audits cost, performance, caching | All coding agents |
| `react-best-practices` | Enforces React/Next.js optimization | Frontend agents |
| `web-design-guidelines` | 100+ UX/accessibility/performance rules | All agents |
| `writing-guidelines` | Enforces Vercel writing style | Content agents |
| `react-native-guidelines` | React Native best practices | Mobile agents |
| `react-view-transitions` | Smooth animations | Frontend agents |
| `composition-patterns` | Scalable React architecture | Architecture agents |
| `vercel-deploy-claimable` | Deploy + generate claimable link | All agents |

## How to Install (1 command)

### For Claude Code:
```bash
# In any project
claude
# /install https://github.com/vercel-labs/agent-skills
```

### For Cursor:
```bash
# In Cursor settings → Skills → Add from GitHub
# URL: https://github.com/vercel-labs/agent-skills
```

### For OpenClaw:
```bash
openclaw skills add vercel-labs/agent-skills
```

### For Eve (our Vercel agents):
```bash
cd superagents-monitor
npx skills add vercel-labs/agent-skills
# Skills auto-load when relevant
```

## How They Work (Auto-Detection)

You DON'T need to call them. The agent auto-detects when a skill is relevant.

Example:
```
Human: "Deploy my Next.js app to production"
Agent: [auto-detects vercel-deploy-claimable skill]
Agent: [uses skill to deploy + generate claimable link]
Result: App deployed, ownership link generated
```

## What Each Skill Does

### vercel-optimize
Reviews Vercel project for:
- Cost: function execution time, bandwidth
- Performance: Core Web Vitals, caching headers
- Function usage: cold starts, memory
- Edge caching: cache hit rates

### react-best-practices
Enforces:
- Bundle size optimization
- Memo usage (useMemo, useCallback)
- Code splitting
- Image optimization
- Server vs client component rules

### web-design-guidelines (100+ rules)
Reviews for:
- Accessibility (WCAG 2.1)
- Performance
- UX patterns
- Responsive design
- SEO basics
- Dark mode support

### vercel-deploy-claimable
Deploys app directly from conversation:
```bash
# Agent runs:
vercel deploy --prod
# Then generates shareable ownership link
```

## Integration with Our Stack

```
Every agent we have gets Vercel Skills:

Claude Code (DARK F@CT0Ry VM)
├── vercel-optimize → optimize every deploy
├── react-best-practices → clean React code
└── web-design-guidelines → review every change

Cursor (anywhere)
├── All skills available
└── Auto-detects when to use

OpenClaw (Daytona)
├── ape-claw skill (already installed)
├── vercel-agent-skills (add now)
└── All Vercel skills available

Vercel Eve (deployed agents)
├── All skills in skills/ directory
└── Subagents inherit skills
```

## Install on All Agents — Commands

```bash
# 1. On each Orgo VM (SSH in and run):
cd ~/projects/studex-site
claude
/install https://github.com/vercel-labs/agent-skills

# 2. On Daytona:
cd ~/repos/studex
claude
/install https://github.com/vercel-labs/agent-skills

# 3. On Razor (MiroFish):
# Install in the coding agent you use there

# 4. On Lenovo (AutoResearch):
# Install in DeepSeek Harness environment
```

## What Each Agent Now Does Better

| Agent | Skills Applied | Result |
|-------|---------------|--------|
| Website Monitor (Eve) | vercel-optimize, web-design-guidelines | Auto-optimizes as it monitors |
| Deploy Agent (Eve) | vercel-deploy-claimable | One-command deploys |
| Content Agent (Eve) | writing-guidelines, web-design-guidelines | All copy is consistent |
| OpenClaw Builder | react-best-practices, composition-patterns | Clean React code |
| Any Claude Code | All 8 skills | Professional-grade code |
| Any Cursor | All 8 skills | Professional-grade code |
