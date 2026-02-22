
## Directories

### python_async_sdk
Complete async Python SDK for Daytona sandbox management: lifecycle control, file/git/process operations, desktop automation, code execution, LSP, snapshots, volumes.

## AsyncDaytona
Main client for sandbox lifecycle: create from snapshot/image, get/list/find sandboxes, start/stop/delete/recover. Config via DaytonaConfig (api_key, jwt_token, api_url, target) or env vars. Supports OpenTelemetry tracing.

```python
async with AsyncDaytona(DaytonaConfig(api_key="key")) as daytona:
    sandbox = await daytona.create(CreateSandboxFromImageParams(
        image="debian:12.9",
        env_vars={"DEBUG": "true"},
        auto_stop_interval=15,
        resources=Resources(cpu=2, memory=4)
    ))
    await daytona.start(sandbox)
    await daytona.stop(sandbox)
    await daytona.delete(sandbox)
```

## AsyncSandbox
Sandbox instance with lifecycle methods (start/stop/recover/delete/archive), resource management (resize), configuration (autostop/archive/delete intervals, labels, preview links, SSH access). Provides interfaces: `fs` (AsyncFileSystem), `git` (AsyncGit), `process` (AsyncProcess), `computer_use` (AsyncComputerUse), `code_interpreter` (AsyncCodeInterpreter).

```python
sandbox = await daytona.get("sandbox-id")
await sandbox.refresh_data()
await sandbox.set_autostop_interval(60)
await sandbox.resize(Resources(cpu=4, memory=8))
home = await sandbox.get_user_home_dir()
lsp = sandbox.create_lsp_server("python", "workspace/project")
preview = await sandbox.get_preview_link(3000)
ssh = await sandbox.create_ssh_access(expires_in_minutes=60)
```

## AsyncFileSystem
File operations: create_folder, delete_file, download_file(s), upload_file(s), list_files, get_file_info, move_files, find_files (grep), search_files (glob), replace_in_files, set_file_permissions.

```python
await sandbox.fs.create_folder("workspace/data", "755")
await sandbox.fs.upload_file(b"content", "tmp/file.txt")
await sandbox.fs.upload_file("local.txt", "tmp/large.txt")  # streaming
content = await sandbox.fs.download_file("tmp/file.txt")
await sandbox.fs.download_file("tmp/large.txt", "local.txt")  # streaming
files = await sandbox.fs.list_files("workspace")
matches = await sandbox.fs.find_files("workspace/src", "TODO:")
results = await sandbox.fs.replace_in_files(["file1.py", "file2.py"], "old", "new")
await sandbox.fs.move_files("old_name.txt", "new_name.txt")
await sandbox.fs.set_file_permissions("script.sh", mode="755", owner="user")
```

## AsyncGit
Git operations: clone (with branch/commit/auth), add, commit, push, pull, status, branch management (list/create/checkout/delete).

```python
await sandbox.git.clone("https://github.com/user/repo.git", "workspace/repo", branch="develop")
await sandbox.git.clone("https://github.com/user/private.git", "workspace/private", username="user", password="token")
await sandbox.git.add("workspace/repo", ["file.txt", "src/main.py"])
await sandbox.git.commit("workspace/repo", "Update docs", author="John", email="john@example.com")
await sandbox.git.push("workspace/repo", username="user", password="token")
await sandbox.git.pull("workspace/repo")
status = await sandbox.git.status("workspace/repo")  # current_branch, ahead, behind, branch_published
branches = await sandbox.git.branches("workspace/repo")
await sandbox.git.create_branch("workspace/repo", "feature")
await sandbox.git.checkout_branch("workspace/repo", "feature")
await sandbox.git.delete_branch("workspace/repo", "old-feature")
```

## AsyncProcess
Execute shell commands and code with automatic matplotlib chart capture.

**exec()** - Shell commands with cwd, env, timeout:
```python
response = await sandbox.process.exec("ls", cwd="workspace/src", timeout=10)
print(response.artifacts.stdout)
```

**code_run()** - Language-specific code execution with automatic chart detection:
```python
response = await sandbox.process.code_run("print(sum([1,2,3]))")
for chart in response.artifacts.charts:
    print(f"{chart.type}: {chart.title}")
```

