## Code Execution

### Stateless Execution
Run code snippets in a clean interpreter each time. Supports Python, TypeScript, Ruby, Go, and API.

```python
response = sandbox.process.code_run('''
def greet(name):
    return f"Hello, {name}!"
print(greet("Daytona"))
''')
print(response.result)
```

```typescript
let response = await sandbox.process.codeRun(`
function greet(name: string): string {
    return \`Hello, \${name}!\`;
}
console.log(greet("Daytona"));
`);

// With argv, environment variables, and timeout
response = await sandbox.process.codeRun(
    `console.log(\`Hello, \${process.argv[2]}!\`); console.log(\`FOO: \${process.env.FOO}\`);`,
    { argv: ["Daytona"], env: { FOO: "BAR" } },
    5  // timeout in seconds
);
```

```ruby
response = sandbox.process.code_run(code: <<~PYTHON)
  def greet(name):
      return f"Hello, {name}!"
  print(greet("Daytona"))
PYTHON
puts response.result
```

```go
result, err := sandbox.Process.ExecuteCommand(ctx, `python3 -c 'def greet(name): return f"Hello, {name}!"\nprint(greet("Daytona"))'`)
if err != nil { log.Fatal(err) }
fmt.Println(result.Result)

// With environment variables and timeout
result, err = sandbox.Process.ExecuteCommand(ctx, `python3 -c 'import os; print(f"FOO: {os.environ.get(\"FOO\")}")'`,
	options.WithCommandEnv(map[string]string{"FOO": "BAR"}),
	options.WithExecuteTimeout(5*time.Second),
)
```

### Stateful Execution (Python only)
Maintain variables and imports between calls. Create isolated contexts or use shared default context.

```python
from daytona import Daytona, OutputMessage

def handle_stdout(message: OutputMessage):
    print(f"[STDOUT] {message.output}")

daytona = Daytona()
sandbox = daytona.create()

# Shared default context
result = sandbox.code_interpreter.run_code(
    "counter = 1\nprint(f'Counter initialized at {counter}')",
    on_stdout=handle_stdout,
)

# Isolated context
ctx = sandbox.code_interpreter.create_context()
try:
    sandbox.code_interpreter.run_code("value = 'stored in ctx'", context=ctx)
    sandbox.code_interpreter.run_code("print(value)", context=ctx, on_stdout=handle_stdout)
finally:
    sandbox.code_interpreter.delete_context(ctx)
```

```typescript
const daytona = new Daytona()
const sandbox = await daytona.create()

// Shared default context
await sandbox.codeInterpreter.runCode(
    `counter = 1\nprint(f'Counter initialized at {counter}')`,
    { onStdout: (msg) => process.stdout.write(`[STDOUT] ${msg.output}`) },
)

// Isolated context
const ctx = await sandbox.codeInterpreter.createContext()
try {
    await sandbox.codeInterpreter.runCode(`value = 'stored in ctx'`, { context: ctx })
    await sandbox.codeInterpreter.runCode(`print(value)`, { context: ctx, onStdout: (msg) => process.stdout.write(`[STDOUT] ${msg.output}`) })
} finally {
    await sandbox.codeInterpreter.deleteContext(ctx)
}
```

```go
ctxInfo, err := sandbox.CodeInterpreter.CreateContext(ctx, nil)
if err != nil { log.Fatal(err) }
contextID := ctxInfo["id"].(string)

channels, err := sandbox.CodeInterpreter.RunCode(ctx,
	"counter = 1\nprint(f'Counter initialized at {counter}')",
	options.WithCustomContext(contextID),
)
if err != nil { log.Fatal(err) }

for msg := range channels.Stdout {
	fmt.Printf("[STDOUT] %s\n", msg.Text)
}

