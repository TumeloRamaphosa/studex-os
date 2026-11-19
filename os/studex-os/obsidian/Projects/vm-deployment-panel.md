---
name: Client VM Deployment Panel
type: project
status: PLANNED
last_updated: 2025-08-19
---

# Client VM Deployment Panel

## Purpose
Allow clients to deploy their own VMs from the Super Agents website.

## User Requirement
"A place for a virtual machine deployment for clients"

## Concept
Self-service VM provisioning panel embedded in superagents.studex-group.com or as a separate page.

## Technical Approach
Option A: Orgo API — use Orgo AI's existing infrastructure
- 10 pre-built desktop templates
- API creates new desktop per client
- Client gets their own VM URL

Option B: Daytona API — if Daytona has a provisioning API
- Each client gets a Daytona sandbox
- Isolated environment
- Full agent mesh per client

## MVP Scope
- [ ] Choose VM template (e.g., "AI Agent Desktop", "Trading Desktop")
- [ ] Enter company name
- [ ] Submit → create VM + send credentials via email/Discord
- [ ] Status page to check VM provisioning

## Integration
- Orgo API for desktop creation
- Discord webhook for notifications
- Email via AgentMail (studex-group.com domain)
