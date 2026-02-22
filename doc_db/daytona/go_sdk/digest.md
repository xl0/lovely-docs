# Go SDK for Daytona

Complete Go client library for creating and managing Daytona sandboxes with full lifecycle control, process execution, file operations, and desktop automation.

## Installation & Setup

```bash
go get github.com/daytonaio/daytona/libs/sdk-go
```

Initialize with API key or JWT token from environment variables (`DAYTONA_API_KEY`, `DAYTONA_JWT_TOKEN`, `DAYTONA_ORGANIZATION_ID`, `DAYTONA_API_URL`) or explicit config:

```go
client, err := daytona.NewClient()
// or
client, err := daytona.NewClientWithConfig(&types.DaytonaConfig{
    APIKey: "key", APIUrl: "https://...", Target: "us",
})
```

## Sandbox Lifecycle

Create from snapshot or Docker image with optional resources:
```go
sandbox, err := client.Create(ctx, types.SnapshotParams{
    Snapshot: "my-snapshot",
    SandboxBaseParams: types.SandboxBaseParams{Name: "my-sandbox"},
})
// or
sandbox, err := client.Create(ctx, types.ImageParams{
    Image: "python:3.11",
    Resources: &types.Resources{CPU: 2, Memory: 4096},
})
```

Manage state: `Start()`, `Stop()`, `Archive()`, `Delete()` with optional timeouts and wait methods. Retrieve by ID/name/labels: `Get()`, `FindOne()`, `List()`. Configure: `SetLabels()`, `SetAutoArchiveInterval()`, `SetAutoDeleteInterval()`, `Resize()`, `RefreshData()`. Get info: `GetUserHomeDir()`, `GetWorkingDir()`, `GetPreviewLink(port)`.

## Process Execution

Execute commands with optional working directory, environment variables, and timeout:
```go
result, err := sandbox.Process.ExecuteCommand(ctx, "echo 'Hello'",
    options.WithCwd("/home/user/project"),
    options.WithCommandEnv(map[string]string{"NODE_ENV": "prod"}),
    options.WithExecuteTimeout(5*time.Minute),
)
fmt.Println(result.Result, result.ExitCode)
```

Sessions maintain state across commands:
```go
sandbox.Process.CreateSession(ctx, "my-session")
sandbox.Process.ExecuteSessionCommand(ctx, "my-session", "cd /app", false, false)
result, err := sandbox.Process.ExecuteSessionCommand(ctx, "my-session", "npm start", false, false)
// Async: result, err := sandbox.Process.ExecuteSessionCommand(ctx, "my-session", "long-cmd", true, false)
// cmdID := result["id"].(string); status, err := sandbox.Process.GetSessionCommand(ctx, "my-session", cmdID)
// logs, err := sandbox.Process.GetSessionCommandLogs(ctx, "my-session", cmdID)
// Stream: sandbox.Process.GetSessionCommandLogsStream(ctx, "session", "cmd", stdout, stderr)
sandbox.Process.DeleteSession(ctx, "my-session")
```

PTY (interactive terminal) with optional size and environment:
```go
handle, err := sandbox.Process.CreatePty(ctx, "my-terminal",
    options.WithCreatePtySize(types.PtySize{Rows: 24, Cols: 80}),
    options.WithCreatePtyEnv(map[string]string{"TERM": "xterm-256color"}),
)
handle.WaitForConnection(ctx)
handle.SendInput([]byte("ls -la\n"))
for data := range handle.DataChan() { fmt.Print(string(data)) }
// Or: io.Copy(os.Stdout, handle); handle.Write([]byte("cmd\n"))
handle.Resize(ctx, 120, 40)
result, err := handle.Wait(ctx)
handle.Kill(ctx)
defer handle.Disconnect()
// Connect to existing: handle, err := sandbox.Process.ConnectPty(ctx, "my-terminal")
```

## File System

