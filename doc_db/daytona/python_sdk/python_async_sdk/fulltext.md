

## Pages

### asynccodeinterpreter
Async Python code interpreter for sandbox execution with isolated contexts, output streaming callbacks, and configurable timeout.

## AsyncCodeInterpreter

Handles Python code interpretation and execution within a Sandbox. Supports isolated interpreter contexts where variables, imports, and functions persist across executions within the same context.

### Initialization

```python
AsyncCodeInterpreter(api_client: InterpreterApi, ensure_toolbox_url: Callable[[], Awaitable[None]])
```

### run_code

Execute Python code in the sandbox with optional callbacks for output streaming.

```python
async def run_code(
    code: str,
    *,
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
- `context` - Execution context (default: shared default context). Use `create_context()` for isolation
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

result = await sandbox.code_interpreter.run_code(
    code="import sys; [print(i) for i in range(5)]; sys.stderr.write('Done!')",
    on_stdout=handle_stdout,
    on_stderr=handle_stderr,
    on_error=handle_error,
    timeout=10
)
```

### Context Management

**create_context** - Create isolated interpreter context with own namespace:
```python
async def create_context(cwd: str | None = None) -> InterpreterContext
```

**list_contexts** - List all user-created contexts (excludes default):
```python
async def list_contexts() -> list[InterpreterContext]
```

**delete_context** - Delete context and shut down associated processes:
```python
async def delete_context(context: InterpreterContext) -> None
```

**Context example:**
```python
ctx = await sandbox.code_interpreter.create_context()
await sandbox.code_interpreter.run_code("x = 100", context=ctx)
result = await sandbox.code_interpreter.run_code("print(x)", context=ctx)  # OK
result = await sandbox.code_interpreter.run_code("print(x)")  # NameError - x not in default context
await sandbox.code_interpreter.delete_context(ctx)

contexts = await sandbox.code_interpreter.list_contexts()
for ctx in contexts:
    print(f"Context {ctx.id}: {ctx.language} at {ctx.cwd}")
```

### Data Models

**OutputMessage** - stdout/stderr output
- `output` - Output content

**ExecutionError** - Execution error details
- `name` - Error type (e.g., "ValueError", "SyntaxError")
- `value` - Error value
- `traceback` - Full traceback

**ExecutionResult** - Code execution result
- `stdout` - Standard output
- `stderr` - Standard error
- `error` - Error details or None

### Notes

- Default context persists state across executions
- For other languages, use `code_run` from `AsyncProcess` interface or execute commands directly in sandbox terminal
- Default context cannot be deleted

### asynccomputeruse
Async API for desktop automation: mouse/keyboard input, screenshots (full/region/compressed), display info, window management, and screen recording with start/stop/list/download.

## AsyncComputerUse

Main class for desktop automation. Provides access to mouse, keyboard, screenshot, display, and recording operations.

### Lifecycle Methods

```python
result = await sandbox.computer_use.start()
result = await sandbox.computer_use.stop()
```

Starts/stops all computer use processes (Xvfb, xfce4, x11vnc, novnc).

### Status Methods

```python
response = await sandbox.computer_use.get_status()
xvfb_status = await sandbox.computer_use.get_process_status("xvfb")
result = await sandbox.computer_use.restart_process("xfce4")
logs = await sandbox.computer_use.get_process_logs("novnc")
errors = await sandbox.computer_use.get_process_errors("x11vnc")
```

## AsyncMouse

### Position and Movement

```python
position = await sandbox.computer_use.mouse.get_position()
result = await sandbox.computer_use.mouse.move(100, 200)
```

### Clicking

```python
# Single left click
await sandbox.computer_use.mouse.click(100, 200)

# Double click
await sandbox.computer_use.mouse.click(100, 200, "left", True)

# Right click
await sandbox.computer_use.mouse.click(100, 200, "right")
```

### Dragging and Scrolling

```python
result = await sandbox.computer_use.mouse.drag(50, 50, 150, 150)

# Scroll up
await sandbox.computer_use.mouse.scroll(100, 200, "up", 3)

# Scroll down
await sandbox.computer_use.mouse.scroll(100, 200, "down", 5)
```

## AsyncKeyboard

### Text Input

```python
await sandbox.computer_use.keyboard.type("Hello, World!")
await sandbox.computer_use.keyboard.type("Slow typing", 100)  # 100ms delay between chars
```

### Key Presses

```python
# Single key
await sandbox.computer_use.keyboard.press("Return")

# With modifiers
await sandbox.computer_use.keyboard.press("c", ["ctrl"])
await sandbox.computer_use.keyboard.press("t", ["ctrl", "shift"])
```