**Sessions** - Background processes maintaining state:
```python
await sandbox.process.create_session("my-session")
req = SessionExecuteRequest(command="cd /workspace")
await sandbox.process.execute_session_command("my-session", req)
result = await sandbox.process.execute_session_command("my-session", SessionExecuteRequest(command="cat file.txt"))
print(result.stdout, result.stderr, result.exit_code)
logs = await sandbox.process.get_session_command_logs("my-session", "cmd-id")
await sandbox.process.get_session_command_logs_async("my-session", "cmd-id", lambda log: print(f"[OUT]: {log}"), lambda log: print(f"[ERR]: {log}"))
await sandbox.process.delete_session("my-session")
```

**PTY Sessions** - Interactive terminal with WebSocket:
```python
pty = await sandbox.process.create_pty_session("term", on_data=lambda data: print(data.decode()), cwd="/workspace")
await pty.write(b"ls\n")
await pty.resize(PtySize(rows=40, cols=150))
await pty.close()
info = await sandbox.process.get_pty_session_info("term")
await sandbox.process.kill_pty_session("term")
```

## AsyncCodeInterpreter
Stateful Python code execution with isolated contexts, output streaming, configurable timeout (default 10min, 0=no timeout).

```python
result = await sandbox.code_interpreter.run_code(
    "x = 100",
    on_stdout=lambda msg: print(f"OUT: {msg.output}"),
    on_stderr=lambda msg: print(f"ERR: {msg.output}"),
    on_error=lambda err: print(f"ERROR: {err.name}: {err.value}"),
    timeout=10
)
ctx = await sandbox.code_interpreter.create_context()
await sandbox.code_interpreter.run_code("x = 100", context=ctx)
result = await sandbox.code_interpreter.run_code("print(x)", context=ctx)  # OK
await sandbox.code_interpreter.delete_context(ctx)
contexts = await sandbox.code_interpreter.list_contexts()
```

## AsyncComputerUse
Desktop automation: mouse (position, click, drag, scroll), keyboard (type, press, hotkey), screenshots (full/region/compressed with format/quality/scale options), display info, window management, screen recording (start/stop/list/download).

```python
await sandbox.computer_use.start()
await sandbox.computer_use.mouse.move(100, 200)
await sandbox.computer_use.mouse.click(100, 200, "left", double=True)
await sandbox.computer_use.mouse.drag(50, 50, 150, 150)
await sandbox.computer_use.mouse.scroll(100, 200, "down", 5)
await sandbox.computer_use.keyboard.type("Hello", delay=100)
await sandbox.computer_use.keyboard.press("Return")
await sandbox.computer_use.keyboard.hotkey("ctrl+c")
screenshot = await sandbox.computer_use.screenshot.take_full_screen(show_cursor=True)
region = ScreenshotRegion(x=100, y=100, width=300, height=200)
screenshot = await sandbox.computer_use.screenshot.take_region(region)
compressed = await sandbox.computer_use.screenshot.take_compressed(ScreenshotOptions(format="jpeg", quality=95))
info = await sandbox.computer_use.display.get_info()
windows = await sandbox.computer_use.display.get_windows()
recording = await sandbox.computer_use.recording.start("test-recording")
await sandbox.computer_use.recording.stop(recording.id)
recordings = await sandbox.computer_use.recording.list()
await sandbox.computer_use.recording.download(recording_id, "local.mp4")
await sandbox.computer_use.stop()
```

## AsyncLspServer
Language Server Protocol for IDE features: code completion, symbol search, diagnostics. Supports Python/TypeScript/JavaScript.

```python
lsp = AsyncLspServer(LspLanguageId.PYTHON, "/absolute/path/to/project", api_client)
await lsp.start()
await lsp.did_open("src/main.py")
symbols = await lsp.document_symbols("src/main.py")
symbols = await lsp.sandbox_symbols("MyClass")
completions = await lsp.completions("src/main.py", LspCompletionPosition(line=10, character=15))
await lsp.stop()
```

## AsyncSnapshotService
Snapshot management: list/get/create/delete/activate pre-configured sandboxes.

