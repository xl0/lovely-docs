## CodeInterpreter

Handles Python code interpretation and execution within a Sandbox. Supports isolated execution contexts where variables, imports, and functions persist across executions within the same context.

### Initialization

```python
CodeInterpreter(api_client: InterpreterApi, ensure_toolbox_url: Callable[[], None])
```

### run_code

Execute Python code in the sandbox with optional callbacks for output streaming.

```python
result = sandbox.code_interpreter.run_code(
    code: str,
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
- `context` - Execution context (default: shared persistent context)
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

result = sandbox.code_interpreter.run_code(
    code='import time\nfor i in range(5):\n    print(i)\n    time.sleep(1)',
    on_stdout=handle_stdout,
    on_stderr=handle_stderr,
    on_error=handle_error,
    timeout=10
)
```

### Context Management

Create isolated execution environments with separate namespaces:

```python
# Create isolated context
ctx = sandbox.code_interpreter.create_context(cwd: str | None = None) -> InterpreterContext

# List all user-created contexts (excludes default context)
contexts = sandbox.code_interpreter.list_contexts() -> list[InterpreterContext]

# Delete context and shut down associated processes
sandbox.code_interpreter.delete_context(context: InterpreterContext) -> None
```

**Example:**
```python
ctx = sandbox.code_interpreter.create_context()
sandbox.code_interpreter.run_code("x = 100", context=ctx)
result = sandbox.code_interpreter.run_code("print(x)", context=ctx)  # OK: x exists in ctx
result = sandbox.code_interpreter.run_code("print(x)")  # NameError: x doesn't exist in default context
sandbox.code_interpreter.delete_context(ctx)
```

### Data Models

**OutputMessage:** Represents stdout/stderr output
- `output` - Output content

**ExecutionError:** Represents execution errors
- `name` - Error type (e.g., "ValueError", "SyntaxError")
- `value` - Error value
- `traceback` - Full traceback

**ExecutionResult:** Result of code execution
- `stdout` - Standard output
- `stderr` - Standard error
- `error` - Error details or None

### Notes

- Default context persists state across executions
- For other languages, use `Process.code_run()` or execute commands directly in sandbox terminal
- Default context cannot be deleted