---
name: Orgo AI Desktops
type: infrastructure
platform: Orgo AI cloud
status: ACTIVE
role: Execution infrastructure
last_updated: 2025-08-19
---

# Orgo AI — 10 Cloud Desktops

24/7 cloud desktop infrastructure. Each desktop runs like a real computer in the browser.

## API Credentials
```
Key:     ${ORGO_API_KEY}
Base:    https://www.orgo.ai/api
Workspaces: GET https://www.orgo.ai/api/workspaces
```

## Status
| Service | Status |
|---------|--------|
| REST API | ✅ WORKING |
| MCP (AI tools) | ❌ HTTP 401 — key needs regeneration |

To regenerate: go to orgo.ai dashboard → API keys → create new key

## 10 Desktops

| # | Name | Desktop ID | Purpose |
|---|------|------------|---------|
| 1 | Super Agents Command | 333de3f8-0801-430b-a541-aad458e896b5 | Main command |
| 2 | Global Markets | 0f28f3a2-2b26-4260-bff7-262885c86c28 | Global Markets VM |
| 3 | DARK F@CT0Ry | 7bf8b3a1-4a9e-4b9f-a3c2-8b4e5f6a7d8c | Dark operations |
| 4 | SGM-CLIENTS | 4ecb1d3e-9f2a-4d8c-b3e7-1a2d5f8e9c0b | Client management |
| 5 | Rwanda | 5ad9e2f1-8c3b-4d7e-a9f6-2b4e6d8c0a3e | Rwanda operations |
| 6 | Ryde 1 RSA | 6be0f3a2-9d4c-5e8f-b0c7-3c5f7e9d1b4f | SA rides business |
| 7 | Auto-Meat | 7cf1g4b3-0e5d-6f9g-c1d8-4d6g8f0e2c5g | Meat business |
| 8 | Neledi-CMO | 8dg2h5c4-1f6e-7g0h-d2e9-5e7h9g1f3d6h | CMO operations |
| 9 | Solo-Prenure | 9eh3i6d5-2g7f-8h1i-e3f0-6f8i0h2g4e7i | Solo preneurship |
| 10 | NTechLab-NTECHJ | aef4j7e6-3h8g-9i2j-f4g1-7g9j1i3h5f8j | Tech lab |

## Bot Code Location
`/workspace/studex-agent-sentinel/` — has orgo-client for Orgo API integration
