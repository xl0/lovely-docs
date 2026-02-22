

## Pages

### go-sdk
Go SDK for Daytona sandboxes: client setup, sandbox lifecycle (create/start/stop/delete), process execution (commands/sessions/PTY), file operations, git, Python code execution, desktop automation (mouse/keyboard/screenshots/recording), LSP, snapshots, volumes.

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

### errors
SDK error hierarchy: DaytonaError base type with NotFoundError (404), RateLimitError (429), TimeoutError variants; ConvertAPIError/ConvertToolboxError for external error conversion.

## Error Types

The SDK provides specialized error types for different failure scenarios:

### DaytonaError
Base error type for all SDK errors. Contains message, HTTP status code, and response headers.

```go
type DaytonaError struct {
    Message    string
    StatusCode int
    Headers    http.Header
}

func NewDaytonaError(message string, statusCode int, headers http.Header) *DaytonaError
func (e *DaytonaError) Error() string
```

### DaytonaNotFoundError
Represents 404 resource not found errors. Embeds DaytonaError.

```go
type DaytonaNotFoundError struct {
    *DaytonaError
}

func NewDaytonaNotFoundError(message string, headers http.Header) *DaytonaNotFoundError
func (e *DaytonaNotFoundError) Error() string
```

### DaytonaRateLimitError
Represents 429 rate limit errors. Embeds DaytonaError.

```go
type DaytonaRateLimitError struct {
    *DaytonaError
}

func NewDaytonaRateLimitError(message string, headers http.Header) *DaytonaRateLimitError
func (e *DaytonaRateLimitError) Error() string
```

### DaytonaTimeoutError
Represents timeout errors. Embeds DaytonaError.

```go
type DaytonaTimeoutError struct {
    *DaytonaError
}

func NewDaytonaTimeoutError(message string) *DaytonaTimeoutError
func (e *DaytonaTimeoutError) Error() string
```

## Error Conversion

Two functions convert external API errors to SDK error types:

- `ConvertAPIError(err error, httpResp *http.Response) error` - Converts api-client-go errors
- `ConvertToolboxError(err error, httpResp *http.Response) error` - Converts toolbox-api-client-go errors

### reference
Go SDK for programmatically creating sandboxes and executing commands; install via `go get github.com/daytonaio/daytona/libs/sdk-go`, initialize with `NewClient()` or `NewClientWithConfig()`, create sandboxes with `client.Create()`, execute commands with `sandbox.Process.ExecuteCommand()`.

## Installation

```bash
go get github.com/daytonaio/daytona/libs/sdk-go
```

## Getting Started

Create and interact with sandboxes:

```go
package main

import (
	"context"
	"fmt"
	"log"
	"github.com/daytonaio/daytona/libs/sdk-go/pkg/daytona"
	"github.com/daytonaio/daytona/libs/sdk-go/pkg/types"
)

func main() {
	// Initialize with environment variables (DAYTONA_API_KEY, DAYTONA_API_URL, DAYTONA_TARGET)
	client, err := daytona.NewClient()
	if err != nil {
		log.Fatal(err)
	}

	// Or with explicit config
	config := &types.DaytonaConfig{
		APIKey: "YOUR_API_KEY",
		APIUrl: "https://app.daytona.io/api",
		Target: "us",
	}
	client, _ = daytona.NewClientWithConfig(config)

	// Create a sandbox
	sandbox, err := client.Create(context.Background(), nil)
	if err != nil {
		log.Fatal(err)
	}

	// Execute commands
	response, err := sandbox.Process.ExecuteCommand(context.Background(), "echo 'Hello, World!'")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(response.Result)
}
```

## Configuration

Configure via environment variables or `DaytonaConfig` struct with `APIKey`, `APIUrl`, and `Target` fields. Use `NewClient()` for environment-based config or `NewClientWithConfig()` for explicit configuration.

### options
Functional options pattern for configuring SDK operations: git (branch, commit, auth), commands (cwd, env, timeout), code interpreter (context, env, timeout), PTY (size, env), filesystem (permissions, owner, group), sandbox creation (timeout, wait, logs), pip (index URLs, pre-release).

# Functional Options Pattern for SDK Configuration

Package `options` provides functional option types for configuring SDK operations using the functional options pattern.

## Core Concept

Options are passed as variadic arguments to SDK methods. Each option function returns a closure that modifies the corresponding options struct.

```go
import "github.com/daytonaio/daytona/libs/sdk-go/pkg/options"

err := sandbox.Git.Clone(ctx, url, path,
    options.WithBranch("develop"),
    options.WithUsername("user"),
    options.WithPassword("token"),
)
```

## Generic Apply Function

The `Apply` function creates a new options struct and applies all provided option functions:

