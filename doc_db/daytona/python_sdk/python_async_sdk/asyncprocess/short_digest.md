## AsyncProcess

Handles process and code execution in Sandbox.

### Command & Code Execution

```python
# Shell commands
response = await sandbox.process.exec("echo 'Hello'", cwd="dir", timeout=5)
print(response.artifacts.stdout)

# Code execution with automatic matplotlib chart capture
response = await sandbox.process.code_run('''
    import matplotlib.pyplot as plt
    plt.plot([1,2,3])
    plt.show()
''')
chart = response.artifacts.charts[0]
```

### Sessions

Background processes maintaining state between commands.

```python
await sandbox.process.create_session("my-session")

# Execute commands in sequence
req = SessionExecuteRequest(command="cd /workspace")
await sandbox.process.execute_session_command("my-session", req)

req = SessionExecuteRequest(command="cat test.txt")
result = await sandbox.process.execute_session_command("my-session", req)
print(result.stdout)

# Get logs asynchronously
await sandbox.process.get_session_command_logs_async(
    "my-session", "cmd-123",
    lambda log: print(f"[STDOUT]: {log}"),
    lambda log: print(f"[STDERR]: {log}"),
)

await sandbox.process.delete_session("my-session")
```

### PTY Sessions

Interactive terminal sessions.

```python
# Create PTY session
pty_handle = await sandbox.process.create_pty_session(
    "my-pty",
    on_data=lambda data: print(data.decode()),
    pty_size=PtySize(rows=24, cols=80)
)

# Or connect to existing
pty_handle = await sandbox.process.connect_pty_session(
    "my-pty",
    on_data=lambda data: print(data.decode())
)

# Manage PTY
info = await sandbox.process.get_pty_session_info("my-pty")
await sandbox.process.resize_pty_session("my-pty", PtySize(rows=40, cols=150))
await sandbox.process.kill_pty_session("my-pty")
```

### Data Classes

- `ExecuteResponse`: exit_code, result, artifacts
- `ExecutionArtifacts`: stdout, charts
- `SessionExecuteResponse`: cmd_id, stdout, stderr, output, exit_code
- `SessionCommandLogsResponse`: output, stdout, stderr
- `CodeRunParams`: argv, env
- `SessionExecuteRequest`: command, run_async, suppress_input_echo