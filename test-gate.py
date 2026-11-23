import json,pathlib,subprocess,tempfile,shutil
code=pathlib.Path('gate-result.py').read_text()
base={'type':'run_end','status':'passed','result_code':100,'reason_code':'success.complete','per_flow_metadata':[{'result_code':'100','reason_code':'success.complete'}]}
cases=[('pass',0,[base],0),('empty',0,[],1),('auth-error',2,[base],1),('timeout',3,[base],1),('missing-final',0,[{'type':'stream_start'}],1),('failed-verdict',0,[{**base,'status':'failed'}],1),('failed-flow',0,[{**base,'per_flow_metadata':[{'result_code':'500','reason_code':'failed'}]}],1),('missing-flow',0,[{**base,'per_flow_metadata':[]}],1),('duplicate-final',0,[base,base],1)]
for name,exitcode,rows,expected in cases:
 with tempfile.TemporaryDirectory() as td:
  p=pathlib.Path(td);(p/'gate-result.py').write_text(code);(p/'verify-last.ndjson').write_text('\n'.join(json.dumps(r) for r in rows))
  r=subprocess.run(['python3',str(p/'gate-result.py'),str(exitcode)],capture_output=True,text=True)
  assert r.returncode==expected,(name,r.stdout,r.stderr)
  assert (p/'reprompt.txt').exists()==bool(expected),name
  print('PASS',name)
