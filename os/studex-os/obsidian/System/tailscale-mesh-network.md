---
name: Tailscale Mesh Network
type: infrastructure
status: DEPLOYING
last_updated: 2025-08-19
---

# Tailscale — Connect All Devices Into One Secure Network

## What Is Tailscale?

VPN replacement. Connects all your devices into ONE private network.

Instead of:
- Port forwarding
- Static IPs
- Firewall rules
- ngrok/cloudflare tunnels

You get:
- One private network (like 192.168.1.x but global)
- Zero-config — works behind NATs/firewalls
- MagicDNS — `machine-name.tailnet` like `daytona.tailnet`
- End-to-end encrypted
- Free for personal use (up to 100 devices)

## Your Tailscale Key
```
tskey-auth-kCwAg5huu721CNTRL-U6ZSsmLDcigSkfiNsXxUigEgWBD6wGnBK
```

This is an AUTH KEY — lets devices join your tailnet without browser login.

## Network Topology

```
┌──────────────────────────────────────────────────────────────┐
│                 STUDEX TAILNET (tailnet: studex-xxx)          │
│                                                               │
│  STUDENT LAPTOP (macOS)                                      │
│  └── 100.x.x.x (Tailscale IP)                                │
│  └── studex-macbook.tailnet                                  │
│  └── Access: MiroFish-O, browser, git                       │
│                                                               │
│  RAZOR LAPTOP (Windows/Linux)                                │
│  └── 100.x.x.x (Tailscale IP)                                │
│  └── studex-razor.tailnet                                    │
│  └── Access: MiroFish simulation, Docker                     │
│                                                               │
│  LENOVO LAPTOP (Windows/Linux)                               │
│  └── 100.x.x.x (Tailscale IP)                                │
│  └── studex-lenovo.tailnet                                   │
│  └── Access: AutoResearch, DeepSeek Harness                 │
│                                                               │
│  ORGO VM: SUPER AGENTS CMD (10.0.0.x)                       │
│  └── 100.x.x.x (Tailscale IP)                                │
│  └── superagents-cmd.tailnet                                 │
│  └── Access: Discord bot, Command center                    │
│                                                               │
│  ORGO VM: GLOBAL MKTS (10.0.0.x)                            │
│  └── 100.x.x.x (Tailscale IP)                                │
│  └── global-mkts.tailnet                                     │
│  └── Access: Research, Gitea                                │
│                                                               │
│  ORGO VM: DARK F@CT0Ry (10.0.0.x)                           │
│  └── 100.x.x.x (Tailscale IP)                                │
│  └── dark-factory.tailnet                                    │
│  └── Access: Claude Code, code builds                       │
│                                                               │
│  ORGO VMs: [+ SGM-CLIENTS, Rwanda, Ryde, Auto-Meat,        │
│  │           Neledi-CMO, Solo-Prenure, NTechLab]             │
│  └── All get 100.x.x.x Tailscale IPs                        │
│                                                               │
│  HERMES AGENT (THIS SANDBOX)                                 │
│  └── 100.x.x.x (Tailscale IP)                                │
│  └── hermes.tailnet                                          │
│  └── Access: All VMs, orchestrating everything              │
│                                                               │
│  DAYTONA (755GB RAM) — ALREADY ON TAILSCALE?                │
│  └── 100.x.x.x (Tailscale IP)                                │
│  └── daytona.tailnet                                         │
│  └── Access: Obsidian vault, bare git repos                 │
└──────────────────────────────────────────────────────────────┘
```

## Why Tailscale Solves Your Problems

### Problem 1: Can't SSH from sandbox to Daytona
**Before:** `ssh.app.daytona.io` blocked
**After:** `ssh daytona.tailnet` — works from anywhere

### Problem 2: VMs on different networks, can't talk
**Before:** Port forwarding, static IPs, ngrok tunnels
**After:** All VMs on 100.x.x.x range, can talk to each other

### Problem 3: Discord bot on one VM needs to talk to AgentMail on another
**Before:** Complex API routing
**After:** Both on tailnet, direct internal calls

### Problem 4: MiroFish on Razor needs to talk to DeerFlow on Orgo
**Before:** External API calls, ngrok
**After:** Internal Tailscale IPs

## Installation Per Device

