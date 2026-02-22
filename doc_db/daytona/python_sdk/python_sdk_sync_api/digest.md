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