```go
opts := options.Apply(
    options.WithBranch("main"),
    options.WithUsername("user"),
)
// opts.Branch == "main", opts.Username == "user"
```

## Git Options

**WithBranch(branch string)** - Clone a specific branch instead of default
```go
options.WithBranch("develop")
```

**WithCommitId(commitID string)** - Checkout specific commit SHA after cloning (detached HEAD)
```go
options.WithCommitId("abc123def")
```

**WithUsername/WithPassword** - HTTPS authentication for clone
```go
options.WithUsername("username")
options.WithPassword("ghp_xxxxxxxxxxxx")  // PAT for GitHub, token for GitLab/Bitbucket
```

**WithAllowEmpty** - Create commit without staged changes (useful for CI/CD triggers)
```go
sandbox.Git.Commit(ctx, path, "Trigger rebuild", author, email,
    options.WithAllowEmpty(true),
)
```

**WithForce** - Force delete branch even if not fully merged
```go
options.WithForce(true)
```

**WithPullUsername/WithPullPassword, WithPushUsername/WithPushPassword** - Authentication for pull/push operations

## Process/Command Execution Options

**WithCwd(cwd string)** - Working directory for command execution
```go
options.WithCwd("/home/user/project")
```

**WithCommandEnv(env map[string]string)** - Environment variables for command
```go
options.WithCommandEnv(map[string]string{"MY_VAR": "hello"})
```

**WithExecuteTimeout(timeout time.Duration)** - Command execution timeout
```go
options.WithExecuteTimeout(5*time.Second)
```

**WithCodeRunTimeout(timeout time.Duration)** - Code execution timeout
```go
options.WithCodeRunTimeout(30*time.Second)
```

**WithCodeRunParams(params types.CodeRunParams)** - Code execution parameters
```go
options.WithCodeRunParams(types.CodeRunParams{Language: "python"})
```

## Code Interpreter Options

**WithCustomContext(contextID string)** - Use persistent interpreter context for maintaining state across executions
```go
ctx, _ := sandbox.CodeInterpreter.CreateContext(ctx, nil)
sandbox.CodeInterpreter.RunCode(ctx, "x = 42",
    options.WithCustomContext(ctx["id"].(string)),
)
```

**WithEnv(env map[string]string)** - Environment variables for code execution
```go
options.WithEnv(map[string]string{"API_KEY": "secret"})
```

**WithInterpreterTimeout(timeout time.Duration)** - Code execution timeout

## PTY (Pseudo-Terminal) Options

**WithCreatePtySize(ptySize types.PtySize)** - Terminal dimensions for CreatePty
```go
options.WithCreatePtySize(types.PtySize{Rows: 24, Cols: 80})
```

**WithCreatePtyEnv(env map[string]string)** - Environment variables for PTY
```go
options.WithCreatePtyEnv(map[string]string{"TERM": "xterm-256color"})
```

**WithPtySize/WithPtyEnv** - Same for PtySession

## File System Options

**WithMode(mode string)** - Unix permissions for created folder (octal string)
```go
options.WithMode("0755")  // or "0700"
```

**WithPermissionMode(mode string)** - Unix file permissions (octal string)
```go
options.WithPermissionMode("0644")
```

**WithOwner(owner string)** - File owner username
```go
options.WithOwner("root")
```

**WithGroup(group string)** - File group name
```go
options.WithGroup("users")
```

## Sandbox Creation Options

**WithTimeout(timeout time.Duration)** - Maximum duration to wait for sandbox creation (default 60s)
```go
options.WithTimeout(5*time.Minute)
```

**WithWaitForStart(waitForStart bool)** - Whether to wait for sandbox to reach started state (default true)
```go
options.WithWaitForStart(false)  // Return immediately after creation
```

**WithLogChannel(logChannel chan string)** - Channel for receiving build logs during sandbox creation
```go
logChan := make(chan string)
go func() {
    for log := range logChan {
        fmt.Println(log)
    }
}()
sandbox, err := client.Create(ctx, params,
    options.WithLogChannel(logChan),
)
```

## Pip Install Options

**WithIndexURL(url string)** - Base URL of Python Package Index (replaces default PyPI)
```go
options.WithIndexURL("https://my-pypi.example.com/simple/")
```

**WithExtraIndexURLs(urls ...string)** - Additional index URLs checked in addition to main index
```go
options.WithExtraIndexURLs("https://private.example.com/simple/")
```

**WithFindLinks(links ...string)** - URLs searched for packages before package index
```go
options.WithFindLinks("/path/to/wheels", "https://example.com/wheels/")
```

**WithPre()** - Enable installation of pre-release and development versions

