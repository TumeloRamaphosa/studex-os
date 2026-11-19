---
name: Orgo AI VMs — Full Status
type: infrastructure
status: ACTIVE
last_updated: 2026-08-26T16:00 SAST
---

# Orgo AI — 10 Cloud Desktops Health Report
**26 August 2026 · 16:00 SAST**

## API
```
Key:     ${ORGO_API_KEY}
Base:    https://www.orgo.ai/api
Workspaces: GET https://www.orgo.ai/api/workspaces
```
Project: `Studex Wildlife's workspace` (a4977a1c-cde4-410d-878e-fb5675d55995)
Owner: tumelor001@gmail.com

## VM Fleet Status: 8/10 ONLINE

| # | Name | ID | Disk | RAM | Uptime | Ollama | Status |
|---|------|-----|------|-----|--------|--------|--------|
| 1 | Super Agents Command | 333de3f8-0801-430b-a541-aad458e896b5 | **95% ⚠️** | 28% | 15d | models[] | ⚠️ CRITICAL |
| 2 | Global Markets | 0f28f3a2-2b26-4260-bff7-262885c86c28 | **88% ⚠️** | 28% | 28d | NO_OLLAMA | ⚠️ WARNING |
| 3 | TH# D@RK F@CT0Ry | 44991831-da7d-4a5b-8cf6-9347ef638712 | ~15% est | 13% | 7d | NO_OLLAMA | ⚠️ df corrupted |
| 4 | SGM-CLIENTS | d95d7f15-5845-4fc6-ad12-7e3aae55e57c | — | — | — | — | **❌ OFFLINE** |
| 5 | Rwanda | 1a624546-2947-4974-a6ba-6d0e246c9b46 | 17% | 14% | ? | NO_OLLAMA | ✅ OK |
| 6 | Ryde 1 RSA | c58657ad-9223-4bd5-b37c-9b897fa6cfc7 | 37% | 14% | ? | NO_OLLAMA | ✅ OK |
| 7 | Auto-Meat | 343f4c0d-137c-4e1a-bff4-8b1178db32f3 | 12% | 7% | ? | NO_OLLAMA | ✅ OK |
| 8 | Neledi-CMO | 06cf4136-7847-458e-a263-508654f565bd | 13% | 12% | ? | NO_OLLAMA | ✅ OK |
| 9 | Solo-Prenure | 57832482-9e5c-439f-9da1-6d088adc127e | 20% | 7% | ? | NO_OLLAMA | ✅ OK |
| 10 | NTechLab-NTECHJ | 0f25104d-1243-42d5-8eec-4e9b08dbfa81 | 19% | 13% | ? | NO_OLLAMA | ✅ OK |

## Actions Needed

### CRITICAL — Free disk on Super Agents Command (1.1GB left)
```
# On Super Agents Command VM:
docker system prune -a -f          # Remove unused Docker images
apt-get clean                       # Clean apt cache
journalctl --vacuum-time=7d        # Trim old logs
# Also check: /tmp, /var/log, /root/.cache
```

### WARNING — Free disk on Global Markets (3.5GB left)
Same cleanup commands as above.

### SGM-CLIENTS offline
Restart via Orgo dashboard or API.

### Ollama not running on any VM
Install via: `curl -fsSL https://ollama.com/install.sh | sh`

## Health Check Command (use daily)
```bash
# Check all VMs in one shot:
for id in 333de3f8 0f28f3a2 44991831 d95d7f15 1a624546 c58657ad 343f4c0d 06cf4136 57832482 0f25104d; do
  curl -s -X POST "https://www.orgo.ai/api/computers/${id}-0801-430b-a541-aad458e896b5/bash" \
    -H "Authorization: Bearer ${ORGO_API_KEY}" \
    -H "Content-Type: application/json" \
    -d '{"command": "df -h / | tail -1 && free -h | grep Mem && ps aux --no-headers | wc -l", "timeout": 15}'
done
```
