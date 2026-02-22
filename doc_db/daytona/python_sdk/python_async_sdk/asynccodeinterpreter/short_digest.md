## AsyncCodeInterpreter

Execute Python code in sandbox with output callbacks and isolated contexts.

**run_code** - Execute code with optional stdout/stderr/error callbacks, environment variables, and timeout:
```python
result = await sandbox.code_interpreter.run_code(
    code="print('hello')",
    on_stdout=lambda msg: print(msg.output, end=""),
    on_stderr=lambda msg: print(msg.output, end=""),
    on_error=lambda err: print(f"{err.name}: {err.value}"),
    timeout=10
)
```

**Contexts** - Create isolated execution environments with own namespace:
```python
ctx = await sandbox.code_interpreter.create_context()
await sandbox.code_interpreter.run_code("x = 100", context=ctx)
contexts = await sandbox.code_interpreter.list_contexts()
await sandbox.code_interpreter.delete_context(ctx)
```

Default context persists variables/imports across executions. Returns `ExecutionResult` with stdout, stderr, error fields.