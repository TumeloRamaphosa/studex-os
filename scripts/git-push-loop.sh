#!/usr/bin/env bash
# Commit and push StudEx Nexus (no secrets). Safe to run every 30 minutes.
set -euo pipefail
ROOT="/Users/tumeloramaphosa/studex-os/nexus"
cd "$ROOT"
python3 mcp/test_engine.py >/tmp/studex-nexus-tests.log 2>&1
git add -A
git diff --cached --quiet && { echo "no changes"; exit 0; }
SCAN=$(git diff --cached -- . ':!scripts/git-push-loop.sh' || true)
if printf '%s' "$SCAN" | rg -n "nsec1|xoxb-|xapp-|BEGIN PRIVATE" >/tmp/studex-nexus-secret-scan.log; then
  echo "REFUSING: secret-like string in staged diff" >&2
  exit 2
fi
git commit -m "nexus: checkpoint $(date -u +%Y-%m-%dT%H:%MZ)"
git push origin HEAD
echo "pushed $(git rev-parse --short HEAD)"
