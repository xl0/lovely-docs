

## Pages

### codeinterpreter
Python code interpreter for sandbox execution with persistent default context and isolated context creation, supporting output streaming callbacks and configurable timeouts.

## CodeInterpreter

Handles Python code interpretation and execution within a Sandbox. Supports isolated execution contexts where variables, imports, and functions persist across executions within the same context.

### Initialization

```python
CodeInterpreter(api_client: InterpreterApi, ensure_toolbox_url: Callable[[], None])
```

### run_code

Execute Python code in the sandbox with optional callbacks for output streaming.

```python
result = sandbox.code_interpreter.run_code(
    code: str,
    context: InterpreterContext | None = None,
    on_stdout: OutputHandler[OutputMessage] | None = None,
    on_stderr: OutputHandler[OutputMessage] | None = None,
    on_error: OutputHandler[ExecutionError] | None = None,
    envs: dict[str, str] | None = None,
    timeout: int | None = None
) -> ExecutionResult
```

**Arguments:**
- `code` - Python code to execute
- `context` - Execution context (default: shared persistent context)
- `on_stdout`, `on_stderr`, `on_error` - Callbacks for streaming output
- `envs` - Environment variables for this execution
- `timeout` - Timeout in seconds (default: 10 minutes, 0 = no timeout)

**Returns:** `ExecutionResult` with stdout, stderr, and error fields

**Raises:** `DaytonaTimeoutError`, `DaytonaError`

**Example:**
```python
def handle_stdout(msg: OutputMessage):
    print(f"STDOUT: {msg.output}", end="")

def handle_stderr(msg: OutputMessage):
    print(f"STDERR: {msg.output}", end="")

def handle_error(err: ExecutionError):
    print(f"ERROR: {err.name}: {err.value}")

result = sandbox.code_interpreter.run_code(
    code='import time\nfor i in range(5):\n    print(i)\n    time.sleep(1)',
    on_stdout=handle_stdout,
    on_stderr=handle_stderr,
    on_error=handle_error,
    timeout=10
)
```

### Context Management

Create isolated execution environments with separate namespaces:

```python
# Create isolated context
ctx = sandbox.code_interpreter.create_context(cwd: str | None = None) -> InterpreterContext

# List all user-created contexts (excludes default context)
contexts = sandbox.code_interpreter.list_contexts() -> list[InterpreterContext]

# Delete context and shut down associated processes
sandbox.code_interpreter.delete_context(context: InterpreterContext) -> None
```

**Example:**
```python
ctx = sandbox.code_interpreter.create_context()
sandbox.code_interpreter.run_code("x = 100", context=ctx)
result = sandbox.code_interpreter.run_code("print(x)", context=ctx)  # OK: x exists in ctx
result = sandbox.code_interpreter.run_code("print(x)")  # NameError: x doesn't exist in default context
sandbox.code_interpreter.delete_context(ctx)
```

### Data Models

**OutputMessage:** Represents stdout/stderr output
- `output` - Output content

**ExecutionError:** Represents execution errors
- `name` - Error type (e.g., "ValueError", "SyntaxError")
- `value` - Error value
- `traceback` - Full traceback

**ExecutionResult:** Result of code execution
- `stdout` - Standard output
- `stderr` - Standard error
- `error` - Error details or None

### Notes

- Default context persists state across executions
- For other languages, use `Process.code_run()` or execute commands directly in sandbox terminal
- Default context cannot be deleted

### computeruse
ComputerUse class with mouse, keyboard, screenshot, display, and recording operations for desktop automation; includes process management (start/stop/status/restart/logs), mouse movement/clicking/dragging/scrolling, keyboard typing/key pressing/hotkeys, full/region/compressed screenshots, display info/windows, and screen recording with download.

## ComputerUse

Desktop automation interface providing mouse, keyboard, screenshot, display, and recording operations.

### ComputerUse Class

Main class with attributes: `mouse`, `keyboard`, `screenshot`, `display`, `recording`.

**Methods:**
- `start()` → ComputerUseStartResponse: Starts Xvfb, xfce4, x11vnc, novnc processes
- `stop()` → ComputerUseStopResponse: Stops all processes
- `get_status()` → ComputerUseStatusResponse: Gets status of all VNC processes
- `get_process_status(process_name: str)` → ProcessStatusResponse: Check specific process
- `restart_process(process_name: str)` → ProcessRestartResponse: Restart specific process
- `get_process_logs(process_name: str)` → ProcessLogsResponse: Get process logs
- `get_process_errors(process_name: str)` → ProcessErrorsResponse: Get error logs

