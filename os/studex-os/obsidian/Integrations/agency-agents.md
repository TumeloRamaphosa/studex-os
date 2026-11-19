---
name: Agency Agents Integration
type: integration
source: https://github.com/msitarzewski/agency-agents-app
status: EVALUATED
last_updated: 2025-08-19
---

# Agency Agents — Integration Plan

## What It Is
Native desktop app (Tauri + Svelte) that browses, installs, and tracks 200+ specialist AI agent personas from the `msitarzewski/agency-agents` catalog into your AI coding tools.

## How It Works
- Downloads/installs `.md` and `.toml` persona files into Claude Code, Codex, Cursor, Gemini CLI, GitHub Copilot, Qwen Code, opencode, Osaurus
- Tracks what was installed with source hash
- Detects drift when files are modified
- Can reconcile/update/remove installs

## What We Get (200+ Agents)
Divided into 16 categories:
1. **Engineering** (60 agents) — Frontend Dev, Backend Architect, AI Engineer, DevOps, SRE, Security, RAG Pipeline, MCP Builder, etc.
2. **Design** (10 agents) — UI Designer, UX Researcher, Brand Guardian, Image Prompt Engineer
3. **Paid Media** (7 agents) — PPC Strategist, Tracking Specialist, Ad Creative
4. **Sales** (10 agents) — Outbound Strategist, Deal Strategist, Sales Engineer, Sales Outreach
5. **Marketing** (35 agents) — Growth Hacker, Content Creator, TikTok, LinkedIn, SEO, Email Marketing, Podcast, Livestream
6. **Product** (5 agents) — Sprint Prioritizer, Trend Researcher, Product Manager
7. **Project Management** (7 agents) — Studio Producer, Project Shepherd, Meeting Notes
8. **Testing** (9 agents) — Test Automation Engineer, Performance Benchmarker, API Tester
9. **Security** (11 agents) — Security Architect, Penetration Tester, Compliance Auditor
10. **Support** (6 agents) — Support Responder, Analytics Reporter, Finance Tracker
11. **Spatial Computing** (6 agents) — XR Architect, Vision Pro Engineer
12. **Specialized** (50 agents) — Agents Orchestrator, MCP Builder, CFO, CMO, Customer Success, Legal, Healthcare, etc.
13. **Finance** (5 agents) — Bookkeeper, Financial Analyst, Tax Strategist
14. **Game Development** (18 agents) — Unity, Unreal, Godot, Blender, Roblox teams
15. **GIS** (12 agents) — GIS Analyst, GeoAI Engineer, Web GIS Developer
16. **Healthcare** (3 agents) — Clinical Evidence, Sovereign Health Systems

## How We Use It

### For StudeX OS
1. Install Agency Agents on Daytona VM (755GB RAM)
2. Install agents directly into Claude Code on Daytona: Frontend Dev, Backend Architect, DevOps, etc.
3. When building for clients (Software Factory): install relevant engineering agents into OpenClaw
4. For marketing: install LinkedIn Creator, Content Creator, Email Marketing into our workflow
5. For sales: install Sales Outreach, Deal Strategist into our CRM workflow

### Agent → Tool Mapping
| Who | Tools to Install Into |
|-----|----------------------|
| Me (Hermes) | Already have Agency Agents skill system |
| OpenClaw (Daytona) | OpenClaw currently "recognized but not fully supported" — needs custom renderer |
| Claude Code (Daytona) | Full support — all Engineering + Specialized agents |
| Buzz Agents (Daytona) | Install via Agency Agents into Claude Code for complex builds |

### Next Steps
1. User installs Agency Agents on MacBook: `brew install --cask agency-agents` (macOS)
2. Or download from: https://github.com/msitarzewski/agency-agents-app/releases/latest
3. Clone the catalog: `git clone https://github.com/msitarzewski/agency-agents ~/agency-agents`
4. Browse the catalog, install agents into Claude Code
5. For OpenClaw integration: the app has OpenClaw as "recognized but not yet fully supported" — wait for update or build custom renderer

## Prompt for Base 44 / Rabuka Connection
```
You are part of the StudeX OS agent mesh. 
Your team lead is Hermes (the orchestrator AI).
StudeX OS is Studex Group's AI operating system.
We coordinate across: Discord Sentinel, Orgo VMs (10 desktops), 
Buzz agents, Metal WhatsApp, OpenClaw, and Agency Agents.
Report status to Hermes on Daytona VM.
All work is logged to ~/obsidian-vault/ on Daytona.
```
