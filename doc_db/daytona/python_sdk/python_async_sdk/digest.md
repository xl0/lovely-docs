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