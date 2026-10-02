#!/usr/bin/env bash
# Finished-build watchdog. Exit 0 only if the OS is up and tests pass.
set -euo pipefail
ROOT="${STUDEX_OS_ROOT:-$HOME/studex-os/nexus}"
cd "$ROOT"
fail=0
python3 mcp/test_engine.py || fail=1
if curl -sf --noproxy '*' --max-time 3 http://127.0.0.1:8765/health >/tmp/studex-health.json; then
  echo "engine OK"
else
  echo "engine DOWN" >&2
  fail=1
fi
if curl -sf --noproxy '*' --max-time 4 http://127.0.0.1:8765/fleet >/tmp/studex-fleet.json; then
  python3 - <<'PY'
import json
d=json.load(open("/tmp/studex-fleet.json"))
print("fleet live", d.get("live_count"), d.get("live"))
if d.get("live_count", 0) < 8:
    raise SystemExit(2)
PY
else
  echo "fleet DOWN" >&2
  fail=1
fi
test -f seats.json && test -f businesses.json && test -f drive.json && test -f dashboard/index.html
echo "build files OK"
exit $fail
