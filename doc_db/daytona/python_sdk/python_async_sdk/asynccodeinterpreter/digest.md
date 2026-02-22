## AsyncCodeInterpreter

Handles Python code interpretation and execution within a Sandbox. Supports isolated interpreter contexts where variables, imports, and functions persist across executions within the same context.

### Initialization

```python
AsyncCodeInterpreter(api_client: InterpreterApi, ensure_toolbox_url: Callable[[], Awaitable[None]])
```

### run_code

Execute Python code in the sandbox with optional callbacks for output streaming.

```python
async def run_code(
    code: str,
    *,
    context: InterpreterContext | None = None,
    on_stdout: OutputHandler[OutputMessage] | None = None,
    on_stderr: OutputHandler[OutputMessage] | None = None,
    on_error: OutputHandler[ExecutionError] | None = None,
    envs: dict[str, str] | None = None,
    timeout: int | None = None
) -> ExecutionResult
```

**Arguments:**
- `code` - Python code to execute
- `context` - Execution context (default: shared default context). Use `create_context()` for isolation
- `on_stdout`, `on_stderr`, `on_error` - Callbacks for streaming output
- `envs` - Environment variables for this execution
- `timeout` - Timeout in seconds (default: 10 minutes, 0 = no timeout)

**Returns:** `ExecutionResult` with stdout, stderr, and error fields

**Raises:** `DaytonaTimeoutError`, `DaytonaError`

**Example:**
```python
def handle_stdout(msg: OutputMessage):
    print(f"STDOUT: {msg.output}", end="")

def handle_stderr(msg: OutputMessage):
    print(f"STDERR: {msg.output}", end="")

def handle_error(err: ExecutionError):
    print(f"ERROR: {err.name}: {err.value}")

result = await sandbox.code_interpreter.run_code(
    code="import sys; [print(i) for i in range(5)]; sys.stderr.write('Done!')",
    on_stdout=handle_stdout,
    on_stderr=handle_stderr,
    on_error=handle_error,
    timeout=10
)
```

### Context Management

**create_context** - Create isolated interpreter context with own namespace:
```python
async def create_context(cwd: str | None = None) -> InterpreterContext
```

**list_contexts** - List all user-created contexts (excludes default):
```python
async def list_contexts() -> list[InterpreterContext]
```

**delete_context** - Delete context and shut down associated processes:
```python
async def delete_context(context: InterpreterContext) -> None
```

**Context example:**
```python
ctx = await sandbox.code_interpreter.create_context()
await sandbox.code_interpreter.run_code("x = 100", context=ctx)
result = await sandbox.code_interpreter.run_code("print(x)", context=ctx)  # OK
result = await sandbox.code_interpreter.run_code("print(x)")  # NameError - x not in default context
await sandbox.code_interpreter.delete_context(ctx)

contexts = await sandbox.code_interpreter.list_contexts()
for ctx in contexts:
    print(f"Context {ctx.id}: {ctx.language} at {ctx.cwd}")
```

### Data Models

**OutputMessage** - stdout/stderr output
- `output` - Output content

**ExecutionError** - Execution error details
- `name` - Error type (e.g., "ValueError", "SyntaxError")
- `value` - Error value
- `traceback` - Full traceback

**ExecutionResult** - Code execution result
- `stdout` - Standard output
- `stderr` - Standard error
- `error` - Error details or None

### Notes

- Default context persists state across executions
- For other languages, use `code_run` from `AsyncProcess` interface or execute commands directly in sandbox terminal
- Default context cannot be deleted