### Hotkeys

```python
await sandbox.computer_use.keyboard.hotkey("ctrl+c")
await sandbox.computer_use.keyboard.hotkey("ctrl+v")
await sandbox.computer_use.keyboard.hotkey("alt+tab")
```

## AsyncScreenshot

### Full Screen

```python
screenshot = await sandbox.computer_use.screenshot.take_full_screen()
with_cursor = await sandbox.computer_use.screenshot.take_full_screen(True)
```

Returns `ScreenshotResponse` with base64 encoded image, width, height.

### Region Capture

```python
region = ScreenshotRegion(x=100, y=100, width=300, height=200)
screenshot = await sandbox.computer_use.screenshot.take_region(region)
```

### Compressed Screenshots

```python
# Default compression
screenshot = await sandbox.computer_use.screenshot.take_compressed()

# High quality JPEG
jpeg = await sandbox.computer_use.screenshot.take_compressed(
    ScreenshotOptions(format="jpeg", quality=95, show_cursor=True)
)

# Scaled down PNG
scaled = await sandbox.computer_use.screenshot.take_compressed(
    ScreenshotOptions(format="png", scale=0.5)
)

# Compressed region
region = ScreenshotRegion(x=0, y=0, width=800, height=600)
screenshot = await sandbox.computer_use.screenshot.take_compressed_region(
    region,
    ScreenshotOptions(format="webp", quality=80, show_cursor=True)
)
```

## AsyncDisplay

```python
info = await sandbox.computer_use.display.get_info()
print(f"Primary: {info.primary_display.width}x{info.primary_display.height}")
print(f"Total displays: {info.total_displays}")
for display in info.displays:
    print(f"{display.width}x{display.height} at {display.x},{display.y}")

windows = await sandbox.computer_use.display.get_windows()
for window in windows.windows:
    print(f"{window.title} (ID: {window.id})")
```

## AsyncRecordingService

### Recording Lifecycle

```python
recording = await sandbox.computer_use.recording.start("my-test-recording")
print(f"Recording ID: {recording.id}, File: {recording.file_path}")

result = await sandbox.computer_use.recording.stop(recording.id)
print(f"Duration: {result.duration_seconds}s, Saved to: {result.file_path}")
```

### Listing and Retrieval

```python
recordings = await sandbox.computer_use.recording.list()
for rec in recordings.recordings:
    print(f"{rec.file_name}: {rec.status}")

recording = await sandbox.computer_use.recording.get(recording_id)
print(f"{recording.file_name}, Status: {recording.status}, Duration: {recording.duration_seconds}s")
```

### Management

```python
await sandbox.computer_use.recording.delete(recording_id)
await sandbox.computer_use.recording.download(recording_id, "local_recording.mp4")
```

## Data Models

**ScreenshotRegion**: `x`, `y`, `width`, `height` - region coordinates for screenshot operations.

**ScreenshotOptions**: `show_cursor` (bool), `fmt` (str: 'png'/'jpeg'/'webp'), `quality` (0-100), `scale` (float) - compression and display options.

### asyncdaytona
AsyncDaytona client for creating/managing sandboxes from snapshots or images with lifecycle control (start/stop/delete), configuration via DaytonaConfig or env vars, and support for custom resources, environment variables, auto-stop/archive/delete intervals, volumes, and network policies.

## AsyncDaytona

Main async class for interacting with the Daytona API. Provides methods to create, manage, and interact with Daytona Sandboxes.

**Attributes**:
- `volume` - AsyncVolumeService for managing volumes
- `snapshot` - AsyncSnapshotService for managing snapshots

### Initialization

```python
from daytona import AsyncDaytona, DaytonaConfig

# Using environment variables (DAYTONA_API_KEY, DAYTONA_API_URL, DAYTONA_TARGET)
async with AsyncDaytona() as daytona:
    sandbox = await daytona.create()

# Using explicit configuration
config = DaytonaConfig(api_key="key", api_url="https://api.com", target="us")
daytona = AsyncDaytona(config)
try:
    sandbox = await daytona.create()
finally:
    await daytona.close()

# With OpenTelemetry tracing
config = DaytonaConfig(api_key="key", experimental={"otelEnabled": True})
async with AsyncDaytona(config) as daytona:
    sandbox = await daytona.create()
    # All operations traced, flushed on close
```

**Raises**: `DaytonaError` if API key not provided via config or environment variables.

### Resource Management

```python
async def close() -> None
```
Closes HTTP session and cleans up resources. Use as async context manager to ensure cleanup.

### Sandbox Creation

