# STUDEX FLEET STATUS REPORT
Generated: 2026-09-22 23:55 UTC

## ORGO AI API STATUS
- API: OPERATIONAL ✓
- Compute: OPERATIONAL ✓
- Auth: Bearer API Key (sk_live_e...)

## 10-DESKTOP FLEET INVENTORY

| # | Desktop Name              | ID                                   | Status   | CPU | RAM | Disk | Always-On |
|---|---------------------------|--------------------------------------|----------|-----|-----|------|-----------|
| 1 | Super Agents Command      | 333de3f8-0801-430b-a541-aad458e896b5 | FROZEN   | 2   | 8GB | 20GB | Yes       |
| 2 | Global Markets            | 0f28f3a2-2b26-4260-bff7-262885c86c28 | FROZEN   | 2   | 16GB| 30GB | Yes       |
| 3 | SGM - CLIENTS             | d95d7f15-5845-4fc6-ad12-7e3aae55e57c | FROZEN   | 1   | 4GB | 20GB | Yes       |
| 4 | Auto - Meat               | 343f4c0d-137c-4e1a-bff4-8b1178db32f3 | FROZEN   | 2   | 8GB | 30GB | Yes       |
| 5 | TH# D@RK F@CT0Ry         | 44991831-da7d-4a5b-8cf6-9347ef638712 | ERROR    | 1   | 4GB | 20GB | Yes       |
| 6 | Neledi - CMO              | 06cf4136-7847-458e-a263-508654f565bd | FROZEN   | 1   | 4GB | 20GB | Yes       |
| 7 | Rwanda                    | 1a624546-2947-4974-a6ba-6d0e246c9b46 | FROZEN   | 1   | 4GB | 20GB | Yes       |
| 8 | NTechLab-NTECHJ           | 0f25104d-1243-42d5-8eec-4e9b08dbfa81 | FROZEN   | 1   | 4GB | 20GB | Yes       |
| 9 | Solo - Prenure            | 57832482-9e5c-439f-9da1-6d088adc127e | FROZEN   | 2   | 8GB | 20GB | Yes       |
|10 | Ryde 1 RSA                | c58657ad-9223-4bd5-b37c-9b897fa6cfc7 | FROZEN   | 1   | 4GB | 20GB | Yes       |

## KEY FINDINGS

### FROZEN: 9/10 desktops
All desktops are frozen. Cannot be resumed via REST API.
The Orgo AI OpenAPI has no computer control endpoints (no /resume, /freeze, /wake).
Control is only available through the Orgo AI web dashboard (VNC).

### ERROR: 1/10 desktops
TH# D@RK F@CT0Ry is in ERROR state — needs investigation in dashboard.

### TOTAL RESOURCES (if all online)
- Combined CPU: 13 cores
- Combined RAM: 62GB
- Combined Disk: 230GB

## ACTION REQUIRED — VNC UNFREEZE

1. Log into https://www.orgo.ai
2. Open each frozen desktop
3. Click UNFREEZE / RESUME in the Orgo AI dashboard
4. Once resumed, SSH/bash commands can be run via Orgo API

## PENDING API CONNECTIONS

| API         | Status          | Action Required |
|-------------|-----------------|-----------------|
| Queen API   | KEY NEEDED      | Paste key in chat |
| Croc API    | KEY NEEDED      | Paste key in chat |
| CashClaw    | FOUND IN CODE   | Review + connect |
| WhatsApp    | ULTRAMSG STOPPED| Pay UltraMsg to reactivate |
| OpenWA      | CAN DEPLOY NOW  | Load openwa-whatsapp-gateway skill |

## CASHCLAW INTEGRATION
CashClaw is a HYRVE AI product for Shopify e-commerce automation.
Studex integration skill already built: CashClaw-HYVRE-Integration-Skill.md
Shopify credentials: jarves@hyv.re / WickieB0y@1989

## WHATSAPP OPTIONS
1. ULTRAMSG (stopped — needs payment): +1(571)739-7373(Base44), +27 79 498 8737(Studex Meat)
2. OPENWA (can deploy now): Load openwa-whatsapp-gateway skill
3. Twilio: Standard WhatsApp Business API

## STUDEX INTELLIGENCE SCANNER
Built at: /workspace/studex-intelligence/scanner.py
Sources: Comtrade, OpenSanctions, GDELT, Maritime, Macro
Output: /workspace/studex-intelligence/last-brief.json
Run: python3 /workspace/studex-intelligence/scanner.py
