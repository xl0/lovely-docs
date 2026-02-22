## Overview
Complete Python SDK for Daytona sandbox management with both sync and async APIs. Covers sandbox lifecycle, file operations, git, process execution, code interpretation, desktop automation, LSP, snapshots, and volumes.

## Installation & Setup
```bash
pip install daytona
```

Configure via env vars (`DAYTONA_API_KEY`, `DAYTONA_API_URL`, `DAYTONA_TARGET`) or `DaytonaConfig` object.

```python
from daytona import Daytona, AsyncDaytona, DaytonaConfig

# Sync
daytona = Daytona()
config = DaytonaConfig(api_key="key", api_url="https://app.daytona.io/api", target="us")
daytona = Daytona(config)

# Async
async with AsyncDaytona(config) as daytona:
    pass
```

## Sandbox Lifecycle
Create from snapshot (default) or Docker image with resources, env vars, auto-stop/archive/delete intervals, labels, volumes.

```python
sandbox = daytona.create(CreateSandboxFromImageParams(
    image="debian:12.9",
    env_vars={"DEBUG": "true"},
    resources=Resources(cpu=2, memory=4),
    auto_stop_interval=15
))
await daytona.start(sandbox)
await sandbox.set_autostop_interval(60)
await sandbox.resize(Resources(cpu=4, memory=8))
await daytona.stop(sandbox)
await daytona.delete(sandbox)
```

Get/list/find sandboxes, recover deleted ones. Sandbox provides interfaces: `fs`, `git`, `process`, `computer_use`, `code_interpreter`.

## File System
Create/delete folders, upload/download files (streaming for large files), list/search files, move/rename, set permissions, replace text across files.

```python
await sandbox.fs.create_folder("workspace/data", "755")
await sandbox.fs.upload_file(b"content", "tmp/file.txt")
await sandbox.fs.upload_file("local.txt", "tmp/large.txt")  # streaming
content = await sandbox.fs.download_file("tmp/file.txt")
await sandbox.fs.download_file("tmp/large.txt", "local.txt")  # streaming
files = await sandbox.fs.list_files("workspace")
matches = await sandbox.fs.find_files("workspace/src", "TODO:")  # grep
results = await sandbox.fs.search_files("workspace", "*.py")  # glob
await sandbox.fs.replace_in_files(["file1.py", "file2.py"], "old", "new")
await sandbox.fs.move_files("old_name.txt", "new_name.txt")
await sandbox.fs.set_file_permissions("script.sh", mode="755", owner="user")
```

## Git
Clone (with branch/commit/auth), add, commit, push, pull, status, branch management.

```python
await sandbox.git.clone("https://github.com/user/repo.git", "workspace/repo", branch="develop")
await sandbox.git.clone("https://github.com/user/private.git", "workspace/private", username="user", password="token")
await sandbox.git.add("workspace/repo", ["file.txt"])
await sandbox.git.commit("workspace/repo", "Update docs", author="John", email="john@example.com")
await sandbox.git.push("workspace/repo", username="user", password="token")
await sandbox.git.pull("workspace/repo")
status = await sandbox.git.status("workspace/repo")  # current_branch, ahead, behind, branch_published
branches = await sandbox.git.branches("workspace/repo")
await sandbox.git.create_branch("workspace/repo", "feature")
await sandbox.git.checkout_branch("workspace/repo", "feature")
await sandbox.git.delete_branch("workspace/repo", "old-feature")
```

## Process Execution
Execute shell commands and language-specific code with automatic matplotlib chart detection.

```python
# Shell commands
response = await sandbox.process.exec("ls", cwd="workspace/src", timeout=10)
print(response.artifacts.stdout)

# Code execution with chart detection
response = await sandbox.process.code_run("print(sum([1,2,3]))")
for chart in response.artifacts.charts:
    print(f"{chart.type}: {chart.title}")

# Background sessions (maintain state)
await sandbox.process.create_session("my-session")
await sandbox.process.execute_session_command("my-session", SessionExecuteRequest(command="cd /workspace"))
result = await sandbox.process.execute_session_command("my-session", SessionExecuteRequest(command="cat file.txt"))
print(result.stdout, result.stderr, result.exit_code)
logs = await sandbox.process.get_session_command_logs("my-session", "cmd-id")
await sandbox.process.get_session_command_logs_async("my-session", "cmd-id", 
    lambda log: print(f"[OUT]: {log}"), lambda log: print(f"[ERR]: {log}"))
await sandbox.process.delete_session("my-session")

# Interactive PTY sessions
pty = await sandbox.process.create_pty_session("term", on_data=lambda data: print(data.decode()), cwd="/workspace")
await pty.write(b"ls\n")
await pty.resize(PtySize(rows=40, cols=150))
await pty.close()
info = await sandbox.process.get_pty_session_info("term")
await sandbox.process.kill_pty_session("term")
```

## Code Interpreter
Stateful Python execution with isolated contexts, output streaming, configurable timeout (default 10min, 0=no timeout).