```python
async def create(
    params: CreateSandboxFromSnapshotParams | None = None,
    timeout: float = 60
) -> AsyncSandbox
```
Creates sandbox from snapshot (default or specified).

```python
async def create(
    params: CreateSandboxFromImageParams | None = None,
    timeout: float = 60,
    on_snapshot_create_logs: Callable[[str], None] | None = None
) -> AsyncSandbox
```
Creates sandbox from image (registry or declarative). Daytona creates snapshot from image first.

**Examples**:
```python
# Default Python sandbox
sandbox = await daytona.create()

# From snapshot with custom params
params = CreateSandboxFromSnapshotParams(
    language="python",
    snapshot="my-snapshot-id",
    env_vars={"DEBUG": "true"},
    auto_stop_interval=0,
    auto_archive_interval=60,
    auto_delete_interval=120
)
sandbox = await daytona.create(params, timeout=40)

# From registry image
sandbox = await daytona.create(CreateSandboxFromImageParams(image="debian:12.9"))

# From declarative image with resources and logs
from daytona import Image, Resources
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
sandbox = await daytona.create(
    params,
    timeout=40,
    on_snapshot_create_logs=lambda chunk: print(chunk, end="")
)
```

**Raises**: `DaytonaError` if timeout/auto_stop_interval/auto_archive_interval negative or sandbox fails to start.

### Sandbox Retrieval

```python
async def get(sandbox_id_or_name: str) -> AsyncSandbox
```
Gets sandbox by ID or name.

```python
async def find_one(
    sandbox_id_or_name: str | None = None,
    labels: dict[str, str] | None = None
) -> AsyncSandbox
```
Finds first sandbox matching ID/name or labels.

```python
async def list(
    labels: dict[str, str] | None = None,
    page: int | None = None,
    limit: int | None = None
) -> AsyncPaginatedSandboxes
```
Returns paginated list of sandboxes filtered by labels.

**Examples**:
```python
sandbox = await daytona.get("my-sandbox-id-or-name")
print(sandbox.state)

sandbox = await daytona.find_one(labels={"my-label": "my-value"})
print(f"Sandbox ID: {sandbox.id} State: {sandbox.state}")

result = await daytona.list(labels={"my-label": "my-value"}, page=2, limit=10)
for sandbox in result.items:
    print(f"{sandbox.id}: {sandbox.state}")
```

### Sandbox Lifecycle

```python
async def start(sandbox: AsyncSandbox, timeout: float = 60) -> None
```
Starts sandbox and waits for it to be ready.

```python
async def stop(sandbox: AsyncSandbox, timeout: float = 60) -> None
```
Stops sandbox and waits for it to be stopped.

```python
async def delete(sandbox: AsyncSandbox, timeout: float = 60) -> None
```
Deletes sandbox.

**Example**:
```python
sandbox = await daytona.create()
await daytona.start(sandbox)
# ... use sandbox ...
await daytona.stop(sandbox)
await daytona.delete(sandbox)
```

**Raises**: `DaytonaError` if timeout negative or operation fails.

## DaytonaConfig

Configuration for Daytona client.

**Attributes**:
- `api_key` - API key for authentication (or use `DAYTONA_API_KEY` env var)
- `jwt_token` - JWT token for authentication (or use `DAYTONA_JWT_TOKEN` env var)
- `organization_id` - Required with JWT token (or use `DAYTONA_ORGANIZATION_ID` env var)
- `api_url` - Daytona API URL, defaults to `https://app.daytona.io/api` (or use `DAYTONA_API_URL` env var)
- `server_url` - Deprecated, use `api_url` instead
- `target` - Target runner location (or use `DAYTONA_TARGET` env var)
- `_experimental` - Configuration for experimental features

**Examples**:
```python
config = DaytonaConfig(api_key="your-api-key")
config = DaytonaConfig(jwt_token="your-jwt-token", organization_id="your-organization-id")
```

## CodeLanguage

Enum of supported programming languages: `PYTHON`, `TYPESCRIPT`, `JAVASCRIPT`

## CreateSandboxBaseParams

Base parameters for sandbox creation.

**Attributes**:
- `name` - Sandbox name
- `language` - Programming language, defaults to "python"
- `os_user` - OS user for sandbox
- `env_vars` - Environment variables dict
- `labels` - Custom labels dict
- `public` - Whether sandbox is public
- `timeout` - Timeout in seconds for creation/start
- `auto_stop_interval` - Minutes until auto-stop if no activity (default 15, 0 = disabled)
- `auto_archive_interval` - Minutes until auto-archive when stopped (default 7 days, 0 = max interval)
- `auto_delete_interval` - Minutes until auto-delete when stopped (default disabled, 0 = delete immediately)
- `volumes` - List of VolumeMount objects
- `network_block_all` - Block all network access
- `network_allow_list` - Comma-separated CIDR addresses to allow
- `ephemeral` - If True, sets auto_delete_interval to 0

