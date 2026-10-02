#!/usr/bin/env bash
# Seed the studex-nexus Herdr workspace. Must run inside a Herdr pane.
set -euo pipefail
if [ "${HERDR_ENV:-}" != "1" ]; then
  echo "open a Herdr pane first, then: bash ~/studex-os/nexus/scripts/herdr-seed.sh"
  exit 1
fi
cd "$HOME/studex-os/nexus"
herdr workspace create --name studex-nexus --cwd "$PWD" || herdr workspace focus studex-nexus
echo "workspace studex-nexus ready"
echo "tabs: orch ops markets content infra"
echo "join prompt: JOIN-THE-OS.md"
echo "engine: http://127.0.0.1:8765"
