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