### On MacBook (Tumelo's laptop)
```bash
# Install Tailscale
brew install --cask tailscale
# OR download from: https://pkgs.tailscale.com/stable/

# Start and authenticate
sudo tailscaled install
sudo tailscaled up --authkey=tskey-auth-kCwAg5huu721CNTRL-U6ZSsmLDcigSkfiNsXxUigEgWBD6wGnBK

# Verify
tailscale status
# Should show: studex-macbook (your hostname), 100.x.x.x IP
```

### On Razor (MiroFish laptop)
```bash
# Windows: Download from https://pkgs.tailscale.com/stable/
# https://pkgs.tailscale.com/stable/tailscale-setup.exe

# Run installer, then in PowerShell as Admin:
tailscale up --authkey=tskey-auth-kCwAg5huu721CNTRL-U6ZSsmLDcigSkfiNsXxUigEgWBD6wGnBK

# Verify
tailscale status
# Should show: studex-razor, 100.x.x.x IP
```

### On Lenovo (AutoResearch laptop)
```bash
# Same as Razor
tailscale up --authkey=tskey-auth-kCwAg5huu721CNTRL-U6ZSsmLDcigSkfiNsXxUigEgWBD6wGnBK

# Verify
tailscale status
```

### On Each Orgo VM (SSH in and install)
```bash
# SSH to each VM, then:

# Ubuntu/Debian:
curl -fsSL https://tailscale.com/install.sh | sh

# Start with auth key:
sudo tailscale up --authkey=tskey-auth-kCwAg5huu721CNTRL-U6ZSsmLDcigSkfiNsXxUigEgWBD6wGnBK --hostname=superagents-cmd

# Repeat for each VM with unique hostname:
# --hostname=superagents-cmd
# --hostname=global-mkts
# --hostname=dark-factory
# --hostname=sgm-clients
# --hostname=rwanda
# --hostname=ryde-rsa
# --hostname=auto-meat
# --hostname=neledi-cmo
# --hostname=solo-prenure
# --hostname=ntechlab
```

### On Daytona (if not already installed)
```bash
# SSH via Daytona UI, then:
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up --authkey=tskey-auth-kCwAg5huu721CNTRL-U6ZSsmLDcigSkfiNsXxUigEgWBD6wGnBK --hostname=daytona

# Then from ANY device:
ssh daytona.tailnet
```

### On This Sandbox (Hermes agent)
```bash
# Try to install
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up --authkey=tskey-auth-kCwAg5huu721CNTRL-U6ZSsmLDcigSkfiNsXxUigEgWBD6wGnBK --hostname=hermes-agent

# OR if already installed:
tailscale up --authkey=tskey-auth-kCwAg5huu721CNTRL-U6ZSsmLDcigSkfiNsXxUigEgWBD6wGnBK
```

## What Works After Tailscale

### SSH Between All Devices
```bash
# From MacBook to Daytona (instead of broken ssh.app.daytona.io)
ssh daytona.tailnet

# From MacBook to any Orgo VM
ssh superagents-cmd.tailnet
ssh global-mkts.tailnet
ssh dark-factory.tailnet

# From Hermes agent to all VMs
ssh superagents-cmd.tailnet
ssh daytona.tailnet
```

### Direct Service Access
```bash
# MiroFish on Razor → DeerFlow on Orgo
curl http://dark-factory.tailnet:8000  # DeerFlow API

# Discord bot → AgentMail
curl http://superagents-cmd.tailnet:3000/api/agentmail

# All services visible on tailnet
http://superagents-cmd.tailnet:3000  # Discord bot
http://global-mkts.tailnet:3000      # Gitea
http://dark-factory.tailnet:8000     # DeerFlow
http://daytona.tailnet:9090          # Daytona port 9090
```

### Sync Files Between Devices
```bash
# rsync from Razor to Daytona
rsync -avP ~/MiroFish/output/ daytona.tailnet:~/obsidian-vault/raw-sources/

# Push from MacBook to all Orgo VMs
for vm in superagents-cmd global-mkts dark-factory; do
  rsync -avP ~/studex-os/ $vm.tailnet:~/studex-os/
done
```

### Connect Discord Bot to All VMs
```bash
# On MacBook, one command to update all VMs
for vm in superagents-cmd global-mkts dark-factory sgm-clients; do
  ssh $vm.tailnet "cd ~/studex-agent-sentinel && git pull"
done
```

## MagicDNS — Easy Names

