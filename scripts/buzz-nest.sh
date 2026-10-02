#!/usr/bin/env bash
# List Buzz agents on disk. Does not join the relay until BUZZ_MEMBERSHIP=yes.
set -euo pipefail
NEST="$HOME/.openclaw/keys/buzz-agents"
echo "buzz cli: $(command -v buzz || echo missing)"
echo "agents on disk:"
ls -1 "$NEST"/*.env 2>/dev/null | sed 's#.*/##;s/\.env$//' || echo "(none)"
if [ "${BUZZ_MEMBERSHIP:-}" != "yes" ]; then
  echo "nest stays dark until BUZZ_MEMBERSHIP=yes"
  exit 0
fi
echo "membership yes — start each agent with: buzz (see ~/.local/bin/buzz)"
