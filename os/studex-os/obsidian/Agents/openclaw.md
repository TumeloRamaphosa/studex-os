---
name: OpenClaw
type: agent
platform: Daytona VM
status: READY
role: AI coding agent
last_updated: 2025-08-19
---

# OpenClaw

AI coding agent on Daytona VM. Builds actual software autonomously.

## Version
2026.7.1-2

## Capabilities
- Writes code in any language
- Runs on Daytona (755GB RAM)
- Connects to Discord via Sentinel for reporting
- Used in the Software Factory workflow

## Usage
```
# On Daytona VM:
openclaw "build me a CRM with React"
```

## Software Factory Workflow
```
Huly Ticket → Buzz Agent → OpenClaw → Built Software → Discord Report
```

## Files
- Install: npm install -g openclaw (on Daytona)
- Config: ~/openclaw/ (on Daytona)