```python
result = await daytona.snapshot.list(page=1, limit=10)
snapshot = await daytona.snapshot.get("snapshot-name")
image = Image.debianSlim('3.12').pipInstall('numpy')
snapshot = await daytona.snapshot.create(
    CreateSnapshotParams(name='my-snapshot', image=image, resources=Resources(cpu=2, memory=4)),
    on_logs=lambda chunk: print(chunk, end="")
)
await daytona.snapshot.delete(snapshot)
await daytona.snapshot.activate(snapshot)
```

## AsyncVolumeService
Shared storage volume management: list, get/create, delete, mount via VolumeMount (with optional S3 subpath filtering).

```python
volumes = await daytona.volume.list()
volume = await daytona.volume.get("volume-name", create=True)
volume = await daytona.volume.create("new-volume")
await daytona.volume.delete(volume)
# Mount in sandbox creation:
params = CreateSandboxFromSnapshotParams(volumes=[VolumeMount(volume_id="vol-id", mount_path="/data", subpath="prefix")])
```

## AsyncObjectStorage
Upload files to object storage, returns file hash.

```python
hash = await storage.upload("local_file.tar", "org-id", archive_base_path="path")
```

### python_sdk_common_classes
Core data models and builders: matplotlib chart hierarchy, SDK exceptions, and chainable Image builder for sandbox configuration.

## Chart Classes

Base `Chart` class with `type`, `title`, `elements`, and optional `png` (base64). `ChartType` enum: `LINE`, `SCATTER`, `BAR`, `PIE`, `BOX_AND_WHISKER`, `COMPOSITE_CHART`, `UNKNOWN`.

`Chart2D` extends Chart with `x_label` and `y_label`.

`PointChart` (extends Chart2D) for point-based data with `x_ticks`, `x_tick_labels`, `x_scale`, `y_ticks`, `y_tick_labels`, `y_scale`, and `elements: list[PointData]` where `PointData` has `label` and `points: list[tuple[str | float, str | float]]`. `LineChart` and `ScatterChart` are specialized subclasses.

`BarChart` (extends Chart2D) with `elements: list[BarData]` where `BarData` has `label`, `group`, `value`.

`PieChart` with `elements: list[PieData]` where `PieData` has `label`, `angle`, `radius`, `autopct`.

`BoxAndWhiskerChart` (extends Chart2D) with `elements: list[BoxAndWhiskerData]` containing `label`, `min`, `first_quartile`, `median`, `third_quartile`, `max`, `outliers: list[float]`.

`CompositeChart` for subplots with `elements: list[Chart]` (nested charts).

## Error Classes

`DaytonaError` base exception with `message`, `status_code`, `headers`. Subclasses: `DaytonaNotFoundError`, `DaytonaRateLimitError`, `DaytonaTimeoutError`.

## Image Class

Chainable builder for sandbox images. Factory methods: `Image.base("python:3.12-slim-bookworm")`, `Image.from_dockerfile("Dockerfile")`, `Image.debian_slim("3.12")`.

Package installation: `.pip_install("requests", "pandas")`, `.pip_install_from_requirements("requirements.txt")`, `.pip_install_from_pyproject("pyproject.toml", optional_dependencies=["dev"])`. All support `find_links`, `index_url`, `extra_index_urls`, `pre`, `extra_options`.

File operations: `.add_local_file("package.json", "/home/daytona/package.json")`, `.add_local_dir("src", "/home/daytona/src")`.

Configuration: `.workdir("/home/daytona")`, `.env({"PROJECT_ROOT": "/home/daytona"})`, `.run_commands('echo "Hello"', ['bash', '-c', 'echo Hello'])`, `.entrypoint(["/bin/bash"])`, `.cmd(["/bin/bash"])`, `.dockerfile_commands(["RUN echo 'Hello'"], context_dir=None)`.

Methods: `dockerfile()` returns Dockerfile string. All builder methods return `Image` for chaining.

`Context` model with `source_path` (str) and `archive_path` (str | None).

### python_sdk_sync_api
Synchronous Python SDK for Daytona sandbox operations: lifecycle management, file system, git, process execution, code interpretation, desktop automation, LSP, snapshots, volumes, object storage.

## Python SDK Synchronous API Reference

Complete synchronous interface for Daytona sandbox operations across file system, git, process execution, code interpretation, and desktop automation.