## CreateSandboxFromSnapshotParams

Extends CreateSandboxBaseParams.

**Attributes**:
- `snapshot` - Name of snapshot to use

## CreateSandboxFromImageParams

Extends CreateSandboxBaseParams.

**Attributes**:
- `image` - Docker image string or Image object (dynamically built if Image object)
- `resources` - Resources configuration (cpu, memory); uses defaults if not provided

### asyncfilesystem
Async file system API for Daytona Sandbox: CRUD operations, streaming upload/download, batch operations, search/replace, metadata, permissions.

## AsyncFileSystem

High-level async interface for file system operations within a Daytona Sandbox.

### Initialization

```python
AsyncFileSystem(api_client: FileSystemApi, ensure_toolbox_url: Callable[[], Awaitable[None]])
```

### Directory Operations

**create_folder(path: str, mode: str) -> None**

Creates a directory with specified permissions (octal format).

```python
await sandbox.fs.create_folder("workspace/data", "755")
await sandbox.fs.create_folder("workspace/secrets", "700")
```

### File Deletion

**delete_file(path: str, recursive: bool = False) -> None**

Deletes files or directories. Set `recursive=True` to delete directories.

```python
await sandbox.fs.delete_file("workspace/data/old_file.txt")
```

### File Download

**download_file(remote_path: str, timeout: int = 30*60) -> bytes**

Downloads file into memory as bytes.

```python
content = await sandbox.fs.download_file("workspace/data/file.txt")
config = json.loads(content.decode('utf-8'))
```

**download_file(remote_path: str, local_path: str, timeout: int = 30*60) -> None**

Downloads file to disk using streaming (for large files).

```python
await sandbox.fs.download_file("tmp/large_file.txt", "local_copy.txt")
```

**download_files(files: list[FileDownloadRequest], timeout: int = 30*60) -> list[FileDownloadResponse]**

Downloads multiple files. Individual errors returned in response, not raised.

```python
results = await sandbox.fs.download_files([
    FileDownloadRequest(source="tmp/data.json"),
    FileDownloadRequest(source="tmp/config.json", destination="local_config.json")
])
for result in results:
    if result.error:
        print(f"Error: {result.error}")
    else:
        print(f"Downloaded to {result.result}")
```

### File Search

**find_files(path: str, pattern: str) -> list[Match]**

Searches file contents (grep-like). Returns matches with file, line number, and content.

```python
matches = await sandbox.fs.find_files("workspace/src", "TODO:")
for match in matches:
    print(f"{match.file}:{match.line}: {match.content.strip()}")
```

**search_files(path: str, pattern: str) -> SearchFilesResponse**

Searches file/directory names with glob pattern support.

```python
result = await sandbox.fs.search_files("workspace", "*.py")
result = await sandbox.fs.search_files("workspace/data", "test_*")
```

### File Information

**get_file_info(path: str) -> FileInfo**

Returns file metadata: name, is_dir, size, mode, mod_time, permissions, owner, group.

```python
info = await sandbox.fs.get_file_info("workspace/data/file.txt")
print(f"Size: {info.size}, Modified: {info.mod_time}, Mode: {info.mode}")

info = await sandbox.fs.get_file_info("workspace/data")
if info.is_dir:
    print("Path is a directory")
```

**list_files(path: str) -> list[FileInfo]**

Lists directory contents with full metadata (ls -l equivalent).

```python
files = await sandbox.fs.list_files("workspace/data")
for file in files:
    if not file.is_dir:
        print(f"{file.name}: {file.size} bytes")
dirs = [f for f in files if f.is_dir]
```

### File Movement

**move_files(source: str, destination: str) -> None**

Moves or renames files/directories. Parent directory of destination must exist.

```python
await sandbox.fs.move_files("workspace/data/old_name.txt", "workspace/data/new_name.txt")
await sandbox.fs.move_files("workspace/data/file.txt", "workspace/archive/file.txt")
await sandbox.fs.move_files("workspace/old_dir", "workspace/new_dir")
```

### File Replacement

**replace_in_files(files: list[str], pattern: str, new_value: str) -> list[ReplaceResult]**

Search and replace across multiple files. Returns results with success/error per file.

```python
results = await sandbox.fs.replace_in_files(
    files=["workspace/src/file1.py", "workspace/src/file2.py"],
    pattern="old_function",
    new_value="new_function"
)
for result in results:
    print(f"{result.file}: {result.success or result.error}")
```