```python
result = await sandbox.code_interpreter.run_code(
    "x = 100",
    on_stdout=lambda msg: print(f"OUT: {msg.output}"),
    on_stderr=lambda msg: print(f"ERR: {msg.output}"),
    on_error=lambda err: print(f"ERROR: {err.name}: {err.value}"),
    timeout=10
)

# Isolated contexts
ctx = await sandbox.code_interpreter.create_context()
await sandbox.code_interpreter.run_code("x = 100", context=ctx)
result = await sandbox.code_interpreter.run_code("print(x)", context=ctx)  # OK
await sandbox.code_interpreter.delete_context(ctx)
contexts = await sandbox.code_interpreter.list_contexts()
```

## Desktop Automation
Mouse (position, click, drag, scroll), keyboard (type, press, hotkey), screenshots (full/region/compressed), display info, window management, screen recording.

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

## Language Server Protocol
IDE features: code completion, symbol search, diagnostics. Supports Python/TypeScript/JavaScript.

```python
lsp = sandbox.create_lsp_server("python", "workspace/project")
await lsp.start()
await lsp.did_open("src/main.py")
symbols = await lsp.document_symbols("src/main.py")
symbols = await lsp.sandbox_symbols("MyClass")
completions = await lsp.completions("src/main.py", LspCompletionPosition(line=10, character=15))
await lsp.stop()
```

## Snapshots
Pre-configured sandbox templates. List/get/create/delete/activate.

```python
result = await daytona.snapshot.list(page=1, limit=10)
snapshot = await daytona.snapshot.get("snapshot-name")
image = Image.debian_slim('3.12').pip_install('numpy')
snapshot = await daytona.snapshot.create(
    CreateSnapshotParams(name='my-snapshot', image=image, resources=Resources(cpu=2, memory=4)),
    on_logs=lambda chunk: print(chunk, end="")
)
await daytona.snapshot.delete(snapshot)
await daytona.snapshot.activate(snapshot)
```

## Volumes
Shared storage volume management. Mount in sandboxes via `VolumeMount` with optional S3 subpath filtering.

```python
volumes = await daytona.volume.list()
volume = await daytona.volume.get("volume-name", create=True)
volume = await daytona.volume.create("new-volume")
await daytona.volume.delete(volume)
params = CreateSandboxFromSnapshotParams(volumes=[VolumeMount(volume_id="vol-id", mount_path="/data", subpath="prefix")])
```

## Object Storage
Upload files to S3-compatible storage, returns file hash.

```python
hash = await storage.upload("local_file.tar", "org-id", archive_base_path="path")
```

## Image Builder
Chainable builder for sandbox Docker images.

```python
image = Image.base("python:3.12-slim-bookworm")
image = Image.debian_slim("3.12")
image = Image.from_dockerfile("Dockerfile")

image.pip_install("requests", "pandas")
image.pip_install_from_requirements("requirements.txt")
image.pip_install_from_pyproject("pyproject.toml", optional_dependencies=["dev"])
image.add_local_file("package.json", "/home/daytona/package.json")
image.add_local_dir("src", "/home/daytona/src")
image.workdir("/home/daytona")
image.env({"PROJECT_ROOT": "/home/daytona"})
image.run_commands('echo "Hello"', ['bash', '-c', 'echo Hello'])
image.entrypoint(["/bin/bash"])
image.cmd(["/bin/bash"])
image.dockerfile_commands(["RUN echo 'Hello'"], context_dir=None)
dockerfile_str = image.dockerfile()
```

All builder methods return `Image` for chaining. Package installation methods support `find_links`, `index_url`, `extra_index_urls`, `pre`, `extra_options`.

## Chart Classes
Matplotlib chart hierarchy: `Chart` (base with type, title, elements, optional png), `Chart2D` (adds x_label, y_label), `PointChart` (x/y ticks, scales, PointData with label and points), `LineChart`, `ScatterChart`, `BarChart` (BarData with label, group, value), `PieChart` (PieData with label, angle, radius, autopct), `BoxAndWhiskerChart` (BoxAndWhiskerData with quartiles, outliers), `CompositeChart` (nested charts).

`ChartType` enum: `LINE`, `SCATTER`, `BAR`, `PIE`, `BOX_AND_WHISKER`, `COMPOSITE_CHART`, `UNKNOWN`.

## Error Handling
Raises `DaytonaError` (base with message, status_code, headers), `DaytonaNotFoundError`, `DaytonaRateLimitError`, `DaytonaTimeoutError`. Batch file operations don't raise on individual failures—check error field in response.

## Data Models
`Resources` (cpu, memory, disk, gpu - all optional int), `FileInfo` (name, is_dir, size, mode, mod_time, permissions, owner, group), `GitStatus` (current_branch, file_status list, ahead/behind, branch_published), `ExecutionResult` (stdout, stderr, error), `CreateSandboxFromSnapshotParams`, `CreateSandboxFromImageParams`, `Context` (source_path, archive_path).

## Async/Sync
All operations available in both sync and async variants. Async uses `AsyncDaytona`, `AsyncSandbox`, etc. with `await` and context managers.