List/info: `ListFiles()`, `GetFileInfo()`. Create/delete: `CreateFolder()`, `DeleteFile()` (recursive option). Upload/download: `UploadFile()` (from path or bytes), `DownloadFile()` (to memory or file). Move: `MoveFiles()`. Permissions: `SetFilePermissions()` with mode, owner, group. Search: `SearchFiles()` (glob), `FindFiles()` (content), `ReplaceInFiles()`.

## Git Operations

Clone with optional branch, commit, and auth:
```go
sandbox.Git.Clone(ctx, "https://github.com/user/repo.git", "/home/user/repo",
    options.WithBranch("develop"),
    options.WithUsername("user"),
    options.WithPassword("token"),
)
```

Branches: `Branches()`, `CreateBranch()`, `Checkout()`, `DeleteBranch()` (with force option). Staging/commits: `Add()`, `Commit()` (with author, email, allow-empty option). Sync: `Pull()`, `Push()` (with auth options). Status: `Status()` returns current branch, ahead/behind counts, file statuses.

## Code Execution (Python)

Simple execution with streaming output:
```go
channels, err := sandbox.CodeInterpreter.RunCode(ctx, "print('Hello')")
result := <-channels.Done
fmt.Println(result.Stdout)
// Stream: for msg := range channels.Stdout { fmt.Print(msg.Text) }
```

With environment and timeout:
```go
channels, err := sandbox.CodeInterpreter.RunCode(ctx, "import os; print(os.environ['API_KEY'])",
    options.WithEnv(map[string]string{"API_KEY": "secret"}),
    options.WithInterpreterTimeout(30*time.Second),
)
```

Persistent contexts for state across executions:
```go
ctxInfo, err := sandbox.CodeInterpreter.CreateContext(ctx, nil)
contextID := ctxInfo["id"].(string)
sandbox.CodeInterpreter.RunCode(ctx, "x = 42", options.WithCustomContext(contextID))
sandbox.CodeInterpreter.RunCode(ctx, "print(x)", options.WithCustomContext(contextID)) // prints 42
sandbox.CodeInterpreter.DeleteContext(ctx, contextID)
contexts, err := sandbox.CodeInterpreter.ListContexts(ctx)
```

## Desktop Automation

Start/stop desktop and get status:
```go
cu := sandbox.ComputerUse
cu.Start(ctx)
status, err := cu.GetStatus(ctx)
defer cu.Stop(ctx)
```

Screenshots (full screen or region with optional cursor):
```go
screenshot, err := cu.Screenshot().TakeFullScreen(ctx, nil)
screenshot, err := cu.Screenshot().TakeFullScreen(ctx, &showCursor)
screenshot, err := cu.Screenshot().TakeRegion(ctx, types.ScreenshotRegion{X: 50, Y: 50, Width: 200, Height: 100}, nil)
```

Mouse: `Move()`, `Click()` (left/right/double), `Drag()`, `Scroll()`, `GetPosition()`.

Keyboard: `Type()` (with optional delay), `Press()` (key with modifiers), `Hotkey()` (e.g., "ctrl+c", "alt+tab").

Recording: `Start()`, `Stop()`, `List()`, `Get()`, `Download()`, `Delete()`.

Display: `GetInfo()`, `GetWindows()`.

## Language Server Protocol (LSP)

```go
lsp := sandbox.Lsp(types.LspLanguageIDPython, "/home/user/project")
lsp.Start(ctx)
lsp.DidOpen(ctx, "/home/user/project/main.py")
completions, err := lsp.Completions(ctx, "/home/user/project/main.py", types.Position{Line: 10, Character: 5})
symbols, err := lsp.DocumentSymbols(ctx, "/home/user/project/main.py")
symbols, err := lsp.SandboxSymbols(ctx, "MyClass")
lsp.DidClose(ctx, "/home/user/project/main.py")
defer lsp.Stop(ctx)
```

## Snapshots (Image Templates)

