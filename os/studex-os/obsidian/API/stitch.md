---
name: Stitch Payments
type: payment
provider: Stitch (South Africa)
status: WORKING
last_updated: 2025-08-19
---

# Stitch Payment API

South African payment provider. GraphQL-based.

## Credentials
```
Key:   qnvTfERktd44FPUpskKoZBUtrzMXJ1jIBXPsDiz5wQ2z0z0zd2qAp2QR2vyM69Fz
FNB:   62760837610
```

## Endpoints
| Endpoint | URL | Status |
|----------|-----|--------|
| GraphQL | https://api.stitch.money/graphql | ✅ WORKING |
| Dashboard | https://express.stitch.money/login | ✅ |
| ID verification | https://id.stitch.money | ❌ BLOCKED |
| Payment page | https://nbhzahnx5ny9.space.mcode.io | ✅ |

## Payment Links (Stitch)
- RetailBot, HealthBot, PropBot, DineAssist
- ProAssist, SalesCloser, MultiBot, TradeBot

## GraphQL Query Example
```graphql
query GetPaymentLink($id: ID!) {
  paymentLink(id: $id) {
    id
    amount
    status
  }
}
```

## Integration
Used on superagents.studex-group.com for ZAR payments.
Dashboard: express.stitch.money/login