### File Permissions

**set_file_permissions(path: str, mode: str | None = None, owner: str | None = None, group: str | None = None) -> None**

Sets permissions and ownership. Any parameter can be None to leave unchanged.

```python
await sandbox.fs.set_file_permissions("workspace/scripts/run.sh", mode="755")
await sandbox.fs.set_file_permissions("workspace/data/file.txt", owner="daytona", group="daytona")
```

### File Upload

**upload_file(file: bytes, remote_path: str, timeout: int = 30*60) -> None**

Uploads bytes to sandbox (for small files).

```python
await sandbox.fs.upload_file(b"Hello, World!", "tmp/hello.txt")
with open("local_file.txt", "rb") as f:
    await sandbox.fs.upload_file(f.read(), "tmp/file.txt")
data = json.dumps({"key": "value"}).encode('utf-8')
await sandbox.fs.upload_file(data, "tmp/config.json")
```

**upload_file(local_path: str, remote_path: str, timeout: int = 30*60) -> None**

Uploads file from disk using streaming (for large files).

```python
await sandbox.fs.upload_file("local_file.txt", "tmp/large_file.txt")
```

**upload_files(files: list[FileUpload], timeout: int = 30*60) -> None**

Uploads multiple files. Source can be bytes or local file path.

```python
files = [
    FileUpload(source=b"Content of file 1", destination="/tmp/file1.txt"),
    FileUpload(source="workspace/data/file2.txt", destination="/tmp/file2.txt"),
    FileUpload(source=b'{"key": "value"}', destination="/tmp/config.json")
]
await sandbox.fs.upload_files(files)
```

## Data Classes

**FileUpload**
- `source: bytes | str` - File contents or local file path
- `destination: str` - Absolute destination path in sandbox

**FileDownloadRequest**
- `source: str` - Source path in sandbox
- `destination: str | None` - Local destination path (optional; if not provided, downloads to bytes buffer)

**FileDownloadResponse**
- `source: str` - Original source path
- `result: str | bytes | None` - File path (if destination provided) or bytes content
- `error: str | None` - Error message if failed

## Notes

- Relative paths resolve based on sandbox working directory
- Timeout default is 30 minutes; 0 means no timeout
- All methods decorated with error interception and instrumentation
- Download/upload operations support streaming for large files
- Batch operations (download_files, upload_files, replace_in_files) return per-item results rather than raising on individual failures

### asyncgit
AsyncGit class providing async Git operations (clone, add, commit, push, pull, status, branch management) for Sandbox with optional authentication and detailed status tracking.

## AsyncGit

Async Git operations class for executing Git commands within a Sandbox.

### Initialization

```python
class AsyncGit()
def __init__(api_client: GitApi)
```

Initializes with a GitApi client for Sandbox Git operations.

### Core Operations

#### clone
```python
async def clone(url: str, path: str, branch: str | None = None, 
                commit_id: str | None = None, username: str | None = None, 
                password: str | None = None) -> None
```
Clones a repository. Supports specific branches, commits, and authentication.

```python
# Default branch
await sandbox.git.clone(url="https://github.com/user/repo.git", path="workspace/repo")

# Specific branch with auth
await sandbox.git.clone(url="https://github.com/user/private-repo.git", 
                        path="workspace/private", branch="develop", 
                        username="user", password="token")

# Specific commit (detached HEAD)
await sandbox.git.clone(url="https://github.com/user/repo.git", 
                        path="workspace/repo-old", commit_id="abc123")
```

#### add
```python
async def add(path: str, files: list[str]) -> None
```
Stages files for commit (like `git add`).

```python
await sandbox.git.add("workspace/repo", ["file.txt"])
await sandbox.git.add("workspace/repo", ["src/main.py", "tests/test_main.py", "README.md"])
```

#### commit
```python
async def commit(path: str, message: str, author: str, email: str, 
                 allow_empty: bool = False) -> GitCommitResponse
```
Creates a commit with staged changes. Returns `GitCommitResponse` with `sha` attribute.

```python
await sandbox.git.add("workspace/repo", ["README.md"])
await sandbox.git.commit(path="workspace/repo", message="Update documentation",
                         author="John Doe", email="john@example.com", allow_empty=True)
```

#### push
```python
async def push(path: str, username: str | None = None, 
               password: str | None = None) -> None
```
Pushes local commits to remote. Optional authentication for private repos.

```python
await sandbox.git.push("workspace/repo")
await sandbox.git.push(path="workspace/repo", username="user", password="github_token")
```

#### pull
```python
async def pull(path: str, username: str | None = None, 
               password: str | None = None) -> None
```
Pulls changes from remote. Optional authentication.

