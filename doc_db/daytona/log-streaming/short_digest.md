## Log Streaming

Real-time log access for running sandbox processes. Separate stdout/stderr streams available since v0.27.0.

### Stream with callbacks (async)
Execute command with `var_async=True` (Python) or `runAsync: true` (TypeScript), then call `get_session_command_logs_async()` with stdout/stderr callbacks to process logs in background while execution continues.

**Python example:**
```python
command = sandbox.process.execute_session_command(
  session_id,
  SessionExecuteRequest(command='...', var_async=True),
)
logs_task = asyncio.create_task(
  sandbox.process.get_session_command_logs_async(
    session_id, command.cmd_id,
    lambda stdout: print(f"[STDOUT]: {stdout}"),
    lambda stderr: print(f"[STDERR]: {stderr}"),
  )
)
await logs_task
```

### Retrieve log snapshot
Call `get_session_command_logs()` to fetch all logs up to current point. Works with both blocking and async commands.

**Python example:**
```python
command = sandbox.process.execute_session_command(
  session_id, 
  SessionExecuteRequest(command='...', run_async=True)
)
time.sleep(5)
logs = sandbox.process.get_session_command_logs(session_id, command.cmd_id)
print(logs.stdout, logs.stderr)
```

Available in Python, TypeScript, Ruby, Go SDKs and REST API.