# Functional Options for SDK Configuration

Provides functional option types using the functional options pattern for configuring SDK operations.

## Usage Pattern

```go
import "github.com/daytonaio/daytona/libs/sdk-go/pkg/options"

// Pass options as variadic arguments
err := sandbox.Git.Clone(ctx, url, path,
    options.WithBranch("develop"),
    options.WithUsername("user"),
    options.WithPassword("token"),
)

// Or use Apply to create options struct
opts := options.Apply(
    options.WithBranch("main"),
    options.WithUsername("user"),
)
```

## Main Option Categories

**Git Operations**: WithBranch, WithCommitId, WithUsername/Password, WithAllowEmpty, WithForce, WithPullUsername/Password, WithPushUsername/Password

**Command Execution**: WithCwd, WithCommandEnv, WithExecuteTimeout, WithCodeRunTimeout, WithCodeRunParams

**Code Interpreter**: WithCustomContext (persistent state), WithEnv, WithInterpreterTimeout

**PTY**: WithCreatePtySize, WithCreatePtyEnv, WithPtySize, WithPtyEnv

**File System**: WithMode, WithPermissionMode, WithOwner, WithGroup

**Sandbox Creation**: WithTimeout, WithWaitForStart, WithLogChannel

**Pip Install**: WithIndexURL, WithExtraIndexURLs, WithFindLinks, WithPre, WithExtraOptions

Each option function returns a closure modifying the corresponding options struct. Fields use pointers to distinguish unset from zero values.