```python
await sandbox.git.pull("workspace/repo")
await sandbox.git.pull(path="workspace/repo", username="user", password="github_token")
```

#### status
```python
async def status(path: str) -> GitStatus
```
Returns repository status with fields: `current_branch`, `file_status`, `ahead`, `behind`, `branch_published`.

```python
status = await sandbox.git.status("workspace/repo")
print(f"On branch: {status.current_branch}")
print(f"Commits ahead: {status.ahead}, behind: {status.behind}")
```

### Branch Operations

#### branches
```python
async def branches(path: str) -> ListBranchResponse
```
Lists all branches in repository.

```python
response = await sandbox.git.branches("workspace/repo")
print(f"Branches: {response.branches}")
```

#### create_branch
```python
async def create_branch(path: str, name: str) -> None
```
Creates a new branch.

```python
await sandbox.git.create_branch("workspace/repo", "new-feature")
```

#### checkout_branch
```python
async def checkout_branch(path: str, branch: str) -> None
```
Checks out a branch.

```python
await sandbox.git.checkout_branch("workspace/repo", "feature-branch")
```

#### delete_branch
```python
async def delete_branch(path: str, name: str) -> None
```
Deletes a branch.

```python
await sandbox.git.delete_branch("workspace/repo", "old-feature")
```

### Response Types

**GitCommitResponse**: Contains `sha` (commit SHA hash)

**GitStatus**: Contains `current_branch`, `file_status`, `ahead`, `behind`, `branch_published`

**ListBranchResponse**: Contains `branches` list

### Notes

- All paths are relative to sandbox working directory unless absolute
- File paths in `add()` are relative to repository root
- All methods use error interception with descriptive prefixes
- All methods are instrumented for monitoring

### asynclspserver
AsyncLspServer provides LSP-based code intelligence (completions, symbol search, diagnostics) for Python/TypeScript/JavaScript projects with file tracking and sandbox-wide symbol search.

## AsyncLspServer

Provides Language Server Protocol functionality for IDE-like features: code completion, symbol search, diagnostics, and more.

### Initialization

```python
lsp = AsyncLspServer(
    language_id=LspLanguageId.TYPESCRIPT,  # or PYTHON, JAVASCRIPT
    path_to_project="/absolute/path/to/project",
    api_client=api_client
)
```

### Lifecycle

```python
await lsp.start()   # Initialize server before use
await lsp.stop()    # Clean up resources when done
```

### File Operations

```python
await lsp.did_open("src/index.ts")   # Notify server file opened
await lsp.did_close("src/index.ts")  # Notify server file closed
```

Relative paths are resolved based on the project path set in constructor.

### Symbol Search

```python
# Get symbols from a specific file
symbols = await lsp.document_symbols("src/index.ts")

# Search symbols across entire sandbox
symbols = await lsp.sandbox_symbols("User")  # Returns matching symbols

for symbol in symbols:
    print(f"{symbol.kind} {symbol.name}: {symbol.location}")
```

`workspace_symbols()` is deprecated; use `sandbox_symbols()` instead.

### Code Completions

```python
pos = LspCompletionPosition(line=10, character=15)
completions = await lsp.completions("src/index.ts", pos)

for item in completions.items:
    print(f"{item.label} ({item.kind}): {item.detail}")
```

Returns `CompletionList` with:
- `isIncomplete`: Whether more items might be available
- `items`: List of completion items with label, kind, detail, documentation, sortText, filterText, insertText

## LspLanguageId

Enum with members: `PYTHON`, `TYPESCRIPT`, `JAVASCRIPT`

## LspCompletionPosition

Dataclass with zero-based position:
- `line`: Line number
- `character`: Character offset on line


### asyncobjectstorage
Async object storage client with upload method that returns file hash; configurable via AWS credentials and bucket name.

## AsyncObjectStorage

Async class for interacting with object storage services.

### Attributes

- `endpoint_url` (str) - The endpoint URL for the object storage service
- `aws_access_key_id` (str) - Access key ID for the object storage service
- `aws_secret_access_key` (str) - Secret access key for the object storage service
- `aws_session_token` (str) - Session token for temporary credentials
- `bucket_name` (str) - Bucket name to use (defaults to "daytona-volume-builds")

### Methods

#### upload

```python
async def upload(path: str,
                 organization_id: str,
                 archive_base_path: str | None = None) -> str
```

Uploads a file to the object storage service.

**Parameters:**
- `path` (str) - Path to the file to upload
- `organization_id` (str) - Organization ID to use
- `archive_base_path` (str, optional) - Base path for the archive