```python
result = sandbox.computer_use.start()
status = sandbox.computer_use.get_status()
xvfb_status = sandbox.computer_use.get_process_status("xvfb")
sandbox.computer_use.restart_process("xfce4")
logs = sandbox.computer_use.get_process_logs("novnc")
errors = sandbox.computer_use.get_process_errors("x11vnc")
sandbox.computer_use.stop()
```

### Mouse

**Methods:**
- `get_position()` → MousePositionResponse: Current cursor position
- `move(x: int, y: int)` → MousePositionResponse: Move to coordinates
- `click(x: int, y: int, button: str = "left", double: bool = False)` → MouseClickResponse: Click at position (button: 'left'/'right'/'middle')
- `drag(start_x: int, start_y: int, end_x: int, end_y: int, button: str = "left")` → MouseDragResponse: Drag from start to end
- `scroll(x: int, y: int, direction: str, amount: int = 1)` → bool: Scroll at position (direction: 'up'/'down')

```python
position = sandbox.computer_use.mouse.get_position()
sandbox.computer_use.mouse.move(100, 200)
sandbox.computer_use.mouse.click(100, 200)  # single left click
sandbox.computer_use.mouse.click(100, 200, "left", True)  # double click
sandbox.computer_use.mouse.click(100, 200, "right")  # right click
sandbox.computer_use.mouse.drag(50, 50, 150, 150)
sandbox.computer_use.mouse.scroll(100, 200, "up", 3)
sandbox.computer_use.mouse.scroll(100, 200, "down", 5)
```

### Keyboard

**Methods:**
- `type(text: str, delay: int | None = None)` → None: Type text with optional delay (ms) between characters
- `press(key: str, modifiers: list[str] | None = None)` → None: Press key with modifiers ('ctrl', 'alt', 'meta', 'shift'). Key examples: 'Return', 'Escape', 'Tab', 'a', 'A'
- `hotkey(keys: str)` → None: Press hotkey combination (e.g., 'ctrl+c', 'alt+tab', 'cmd+shift+t')

```python
sandbox.computer_use.keyboard.type("Hello, World!")
sandbox.computer_use.keyboard.type("Slow typing", 100)
sandbox.computer_use.keyboard.press("Return")
sandbox.computer_use.keyboard.press("c", ["ctrl"])  # Ctrl+C
sandbox.computer_use.keyboard.press("t", ["ctrl", "shift"])  # Ctrl+Shift+T
sandbox.computer_use.keyboard.hotkey("ctrl+c")
sandbox.computer_use.keyboard.hotkey("ctrl+v")
sandbox.computer_use.keyboard.hotkey("alt+tab")
```

### Screenshot

**Methods:**
- `take_full_screen(show_cursor: bool = False)` → ScreenshotResponse: Full screen screenshot
- `take_region(region: ScreenshotRegion, show_cursor: bool = False)` → ScreenshotResponse: Screenshot of specific region
- `take_compressed(options: ScreenshotOptions | None = None)` → ScreenshotResponse: Compressed full screen
- `take_compressed_region(region: ScreenshotRegion, options: ScreenshotOptions | None = None)` → ScreenshotResponse: Compressed region screenshot

ScreenshotRegion: `x`, `y`, `width`, `height` (int)

ScreenshotOptions: `show_cursor` (bool), `fmt` (str: 'png'/'jpeg'/'webp'), `quality` (int 0-100), `scale` (float)

```python
screenshot = sandbox.computer_use.screenshot.take_full_screen()
with_cursor = sandbox.computer_use.screenshot.take_full_screen(True)

region = ScreenshotRegion(x=100, y=100, width=300, height=200)
screenshot = sandbox.computer_use.screenshot.take_region(region)

screenshot = sandbox.computer_use.screenshot.take_compressed()
jpeg = sandbox.computer_use.screenshot.take_compressed(
    ScreenshotOptions(format="jpeg", quality=95, show_cursor=True)
)
scaled = sandbox.computer_use.screenshot.take_compressed(
    ScreenshotOptions(format="png", scale=0.5)
)

region = ScreenshotRegion(x=0, y=0, width=800, height=600)
screenshot = sandbox.computer_use.screenshot.take_compressed_region(
    region,
    ScreenshotOptions(format="webp", quality=80, show_cursor=True)
)
```