Create from Docker image with optional logs:
```go
snapshot, logChan, err := client.Snapshot.Create(ctx, &types.CreateSnapshotParams{
    Name: "my-python-env",
    Image: "python:3.11-slim",
})
for log := range logChan { fmt.Println(log) }
```

Create with fluent DockerImage builder:
```go
image := daytona.Base("python:3.11-slim").
    AptGet([]string{"git", "curl"}).
    PipInstall([]string{"numpy", "pandas"},
        options.WithIndexURL("https://download.pytorch.org/whl/cpu"),
        options.WithExtraOptions("--no-cache-dir"),
    ).
    AddLocalFile("./requirements.txt", "/app/requirements.txt").
    AddLocalDir("./src", "/app/src").
    Workdir("/app").
    Env("PYTHONUNBUFFERED", "1").
    Run("pip install -r /app/requirements.txt").
    Expose([]int{8080, 8443}).
    Label("maintainer", "team@example.com").
    User("appuser").
    Volume([]string{"/data", "/logs"}).
    Entrypoint([]string{"python", "-m", "myapp"}).
    Cmd([]string{"--help"})
```

Convenience builders: `daytona.DebianSlim(nil)` (Python 3.12), `daytona.DebianSlim(&"3.10")`, `daytona.FromDockerfile(dockerfile)`. Generate Dockerfile: `image.Dockerfile()`. Manage: `Get()`, `List()`, `Delete()`.

## Persistent Volumes

```go
volume, err := client.Volume.Create(ctx, "my-data-volume")
volume, err = client.Volume.WaitForReady(ctx, volume, 60*time.Second)
volume, err := client.Volume.Get(ctx, "my-data-volume")
volumes, err := client.Volume.List(ctx)
client.Volume.Delete(ctx, volume)
```

## Error Handling

Specialized error types: `DaytonaError` (base with message, status code, headers), `DaytonaNotFoundError` (404), `DaytonaRateLimitError` (429), `DaytonaTimeoutError`. Conversion functions: `ConvertAPIError()`, `ConvertToolboxError()`.

## Functional Options Pattern

Options passed as variadic arguments configure operations. Generic `Apply()` creates options struct with all provided functions applied. Examples: `WithBranch()`, `WithCommitId()`, `WithUsername()`, `WithPassword()`, `WithCwd()`, `WithCommandEnv()`, `WithExecuteTimeout()`, `WithCustomContext()`, `WithEnv()`, `WithCreatePtySize()`, `WithCreatePtyEnv()`, `WithMode()`, `WithPermissionMode()`, `WithOwner()`, `WithGroup()`, `WithTimeout()`, `WithWaitForStart()`, `WithLogChannel()`, `WithIndexURL()`, `WithExtraIndexURLs()`, `WithFindLinks()`, `WithPre()`, `WithExtraOptions()`, `WithAllowEmpty()`, `WithForce()`.

## Types

Configuration: `DaytonaConfig`. Sandbox creation: `SandboxBaseParams`, `ImageParams`, `SnapshotParams`. Snapshots: `CreateSnapshotParams`, `Snapshot`, `PaginatedSnapshots`. Code execution: `CodeRunParams`, `ExecuteResponse`, `ExecutionResult`, `ExecutionError`, `ExecutionArtifacts`, `Chart`, `ChartType`. Files: `FileUpload`, `FileDownloadRequest`, `FileDownloadResponse`, `FileInfo`. PTY: `PtySessionInfo`, `PtySize`, `PtyResult`. Git: `GitStatus`, `GitCommitResponse`, `FileStatus`. Volumes: `Volume`, `VolumeMount`. Resources: `Resources`. Screenshots: `ScreenshotOptions`, `ScreenshotRegion`, `ScreenshotResponse`. Languages: `CodeLanguage`, `LspLanguageID`. Utilities: `Position`, `OutputMessage`.

SDK version: `daytona.Version`.