**Returns:** str - The hash of the uploaded file

### asyncprocess
AsyncProcess class for executing shell commands, code, and managing background/PTY sessions in Sandbox with automatic matplotlib chart capture.

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

### asyncsandbox
Async sandbox interface with lifecycle control (start/stop/recover/delete/archive), resource management (resize), configuration (autostop/archive/delete intervals, labels), preview links, SSH access, LSP server creation, and file/git/process/code execution operations.

## AsyncSandbox

Represents a Daytona Sandbox with async operations. Inherits from `SandboxDto`.

### Attributes

Core interfaces:
- `fs` - AsyncFileSystem for file operations
- `git` - AsyncGit for version control
- `process` - AsyncProcess for executing processes
- `computer_use` - AsyncComputerUse for desktop automation
- `code_interpreter` - AsyncCodeInterpreter for stateful code execution (Python)

Sandbox metadata:
- `id`, `name`, `organization_id`, `user` - Identifiers and ownership
- `snapshot` - Daytona snapshot used for creation
- `env` - Environment variables (dict)
- `labels` - Custom labels (dict)
- `public` - Public accessibility flag
- `target` - Runner location

Resources:
- `cpu`, `gpu`, `memory` (GiB), `disk` (GiB)

State:
- `state` - Current state (e.g., "started", "stopped")
- `error_reason` - Error message if in error state
- `recoverable` - Whether error is recoverable
- `backup_state`, `backup_created_at` - Backup information

Lifecycle:
- `auto_stop_interval`, `auto_archive_interval`, `auto_delete_interval` - Inactivity timeouts (minutes)
- `created_at`, `updated_at` - Timestamps

Network:
- `network_block_all` - Block all network access
- `network_allow_list` - Comma-separated CIDR addresses

Other:
- `volumes` - Attached volumes
- `build_info` - Build information if created from dynamic build

### Methods

#### Initialization
```python
AsyncSandbox(sandbox_dto, toolbox_api, sandbox_api, code_toolbox, get_toolbox_base_url)
```

#### Data & State
```python
await sandbox.refresh_data()  # Refresh from API
await sandbox.refresh_activity()  # Reset lifecycle timer

home = await sandbox.get_user_home_dir()  # Get user home path
work_dir = await sandbox.get_work_dir()  # Get working directory (WORKDIR from Dockerfile or home)
```

#### Lifecycle Control
```python
await sandbox.start(timeout=60)  # Start and wait (0 = no timeout)
await sandbox.stop(timeout=60)   # Stop and wait
await sandbox.recover(timeout=60)  # Recover from recoverable error
await sandbox.delete(timeout=60)  # Delete sandbox

await sandbox.wait_for_sandbox_start(timeout=60)  # Poll until started
await sandbox.wait_for_sandbox_stop(timeout=60)   # Poll until stopped (treats destroyed as stopped)
```

#### Resource Management
```python
await sandbox.resize(Resources(cpu=4, memory=8, disk=30), timeout=60)
# Hot resize (running): CPU/memory can only increase
# Disk resize: requires stopped sandbox, can only increase
await sandbox.wait_for_resize_complete(timeout=60)
```

#### Lifecycle Configuration
```python
await sandbox.set_autostop_interval(60)  # Auto-stop after 60 min idle (0 = disable)
await sandbox.set_auto_archive_interval(60)  # Auto-archive after 60 min stopped (0 = max)
await sandbox.set_auto_delete_interval(60)  # Auto-delete after 60 min stopped (-1 = disable, 0 = immediate)
await sandbox.archive()  # Archive (must be stopped, moves filesystem to object storage)
```

#### Labels
```python
labels = await sandbox.set_labels({"project": "my-project", "env": "dev"})
```

#### Language Server Protocol
```python
lsp = sandbox.create_lsp_server("python", "workspace/project")
# Relative paths resolved from sandbox working directory
```

#### Preview Links
```python
preview = await sandbox.get_preview_link(3000)  # Auto-opens port, includes token for private sandboxes
print(preview.url, preview.token)

signed = await sandbox.create_signed_preview_url(3000, expires_in_seconds=60)
await sandbox.expire_signed_preview_url(3000, token)
```

#### SSH Access
```python
ssh = await sandbox.create_ssh_access(expires_in_minutes=60)
await sandbox.revoke_ssh_access(token)
validation = await sandbox.validate_ssh_access(token)
```

### Resources Dataclass

```python
@dataclass
class Resources:
    cpu: int | None  # CPU cores
    memory: int | None  # GiB
    disk: int | None  # GiB
    gpu: int | None  # GPU count
```

### AsyncPaginatedSandboxes

