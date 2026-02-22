# Go SDK for Daytona

## Setup
```go
client, err := daytona.NewClient() // reads env vars
// or
client, err := daytona.NewClientWithConfig(&types.DaytonaConfig{APIKey: "...", APIUrl: "..."})
defer client.Close(ctx)
```

## Sandboxes
```go
// Create
sandbox, err := client.Create(ctx, types.SnapshotParams{Snapshot: "my-snapshot"})
sandbox, err := client.Create(ctx, types.ImageParams{Image: "python:3.11"})

// Retrieve
sandbox, err := client.Get(ctx, "id-or-name")
result, err := client.List(ctx, labels, &page, &limit)

// Lifecycle
sandbox.Start(ctx)
sandbox.Stop(ctx)
sandbox.Archive(ctx)
sandbox.Delete(ctx)

// Config
sandbox.SetLabels(ctx, map[string]string{"env": "prod"})
sandbox.Resize(ctx, &types.Resources{CPU: 4, Memory: 8})
```

## Process Execution
```go
// Commands
result, err := sandbox.Process.ExecuteCommand(ctx, "echo hello",
    options.WithCwd("/app"),
    options.WithExecuteTimeout(5*time.Minute),
)

// Sessions (stateful)
sandbox.Process.CreateSession(ctx, "session")
sandbox.Process.ExecuteSessionCommand(ctx, "session", "cd /app", false, false)

// PTY (interactive terminal)
handle, err := sandbox.Process.CreatePty(ctx, "terminal")
handle.SendInput([]byte("ls\n"))
for data := range handle.DataChan() { fmt.Print(string(data)) }
```

## File System
```go
files, err := sandbox.FileSystem.ListFiles(ctx, "/home/user")
sandbox.FileSystem.UploadFile(ctx, "/local/file.txt", "/remote/file.txt")
data, err := sandbox.FileSystem.DownloadFile(ctx, "/remote/file.txt", nil)
sandbox.FileSystem.CreateFolder(ctx, "/home/user/dir")
sandbox.FileSystem.DeleteFile(ctx, "/home/user/file.txt", false)
sandbox.FileSystem.SearchFiles(ctx, "/home/user", "*.go")
```

## Git
```go
sandbox.Git.Clone(ctx, "https://github.com/user/repo.git", "/home/user/repo")
sandbox.Git.Add(ctx, "/home/user/repo", []string{"."})
sandbox.Git.Commit(ctx, "/home/user/repo", "msg", "author", "email")
sandbox.Git.Push(ctx, "/home/user/repo")
status, err := sandbox.Git.Status(ctx, "/home/user/repo")
```

## Code Execution (Python)
```go
channels, err := sandbox.CodeInterpreter.RunCode(ctx, "print('hello')",
    options.WithEnv(map[string]string{"KEY": "value"}),
)
result := <-channels.Done

// Persistent context
ctx, _ := sandbox.CodeInterpreter.CreateContext(ctx, nil)
sandbox.CodeInterpreter.RunCode(ctx, "x = 42", options.WithCustomContext(ctxID))
```

## Desktop Automation
```go
cu := sandbox.ComputerUse
cu.Start(ctx)
defer cu.Stop(ctx)

cu.Screenshot().TakeFullScreen(ctx, nil)
cu.Mouse().Click(ctx, 100, 200, nil, nil)
cu.Keyboard().Type(ctx, "text", nil)
cu.Recording().Start(ctx, nil)
```

## Snapshots & Volumes
```go
// Snapshots (image templates)
image := daytona.Base("python:3.11").PipInstall([]string{"numpy"})
snapshot, logChan, err := client.Snapshot.Create(ctx, &types.CreateSnapshotParams{Name: "env", Image: image})

// Volumes (persistent storage)
volume, err := client.Volume.Create(ctx, "data-volume")
volume, err = client.Volume.WaitForReady(ctx, volume, 60*time.Second)
```