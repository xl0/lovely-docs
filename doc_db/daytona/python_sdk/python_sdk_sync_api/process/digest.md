## Process

Handles process and code execution within a Sandbox.

### Initialization

```python
Process(code_toolbox: SandboxCodeToolbox, api_client: ProcessApi,
        ensure_toolbox_url: Callable[[], None])
```

### Command Execution

#### exec()
Execute shell commands with optional working directory, environment variables, and timeout.

```python
response = sandbox.process.exec("echo 'Hello'")
print(response.artifacts.stdout)  # Prints: Hello

result = sandbox.process.exec("ls", cwd="workspace/src")
result = sandbox.process.exec("sleep 10", timeout=5)
```

Returns `ExecuteResponse` with `exit_code`, `result` (stdout), and `artifacts` (stdout + matplotlib charts).

#### code_run()
Execute code in the appropriate language runtime.

```python
response = sandbox.process.code_run('''
    x = 10
    y = 20
    print(f"Sum: {x + y}")
''')
print(response.artifacts.stdout)  # Prints: Sum: 30
```

Accepts `CodeRunParams` with `argv` and `env`. Automatically detects and returns matplotlib charts in `artifacts.charts`.

```python
code = '''
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 30)
y = np.sin(x)

plt.figure(figsize=(8, 5))
plt.plot(x, y, 'b-', linewidth=2)
plt.title('Line Chart')
plt.xlabel('X-axis (seconds)')
plt.ylabel('Y-axis (amplitude)')
plt.grid(True)
plt.show()
'''

response = sandbox.process.code_run(code)
chart = response.artifacts.charts[0]

print(f"Type: {chart.type}")
print(f"Title: {chart.title}")
if chart.type == ChartType.LINE and isinstance(chart, LineChart):
    print(f"X Label: {chart.x_label}")
    print(f"Y Label: {chart.y_label}")
    print(f"X Ticks: {chart.x_ticks}")
    print(f"X Tick Labels: {chart.x_tick_labels}")
    print(f"X Scale: {chart.x_scale}")
    print(f"Y Ticks: {chart.y_ticks}")
    print(f"Y Tick Labels: {chart.y_tick_labels}")
    print(f"Y Scale: {chart.y_scale}")
    for element in chart.elements:
        print(f"Label: {element.label}, Points: {element.points}")
```

### Sessions

Background processes that maintain state between commands.

#### create_session() / get_session() / delete_session()
```python
session_id = "my-session"
sandbox.process.create_session(session_id)
session = sandbox.process.get_session(session_id)
for cmd in session.commands:
    print(f"Command: {cmd.command}")
sandbox.process.delete_session(session_id)
```

#### execute_session_command()
Execute commands in a session, maintaining state across commands.

```python
session_id = "my-session"
sandbox.process.execute_session_command(
    session_id,
    SessionExecuteRequest(command="cd /workspace")
)
sandbox.process.execute_session_command(
    session_id,
    SessionExecuteRequest(command="echo 'Hello' > test.txt")
)
result = sandbox.process.execute_session_command(
    session_id,
    SessionExecuteRequest(command="cat test.txt")
)
print(f"stdout: {result.stdout}, stderr: {result.stderr}")
```

Returns `SessionExecuteResponse` with `cmd_id`, `stdout`, `stderr`, `output`, `exit_code`. Supports async execution with `run_async=True`.

#### get_session_command()
Get information about a specific command in a session.

```python
cmd = sandbox.process.get_session_command("my-session", "cmd-123")
if cmd.exit_code == 0:
    print(f"Command {cmd.command} completed successfully")
```

#### get_session_command_logs() / get_session_command_logs_async()
Retrieve command logs synchronously or asynchronously.

```python
logs = sandbox.process.get_session_command_logs("my-session", "cmd-123")
print(f"stdout: {logs.stdout}, stderr: {logs.stderr}")

# Async with callbacks (supports both sync and async handlers)
await sandbox.process.get_session_command_logs_async(
    "my-session",
    "cmd-123",
    lambda log: print(f"[STDOUT]: {log}"),
    lambda log: print(f"[STDERR]: {log}"),
)
```

#### send_session_command_input()
Send input data to a running command.

```python
sandbox.process.send_session_command_input("my-session", "cmd-123", "input data")
```

#### list_sessions()
List all sessions in the Sandbox.

```python
sessions = sandbox.process.list_sessions()
for session in sessions:
    print(f"Session {session.session_id}: {len(session.commands)} commands")
```

### PTY Sessions

Interactive terminal sessions supporting command history and user input.

#### create_pty_session() / connect_pty_session()
Create or connect to a PTY session.

```python
pty_handle = sandbox.process.create_pty_session(
    id="my-pty",
    cwd="/workspace",
    envs={"VAR": "value"},
    pty_size=PtySize(rows=24, cols=80)
)

# Or connect to existing
pty_handle = sandbox.process.connect_pty_session("my-pty")
```

Returns `PtyHandle` for managing the session.

#### list_pty_sessions() / get_pty_session_info()
List or get details about PTY sessions.

```python
sessions = sandbox.process.list_pty_sessions()
for session in sessions:
    print(f"Session {session.id}: active={session.active}, created={session.created_at}")

session_info = sandbox.process.get_pty_session_info("my-session")
print(f"Terminal size: {session_info.cols}x{session_info.rows}")
```

#### kill_pty_session() / resize_pty_session()
Terminate or resize PTY sessions.

```python
sandbox.process.kill_pty_session("my-session")

new_size = PtySize(rows=40, cols=150)
updated_info = sandbox.process.resize_pty_session("my-session", new_size)
print(f"Resized to {updated_info.cols}x{updated_info.rows}")

# Or via PtyHandle
pty_handle.resize(new_size)
```

### Data Classes

**CodeRunParams**: `argv` (list[str]), `env` (dict[str, str])

**SessionExecuteRequest**: `command` (str), `run_async` (bool), `suppress_input_echo` (bool)

**ExecutionArtifacts**: `stdout` (str), `charts` (list[Chart])

**ExecuteResponse**: `exit_code` (int), `result` (str), `artifacts` (ExecutionArtifacts)

**SessionExecuteResponse**: `cmd_id` (str), `stdout` (str), `stderr` (str), `output` (str), `exit_code` (int)

**SessionCommandLogsResponse**: `output` (str), `stdout` (str), `stderr` (str)

### Utilities

**parse_session_command_logs(data: bytes)**: Parse combined stdout/stderr into separate streams.

**demux_log(data: bytes)**: Demultiplex combined log data, returns tuple of (stdout_bytes, stderr_bytes).

**OutputHandler**: Union of sync `Callable[[T], None]` or async `Callable[[T], Awaitable[None]]`. Blocking operations may cause WebSocket disconnections—use async callbacks with async libraries.