Paginated list of sandboxes:
- `items` - List of AsyncSandbox instances
- `total` - Total count across all pages
- `page` - Current page number
- `total_pages` - Total pages available

### Error Handling

Methods decorated with `@intercept_errors` raise `DaytonaError` with descriptive messages. Timeout-related methods raise `DaytonaError` if timeout is negative or operation times out.

### asyncsnapshot
Async API for snapshot management: list/get/create/delete/activate pre-configured sandboxes with resource allocation, image context processing, and pagination support.

## Snapshot

Pre-configured sandbox representation with attributes: `id`, `organization_id`, `general`, `name`, `image_name`, `state`, `size`, `entrypoint`, `cpu`, `gpu`, `mem`, `disk`, `error_reason`, `created_at`, `updated_at`, `last_used_at`.

## AsyncSnapshotService

Service for managing snapshots with async methods.

### list
```python
async def list(page: int | None = None, limit: int | None = None) -> PaginatedSnapshots
```
Returns paginated list of snapshots.

```python
async with AsyncDaytona() as daytona:
    result = await daytona.snapshot.list(page=2, limit=10)
    for snapshot in result.items:
        print(f"{snapshot.name} ({snapshot.image_name})")
```

### get
```python
async def get(name: str) -> Snapshot
```
Get snapshot by name.

```python
snapshot = await daytona.snapshot.get("test-snapshot-name")
```

### create
```python
async def create(params: CreateSnapshotParams,
                 *,
                 on_logs: Callable[[str], None] | None = None,
                 timeout: float | None = 0) -> Snapshot
```
Creates and registers new snapshot from Image definition. `on_logs` callback handles creation logs. `timeout` in seconds (0 = no timeout).

```python
image = Image.debianSlim('3.12').pipInstall('numpy')
snapshot = await daytona.snapshot.create(
    CreateSnapshotParams(name='my-snapshot', image=image),
    on_logs=lambda chunk: print(chunk, end=""),
)
```

### delete
```python
async def delete(snapshot: Snapshot) -> None
```
Delete a snapshot.

```python
snapshot = await daytona.snapshot.get("test-snapshot")
await daytona.snapshot.delete(snapshot)
```

### activate
```python
async def activate(snapshot: Snapshot) -> Snapshot
```
Activate a snapshot, returns activated instance.

### process_image_context
```python
@staticmethod
async def process_image_context(object_storage_api: ObjectStorageApi,
                                image: Image) -> list[str]
```
Processes image context by uploading to object storage, returns list of context hashes.

## PaginatedSnapshots

Paginated list container with attributes: `items` (list of Snapshot), `total`, `page`, `total_pages`.

## CreateSnapshotParams

Parameters for snapshot creation:
- `name` _str_ - Snapshot name
- `image` _str | Image_ - Image reference or Image instance (string must be available on registry)
- `resources` _Resources | None_ - Resource allocation
- `entrypoint` _list[str] | None_ - Container entrypoint
- `region_id` _str | None_ - Region ID (defaults to organization default region)

### async-volume
AsyncVolumeService for managing shared storage volumes: list, get/create, delete; VolumeMount for sandbox volume mounting with optional S3 subpath filtering.

## Volume

Data class representing a shared storage volume for Sandboxes.

**Attributes**: `id`, `name`, `organization_id`, `state`, `created_at`, `updated_at`, `last_used_at` (all strings)

## AsyncVolumeService

Service for managing volumes with async methods.

### list()
```python
async with AsyncDaytona() as daytona:
    volumes = await daytona.volume.list()
    for volume in volumes:
        print(f"{volume.name} ({volume.id})")
```
Returns `list[Volume]` of all volumes.

### get(name: str, create: bool = False)
```python
volume = await daytona.volume.get("test-volume-name", create=True)
print(f"{volume.name} ({volume.id})")
```
Get volume by name. If `create=True`, creates it if it doesn't exist. Returns `Volume`.

### create(name: str)
```python
volume = await daytona.volume.create("test-volume")
print(f"{volume.name} ({volume.id}); state: {volume.state}")
```
Create new volume. Returns `Volume`.

### delete(volume: Volume)
```python
volume = await daytona.volume.get("test-volume")
await daytona.volume.delete(volume)
```
Delete a volume.

## VolumeMount

Configuration for mounting a volume in a Sandbox.

**Attributes**:
- `volume_id` _str_ - ID of the volume to mount
- `mount_path` _str_ - Path where volume is mounted in sandbox
- `subpath` _str | None_ - Optional S3 subpath/prefix within volume; when specified, only this prefix is accessible; when omitted, entire volume is mounted

