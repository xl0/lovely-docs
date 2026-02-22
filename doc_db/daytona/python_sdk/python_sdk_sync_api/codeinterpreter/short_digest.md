## CodeInterpreter

Execute Python code in sandbox with persistent or isolated contexts.

```python
result = sandbox.code_interpreter.run_code(
    code='print("hello")',
    on_stdout=lambda msg: print(msg.output),
    timeout=10
)

# Isolated context
ctx = sandbox.code_interpreter.create_context()
sandbox.code_interpreter.run_code("x = 100", context=ctx)
sandbox.code_interpreter.delete_context(ctx)
```

**Methods:** `run_code()`, `create_context()`, `list_contexts()`, `delete_context()`

**Returns:** `ExecutionResult` with stdout, stderr, error fields

**Callbacks:** `on_stdout`, `on_stderr`, `on_error` for streaming output

**Default context** persists variables/imports across executions; create isolated contexts for separate namespaces.