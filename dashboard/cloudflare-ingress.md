# Cloudflare Tunnel ingress for the StudEx Nexus
# APPEND these hostname blocks into the existing ingress list in:
#   ~/.cloudflared/hermes-dashboard.yml
#
# The running tunnel (da2e06a7-... "hermes-dashboard") already serves:
#   - hermes.studex-group.com  -> localhost:8085
#   - maus.studex-group.com    -> 127.0.0.1:18799
#
# Add these BEFORE the catch-all `- service: http_status:404` line.
# Keep the existing 404 catch-all as the LAST entry.

ingress:
  # Nexus Command Deck dashboard (static) — serve the dashboard dir on :8787
  - hostname: nexus.studex-group.com
    service: http://localhost:8787

  # StudEx MCP Bridge (FastAPI, ~/mcp-bridge.py) — unified agent gateway
  - hostname: mcp.studex-group.com
    service: http://localhost:8000
    originRequest:
      connectTimeout: 30s
      keepAliveTimeout: 90s

  # Brian API (~/brain-api.py) — shared knowledge hub for all agents
  - hostname: brain.studex-group.com
    service: http://localhost:8000

  # Ollama local inference (gateway to the Model Warehouse) — WARNING: only
  # expose behind Zero Trust Access; do NOT leave open to the public internet.
  - hostname: ollama.studex-group.com
    service: http://localhost:11434

# After editing, restart the tunnel:
#   sudo cloudflared service restart
#
# And verify:
#   curl -sm6 https://nexus.studex-group.com
#   curl -sm6 https://mcp.studex-group.com