### Display

**Methods:**
- `get_info()` → DisplayInfoResponse: Display information (primary_display, total_displays, displays list with width, height, x, y)
- `get_windows()` → WindowsResponse: List of open windows (count, windows list with id and title)

```python
info = sandbox.computer_use.display.get_info()
for i, display in enumerate(info.displays):
    print(f"Display {i}: {display.width}x{display.height} at {display.x},{display.y}")

windows = sandbox.computer_use.display.get_windows()
for window in windows.windows:
    print(f"- {window.title} (ID: {window.id})")
```

### RecordingService

**Methods:**
- `start(label: str | None = None)` → Recording: Start recording with optional label
- `stop(recording_id: str)` → Recording: Stop recording
- `list()` → ListRecordingsResponse: List all recordings (active and completed)
- `get(recording_id: str)` → Recording: Get recording details (file_name, status, duration_seconds)
- `delete(recording_id: str)` → None: Delete recording
- `download(recording_id: str, local_path: str)` → None: Download recording file to local path (streamed to disk)

```python
recording = sandbox.computer_use.recording.start("my-test-recording")
result = sandbox.computer_use.recording.stop(recording.id)

recordings = sandbox.computer_use.recording.list()
for rec in recordings.recordings:
    print(f"- {rec.file_name}: {rec.status}")

recording = sandbox.computer_use.recording.get(recording_id)
sandbox.computer_use.recording.download(recording_id, "local_recording.mp4")
sandbox.computer_use.recording.delete(recording_id)
```

### daytona_client_api
Daytona client class with methods to create/manage sandboxes from snapshots or images, supporting configuration via DaytonaConfig or environment variables, with parameters for language, resources, environment variables, auto-lifecycle intervals, volumes, and network settings.

## Daytona

Main class for interacting with the Daytona API. Provides methods to create, manage, and interact with Daytona Sandboxes.

**Attributes**:
- `volume` - VolumeService for managing volumes
- `snapshot` - SnapshotService for managing snapshots

### Initialization

```python
from daytona import Daytona, DaytonaConfig

# Environment variables: DAYTONA_API_KEY, DAYTONA_API_URL, DAYTONA_TARGET
daytona = Daytona()

# Explicit config
config = DaytonaConfig(api_key="key", api_url="https://api.com", target="us")
daytona = Daytona(config)

# With OpenTelemetry tracing
config = DaytonaConfig(api_key="key", experimental={"otelEnabled": True})
async with Daytona(config) as daytona:
    sandbox = daytona.create()
```

Raises `DaytonaError` if API key not provided.

### Creating Sandboxes

**From snapshot** (default):
```python
sandbox = daytona.create()

params = CreateSandboxFromSnapshotParams(
    language="python",
    snapshot="my-snapshot-id",
    env_vars={"DEBUG": "true"},
    auto_stop_interval=0,
    auto_archive_interval=60,
    auto_delete_interval=120
)
sandbox = daytona.create(params, timeout=40)
```

**From image**:
```python
sandbox = daytona.create(CreateSandboxFromImageParams(image="debian:12.9"))

declarative_image = (
    Image.base("alpine:3.18")
    .pipInstall(["numpy", "pandas"])
    .env({"MY_ENV_VAR": "value"})
)
params = CreateSandboxFromImageParams(
    language="python",
    image=declarative_image,
    env_vars={"DEBUG": "true"},
    resources=Resources(cpu=2, memory=4),
    auto_stop_interval=0,
    auto_archive_interval=60,
    auto_delete_interval=120
)
sandbox = daytona.create(params, timeout=40, on_snapshot_create_logs=lambda chunk: print(chunk, end=""))
```

`timeout` parameter (default 60s, 0 = no timeout). Raises `DaytonaError` if timeout/auto_stop_interval/auto_archive_interval is negative or sandbox fails to start.

### Sandbox Management

