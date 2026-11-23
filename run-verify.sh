#!/usr/bin/env bash
# A failed, timed-out or unauthenticated run must never open the ship gate.
set -uo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
PORT="${PORT:-8377}"
cd "$ROOT"
python3 -m http.server "$PORT" --directory app >server.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT
python3 - "$PORT" <<'PY'
import sys,time,urllib.request
for _ in range(30):
 try:urllib.request.urlopen('http://127.0.0.1:'+sys.argv[1],timeout=1);break
 except OSError:time.sleep(.1)
else:raise SystemExit('Local app did not start')
PY
STATUS=0
npx kane-cli run "$(cat flows.md)" --url "http://127.0.0.1:$PORT" --headless --agent --timeout 600 --max-steps 75 --final-validation on > verify-last.ndjson 2>verify-stderr.log || STATUS=$?
python3 gate-result.py "$STATUS"
