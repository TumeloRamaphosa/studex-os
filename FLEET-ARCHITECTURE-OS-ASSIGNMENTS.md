# StudEx Fleet — Machine Architecture & OS Assignments
**Date:** 16 September 2026 · **Prepared by:** QA-Bot (Cypher-Trace seat)

## The fleet, audited

| Machine | Tailscale IP | Hardware | Primary GPU | Role | Assigned OS | Status |
|---|---|---|---|---|---|---|
| **macbook-pro-5** | 100.95.66.29 | Apple Silicon M-series, 32GB | unified | **Control plane** — Nexus, gateway :18789, supervisor, fleet brain | macOS (keep) | 🟢 online |
| **projects-mac-mini** | 100.112.109.40 | Mac Mini | unified | **NOC + model server** — 24/7 Ollama, backups, monitoring | macOS (keep) + NOC stack | 🟢 online |
| **MSI** (Windows rig) | 100.124.221.122 | x86 desktop | NVIDIA | **Gaming + Windows-native agent** | **Dual-boot: Bazzite-NVIDIA + Windows** | 🔴 offline |
| **Razor-blade** | 100.115.114.4 | x86 laptop | NVIDIA | Gaming + mobile dev | **Dual-boot: Bazzite-NVIDIA + Windows** | 🔴 offline |
| **Legion Go** (handheld) | 100.86.176.86* | AMD handheld | AMD (integrated) | **Handheld gaming** | **Bazzite-deck (AMD)** | 🔴 offline |
| **cloud-pc-eddxx0kt** | 100.109.98.72 | cloud VM | — | Cloud worker | E2B / cloud agents | 🟡 relay-only |
| **dark-factory-vm / dark-factory** | 100.122.193.50 / .55 | VMs | — | Build farm | Ubuntu Server | 🔴 offline |
| **orgo-desktop (×3)** | 100.90/100.74/100.70 | desktops | — | Sandbox workers | Ubuntu Server | 🔴 offline |
| **naledi-cmo / robusca-sandbox / lyra-agent / maxclaw / maxhermes / superagent-cc / 4d89…** | various | linux VMs | — | Agent workers | Ubuntu Server (headless) | 🔴 offline |
| **sapien / msi / z-fold6 / ipad** | various | mobile | — | Human access | keep as-is | 🔴 offline |

## The OS strategy (one USB, three OS families)

```text
STUDEX USB (Ventoy, 64GB)
├── Omarchy 4.0.4      → dev/agent desktop (dev boxes, any bare-metal)
├── Bazzite-NVIDIA     → MSI + Razor (gaming + agents, dual-boot w/ Windows)
├── Bazzite-deck-AMD   → Legion Go handheld
└── Ubuntu 24.04       → servers, VMs, fallback
```

**Principles:**
1. **Control plane stays macOS** — the MacBook is the brain; we don't reinstall the machine running the fleet
2. **Macs = models + NOC** (Ollama, Qwen models, backups)
3. **x86 gaming rigs = Bazzite dual-boot** (Windows stays for Windows-only games; Bazzite for Linux gaming + local agents)
4. **Handheld = Bazzite-deck** (purpose-built)
5. **All worker VMs = Ubuntu Server headless** (no GUI tax)
6. **Every node joins Tailscale + seats.json on first boot** — the USB kit does it in 10 minutes

## Deployment order

1. Flash USB (Ventoy) → boot MSI from stick → install Bazzite-NVIDIA dual-boot (MSI is already in boot mode ✓)
2. Same stick → Razor → Bazzite dual-boot
3. Legion Go → Bazzite-deck image
4. Mac Mini → NOC stack (no reinstall)
5. Ubuntu ISO → offline VMs when they're next powered on

## Timing (at measured 5.7 MB/s download; slower CDN paths may halve this)

| ISO | Size | Est. download |
|---|---|---|
| Omarchy 4.0.4 | ~5.9 GB | ~17 min @5.7MB/s (iso.omarchy.org may throttle → up to 3h; auto-retry armed) |
| Bazzite-NVIDIA | ~4 GB | ~12 min |
| Ubuntu 24.04 | ~6 GB | ~18 min |
| (optional Bazzite-deck AMD) | ~4 GB | ~12 min |
| **Total (all 4)** | **~20 GB** | **~60 min best case / up to 4h worst case on throttled hosts** |

Flash + kit copy after downloads: **~40 min.** So: **best case you boot the MSI into Bazzite in ~2 hours from now; worst case tonight.**