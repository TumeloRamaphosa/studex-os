---
name: Sentinel Discord Bot
type: agent
platform: Discord
status: NOT_CONNECTED
role: Communication bridge + user comms
last_updated: 2025-08-19
---

# Sentinel — Discord Bot

Discord bot for Studex Super Agents. The bridge between users and the OS.

## Credentials
```
Bot Token:  ${DISCORD_BOT_TOKEN}
App ID:    1530551927979511838
```

## OAuth Invite
```
https://discord.com/oauth2/authorize?client_id=1530551927979511838&permissions=8&scope=bot
```

## Status: 🔴 NOT IN ANY SERVER
User must accept the OAuth link to add bot to their Discord server.

## Capabilities (planned)
- [ ] Respond to user mentions with Hermes AI
- [ ] Relay Discord messages to Hermes orchestrator
- [ ] Run Buzz agent commands from chat
- [ ] Report Orgo VM status
- [ ] Show deployment updates
- [ ] Manage client VM provisioning

## Files
- Bot code: /workspace/studex-agent-sentinel/
- Buzz prompts: /workspace/studex-agent-sentinel/buzz-agents/
- .env.example: DISCORD_BOT_TOKEN, ORGO_API_KEY, STITCH_API_KEY

## Next Steps
1. User accepts OAuth link → bot joins server
2. Load Buzz agent prompts into bot
3. Test mention → response loop
4. Connect to Orgo API for VM status commands