```python
# Get by ID or name
sandbox = daytona.get("sandbox-id-or-name")

# Find by ID/name or labels
sandbox = daytona.find_one(labels={"my-label": "my-value"})

# List with pagination
result = daytona.list(labels={"my-label": "my-value"}, page=2, limit=10)
for sandbox in result.items:
    print(f"{sandbox.id}: {sandbox.state}")

# Start/stop
daytona.start(sandbox, timeout=60)
daytona.stop(sandbox, timeout=60)

# Delete
daytona.delete(sandbox, timeout=60)
```

All management methods raise `DaytonaError` on failure or timeout.

## CodeLanguage

Enum of supported languages: `PYTHON`, `TYPESCRIPT`, `JAVASCRIPT`

## DaytonaConfig

Configuration for Daytona client.

**Attributes**:
- `api_key` - API key for authentication (or use `DAYTONA_API_KEY` env var)
- `jwt_token` - JWT token for authentication (or use `DAYTONA_JWT_TOKEN` env var)
- `organization_id` - Required with JWT token (or use `DAYTONA_ORGANIZATION_ID` env var)
- `api_url` - Daytona API URL (defaults to `https://app.daytona.io/api`, or use `DAYTONA_API_URL` env var)
- `server_url` - Deprecated, use `api_url`
- `target` - Target runner location (or use `DAYTONA_TARGET` env var)
- `_experimental` - Experimental feature configuration

```python
config = DaytonaConfig(api_key="key")
config = DaytonaConfig(jwt_token="token", organization_id="org-id")
```

## CreateSandboxBaseParams

Base parameters for sandbox creation.

**Attributes**:
- `name` - Sandbox name
- `language` - CodeLanguage (defaults to "python")
- `os_user` - OS user for sandbox
- `env_vars` - Environment variables dict
- `labels` - Custom labels dict
- `public` - Whether sandbox is public
- `timeout` - Creation/start timeout in seconds
- `auto_stop_interval` - Minutes until auto-stop if no activity (default 15, 0 = disabled)
- `auto_archive_interval` - Minutes until auto-archive when stopped (default 7 days, 0 = max interval)
- `auto_delete_interval` - Minutes until auto-delete when stopped (default disabled, 0 = delete immediately)
- `volumes` - List of VolumeMount objects
- `network_block_all` - Block all network access
- `network_allow_list` - Comma-separated CIDR addresses to allow
- `ephemeral` - If True, sets auto_delete_interval to 0

## CreateSandboxFromImageParams

Extends CreateSandboxBaseParams.

**Attributes**:
- `image` - Docker image string or Image object (dynamically built if Image object)
- `resources` - Resources object with cpu/memory configuration

## CreateSandboxFromSnapshotParams

Extends CreateSandboxBaseParams.

**Attributes**:
- `snapshot` - Snapshot name to use

### filesystem
FileSystem class for sandbox file operations: create/list/delete directories, upload/download files (bytes or streaming), move/rename, set permissions, search by name/content, and replace in files.

## FileSystem

High-level interface for file system operations within a Daytona Sandbox.

### Initialization

```python
FileSystem(api_client: FileSystemApi, ensure_toolbox_url: Callable[[], None])
```

### Directory Operations

**create_folder(path: str, mode: str) -> None**

Creates a directory with specified permissions in octal format.

```python
sandbox.fs.create_folder("workspace/data", "755")
sandbox.fs.create_folder("workspace/secrets", "700")
```

**list_files(path: str) -> list[FileInfo]**

Lists files and directories with metadata (name, is_dir, size, mode, mod_time, permissions, owner, group).

```python
files = sandbox.fs.list_files("workspace/data")
for file in files:
    if not file.is_dir:
        print(f"{file.name}: {file.size} bytes")
```

**get_file_info(path: str) -> FileInfo**

Gets detailed information about a single file or directory.

```python
info = sandbox.fs.get_file_info("workspace/data/file.txt")
print(f"Size: {info.size}, Modified: {info.mod_time}, Mode: {info.mode}")
if sandbox.fs.get_file_info("workspace/data").is_dir:
    print("Path is a directory")
```

### File Operations

**upload_file(file: bytes | str, remote_path: str, timeout: int = 30*60) -> None**

Uploads file from bytes or local path. Supports streaming for large files.

```python
# From bytes
sandbox.fs.upload_file(b"Hello, World!", "tmp/hello.txt")
sandbox.fs.upload_file(json.dumps({"key": "value"}).encode('utf-8'), "tmp/config.json")

# From local file (streaming)
sandbox.fs.upload_file("local_file.txt", "tmp/large_file.txt")
```

