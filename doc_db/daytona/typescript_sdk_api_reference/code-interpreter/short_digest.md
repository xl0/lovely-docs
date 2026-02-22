## CodeInterpreter

Execute Python code in isolated sandbox contexts with streaming output callbacks.

**Context Management:**
```ts
const ctx = await sandbox.codeInterpreter.createContext(cwd?)
const contexts = await sandbox.codeInterpreter.listContexts()
await sandbox.codeInterpreter.deleteContext(ctx)
```

**Run Code with Callbacks:**
```ts
const result = await codeInterpreter.runCode(code, {
  context: ctx,
  timeout: 10,
  onStdout: (msg) => process.stdout.write(msg.output),
  onStderr: (msg) => process.stderr.write(msg.output),
  onError: (err) => console.error(`${err.name}: ${err.value}`)
})
```

Returns `ExecutionResult` with `stdout`, `stderr`, and optional `error` (ExecutionError with name, value, traceback).