Every device gets a name like `hostname.tailnet`:

```
hermes.tailnet              ← This sandbox
daytona.tailnet              ← 755GB RAM VM
studex-macbook.tailnet       ← Tumelo's MacBook
studex-razor.tailnet         ← MiroFish laptop
studex-lenovo.tailnet        ← AutoResearch laptop
superagents-cmd.tailnet      ← Orgo VM: Discord bot
global-mkts.tailnet          ← Orgo VM: Research
dark-factory.tailnet         ← Orgo VM: Code builds
sgm-clients.tailnet          ← Orgo VM: Clients
rwanda.tailnet               ← Orgo VM: Rwanda
ryde-rsa.tailnet             ← Orgo VM: Ryde
auto-meat.tailnet            ← Orgo VM: StudexMeat
neledi-cmo.tailnet           ← Orgo VM: CMO
solo-prenure.tailnet         ← Orgo VM: Solo Prenure
ntechlab.tailnet             ← Orgo VM: NTechLab
```

## Access Control (ACLs)

Tailscale ACLs define who can talk to whom.

Default policy (all devices can talk):
```json
{
  "acls": [
    {"action": "accept", "src": ["*"], "dst": ["*:*"]}
  ]
}
```

Lock down to StudeX only:
```json
{
  "acls": [
    {"action": "accept", "src": ["tag:studex"], "dst": ["tag:studex:*"]},
  ],
  "tagOwners": {"tag:studex": ["your-email@studex-group.com"]}
}
```

## Tailscale Dashboard

Manage all devices at: https://login.tailscale.com/admin/machines

You can:
- See all connected devices
- Revoke access for lost devices
- Set up ACLs
- Enable/disable features
- View traffic logs

## Free Tier Limits

| Feature | Free | Paid ($/user/mo) |
|---------|------|----------------|
| Devices | 100 | Unlimited |
| Users | 1 | Unlimited |
| Bandwidth | Unlimited | Unlimited |
| Exit nodes | No | Yes |
| Subnets | No | Yes |
| HTTPS certs | No | Yes |

For us: **Free tier is perfect** (we have <20 devices).

## Integration with Existing Tools

### Discord Bot on Super Agents Cmd
```bash
# Connect Discord bot to other VMs via tailnet
# On superagents-cmd.tailnet:
export ORGO_VM_IP="10.0.0.x"  # Orgo internal IP
export DEERFLOW_IP="dark-factory.tailnet"  # Tailscale IP

# Bot can now talk to DeerFlow directly
curl http://dark-factory.tailnet:8000/api/research
```

### AgentMail on Any VM
```bash
# AgentMail accessible from anywhere on tailnet
# No ngrok needed
curl -X POST http://superagents-cmd.tailnet:3001/send   -H "Authorization: Bearer $AGENTMAIL_API_KEY"   -d '{"to":"client@example.com","subject":"Test","body":"..."}'
```

### OpenClaw on Daytona
```bash
# From MacBook:
openclaw run --target daytona.tailnet --skill studex-website-monitor

# From any Orgo VM:
openclaw run --target daytona.tailnet --skill studex-discord-ops
```

## Commands Reference

```bash
# Install (Ubuntu/Debian)
curl -fsSL https://tailscale.com/install.sh | sh

# Connect with auth key
sudo tailscale up --authkey=tskey-auth-kCwAg5huu721CNTRL-U6ZSsmLDcigSkfiNsXxUigEgWBD6wGnBK

# Status
tailscale status

# Ping another device
tailscale ping daytona.tailnet

# SSH to device
ssh daytona.tailnet

# Copy file
scp local.file daytona.tailnet:~/

# Open web UI
tailscale web

# Log out (disconnect device)
tailscale down

# Reconnect
sudo tailscale up
```

## Troubleshooting

### "This node is already logged in"
```bash
sudo tailscale logout
sudo tailscale up --authkey=tskey-auth-kCwAg5huu721CNTRL-U6ZSsmLDcigSkfiNsXxUigEgWBD6wGnBK
```

### Can't reach device
```bash
# Check status on both devices
tailscale status

# Ping test
tailscale ping other-device.tailnet

# Check if tailscale is running
sudo systemctl status tailscaled
```

### Auth key invalid/expired
- Auth keys expire after 90 days by default
- Generate new key at: https://login.tailscale.com/admin/settings/keys
