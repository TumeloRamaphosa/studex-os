---
name: Standard Operating Procedures
type: workflows
last_updated: 2025-08-19
---

# StudeX OS Standard Operating Procedures

## 1. New Client Onboarding
1. Discovery call → understand pain points
2. Create client Obsidian note in Clients/
3. Configure Buzz agent for client
4. Connect their tools (WhatsApp, Slack, etc.)
5. Launch 1-week sprint
6. Weekly Discord report

## 2. Bug Fix Flow
1. Issue reported (Discord/WhatsApp/chat widget)
2. Hermes investigates
3. Fix applied to /workspace/extracted/studex-platform/
4. Copy fix to /workspace/studex-site/
5. Deploy to Matrix for testing
6. Update DNS if Cloudflare fixed

## 3. New Agent Addition
1. Create agent Obsidian note in Agents/
2. Add to agent registry JSON
3. Configure in Daytona (if applicable)
4. Add to Discord bot prompts (if applicable)
5. Document in System/architecture.md

## 4. API Integration
1. Get credentials from user
2. Create API Obsidian note
3. Test connection
4. Add to Discord bot .env
5. Document endpoints
6. Use in agents/workflows

## 5. Deploy to Production
1. Test on Matrix (current: https://pzk33a0u5h2t.space.mcode.io)
2. If Cloudflare fixed → update DNS CNAME
3. If not → keep Matrix URL, notify user
4. Verify live at superagents.studex-group.com
