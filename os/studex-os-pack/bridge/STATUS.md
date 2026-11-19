# Studex OS — Fleet Status

**Last updated:** 2026-09-07T14:38:31
**Agent:** cursor-builder

## Critical Issues
- DARK F@CT0Ry VM: ERROR_STATE (offline)
- Super Agents Command disk: 88% full (2.3GB free) — CRITICAL
- Global Markets disk: 88% full (3.4GB free) — CRITICAL
- WhatsApp bot: DISCONNECTED (no session)
- Queen API (Qwen/DashScope): Wrong key stored
- Croc API (xAI): Incorrect API key

## Fleet (9/10 online)
- Super Agents Command: lax-manual-0 (69.67.149.85) — CRITICAL DISK
- Global Markets: nyc-prod-7 (185.209.179.145) — CRITICAL DISK
- DARK F@CT0Ry: nyc-manual-3 (160.202.128.157) — OFFLINE
- Auto - Meat: nyc-manual-2 (64.34.80.97) — OK (12%)
- SGM - CLIENTS: chi-rs4-1 (67.213.119.147) — OK (38%)
- Neledi - CMO: nyc-prod-9 (69.67.151.85) — OK (13%)
- Rwanda: nyc-prod-3 (160.202.128.9) — OK (17%)
- Solo - Prenure: nyc-prod-5 (64.34.89.247) — OK (20%)
- NTechLab-NTECHJ: nyc-manual-4 (64.34.89.213) — OK (19%)
- Ryde 1 RSA: mia2-manual-0 (64.34.91.77) — OK (37%)

## Key Services
- Discord bot (ADAM): PID 12386, ~24d uptime, 28.9% CPU (needs monitoring)
- WhatsApp bot: PID 3110, DISCONNECTED
- Gitea: Global Markets port 3000
- Buzz relay: Super Agents Command Docker
- Orgo fleet management: Super Agents Command

## Next Steps
1. Get Dropbox access to live studex-os-pack
2. Inspect studex-nexus architecture → first 3 PRs
3. Emergency disk cleanup on SA Command + Global Markets
4. Fix WhatsApp session (rescan QR on VNC)
5. 4pm Stud Bot launch preparation
