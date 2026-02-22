## AsyncProcess

Handles process and code execution within a Sandbox.

### Initialization

```python
class AsyncProcess():
    def __init__(code_toolbox: SandboxCodeToolbox, api_client: ProcessApi,
                 ensure_toolbox_url: Callable[[], Awaitable[None]])
```

- `code_toolbox`: Language-specific code execution toolbox
- `api_client`: API client for process operations
- `ensure_toolbox_url`: Must be called before invoking private API methods

### Command Execution

#### exec()

Execute shell commands in the Sandbox.

```python
async def exec(command: str,
               cwd: str | None = None,
               env: dict[str, str] | None = None,
               timeout: int | None = None) -> ExecuteResponse
```

Returns `ExecuteResponse` with `exit_code`, `result` (stdout), and `artifacts` (ExecutionArtifacts with stdout and matplotlib charts).

```python
# Simple command
response = await sandbox.process.exec("echo 'Hello'")
print(response.artifacts.stdout)

# With working directory and timeout
result = await sandbox.process.exec("ls", cwd="workspace/src")
result = await sandbox.process.exec("sleep 10", timeout=5)
```

#### code_run()

Execute code in the appropriate language runtime.

```python
async def code_run(code: str,
                   params: CodeRunParams | None = None,
                   timeout: int | None = None) -> ExecuteResponse
```

Returns `ExecuteResponse` with execution results and matplotlib charts automatically detected.

```python
response = await sandbox.process.code_run('''
    x = 10
    y = 20
    print(f"Sum: {x + y}")
''')
print(response.artifacts.stdout)

# Matplotlib charts are automatically captured
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

response = await sandbox.process.code_run(code)
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
        print(f"Label: {element.label}")
        print(f"Points: {element.points}")
```

### Sessions

Background processes that maintain state between commands.

#### create_session()

```python
async def create_session(session_id: str) -> None
```

#### get_session()

```python
async def get_session(session_id: str) -> Session
```

Returns Session with `session_id` and `commands` list.

#### execute_session_command()

```python
async def execute_session_command(
        session_id: str,
        req: SessionExecuteRequest,
        timeout: int | None = None) -> SessionExecuteResponse
```

`SessionExecuteRequest` has `command` (str) and `run_async` (bool | None).

Returns `SessionExecuteResponse` with `cmd_id`, `output`, `stdout`, `stderr`, `exit_code`.

```python
session_id = "my-session"
await sandbox.process.create_session(session_id)

# Change directory
req = SessionExecuteRequest(command="cd /workspace")
await sandbox.process.execute_session_command(session_id, req)

# Create and read file
req = SessionExecuteRequest(command="echo 'Hello' > test.txt")
await sandbox.process.execute_session_command(session_id, req)

req = SessionExecuteRequest(command="cat test.txt")
result = await sandbox.process.execute_session_command(session_id, req)
print(f"stdout: {result.stdout}")
print(f"stderr: {result.stderr}")

await sandbox.process.delete_session(session_id)
```

#### get_session_command()

```python
async def get_session_command(session_id: str, command_id: str) -> Command
```

Returns Command with `id`, `command`, `exit_code`.

#### get_session_command_logs()

```python
async def get_session_command_logs(
        session_id: str, command_id: str) -> SessionCommandLogsResponse
```

Returns `SessionCommandLogsResponse` with `output`, `stdout`, `stderr`.

#### get_session_command_logs_async()

```python
async def get_session_command_logs_async(
        session_id: str, command_id: str, on_stdout: OutputHandler[str],
        on_stderr: OutputHandler[str]) -> None
```

Asynchronously retrieves logs as they become available. Accepts both sync and async callbacks. Blocking synchronous operations may cause WebSocket disconnections—use async callbacks.

```python
await sandbox.process.get_session_command_logs_async(
    "my-session",
    "cmd-123",
    lambda log: print(f"[STDOUT]: {log}"),
    lambda log: print(f"[STDERR]: {log}"),
)
```

#### send_session_command_input()

```python
async def send_session_command_input(session_id: str, command_id: str,
                                     data: str) -> None
```