### Core Classes

**Daytona** - Main client for sandbox lifecycle management. Initialize with API key (env: `DAYTONA_API_KEY`) or explicit `DaytonaConfig`. Create sandboxes from snapshots (default) or Docker images with resource configuration, environment variables, and auto-lifecycle intervals (auto-stop, auto-archive, auto-delete). Manage sandboxes via `get()`, `find_one()`, `list()` with pagination, `start()`, `stop()`, `delete()`, all with configurable timeouts.

**Sandbox** - Represents a running sandbox instance. Access operations via `fs`, `git`, `process`, `computer_use`, `code_interpreter` attributes. Manage state with `start()`, `stop()`, `recover()`, `delete()`, `archive()`. Configure with `set_labels()`, `set_autostop_interval()`, `set_auto_archive_interval()`, `set_auto_delete_interval()`. Resize resources with `resize()`. Get directory paths via `get_user_home_dir()`, `get_work_dir()`. Create LSP server for code intelligence. Generate preview links and SSH access tokens.

### File System Operations

**FileSystem** - High-level file operations. Create/list/delete directories. Upload files from bytes or local paths (streaming for large files), download to bytes or local paths. Move/rename files. Set permissions and ownership. Search files by name pattern (glob) or content (grep-like). Replace text across multiple files.

### Git Operations

**Git** - Repository management. Clone with optional branch/commit/auth. Stage files with `add()`. Commit with author info. Push/pull with optional auth. Check status (current branch, file changes, ahead/behind counts). List/create/checkout/delete branches.

### Process Execution

**Process** - Execute shell commands with `exec()` or language-specific code with `code_run()`. Detect and return matplotlib charts from code output. Create background sessions maintaining state across commands with `create_session()`, `execute_session_command()`. Get session command logs synchronously or asynchronously. Send input to running commands. Create interactive PTY sessions with `create_pty_session()`, resize with `resize_pty_session()`, manage with `kill_pty_session()`.

### Code Interpretation

**CodeInterpreter** - Execute Python code in isolated or persistent contexts. Run code with output streaming callbacks (`on_stdout`, `on_stderr`, `on_error`). Create isolated execution contexts with separate namespaces via `create_context()`. List and delete contexts. Default context persists state across executions and cannot be deleted.

### Desktop Automation

**ComputerUse** - Desktop control interface. Start/stop/restart VNC processes (Xvfb, xfce4, x11vnc, novnc). Mouse operations: get position, move, click (single/double/right), drag, scroll. Keyboard: type text with optional delay, press keys with modifiers, hotkeys. Screenshots: full screen, region, compressed formats (PNG/JPEG/WebP) with quality/scale options. Display info and window listing. Screen recording with start/stop/list/get/delete/download.

### Language Server Protocol

**LspServer** - IDE-like code intelligence. Initialize with language (Python/TypeScript/JavaScript) and project path. Lifecycle: `start()`, `stop()`. File tracking: `did_open()`, `did_close()`. Symbol search: `document_symbols()` for file, `sandbox_symbols()` across sandbox. Code completions at specific position with label, kind, detail, documentation.

### Snapshots & Volumes

**SnapshotService** - Pre-configured sandbox templates. List/get/create/delete/activate snapshots. Create from Image definitions with resource config. Process image context by uploading to object storage.

**VolumeService** - Shared storage volumes. List/get/create/delete volumes. Mount in sandboxes via `VolumeMount` with optional S3 subpath filtering.

### Object Storage

**ObjectStorage** - Upload files to S3-compatible storage with AWS credentials. Returns file hash.

### Data Models

**Resources** - CPU, memory, disk, GPU allocation (all optional int).

**Image** - Declarative Docker image builder. Chain methods: `base()`, `pipInstall()`, `env()`, etc.

**CreateSandboxFromSnapshotParams** / **CreateSandboxFromImageParams** - Sandbox creation parameters with name, language, environment variables, labels, resource config, auto-lifecycle intervals, volumes, network settings.

**ExecutionResult** - Code execution result with stdout, stderr, error fields.

**FileInfo** - File metadata: name, is_dir, size, mode, mod_time, permissions, owner, group.

**GitStatus** - Repository status: current_branch, file_status list, ahead/behind counts, branch_published flag.

