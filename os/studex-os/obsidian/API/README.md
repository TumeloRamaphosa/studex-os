---
name: API Registry
type: index
last_updated: 2025-08-19
---

# StudeX OS API Registry

All APIs connected to the operating system.

| API | Type | Status | Auth | Priority |
|-----|------|--------|------|---------|
| Stitch | Payments (SA) | ✅ WORKING | GraphQL key | HIGH |
| Orgo AI | Cloud Desktops | ✅ WORKING (REST) | API key | HIGH |
| Discord Sentinel | Bot | 🔴 NOT CONNECTED | Bot token | HIGH — OAuth needed |
| Composio | AI Tools | ❌ BROKEN (410) | API key | MEDIUM — needs regen |
| WhatsApp | Messaging | 🟡 PENDING | OpenWA | MEDIUM |
| Queen API | Unknown | ⬜ NO KEYS | ? | LOW — awaiting |
| Croc API | Unknown | ⬜ NO KEYS | ? | LOW — awaiting |
| CashClaw | Unknown | ⬜ NO KEYS | ? | LOW — awaiting |
| Paystack | Payments | ⬜ NO KEYS | API key | BACKUP |
| Flutterwave | Payments | ⬜ NO KEYS | API key | BACKUP |

## Priority Actions
1. Discord OAuth — bot joins server
2. Composio key regen — HTTP 410
3. Queen/Croc/CashClaw — user providing keys
4. Paystack/Flutterwave — Africa payment options
