# STUDEX HOMELAB AGENT WAREHOUSE — PROVISIONING PLAN
Generated: 2026-09-23

---

## MACHINE ROLES

| Machine | Hostname | OS | Role | Tailscale IP | Ollama Models |
|---------|----------|-----|------|-------------|---------------|
| Steam Deck | steam-deck | Bazzite Linux | Dev workstation + Ollama | 10.0.0.1 | qwen2.5-coder:7b |
| MSI Claw 8 AI+ | msi-claw | Windows 11 + WSL2 | HHD handheld agent | 10.0.0.2 | qwen2.5:14b |
| Razer Edge | razer-edge | Android/Termux | Mobile agent | 10.0.0.3 | qwen2.5-coder:7b |
| Lenovo | lenovo-legion | TBD | Portable dev agent | 10.0.0.4 | TBD |
| Desktop | studex-desktop | Linux (Tailscale) | GPU compute node | 10.0.0.5 | llama3.3:70b + qwen2.5:32b |
| Z Fold 6 | zfold-agent | Android/Termux | Phone agent + Tailscale | 10.0.0.6 | qwen2.5-coder:7b |
| MacBook | macbook-tumelo | macOS | Hermes desktop | 10.0.0.7 | - |
| Mac mini | mac-mini | macOS | Local server | 10.0.0.8 | - |

---

## ORGO AI CLOUD VMs (9 Frozen — Awaiting Unfreeze)

| VM | ID | CPU | RAM | Role |
|----|-----|-----|-----|------|
| Super Agents Command | 333de3f8-... | 2 | 8GB | Herdr server (port 2244), Huly platform |
| Global Markets | 0f28f3a2-... | 2 | 16GB | Gitea, studex-intelligence, docker |
| SGM - CLIENTS | d95d7f15-... | 1 | 4GB | Client project VMs |
| Auto - Meat | 343f4c0d-... | 2 | 8GB | Trade finance automation |
| TH# D@RK F@CT0Ry | 44991831-... | 1 | 4GB | ERROR state — investigate |
| Neledi - CMO | 06cf4136-... | 1 | 4GB | Marketing agents |
| Rwanda | 1a624546-... | 1 | 4GB | Rwanda opportunity tracking |
| NTechLab-NTECHJ | 0f25104d-... | 1 | 4GB | Tech lab workloads |
| Solo - Prenure | 57832482-... | 2 | 8GB | Startup projects |
| Ryde 1 RSA | c58657ad-... | 1 | 4GB | Ride/transport automation |

---

## GOOGLE CLOUD (hidden-cat-493019-i3)

- Gemini API key: PENDING (create in console.cloud.google.com)
- Cloud Run: Deploy Discord bot + StudEx agents
- Cloud Storage: studex-os assets bucket
- BigQuery: Analytics + trade data

---

## STUDEX INTELLIGENCE SCANNER
- Location: /workspace/studex-intelligence/scanner.py
- Run: python3 /workspace/studex-intelligence/scanner.py
- Sources: Comtrade + OpenSanctions + GDELT + Maritime + Macro
- Last run: 5/5 sources OK in 13.7s

---

## API CREDENTIALS NEEDED

| API | Status | Purpose |
|-----|--------|---------|
| Qwen API (Alibaba) | NEED KEY | Primary LLM for agents |
| Grok API (xAI) | NEED KEY | Secondary LLM |
| CashClaw | FOUND | Shopify/HYVRE integration |
| WhatsApp UltraMsg | STOPPED | Needs payment |
| OpenWA Gateway | CAN DEPLOY | Alternative WhatsApp |
| Google Gemini | GCP Console | Cloud deployment |

---

## SETUP CHECKLIST

### STEAM DECK (Bazzite) — Priority #1
- [ ] Install Tailscale on Bazzite
- [ ] Get Tailscale IP
- [ ] Install Ollama: curl -fsSL https://ollama.ai/install.sh | sh
- [ ] Pull models: ollama pull qwen2.5-coder:7b && ollama pull qwen2.5:14b
- [ ] Clone studex-intelligence: git clone https://github.com/studex-os/studex-intelligence
- [ ] Install HHD REST API token (already configured)
- [ ] SSH access from MacBook via Tailscale

