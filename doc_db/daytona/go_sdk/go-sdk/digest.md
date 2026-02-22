# Go SDK for Daytona

Package daytona provides a Go SDK for creating, managing, and interacting with Daytona sandboxes - isolated development environments that run code, execute commands, and manage files.

## Client Setup

Create a client using API key or JWT token:

```go
client, err := daytona.NewClient()
if err != nil {
    log.Fatal(err)
}
defer client.Close(ctx)
```

Configuration from environment variables:
- `DAYTONA_API_KEY` or `DAYTONA_JWT_TOKEN` (one required)
- `DAYTONA_ORGANIZATION_ID` (required with JWT)
- `DAYTONA_API_URL` (defaults to https://app.daytona.io/api)
- `DAYTONA_TARGET` (target environment)

Or explicit config:
```go
client, err := daytona.NewClientWithConfig(&types.DaytonaConfig{
    APIKey: "your-api-key",
    APIUrl: "https://your-instance.daytona.io/api",
})
```

## Sandbox Lifecycle

Create from snapshot or Docker image:
```go
// From snapshot
sandbox, err := client.Create(ctx, types.SnapshotParams{
    Snapshot: "my-snapshot",
    SandboxBaseParams: types.SandboxBaseParams{Name: "my-sandbox"},
})

// From Docker image
sandbox, err := client.Create(ctx, types.ImageParams{
    Image: "python:3.11",
    Resources: &types.Resources{CPU: 2, Memory: 4096},
})
```

Manage sandbox state:
```go
sandbox.Start(ctx)
sandbox.Stop(ctx)
sandbox.Archive(ctx)
sandbox.Delete(ctx)

// With custom timeouts
sandbox.StartWithTimeout(ctx, 2*time.Minute)
sandbox.StopWithTimeout(ctx, 2*time.Minute)
sandbox.DeleteWithTimeout(ctx, 2*time.Minute)

// Wait for state changes
sandbox.WaitForStart(ctx, 2*time.Minute)
sandbox.WaitForStop(ctx, 2*time.Minute)
sandbox.WaitForResize(ctx, 2*time.Minute)
```

Retrieve sandboxes:
```go
sandbox, err := client.Get(ctx, "sandbox-id-or-name")
sandbox, err := client.FindOne(ctx, &name, nil) // by name
sandbox, err := client.FindOne(ctx, nil, map[string]string{"env": "dev"}) // by labels

result, err := client.List(ctx, map[string]string{"env": "dev"}, &page, &limit)
for _, sb := range result.Items {
    fmt.Printf("%s: %s\n", sb.Name, sb.State)
}
```

Sandbox configuration:
```go
sandbox.SetLabels(ctx, map[string]string{"env": "prod", "team": "backend"})
sandbox.SetAutoArchiveInterval(ctx, &interval) // minutes, 0 to disable
sandbox.SetAutoDeleteInterval(ctx, &interval)  // -1 to disable, 0 to delete immediately
sandbox.Resize(ctx, &types.Resources{CPU: 4, Memory: 8})
sandbox.RefreshData(ctx) // update state from server
```

Get sandbox info:
```go
homeDir, err := sandbox.GetUserHomeDir(ctx)
workDir, err := sandbox.GetWorkingDir(ctx)
url, err := sandbox.GetPreviewLink(ctx, 3000) // access port 3000
```

## Process Execution

Execute commands:
```go
result, err := sandbox.Process.ExecuteCommand(ctx, "echo 'Hello'")
fmt.Println(result.Result)
fmt.Println(result.ExitCode)

// With options
result, err := sandbox.Process.ExecuteCommand(ctx, "npm install",
    options.WithCwd("/home/user/project"),
    options.WithCommandEnv(map[string]string{"NODE_ENV": "prod"}),
    options.WithExecuteTimeout(5*time.Minute),
)
```

Sessions (maintain state across commands):
```go
sandbox.Process.CreateSession(ctx, "my-session")
defer sandbox.Process.DeleteSession(ctx, "my-session")

sandbox.Process.ExecuteSessionCommand(ctx, "my-session", "cd /app", false, false)
result, err := sandbox.Process.ExecuteSessionCommand(ctx, "my-session", "npm start", false, false)

// Async execution
result, err := sandbox.Process.ExecuteSessionCommand(ctx, "my-session", "long-cmd", true, false)
cmdID := result["id"].(string)
status, err := sandbox.Process.GetSessionCommand(ctx, "my-session", cmdID)
logs, err := sandbox.Process.GetSessionCommandLogs(ctx, "my-session", cmdID)

// Stream logs
stdout := make(chan string, 100)
stderr := make(chan string, 100)
go sandbox.Process.GetSessionCommandLogsStream(ctx, "session", "cmd", stdout, stderr)
```

PTY (interactive terminal):
```go
// Create and connect
handle, err := sandbox.Process.CreatePty(ctx, "my-terminal",
    options.WithCreatePtySize(types.PtySize{Rows: 24, Cols: 80}),
    options.WithCreatePtyEnv(map[string]string{"TERM": "xterm-256color"}),
)
defer handle.Disconnect()

// Wait for connection
handle.WaitForConnection(ctx)

// Send input and read output
handle.SendInput([]byte("ls -la\n"))
for data := range handle.DataChan() {
    fmt.Print(string(data))
}

// Or use as io.Reader/Writer
io.Copy(os.Stdout, handle)
handle.Write([]byte("command\n"))

// Terminal control
handle.Resize(ctx, 120, 40)
result, err := handle.Wait(ctx)
handle.Kill(ctx)

// Connect to existing session
handle, err := sandbox.Process.ConnectPty(ctx, "my-terminal")
```

## File System

```go
// List and info
files, err := sandbox.FileSystem.ListFiles(ctx, "/home/user")
info, err := sandbox.FileSystem.GetFileInfo(ctx, "/home/user/file.txt")

// Create and delete
sandbox.FileSystem.CreateFolder(ctx, "/home/user/mydir", options.WithMode("0755"))
sandbox.FileSystem.DeleteFile(ctx, "/home/user/file.txt", false)
sandbox.FileSystem.DeleteFile(ctx, "/home/user/dir", true) // recursive

// Upload and download
sandbox.FileSystem.UploadFile(ctx, "/local/file.txt", "/home/user/file.txt")
sandbox.FileSystem.UploadFile(ctx, []byte("content"), "/home/user/file.txt")
data, err := sandbox.FileSystem.DownloadFile(ctx, "/home/user/file.txt", nil)
data, err := sandbox.FileSystem.DownloadFile(ctx, "/home/user/file.txt", &localPath)

// Move and permissions
sandbox.FileSystem.MoveFiles(ctx, "/home/user/old.txt", "/home/user/new.txt")
sandbox.FileSystem.SetFilePermissions(ctx, "/home/user/file.txt",
    options.WithPermissionMode("0644"),
    options.WithOwner("user"),
    options.WithGroup("staff"),
)

// Search
result, err := sandbox.FileSystem.SearchFiles(ctx, "/home/user", "*.go")
result, err := sandbox.FileSystem.FindFiles(ctx, "/home/user", "TODO:")
result, err := sandbox.FileSystem.ReplaceInFiles(ctx, []string{"file1.txt", "file2.txt"}, "old", "new")
```

## Git Operations

```go
// Clone
sandbox.Git.Clone(ctx, "https://github.com/user/repo.git", "/home/user/repo",
    options.WithBranch("develop"),
    options.WithUsername("user"),
    options.WithPassword("token"),
)

// Branches
branches, err := sandbox.Git.Branches(ctx, "/home/user/repo")
sandbox.Git.CreateBranch(ctx, "/home/user/repo", "feature/new")
sandbox.Git.Checkout(ctx, "/home/user/repo", "feature/new")
sandbox.Git.DeleteBranch(ctx, "/home/user/repo", "old-branch", options.WithForce(true))

// Staging and commits
sandbox.Git.Add(ctx, "/home/user/repo", []string{"."})
resp, err := sandbox.Git.Commit(ctx, "/home/user/repo", "Initial commit", "John Doe", "john@example.com",
    options.WithAllowEmpty(true),
)
fmt.Println(resp.SHA)

// Sync
sandbox.Git.Pull(ctx, "/home/user/repo",
    options.WithPullUsername("user"),
    options.WithPullPassword("token"),
)
sandbox.Git.Push(ctx, "/home/user/repo",
    options.WithPushUsername("user"),
    options.WithPushPassword("token"),
)

// Status
status, err := sandbox.Git.Status(ctx, "/home/user/repo")
fmt.Printf("Branch: %s, Ahead: %d, Behind: %d\n", status.CurrentBranch, status.Ahead, status.Behind)
```

## Code Execution (Python)

```go
// Simple execution
channels, err := sandbox.CodeInterpreter.RunCode(ctx, "print('Hello, World!')")
result := <-channels.Done
fmt.Println(result.Stdout)

// Stream output
channels, err := sandbox.CodeInterpreter.RunCode(ctx, `
    for i in range(5):
        print(f"Count: {i}")
`)
for msg := range channels.Stdout {
    fmt.Print(msg.Text)
}
result := <-channels.Done

// With options
channels, err := sandbox.CodeInterpreter.RunCode(ctx, "import os; print(os.environ['API_KEY'])",
    options.WithEnv(map[string]string{"API_KEY": "secret"}),
    options.WithInterpreterTimeout(30*time.Second),
)

// Persistent contexts
ctxInfo, err := sandbox.CodeInterpreter.CreateContext(ctx, nil)
contextID := ctxInfo["id"].(string)
sandbox.CodeInterpreter.RunCode(ctx, "x = 42", options.WithCustomContext(contextID))
sandbox.CodeInterpreter.RunCode(ctx, "print(x)", options.WithCustomContext(contextID)) // prints 42
sandbox.CodeInterpreter.DeleteContext(ctx, contextID)

contexts, err := sandbox.CodeInterpreter.ListContexts(ctx)
```

## Desktop Automation

Start/stop desktop:
```go
cu := sandbox.ComputerUse
cu.Start(ctx)
defer cu.Stop(ctx)

status, err := cu.GetStatus(ctx)
```

Screenshots:
```go
screenshot, err := cu.Screenshot().TakeFullScreen(ctx, nil)
screenshot, err := cu.Screenshot().TakeFullScreen(ctx, &showCursor)
screenshot, err := cu.Screenshot().TakeRegion(ctx, types.ScreenshotRegion{X: 50, Y: 50, Width: 200, Height: 100}, nil)
```

Mouse:
```go
cu.Mouse().Move(ctx, 500, 300)
cu.Mouse().Click(ctx, 100, 200, nil, nil) // left click
cu.Mouse().Click(ctx, 100, 200, &"right", nil) // right click
cu.Mouse().Click(ctx, 100, 200, nil, &true) // double click
cu.Mouse().Drag(ctx, 100, 100, 300, 300, nil)
cu.Mouse().Scroll(ctx, 500, 400, "down", nil)
pos, err := cu.Mouse().GetPosition(ctx)
```

Keyboard:
```go
cu.Keyboard().Type(ctx, "Hello, World!", nil)
cu.Keyboard().Type(ctx, "Slow typing", &delay) // delay in ms
cu.Keyboard().Press(ctx, "Enter", nil)
cu.Keyboard().Press(ctx, "s", []string{"ctrl"})
cu.Keyboard().Press(ctx, "n", []string{"ctrl", "shift"})
cu.Keyboard().Hotkey(ctx, "ctrl+c")
cu.Keyboard().Hotkey(ctx, "alt+tab")
```

Recording:
```go
recording, err := cu.Recording().Start(ctx, &"my-recording")
cu.Recording().Stop(ctx, recording.GetId())
recordings, err := cu.Recording().List(ctx)
recording, err := cu.Recording().Get(ctx, recordingID)
cu.Recording().Download(ctx, recordingID, "local_recording.mp4")
cu.Recording().Delete(ctx, recordingID)
```

Display:
```go
info, err := cu.Display().GetInfo(ctx)
windows, err := cu.Display().GetWindows(ctx)
```

## Language Server Protocol (LSP)

```go
lsp := sandbox.Lsp(types.LspLanguageIDPython, "/home/user/project")
lsp.Start(ctx)
defer lsp.Stop(ctx)

lsp.DidOpen(ctx, "/home/user/project/main.py")
completions, err := lsp.Completions(ctx, "/home/user/project/main.py", types.Position{Line: 10, Character: 5})
symbols, err := lsp.DocumentSymbols(ctx, "/home/user/project/main.py")
symbols, err := lsp.SandboxSymbols(ctx, "MyClass")
lsp.DidClose(ctx, "/home/user/project/main.py")
```

## Snapshots (Image Templates)

```go
// Create from Docker image
snapshot, logChan, err := client.Snapshot.Create(ctx, &types.CreateSnapshotParams{
    Name:  "my-python-env",
    Image: "python:3.11-slim",
})
for log := range logChan {
    fmt.Println(log)
}

// Create from custom DockerImage
image := daytona.Base("python:3.11-slim").
    AptGet([]string{"git", "curl"}).
    PipInstall([]string{"numpy", "pandas"}).
    Workdir("/app").
    Env("PYTHONUNBUFFERED", "1")

snapshot, logChan, err := client.Snapshot.Create(ctx, &types.CreateSnapshotParams{
    Name:  "custom-python-env",
    Image: image,
    Resources: &types.Resources{CPU: 2, Memory: 4096},
})

// Manage snapshots
snapshot, err := client.Snapshot.Get(ctx, "my-python-env")
result, err := client.Snapshot.List(ctx, &page, &limit)
client.Snapshot.Delete(ctx, snapshot)
```

## DockerImage Builder

Fluent API for building Docker images:

```go
image := daytona.Base("python:3.11-slim").
    AptGet([]string{"git", "curl", "build-essential"}).
    PipInstall([]string{"numpy", "pandas"},
        options.WithIndexURL("https://download.pytorch.org/whl/cpu"),
        options.WithExtraOptions("--no-cache-dir"),
    ).
    AddLocalFile("./requirements.txt", "/app/requirements.txt").
    AddLocalDir("./src", "/app/src").
    Workdir("/app").
    Env("PYTHONUNBUFFERED", "1").
    Env("APP_ENV", "production").
    Run("pip install -r /app/requirements.txt").
    Expose([]int{8080, 8443}).
    Label("maintainer", "team@example.com").
    Label("version", "1.0.0").
    User("appuser").
    Volume([]string{"/data", "/logs"}).
    Entrypoint([]string{"python", "-m", "myapp"}).
    Cmd([]string{"--help"})

// Convenience builders
image := daytona.DebianSlim(nil) // Python 3.12
image := daytona.DebianSlim(&"3.10")

// From existing Dockerfile
dockerfile := `FROM python:3.11\nRUN pip install numpy\nWORKDIR /app`
image := daytona.FromDockerfile(dockerfile)

// Generate Dockerfile
fmt.Println(image.Dockerfile())
```

## Persistent Volumes

```go
// Create and wait
volume, err := client.Volume.Create(ctx, "my-data-volume")
volume, err = client.Volume.WaitForReady(ctx, volume, 60*time.Second)

// Manage
volume, err := client.Volume.Get(ctx, "my-data-volume")
volumes, err := client.Volume.List(ctx)
client.Volume.Delete(ctx, volume)
```

## Version

```go
fmt.Printf("SDK version: %s\n", daytona.Version)
```