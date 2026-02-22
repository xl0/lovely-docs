## Code Execution

**Stateless** (clean interpreter each time):
```python
response = sandbox.process.code_run('def greet(name): return f"Hello, {name}!"\nprint(greet("Daytona"))')
```

**Stateful** (Python only, persistent context):
```python
sandbox.code_interpreter.run_code("counter = 1")
ctx = sandbox.code_interpreter.create_context()
sandbox.code_interpreter.run_code("value = 'stored'", context=ctx)
sandbox.code_interpreter.delete_context(ctx)
```

## Command Execution

```python
sandbox.process.exec("ls -la", cwd="workspace/src", timeout=5, env={"VAR": "value"})
```

## Sessions

For long-running operations:
```python
sandbox.process.create_session(session_id)
cmd = sandbox.process.execute_session_command(session_id, SessionExecuteRequest(command='...', run_async=True))
sandbox.process.send_session_command_input(session_id, cmd.cmd_id, "y")  # interactive input
sandbox.process.delete_session(session_id)  # cleanup
```

## Error Handling

```python
try:
    response = sandbox.process.code_run("code")
    if response.exit_code != 0:
        print(response.result)
except DaytonaError as e:
    print(f"Failed: {e}")
```