### MSI CLAW 8 AI+ — Priority #2
- [ ] Enable WSL2 with Ubuntu
- [ ] Install Ollama in WSL2
- [ ] Install Docker Desktop for Windows
- [ ] Install Tailscale in Windows
- [ ] Pull models: qwen2.5:14b + qwen2.5-coder:7b
- [ ] Connect to Herdr fleet

### RAZER EDGE — Priority #3
- [ ] Install Termux via F-Droid
- [ ] Install Ollama in Termux
- [ ] Install Tailscale in Termux
- [ ] Pull lightweight model: qwen2.5-coder:7b
- [ ] Add to Tailscale mesh

### LENOVO — Priority #4
- [ ] Identify model (Legion Go? ThinkBook?)
- [ ] Install Bazzite or SteamOS
- [ ] Install HHD
- [ ] Add to Tailscale mesh

### DESKTOP (32GB + 2x8GB GPU) — Priority #5
- [ ] Install Ubuntu 24.04 LTS
- [ ] Install NVIDIA drivers
- [ ] Install Ollama with CUDA support
- [ ] Pull GPU models: llama3.3:70b, qwen2.5:32b, deepseek-r1:70b
- [ ] Install Docker + Portainer
- [ ] Install Tailscale
- [ ] Connect to Herdr fleet
- [ ] Run Huly platform

### Z FOLD 6 — Already in progress
- [x] Termux + Tailscale installed
- [ ] Get Tailscale IP (pending)
- [ ] Build phone agent (Needle+Android-Dex style)

### ORGO VMs — Unfreeze via Dashboard
- [ ] Unfreeze Super Agents Command
- [ ] Unfreeze Global Markets
- [ ] Unfreeze Rwanda
- [ ] Then run: git clone + docker compose up

### MACBOOK + MAC MINI
- [ ] Tailscale installed
- [ ] Hermes desktop app connected
- [ ] Connect to MacBook path: /Users/tumeloramaphosa/Dropbox/Studex/studex-os-pack/

---

## DEPLOYMENT COMMANDS (run on each machine)

### Universal Install Script (Bash — works on Linux/macOS/WSL2/Termux)
```bash
curl -fsSL https://raw.githubusercontent.com/studex-os/fleet-scripts/main/install.sh | bash
```

### Ollama Setup
```bash
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull qwen2.5-coder:7b
ollama pull qwen2.5:14b
ollama serve &
```

### Tailscale Setup
```bash
# Linux (Bazzite)
sudo rpm-ostree install tailscale
sudo systemctl enable --now tailscaled
sudo tailscale up --accept-routes

# macOS
brew install tailscale
tailscale up

# Termux/Android
pkg install tailscale
tailscale up
```

### Herdr Agent Install
```bash
curl -fsSL https://herdr.dev/install.sh | sh
herdr agent --server 10.0.0.1:2244
```

---

## AGENT WAREHOUSE — WHAT IT ENABLES

- **24/7 Always-On Agents** — Every physical machine runs Ollama + Herdr agent
- **Distributed AI Inference** — 7 Ollama endpoints across 7 machines
- **HHD Power Management** — MSI Claw + Steam Deck + Lenovo controlled via REST API
- **Phone Agent** — Z Fold 6 + Razer Edge as mobile AI companions
- **GPU Node** — Desktop with 2x8GB GPU for heavy models (llama3.3:70b)
- **Cloud Burst** — GCP for overflow + Gemini API
- **Herdr Mesh** — All machines connected via Herdr runtime
- **Tailscale VPN** — Single network, SSH from anywhere

---

## NEXT STEPS (in order)

1. **Paste Qwen API key + Grok API key** → I wire into Discord bot
2. **Unfreeze Orgo VMs** via dashboard → I deploy Huly + Herdr
3. **Steam Deck Tailscale IP** → I add to fleet config
4. **MSI Claw WSL2 setup** → I give WSL-specific install script
5. **Desktop GPU info** → Which GPU exactly? RTX 3060? 4060? 3070?
6. **Razer Edge model** → Which Razer Edge? (original 8GB or 5G 6GB?)
7. **Lenovo model** → Which Lenovo device?

