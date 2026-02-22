## CodeInterpreter

Handles Python code interpretation and execution within a Sandbox. Provides methods to execute code in isolated interpreter contexts, manage contexts, and stream execution output via callbacks.

For other languages, use the `codeRun` method from the `Process` interface or execute commands directly in the sandbox terminal.

### Creating and Managing Contexts

```ts
// Create a new isolated context
const ctx = await sandbox.codeInterpreter.createContext(cwd?: string)

// List all user-created contexts (excludes default)
const contexts = await sandbox.codeInterpreter.listContexts()

// Delete a context and shut down its worker
await sandbox.codeInterpreter.deleteContext(ctx)
```

### Running Code

```ts
const result = await codeInterpreter.runCode(code: string, options: RunCodeOptions)
```

Returns `ExecutionResult` with `stdout`, `stderr`, and optional `error`.

**RunCodeOptions:**
- `context?` - InterpreterContext to run in (uses default if omitted)
- `envs?` - Record<string, string> of environment variables
- `timeout?` - Timeout in seconds (default 10 minutes, 0 = no timeout)
- `onStdout(message: OutputMessage)?` - Callback for stdout
- `onStderr(message: OutputMessage)?` - Callback for stderr
- `onError(error: ExecutionError)?` - Callback for runtime exceptions

### Example: Streaming Output with Callbacks

```ts
const code = `
import sys
import time
for i in range(5):
    print(i)
    time.sleep(1)
sys.stderr.write("Done!")
`

const result = await codeInterpreter.runCode(code, {
  context: ctx,
  timeout: 10,
  onStdout: (msg) => process.stdout.write(`STDOUT: ${msg.output}`),
  onStderr: (msg) => process.stdout.write(`STDERR: ${msg.output}`),
  onError: (err) => console.error(`${err.name}: ${err.value}\n${err.traceback ?? ''}`)
})
```

### Error Handling

`ExecutionError` contains:
- `name` - Error type (e.g., "ValueError", "SyntaxError")
- `value` - Error message
- `traceback?` - Full traceback if available

`ExecutionResult` contains:
- `stdout` - Standard output
- `stderr` - Standard error
- `error?` - ExecutionError if one occurred