err = sandbox.CodeInterpreter.DeleteContext(ctx, contextID)
```

## Command Execution

Execute shell commands with optional working directory, timeout, and environment variables. Working directory defaults to sandbox WORKDIR or home directory; override with absolute path starting with `/`.

```python
response = sandbox.process.exec("ls -la")
response = sandbox.process.exec("sleep 3", cwd="workspace/src", timeout=5)
response = sandbox.process.exec("echo $CUSTOM_SECRET", env={"CUSTOM_SECRET": "DAYTONA"})
```

```typescript
const response = await sandbox.process.executeCommand("ls -la");
const response2 = await sandbox.process.executeCommand("sleep 3", "workspace/src", undefined, 5);
const response3 = await sandbox.process.executeCommand("echo $CUSTOM_SECRET", ".", {"CUSTOM_SECRET": "DAYTONA"});
```

```ruby
response = sandbox.process.exec(command: 'ls -la')
response = sandbox.process.exec(command: 'sleep 3', cwd: 'workspace/src', timeout: 5)
response = sandbox.process.exec(command: 'echo $CUSTOM_SECRET', env: { 'CUSTOM_SECRET' => 'DAYTONA' })
```

```go
response, err := sandbox.Process.ExecuteCommand(ctx, "ls -la")
response, err = sandbox.Process.ExecuteCommand(ctx, "sleep 3",
	options.WithCwd("workspace/src"),
	options.WithExecuteTimeout(5*time.Second),
)
response, err = sandbox.Process.ExecuteCommand(ctx, "echo $CUSTOM_SECRET",
	options.WithCommandEnv(map[string]string{"CUSTOM_SECRET": "DAYTONA"}),
)
```

```bash
daytona exec my-sandbox -- ls -la
daytona exec my-sandbox --cwd workspace/src --timeout 5 -- sleep 3
daytona exec my-sandbox -- sh -c 'CUSTOM_SECRET=DAYTONA echo $CUSTOM_SECRET'
```

## Session Operations

Manage background process sessions for long-running operations.

### Get Session Status

```python
session = sandbox.process.get_session(session_id)
for command in session.commands:
    print(f"Command: {command.command}, Exit Code: {command.exit_code}")

sessions = sandbox.process.list_sessions()
```

```typescript
const session = await sandbox.process.getSession(sessionId);
for (const command of session.commands) {
    console.log(`Command: ${command.command}, Exit Code: ${command.exitCode}`);
}
const sessions = await sandbox.process.listSessions();
```

```ruby
session = sandbox.process.get_session(session_id)
session.commands.each { |cmd| puts "Command: #{cmd.command}, Exit Code: #{cmd.exit_code}" }
sessions = sandbox.process.list_sessions
```

```go
session, err := sandbox.Process.GetSession(ctx, sessionID)
commands := session["commands"].([]any)
for _, cmd := range commands {
	cmdMap := cmd.(map[string]any)
	fmt.Printf("Command: %s, Exit Code: %v\n", cmdMap["command"], cmdMap["exitCode"])
}
sessions, err := sandbox.Process.ListSessions(ctx)
```

### Execute Interactive Commands

Send input to running commands that expect user interaction.

```python
session_id = "interactive-session"
sandbox.process.create_session(session_id)

command = sandbox.process.execute_session_command(
    session_id,
    SessionExecuteRequest(command='pip uninstall requests', run_async=True),
)

logs_task = asyncio.create_task(
    sandbox.process.get_session_command_logs_async(
        session_id,
        command.cmd_id,
        lambda log: print(f"[STDOUT]: {log}"),
        lambda log: print(f"[STDERR]: {log}"),
    )
)

await asyncio.sleep(1)
sandbox.process.send_session_command_input(session_id, command.cmd_id, "y")
await logs_task
```

```typescript
const sessionId = 'interactive-session'
await sandbox.process.createSession(sessionId)

const command = await sandbox.process.executeSessionCommand(sessionId, {
    command: 'pip uninstall requests',
    runAsync: true,
})

const logPromise = sandbox.process.getSessionCommandLogs(
    sessionId,
    command.cmdId!,
    (stdout) => console.log('[STDOUT]:', stdout),
    (stderr) => console.log('[STDERR]:', stderr),
)