### Error Handling

Raises `DaytonaError` for API failures, timeouts, invalid parameters. `DaytonaTimeoutError` for execution timeouts. Individual file operation errors in batch operations don't raise exceptions—check error field in response.

### Examples

```python
from daytona import Daytona, CreateSandboxFromImageParams, Resources, Image

# Initialize and create sandbox
daytona = Daytona()
image = Image.base("python:3.11").pipInstall(["numpy", "pandas"])
sandbox = daytona.create(CreateSandboxFromImageParams(
    language="python",
    image=image,
    resources=Resources(cpu=2, memory=4),
    env_vars={"DEBUG": "true"}
))

# File operations
sandbox.fs.upload_file(b"print('hello')", "script.py")
sandbox.fs.create_folder("data", "755")
files = sandbox.fs.list_files(".")

# Code execution with streaming
def handle_output(msg):
    print(f"Output: {msg.output}", end="")

result = sandbox.code_interpreter.run_code(
    "import time\nfor i in range(3):\n    print(i)\n    time.sleep(1)",
    on_stdout=handle_output,
    timeout=10
)

# Git operations
sandbox.git.clone("https://github.com/user/repo.git", "workspace/repo")
sandbox.git.add("workspace/repo", ["file.txt"])
sandbox.git.commit("workspace/repo", "Update", "Author", "email@example.com")

# Process execution with matplotlib detection
response = sandbox.process.code_run('''
import matplotlib.pyplot as plt
plt.plot([1,2,3], [1,4,9])
plt.show()
''')
if response.artifacts.charts:
    chart = response.artifacts.charts[0]
    print(f"Chart type: {chart.type}, title: {chart.title}")

# Session-based execution
sandbox.process.create_session("work")
sandbox.process.execute_session_command("work", SessionExecuteRequest(command="cd /workspace"))
result = sandbox.process.execute_session_command("work", SessionExecuteRequest(command="ls"))

# Desktop automation
sandbox.computer_use.start()
screenshot = sandbox.computer_use.screenshot.take_full_screen()
sandbox.computer_use.mouse.click(100, 200)
sandbox.computer_use.keyboard.type("Hello")
recording = sandbox.computer_use.recording.start("test")
sandbox.computer_use.recording.download(recording.id, "local.mp4")

# LSP for code intelligence
lsp = sandbox.create_lsp_server("python", "workspace/project")
lsp.start()
symbols = lsp.sandbox_symbols("MyClass")
completions = lsp.completions("src/main.py", LspCompletionPosition(line=10, character=15))
lsp.stop()

# Cleanup
sandbox.stop()
daytona.delete(sandbox)
```



## Pages

### sdk_reference
Install via pip, initialize Daytona client, create sandboxes, execute commands with sync/async support, configure via env vars or DaytonaConfig object.

## Installation

```bash
pip install daytona
# or
poetry add daytona
```

## Create and Execute in a Sandbox

**Sync:**
```python
from daytona import Daytona

daytona = Daytona()
sandbox = daytona.create()
response = sandbox.process.exec("echo 'Hello, World!'")
print(response.result)
```

**Async:**
```python
import asyncio
from daytona import AsyncDaytona

async def main():
    async with AsyncDaytona() as daytona:
        sandbox = await daytona.create()
        response = await sandbox.process.exec("echo 'Hello, World!'")
        print(response.result)

asyncio.run(main())
```

## Configuration

Configure via environment variables (`DAYTONA_API_KEY`, `DAYTONA_API_URL`, `DAYTONA_TARGET`) or explicit config:

**Sync:**
```python
from daytona import Daytona, DaytonaConfig

daytona = Daytona()  # uses env vars

config = DaytonaConfig(
    api_key="YOUR_API_KEY",
    api_url="https://app.daytona.io/api",
    target="us"
)
daytona = Daytona(config)
```

**Async:**
```python
from daytona import AsyncDaytona, DaytonaConfig

daytona = AsyncDaytona()  # uses env vars
await daytona.close()

config = DaytonaConfig(
    api_key="YOUR_API_KEY",
    api_url="https://app.daytona.io/api",
    target="us"
)
async with AsyncDaytona(config) as daytona:
    pass
```

