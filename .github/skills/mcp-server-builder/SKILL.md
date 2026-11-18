---
name: mcp-server-builder
description: Build, extend and test MCP (Model Context Protocol) servers and tools for the Studex agent fleet — FastMCP gateway tools in Python, TypeScript MCP servers, and the studex-os tool bus. Use when adding an MCP tool, exposing a service to agents, or wiring an MCP server into Copilot, Claude Code or OpenClaw.
---

# MCP server builder

Studex rule: **agents get new capabilities as MCP tools on the gateway**, not as ad-hoc scripts.

## Python — FastMCP (default)

```python
# server.py
from fastmcp import FastMCP

mcp = FastMCP("studex-<domain>")

@mcp.tool
def quote_price(sku: str, qty: int, currency: str = "ZAR") -> dict:
    """Return a price quote for a SKU. Amounts are integer cents."""
    if qty <= 0:
        raise ValueError("qty must be positive")
    ...
    return {"sku": sku, "qty": qty, "currency": currency, "total_cents": total}

if __name__ == "__main__":
    mcp.run(transport="http", host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
```

Install: `pip install fastmcp` (open source, MIT). Check the installed version's docs if an API differs.

## Tool design rules

1. **Name** `verb_noun`, snake_case: `seats_list`, `order_create`, `escrow_release`.
2. **Docstring is the prompt** — first line says what it does and when to use it; mention units (cents, UTC).
3. **Typed inputs**, validated at the top. Return JSON-serialisable dicts with stable keys.
4. **Read vs write**: read tools are safe to call freely. Write tools that move money, send messages, or delete data must take a `confirm: bool = False` argument and return a preview when `confirm` is false.
5. **Errors**: raise with a clear message; never return a stack trace or secret to the model.
6. **Idempotency**: write tools accept an optional `idempotency_key`.
7. **Auth**: HTTP transport requires a bearer token (`MCP_AUTH_TOKEN` from Secret Manager). Only `/health` is open.

## studex-os tool bus (`mcp/langchain_engine.py`)

The local engine exposes `GET /health`, `GET /fleet`, `POST /tool {"name","arguments"}` on `127.0.0.1:8765`. When adding a tool there:
- Register it in the same dispatch table as the existing tools (e.g. `seats_list`).
- Add a test case in `mcp/test_engine.py` and run `python mcp/test_engine.py` (or pytest).
- Keep it stdlib-only, like the rest of the engine.

## Testing an MCP server

- Unit-test tool functions directly with pytest.
- Smoke test end to end with the MCP Inspector (free): `npx @modelcontextprotocol/inspector`.
- Add the server to `.vscode/mcp.json` / Copilot repo MCP settings / Claude Code `.mcp.json` only with env-var references, never inline keys:
  ```json
  { "mcpServers": { "studex-gateway": { "type": "http", "url": "https://<cloud-run-url>/mcp",
      "headers": { "Authorization": "Bearer ${MCP_AUTH_TOKEN}" } } } }
  ```

## Deploying

Containerise and ship on Cloud Run — load the `gcp-deploy` skill.
