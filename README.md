# Deadline Radar

A small, local-first contest deadline tracker and an evidence gate for AI-built software.

## Run

Requires Python 3, Node.js and Chrome. No database, paid hosting or app account is needed.

```sh
python3 -m http.server 8377 --directory app
```

Open `http://127.0.0.1:8377`. Deadlines stay in this browser's localStorage. They are not synced, emailed or backed up. Dates are entered in the browser's local timezone. This tool does not verify contest rules or eligibility.

## Verify with Kane

```sh
npm ci
npx kane-cli login --oauth
./run-verify.sh
```

The wrapper starts the local app, sends the acceptance flows in `flows.md` to Kane CLI, and saves structured evidence. Its default is fail-closed. `gate-result.py` requires a complete successful final verdict for every reported flow, not just an exit code or an isolated passing assertion. An auth error, timeout or incomplete verdict never means the app passed. A failed run writes a repair prompt, so the coding assistant can use the evidence, fix the app and verify again.

Never commit your TestMu credentials or private run evidence. Kane uses your TestMu credits. The hackathon's free-credit offer must be claimed separately from account registration.

## Gate self-tests

`python3 test-gate.py` checks success, missing results, auth errors, timeouts, failed flows and duplicate final verdicts. These test the gate parser, not the browser app.

## Honest build record

Prepared with AI assistance for the November 2026 Kane CLI hackathon. This repository records code and verification evidence, not claims of personal authorship by a human who did not perform that work. Submission and public announcements require separate approval.