**upload_files(files: list[FileUpload], timeout: int = 30*60) -> None**

Uploads multiple files. FileUpload has source (bytes | str) and destination (str).

```python
sandbox.fs.upload_files([
    FileUpload(source=b"Content 1", destination="/tmp/file1.txt"),
    FileUpload(source="local_file.txt", destination="/tmp/file2.txt"),
])
```

**download_file(remote_path: str, timeout: int = 30*60) -> bytes**

Downloads file as bytes (for small files in memory).

```python
content = sandbox.fs.download_file("workspace/data/file.txt")
with open("local_copy.txt", "wb") as f:
    f.write(content)
config = json.loads(sandbox.fs.download_file("workspace/data/config.json").decode('utf-8'))
```

**download_file(remote_path: str, local_path: str, timeout: int = 30*60) -> None**

Downloads file with streaming to local path (for large files).

```python
sandbox.fs.download_file("tmp/large_file.txt", "local_copy.txt")
size_mb = os.path.getsize("local_copy.txt") / 1024 / 1024
```

**download_files(files: list[FileDownloadRequest], timeout: int = 30*60) -> list[FileDownloadResponse]**

Downloads multiple files. FileDownloadRequest has source (str) and optional destination (str). Returns FileDownloadResponse with source, result (str | bytes | None), and error (str | None). Individual file errors don't raise exceptions.

```python
results = sandbox.fs.download_files([
    FileDownloadRequest(source="tmp/data.json"),
    FileDownloadRequest(source="tmp/config.json", destination="local_config.json")
])
for result in results:
    if result.error:
        print(f"Error: {result.error}")
    elif result.result:
        print(f"Downloaded to {result.result}")
```

**delete_file(path: str, recursive: bool = False) -> None**

Deletes a file. For directories, recursive must be True.

```python
sandbox.fs.delete_file("workspace/data/old_file.txt")
```

**move_files(source: str, destination: str) -> None**

Moves or renames files/directories. Parent directory of destination must exist.

```python
sandbox.fs.move_files("workspace/data/old_name.txt", "workspace/data/new_name.txt")
sandbox.fs.move_files("workspace/data/file.txt", "workspace/archive/file.txt")
sandbox.fs.move_files("workspace/old_dir", "workspace/new_dir")
```

**set_file_permissions(path: str, mode: str | None = None, owner: str | None = None, group: str | None = None) -> None**

Sets permissions and ownership. Any parameter can be None to leave unchanged.

```python
sandbox.fs.set_file_permissions("workspace/scripts/run.sh", mode="755")
sandbox.fs.set_file_permissions("workspace/data/file.txt", owner="daytona", group="daytona")
```

### Search and Replace

**search_files(path: str, pattern: str) -> SearchFilesResponse**

Searches for files/directories by name pattern (supports glob patterns like "*.py").

```python
result = sandbox.fs.search_files("workspace", "*.py")
for file in result.files:
    print(file)
result = sandbox.fs.search_files("workspace/data", "test_*")
```

**find_files(path: str, pattern: str) -> list[Match]**

Searches file contents for pattern (like grep). Returns Match objects with file, line, content.

```python
matches = sandbox.fs.find_files("workspace/src", "TODO:")
for match in matches:
    print(f"{match.file}:{match.line}: {match.content.strip()}")
```

**replace_in_files(files: list[str], pattern: str, new_value: str) -> list[ReplaceResult]**

Performs search and replace across multiple files. Returns ReplaceResult with file, success, error.

```python
results = sandbox.fs.replace_in_files(
    files=["workspace/src/file1.py", "workspace/src/file2.py"],
    pattern="old_function",
    new_value="new_function"
)
for result in results:
    print(f"{result.file}: {result.success if result.success else result.error}")
```

### Data Classes

**FileUpload**: source (bytes | str), destination (str)

**FileDownloadRequest**: source (str), destination (str | None)

**FileDownloadResponse**: source (str), result (str | bytes | None), error (str | None)

**FileInfo**: name, is_dir, size, mode, mod_time, permissions, owner, group

All relative paths resolve based on sandbox working directory. Default timeout is 30 minutes (0 = no timeout).

