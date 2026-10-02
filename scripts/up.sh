#!/usr/bin/env bash
# Start the finished StudEx Nexus build on this Mac.
set -euo pipefail
ROOT="${STUDEX_OS_ROOT:-$HOME/studex-os/nexus}"
cd "$ROOT"

if ! lsof -nP -iTCP:8765 -sTCP:LISTEN >/dev/null 2>&1; then
  python3 "$ROOT/mcp/langchain_engine.py" &
  echo "engine starting :8765"
else
  echo "engine already :8765"
fi

if command -v denchclaw >/dev/null 2>&1; then
  if ! lsof -nP -iTCP:3100 -sTCP:LISTEN >/dev/null 2>&1 && ! lsof -nP -iTCP:3101 -sTCP:LISTEN >/dev/null 2>&1; then
    denchclaw start --web-port 3100 >/tmp/studex-denchclaw.log 2>&1 &
    echo "denchclaw starting :3100"
  else
    echo "denchclaw already listening"
  fi
fi

for i in 1 2 3 4 5 6 8 10; do
  if curl -sf --noproxy '*' --max-time 1 "http://127.0.0.1:8765/health" >/dev/null; then
    echo "engine up"
    break
  fi
  sleep 0.3
done
curl -sf --noproxy '*' --max-time 3 "http://127.0.0.1:8765/fleet" | python3 -m json.tool | head -40
echo "deck https://studex-nexus.vercel.app/"
echo "local $ROOT/dashboard/index.html"
