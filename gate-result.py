"""Fail closed unless Kane emits one complete successful final verdict."""
import json, sys, pathlib
p = pathlib.Path(__file__).parent
exitcode = int(sys.argv[1])
records = []
for line in (p / 'verify-last.ndjson').read_text().splitlines():
    try:
        records.append(json.loads(line))
    except json.JSONDecodeError:
        pass
ends = [r for r in records if r.get('type') == 'run_end']
final = ends[-1] if ends else {}
flows = final.get('per_flow_metadata') or []
passed = (
    exitcode == 0
    and len(ends) == 1
    and final.get('status') == 'passed'
    and str(final.get('result_code')) == '100'
    and final.get('reason_code') == 'success.complete'
    and bool(flows)
    and all(str(f.get('result_code')) == '100'
            and f.get('reason_code') == 'success.complete' for f in flows)
)
if not passed:
    (p / 'reprompt.txt').write_text(
        'Kane did not prove every acceptance criterion. Review verify-last.ndjson, '
        'the evidence pack, and stderr. Fix the app or the test specification '
        'without weakening its requirements, then run ./run-verify.sh again.\n'
    )
    print('GATE: FAIL. No complete successful verdict. Exit code:', exitcode)
    sys.exit(1)
(p / 'reprompt.txt').unlink(missing_ok=True)
print('GATE: PASS. Complete Kane verdict,', len(flows), 'flow(s).')
print('Review the evidence before publishing. A pass is not permission to publish.')