### git
Git class for sandbox repository operations: clone, add, commit, push, pull, status, branch management with optional authentication.

## Git

Provides Git operations within a Sandbox via the `Git` class.

### Git.__init__

```python
def __init__(api_client: GitApi)
```

Initializes a Git handler instance with an API client.

### Git.clone

```python
sandbox.git.clone(
    url="https://github.com/user/repo.git",
    path="workspace/repo",
    branch="develop",  # optional
    commit_id="abc123",  # optional
    username="user",  # optional
    password="token"  # optional
)
```

Clones a Git repository. Supports cloning specific branches or commits, with optional authentication.

### Git.add

```python
sandbox.git.add("workspace/repo", ["file.txt", "src/main.py"])
```

Stages files for the next commit (equivalent to `git add`).

### Git.commit

```python
sandbox.git.commit(
    path="workspace/repo",
    message="Update documentation",
    author="John Doe",
    email="john@example.com",
    allow_empty=True  # optional, defaults to False
)
```

Creates a new commit with staged changes. Returns `GitCommitResponse` with the commit SHA.

### Git.push

```python
sandbox.git.push("workspace/repo", username="user", password="token")
```

Pushes local commits on the current branch to the remote repository. Authentication is optional.

### Git.pull

```python
sandbox.git.pull("workspace/repo", username="user", password="token")
```

Pulls changes from the remote repository. Authentication is optional.

### Git.status

```python
status = sandbox.git.status("workspace/repo")
# Returns GitStatus with:
# - current_branch: Current branch name
# - file_status: List of file statuses
# - ahead: Number of local commits not pushed
# - behind: Number of remote commits not pulled
# - branch_published: Whether branch is published to remote
```

Gets the current repository status.

### Git.branches

```python
response = sandbox.git.branches("workspace/repo")
# Returns ListBranchResponse with list of branches
```

Lists all branches in the repository.

### Git.checkout_branch

```python
sandbox.git.checkout_branch("workspace/repo", "feature-branch")
```

Checks out a branch.

### Git.create_branch

```python
sandbox.git.create_branch("workspace/repo", "new-feature")
```

Creates a new branch.

### Git.delete_branch

```python
sandbox.git.delete_branch("workspace/repo", "old-feature")
```

Deletes a branch.

### GitCommitResponse

```python
class GitCommitResponse()
```

Response from commit operation with `sha` attribute containing the commit SHA.

### Path Resolution

All path arguments are relative to the sandbox working directory unless absolute.

### lspserver
LSP server for code intelligence: file tracking, symbol search (document/sandbox), completions; supports Python/TypeScript/JavaScript.

## LspServer

Provides Language Server Protocol functionality for IDE-like features: code completion, symbol search, diagnostics, and more.

### Initialization

```python
lsp = LspServer(
    language_id=LspLanguageId.TYPESCRIPT,  # or PYTHON, JAVASCRIPT
    path_to_project="/absolute/path/to/project",
    api_client=api_client
)
```

### Lifecycle

```python
lsp.start()   # Initialize server before use
lsp.stop()    # Clean up resources when done
```

### File Operations

```python
lsp.did_open("src/index.ts")   # Notify server file opened
lsp.did_close("src/index.ts")  # Notify server file closed
```

Paths can be relative (resolved from project root) or absolute.

### Symbol Search

```python
# Get symbols from a specific file
symbols = lsp.document_symbols("src/index.ts")

# Search symbols across entire sandbox
symbols = lsp.sandbox_symbols("User")  # Returns matching symbols

for symbol in symbols:
    print(f"{symbol.kind} {symbol.name}: {symbol.location}")
```

Returns `list[LspSymbol]` with: name, kind (function/class/variable/etc.), location.

Note: `workspace_symbols()` is deprecated, use `sandbox_symbols()` instead.

### Code Completions

```python
pos = LspCompletionPosition(line=10, character=15)
completions = lsp.completions("src/index.ts", pos)

for item in completions.items:
    print(f"{item.label} ({item.kind}): {item.detail}")
```

Returns `CompletionList` with:
- `isIncomplete`: Whether more items available
- `items`: List of completion items with label, kind, detail, documentation, sortText, filterText, insertText

### Language Support

```python
class LspLanguageId(str, Enum):
    PYTHON = "python"
    TYPESCRIPT = "typescript"
    JAVASCRIPT = "javascript"
```