**WithExtraOptions(options string)** - Additional pip command-line options
```go
options.WithExtraOptions("--no-cache-dir --upgrade")
```

## Option Types

Each option type struct holds the configuration for a specific operation:
- `CodeRun` - Params, Timeout
- `CreateFolder` - Mode
- `CreatePty` - PtySize, Env
- `CreateSandbox` - Timeout, WaitForStart, LogChannel
- `ExecuteCommand` - Cwd, Env, Timeout
- `GitClone` - Branch, CommitId, Username, Password
- `GitCommit` - AllowEmpty
- `GitDeleteBranch` - Force
- `GitPull` - Username, Password
- `GitPush` - Username, Password
- `PipInstall` - FindLinks, IndexURL, ExtraIndexURLs, Pre, ExtraOptions
- `PtySession` - PtySize, Env
- `RunCode` - ContextID, Env, Timeout
- `SetFilePermissions` - Mode, Owner, Group


### types
Go SDK type definitions for Daytona client: configuration, sandbox/snapshot creation, code execution, file/git operations, PTY sessions, volumes, resources, charts, screenshots, and language support.

## Type Definitions

### Configuration
- **DaytonaConfig**: Client configuration with APIKey, JWTToken, OrganizationID, APIUrl, Target, and optional ExperimentalConfig (OtelEnabled for OpenTelemetry)

### Sandbox Creation Parameters
- **SandboxBaseParams**: Common sandbox parameters including Name, User, CodeLanguage (python/javascript/typescript), EnvVars, Labels, Public flag, AutoStop/Archive/Delete intervals (nil=disabled, 0=immediate), Volumes, NetworkBlockAll, NetworkAllowList, Ephemeral
- **ImageParams**: Extends SandboxBaseParams with Image (string or *Image) and Resources
- **SnapshotParams**: Extends SandboxBaseParams with Snapshot identifier

### Snapshot Management
- **CreateSnapshotParams**: Name, Image (string or *Image), Resources, Entrypoint, SkipValidation
- **Snapshot**: Full snapshot metadata with ID, OrganizationID, General flag, Name, ImageName, State, Size, Entrypoint, CPU/GPU/Memory/Disk, ErrorReason, SkipValidation, CreatedAt, UpdatedAt, LastUsedAt
- **PaginatedSnapshots**: Items ([]*Snapshot), Total, Page, TotalPages

### Code Execution
- **CodeRunParams**: Argv ([]string), Env (map[string]string)
- **ExecuteResponse**: ExitCode, Result string, Artifacts (*ExecutionArtifacts)
- **ExecutionResult**: Stdout, Stderr, Charts ([]Chart), Error (*ExecutionError)
- **ExecutionError**: Name, Value, Traceback (*string optional)
- **ExecutionArtifacts**: Stdout, Charts ([]Chart)

### Charts
- **Chart**: Type (ChartType), Title, Elements (any), PNG (*string optional base64)
- **ChartType**: line, scatter, bar, pie, box_and_whisker, composite_chart, unknown

### File Operations
- **FileUpload**: Source ([]byte or string path), Destination
- **FileDownloadRequest**: Source, Destination (*string; nil=memory, non-nil=file path)
- **FileDownloadResponse**: Source, Result ([]byte or string path), Error (*string)
- **FileInfo**: Name, Size, Mode, ModifiedTime, IsDirectory

### PTY Sessions
- **PtySessionInfo**: ID, Active, CWD, Cols, Rows, ProcessID (*int optional), CreatedAt
- **PtySize**: Rows, Cols
- **PtyResult**: ExitCode (*int; nil=running), Error (*string)

### Git Operations
- **GitStatus**: CurrentBranch, Ahead, Behind, BranchPublished, FileStatus ([]FileStatus)
- **GitCommitResponse**: SHA
- **FileStatus**: Path, Status

### Volumes
- **Volume**: ID, Name, OrganizationID, State, ErrorReason (*string), CreatedAt, UpdatedAt, LastUsedAt
- **VolumeMount**: VolumeID, MountPath, Subpath (*string optional)

### Resources
- **Resources**: CPU, GPU, Memory, Disk (all int)

### Screenshots
- **ScreenshotOptions**: ShowCursor (*bool), Format (*string), Quality (*int 0-100), Scale (*float64)
- **ScreenshotRegion**: X, Y, Width, Height
- **ScreenshotResponse**: Image (base64), Width, Height, SizeBytes (*int)

### Language Support
- **CodeLanguage**: python, javascript, typescript
- **LspLanguageID**: python, javascript, typescript

### Utilities
- **Position**: Line, Character (both zero-based)
- **OutputMessage**: Type, Text, Name, Value, Traceback (JSON serializable)