await new Promise((resolve) => setTimeout(resolve, 1000))
await sandbox.process.sendSessionCommandInput(sessionId, command.cmdId!, 'y')
await logPromise
```

```ruby
session_id = "interactive-session"
sandbox.process.create_session(session_id)

interactive_command = sandbox.process.execute_session_command(
  session_id: session_id,
  req: Daytona::SessionExecuteRequest.new(command: 'pip uninstall requests', run_async: true)
)

sleep 1
sandbox.process.send_session_command_input(session_id: session_id, command_id: interactive_command.cmd_id, data: "y")

sandbox.process.get_session_command_logs_async(
  session_id: session_id,
  command_id: interactive_command.cmd_id,
  on_stdout: ->(log) { puts "[STDOUT]: #{log}" },
  on_stderr: ->(log) { puts "[STDERR]: #{log}" }
)
```

```go
sessionID := "interactive-session"
err := sandbox.Process.CreateSession(ctx, sessionID)
result, err := sandbox.Process.ExecuteSessionCommand(ctx, sessionID, "pip uninstall requests", true)
cmdID := result["cmdId"].(string)

stdout := make(chan string)
stderr := make(chan string)
go func() {
	sandbox.Process.GetSessionCommandLogsStream(ctx, sessionID, cmdID, stdout, stderr)
}()

time.Sleep(1 * time.Second)
// Use API endpoint to send input
```

## Resource Management

Clean up sessions after execution using try-finally or defer patterns.

```python
session_id = "long-running-cmd"
try:
    sandbox.process.create_session(session_id)
    session = sandbox.process.get_session(session_id)
    # Do work...
finally:
    sandbox.process.delete_session(session.session_id)
```

```typescript
const sessionId = "long-running-cmd";
try {
    await sandbox.process.createSession(sessionId);
    const session = await sandbox.process.getSession(sessionId);
    // Do work...
} finally {
    await sandbox.process.deleteSession(session.sessionId);
}
```

```ruby
session_id = 'long-running-cmd'
begin
  sandbox.process.create_session(session_id)
  session = sandbox.process.get_session(session_id)
  # Do work...
ensure
  sandbox.process.delete_session(session.session_id)
end
```

```go
sessionID := "long-running-cmd"
err := sandbox.Process.CreateSession(ctx, sessionID)
if err != nil { log.Fatal(err) }
defer sandbox.Process.DeleteSession(ctx, sessionID)

session, err := sandbox.Process.GetSession(ctx, sessionID)
```

## Error Handling

Check exit codes and handle exceptions.

```python
from daytona import DaytonaError

try:
    response = sandbox.process.code_run("invalid python code")
    if response.exit_code != 0:
        print(f"Exit code: {response.exit_code}")
        print(f"Error output: {response.result}")
except DaytonaError as e:
    print(f"Execution failed: {e}")
```

```typescript
import { DaytonaError } from '@daytonaio/sdk'

try {
    const response = await sandbox.process.codeRun("invalid typescript code");
    if (response.exitCode !== 0) {
        console.error("Exit code:", response.exitCode);
        console.error("Error output:", response.result);
    }
} catch (e) {
    if (e instanceof DaytonaError) {
        console.error("Execution failed:", e);
    }
}
```

```ruby
begin
  response = sandbox.process.code_run(code: 'invalid python code')
  if response.exit_code != 0
    puts "Exit code: #{response.exit_code}"
    puts "Error output: #{response.result}"
  end
rescue StandardError => e
  puts "Execution failed: #{e}"
end
```

```go
result, err := sandbox.Process.ExecuteCommand(ctx, "python3 -c 'invalid python code'")
if err != nil {
	fmt.Println("Execution failed:", err)
}
if result != nil && result.ExitCode != 0 {
	fmt.Println("Exit code:", result.ExitCode)
	fmt.Println("Error output:", result.Result)
}
```

## Common Issues

| Issue | Solutions |
|-------|-----------|
| Process execution failed | Check command syntax, verify dependencies, ensure permissions |
| Process timeout | Adjust timeout settings, optimize long-running operations, use background processes |
| Resource limits | Monitor memory usage, handle cleanup properly, use resource constraints |