### Position Format

```python
@dataclass
class LspCompletionPosition:
    line: int        # Zero-based line number
    character: int   # Zero-based character offset
```

All methods include error handling with descriptive prefixes and instrumentation.

### objectstorage
ObjectStorage class for uploading files to object storage services with AWS credentials; upload() method returns file hash

## ObjectStorage

Class for interacting with object storage services.

### Attributes

- `endpoint_url` (str) - The endpoint URL for the object storage service
- `aws_access_key_id` (str) - Access key ID for the object storage service
- `aws_secret_access_key` (str) - Secret access key for the object storage service
- `aws_session_token` (str) - Session token for temporary credentials
- `bucket_name` (str) - Bucket name to use (defaults to "daytona-volume-builds")

### Methods

#### upload(path, organization_id, archive_base_path=None) → str

Uploads a file to the object storage service.

**Parameters:**
- `path` (str) - Path to the file to upload
- `organization_id` (str) - Organization ID to use
- `archive_base_path` (str, optional) - Base path for the archive

**Returns:** str - Hash of the uploaded file

### process
Process class for executing shell commands, code, and managing background/PTY sessions in Sandbox with state persistence, async support, and matplotlib chart detection.

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

### sandbox
Sandbox class with lifecycle management (start/stop/recover/delete/archive), resource resizing, configuration (labels, auto-intervals), directory access, LSP server creation, preview links, and SSH access control.

## Sandbox

Main class representing a Daytona Sandbox with interfaces for file system, git, process execution, computer use automation, and code interpretation.

### Attributes

- `fs`, `git`, `process`, `computer_use`, `code_interpreter` - Operation interfaces
- `id`, `name`, `organization_id`, `user` - Identification
- `snapshot`, `build_info` - Creation source
- `env`, `labels` - Configuration (dict[str, str])
- `public`, `network_block_all`, `network_allow_list` - Network settings
- `target` - Runner location
- `cpu`, `gpu`, `memory`, `disk` - Resource allocation (int)
- `state`, `error_reason`, `recoverable` - Status
- `backup_state`, `backup_created_at` - Backup info
- `auto_stop_interval`, `auto_archive_interval`, `auto_delete_interval` - Lifecycle (minutes)
- `volumes` - Attached volumes
- `created_at`, `updated_at` - Timestamps

### Initialization

```python
sandbox = Sandbox(sandbox_dto, toolbox_api, sandbox_api, code_toolbox, get_toolbox_base_url)
```

### Data & State Management

```python
sandbox.refresh_data()  # Refresh from API
sandbox.refresh_activity()  # Reset auto-stop timer

# State transitions
sandbox.start(timeout=60)  # Start and wait (default 60s, 0=no timeout)
sandbox.stop(timeout=60)
sandbox.recover(timeout=60)  # Recover from recoverable error
sandbox.delete(timeout=60)
sandbox.archive()  # Move to cost-effective storage (must be stopped)

# Wait for state
sandbox.wait_for_sandbox_start(timeout=60)
sandbox.wait_for_sandbox_stop(timeout=60)
```

### Directory Access

```python
home = sandbox.get_user_home_dir()  # User home path
work = sandbox.get_work_dir()  # WORKDIR from Dockerfile or home
```

### Labels & Configuration

```python
labels = sandbox.set_labels({"project": "my-project", "env": "dev"})
sandbox.set_autostop_interval(60)  # Minutes of inactivity (0=disable)
sandbox.set_auto_archive_interval(60)  # Minutes stopped (0=max)
sandbox.set_auto_delete_interval(60)  # Minutes stopped (0=immediate, -1=disable)
```

### Resources

```python
sandbox.resize(Resources(cpu=4, memory=8, disk=30), timeout=60)
# Hot resize (running): CPU/memory can only increase
# Disk resize: requires stopped sandbox, can only increase
sandbox.wait_for_resize_complete(timeout=60)
```

### Language Server Protocol

```python
lsp = sandbox.create_lsp_server("python", "workspace/project")
# Relative paths resolved from sandbox working directory
```

### Preview & Access

