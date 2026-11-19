---
name: Discord Mission Command Setup
type: mission-infra
status: PENDING_SETUP
---

# Discord Mission Command Setup

## Bot: Sentinel (Super Agents Command)
- Token: MTUzMDU1MTkyNzk3OTUxMTgzOA
- App ID: 1530551927979511838
- OAuth: https://discord.com/oauth2/authorize?client_id=1530551927979511838&permissions=8&scope=bot

## Steps

### 1. Authorize Bot to Server
Tumelo must go to:
https://discord.com/oauth2/authorize?client_id=1530551927979511838&permissions=8&scope=bot

Select the Super Agents server and authorize.

### 2. Create Mission Command Channels
Once bot is in the server, create:

```
📁 MISSION COMMAND (category)
├── #mission-live          — Real-time mission updates
├── #mission-decisions    — Decision board + approvals
├── #mission-crm          — Daily CRM pipeline reports
├── #mission-coffee       — Coffee track updates
├── #mission-meat         — Biltong Gold track updates
├── #mission-data         — Data centre + Lake Kivu updates
├── #mission-women-ai     — Women in AI programme updates
├── #mission-gaming       — Gaming + hackathon updates
├── #mission-nigeria      — GITEX Nigeria prep + contacts
├── #mission-russia       — Russia market prep
├── #mission-switzerland  — Switzerland deal room prep
├── #mission-content      — Content + media drops
└── #mission-close        — 21:30 daily mission close reports
```

### 3. Bot Commands for Mission

```javascript
// Command prefix: !
!mission brief          — Today's objectives + risks
!mission add-contact    — Log new contact (interactivo)
!mission decision [id]  — Update decision status
!mission report         — Generate 21:30 mission close
!mission track [T01-T15] — Check track status
!mission countdown       — Days/hours to Rwanda launch
!mission coffee [action] — Coffee track quick actions
```

### 4. Auto-Post Schedule

| Time | Content | Channel |
|------|---------|---------|
| 07:00 SAST | Morning brief | #mission-live |
| 07:00 SAST | Track status | #mission-crm |
| 07:00 SAST | Decision board | #mission-decisions |
| 13:00 SAST | Lunch check-in | #mission-live |
| 17:00 SAST | Pipeline update | #mission-crm |
| 19:00 SAST | Content drop | #mission-content |
| 21:30 SAST | Mission close | #mission-close |

### 5. Mission Roles
Create Discord roles:
- @Mission Commander (Tumelo)
- @Track Lead — one per track
- @Mission Agent — AI agents
- @Rwanda Team
- @Nigeria Team
- @Russia Team
- @Switzerland Team

### 6. Webhook for Hermes
Set up webhook in #mission-live for Hermes to auto-post:
```
Webhook URL: [Get from Discord server settings]
```