#### list_sessions()

```python
async def list_sessions() -> list[Session]
```

#### delete_session()

```python
async def delete_session(session_id: str) -> None
```

Terminates and removes a session, cleaning up resources.

### PTY Sessions

Interactive terminal sessions supporting command history and user input.

#### create_pty_session()

```python
async def create_pty_session(
        id: str,
        on_data: Callable[[bytes], None] | Callable[[bytes], Awaitable[None]],
        cwd: str | None = None,
        envs: dict[str, str] | None = None,
        pty_size: PtySize | None = None) -> AsyncPtyHandle
```

Returns `AsyncPtyHandle` for managing the PTY session. Raises `DaytonaError` if creation fails or session ID already in use.

#### connect_pty_session()

```python
async def connect_pty_session(
    session_id: str,
    on_data: Callable[[bytes], None] | Callable[[bytes], Awaitable[None]]
) -> AsyncPtyHandle
```

Connects to an existing PTY session via WebSocket.

#### list_pty_sessions()

```python
async def list_pty_sessions() -> list[PtySessionInfo]
```

#### get_pty_session_info()

```python
async def get_pty_session_info(session_id: str) -> PtySessionInfo
```

Returns `PtySessionInfo` with ID, state, creation time, working directory, environment variables, and more.

```python
session_info = await sandbox.process.get_pty_session_info("my-session")
print(f"Session ID: {session_info.id}")
print(f"Active: {session_info.active}")
print(f"Working Directory: {session_info.cwd}")
print(f"Terminal Size: {session_info.cols}x{session_info.rows}")
```

#### kill_pty_session()

```python
async def kill_pty_session(session_id: str) -> None
```

Forcefully terminates the PTY session and cleans up resources. Irreversible.

#### resize_pty_session()

```python
async def resize_pty_session(session_id: str,
                             pty_size: PtySize) -> PtySessionInfo
```

Changes terminal size of an active PTY session.

```python
from daytona.common.pty import PtySize

new_size = PtySize(rows=40, cols=150)
updated_info = await sandbox.process.resize_pty_session("my-session", new_size)
print(f"Terminal resized to {updated_info.cols}x{updated_info.rows}")

# Or use AsyncPtyHandle's resize method
await pty_handle.resize(new_size)
```

### Data Classes

#### CodeRunParams

```python
@dataclass
class CodeRunParams():
    argv: list[str] | None
    env: dict[str, str] | None
```

#### SessionExecuteRequest

```python
class SessionExecuteRequest(ApiSessionExecuteRequest, AsyncApiSessionExecuteRequest):
    command: str
    run_async: bool | None
    var_async: bool | None  # Deprecated, use run_async
    suppress_input_echo: bool | None  # Default False
```

#### ExecutionArtifacts

```python
@dataclass
class ExecutionArtifacts():
    stdout: str
    charts: list[Chart] | None
```

#### ExecuteResponse

```python
class ExecuteResponse(BaseModel):
    exit_code: int
    result: str
    artifacts: ExecutionArtifacts | None
```

#### SessionExecuteResponse

```python
class SessionExecuteResponse(ApiSessionExecuteResponse):
    cmd_id: str
    stdout: str | None
    stderr: str | None
    output: str
    exit_code: int
```

#### SessionCommandLogsResponse

```python
@dataclass
class SessionCommandLogsResponse():
    output: str | None
    stdout: str | None
    stderr: str | None
```

### Utility Functions

#### parse_session_command_logs()

```python
def parse_session_command_logs(data: bytes) -> SessionCommandLogsResponse
```

Parse combined stdout/stderr output into separate streams using STDOUT_PREFIX and STDERR_PREFIX markers.

#### demux_log()

```python
def demux_log(data: bytes) -> tuple[bytes, bytes]
```

Demultiplex combined stdout/stderr log data. Returns (stdout_bytes, stderr_bytes).

#### OutputHandler

```python
OutputHandler = Union[
    Callable[[T], None],
    Callable[[T], Awaitable[None]],
]
```

Callback type accepting both sync and async handlers. Blocking synchronous operations may cause WebSocket disconnections.