```python
# Public preview link (auto-opens port, includes token for private sandboxes)
preview = sandbox.get_preview_link(3000)
print(preview.url, preview.token)

# Signed preview URLs
signed = sandbox.create_signed_preview_url(3000, expires_in_seconds=60)
sandbox.expire_signed_preview_url(3000, token)

# SSH access
ssh = sandbox.create_ssh_access(expires_in_minutes=60)
sandbox.revoke_ssh_access(token)
validation = sandbox.validate_ssh_access(token)
```

## PaginatedSandboxes

Paginated list wrapper for Sandbox instances.

**Attributes**: `items` (list[Sandbox]), `total` (int), `page` (int), `total_pages` (int)

## Resources

Dataclass for resource configuration.

```python
resources = Resources(cpu=2, memory=4, disk=20, gpu=1)
```

**Attributes**: `cpu`, `memory`, `disk`, `gpu` (all int | None)

### snapshot
Snapshot class and SnapshotService for managing pre-configured sandboxes: list/get/create/delete/activate with pagination, image context processing, and resource configuration.

## Snapshot

Pre-configured sandbox representation with attributes: `id`, `organization_id`, `general`, `name`, `image_name`, `state`, `size`, `entrypoint`, `cpu`, `gpu`, `mem`, `disk`, `error_reason`, `created_at`, `updated_at`, `last_used_at`.

## SnapshotService

Service for managing snapshots.

### list(page, limit) → PaginatedSnapshots

Returns paginated list of snapshots.

```python
daytona = Daytona()
result = daytona.snapshot.list(page=2, limit=10)
for snapshot in result.items:
    print(f"{snapshot.name} ({snapshot.image_name})")
```

### get(name) → Snapshot

Get snapshot by name.

```python
snapshot = daytona.snapshot.get("test-snapshot-name")
print(f"{snapshot.name} ({snapshot.image_name})")
```

### create(params, on_logs, timeout) → Snapshot

Creates and registers new snapshot from Image definition. `on_logs` callback handles creation logs. `timeout` in seconds (0 = no timeout).

```python
image = Image.debianSlim('3.12').pipInstall('numpy')
daytona.snapshot.create(
    CreateSnapshotParams(name='my-snapshot', image=image),
    on_logs=lambda chunk: print(chunk, end=""),
)
```

### delete(snapshot) → None

Delete a snapshot.

```python
snapshot = daytona.snapshot.get("test-snapshot")
daytona.snapshot.delete(snapshot)
```

### activate(snapshot) → Snapshot

Activate a snapshot.

### process_image_context(object_storage_api, image) → list[str]

Static method. Processes image context by uploading to object storage. Returns list of context hashes.

## PaginatedSnapshots

Paginated list container with attributes: `items` (list of Snapshot), `total`, `page`, `total_pages`.

## CreateSnapshotParams

Parameters for snapshot creation:
- `name` (str) - Snapshot name
- `image` (str | Image) - Image reference or Image instance
- `resources` (Resources | None) - Resource allocation
- `entrypoint` (list[str] | None) - Container entrypoint
- `region_id` (str | None) - Region ID (defaults to organization default)

### volume
Volume class and VolumeService for CRUD operations on shared storage volumes; VolumeMount for mounting volumes in Sandboxes with optional S3 subpath filtering.

## Volume

Data class representing a shared storage volume for Sandboxes.

**Attributes**: `id`, `name`, `organization_id`, `state`, `created_at`, `updated_at`, `last_used_at`

## VolumeService

Service for managing volumes.

### list()
Returns all volumes.

```python
daytona = Daytona()
volumes = daytona.volume.list()
for volume in volumes:
    print(f"{volume.name} ({volume.id})")
```

### get(name, create=False)
Get volume by name, optionally creating if missing.

```python
volume = daytona.volume.get("test-volume-name", create=True)
print(f"{volume.name} ({volume.id})")
```

### create(name)
Create new volume.

```python
volume = daytona.volume.create("test-volume")
print(f"{volume.name} ({volume.id}); state: {volume.state}")
```

### delete(volume)
Delete a volume.

```python
volume = daytona.volume.get("test-volume")
daytona.volume.delete(volume)
```

## VolumeMount

Configuration for mounting a volume in a Sandbox.

**Attributes**:
- `volume_id` - ID of volume to mount
- `mount_path` - Path where volume is mounted in sandbox
- `subpath` - Optional S3 subpath/prefix within volume; when specified, only this prefix is accessible; when omitted, entire volume is mounted

