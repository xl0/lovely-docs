## Process

Initialize a new Process instance with code toolbox, sandbox ID, toolbox API, preview link function, and optional OpenTelemetry state.

### Accessors

- `code_toolbox()` - Returns SandboxPythonCodeToolbox or SandboxTsCodeToolbox
- `sandbox_id()` - Returns String
- `toolbox_api()` - Returns ProcessApi client
- `get_preview_link()` - Returns Proc for getting preview links

### Command Execution

#### exec(command:, cwd:, env:, timeout:)

Execute shell commands in the sandbox.

```ruby
# Simple command
response = sandbox.process.exec("echo 'Hello'")
puts response.artifacts.stdout  # => "Hello\n"

# With working directory and timeout
result = sandbox.process.exec("ls", cwd: "workspace/src")
result = sandbox.process.exec("sleep 10", timeout: 5)
```

Returns ExecuteResponse with exit_code, result, and artifacts.

#### code_run(code:, params:, timeout:)

Execute code using the appropriate language runtime.

```ruby
response = sandbox.process.code_run(<<~CODE)
  x = 10
  y = 20
  print(f"Sum: {x + y}")
CODE
puts response.artifacts.stdout  # Prints: Sum: 30
```

Returns ExecuteResponse with exit_code, result, and artifacts.

### Sessions

Background processes that maintain state between commands.

#### create_session(session_id)

Creates a new long-running background session.

#### get_session(session_id)

Gets session information including session_id and commands.

```ruby
session = sandbox.process.get_session("my-session")
session.commands.each { |cmd| puts "Command: #{cmd.command}" }
```

#### execute_session_command(session_id:, req:)

Executes a command in the session, maintaining state across commands.

```ruby
session_id = "my-session"
sandbox.process.execute_session_command(
  session_id:,
  req: Daytona::SessionExecuteRequest.new(command: "cd /workspace")
)
sandbox.process.execute_session_command(
  session_id:,
  req: Daytona::SessionExecuteRequest.new(command: "echo 'Hello' > test.txt")
)
result = sandbox.process.execute_session_command(
  session_id:,
  req: Daytona::SessionExecuteRequest.new(command: "cat test.txt")
)
puts "stdout: #{result.stdout}, stderr: #{result.stderr}"
```

Returns SessionExecuteResponse with cmd_id, output, stdout, stderr, and exit_code.

#### get_session_command(session_id:, command_id:)

Gets information about a specific command in a session.

```ruby
cmd = sandbox.process.get_session_command(session_id: "my-session", command_id: "cmd-123")
puts "Command #{cmd.command} completed successfully" if cmd.exit_code == 0
```

#### get_session_command_logs(session_id:, command_id:)

Get logs for a command executed in a session.

```ruby
logs = sandbox.process.get_session_command_logs(session_id: "my-session", command_id: "cmd-123")
puts "stdout: #{logs.stdout}, stderr: #{logs.stderr}"
```

#### get_session_command_logs_async(session_id:, command_id:, on_stdout:, on_stderr:)

Asynchronously retrieves logs as they become available via WebSocket.

```ruby
sandbox.process.get_session_command_logs_async(
  session_id: "my-session",
  command_id: "cmd-123",
  on_stdout: ->(log) { puts "[STDOUT]: #{log}" },
  on_stderr: ->(log) { puts "[STDERR]: #{log}" }
)
```

Returns WebSocket::Client::Simple::Client.

#### send_session_command_input(session_id:, command_id:, data:)

Sends input data to an interactive command running in a session.

#### list_sessions()

Returns Array of all sessions in the sandbox.

```ruby
sessions = sandbox.process.list_sessions
sessions.each { |s| puts "Session #{s.session_id}: #{s.commands.length} commands" }
```

#### delete_session(session_id)

Terminates and removes a session, cleaning up resources.

### PTY Sessions

Interactive terminal sessions supporting command history and user input.

#### create_pty_session(id:, cwd:, envs:, pty_size:)

Creates a new PTY session.

```ruby
pty_handle = sandbox.process.create_pty_session(id: "my-pty")

pty_size = Daytona::PtySize.new(rows: 30, cols: 120)
pty_handle = sandbox.process.create_pty_session(
  id: "my-pty",
  cwd: "/workspace",
  envs: {"NODE_ENV" => "development"},
  pty_size: pty_size
)

pty_handle.wait_for_connection
pty_handle.send_input("ls -la\n")
result = pty_handle.wait
pty_handle.disconnect
```

Returns PtyHandle for managing the session. Raises Daytona::Sdk::Error if creation fails or session ID already exists.

#### connect_pty_session(session_id)

Connects to an existing PTY session via WebSocket.

```ruby
pty_handle = sandbox.process.connect_pty_session("my-pty-session")
pty_handle.wait_for_connection
pty_handle.send_input("echo 'Hello World'\n")
result = pty_handle.wait
pty_handle.disconnect
```

Returns PtyHandle. Raises Daytona::Sdk::Error if session doesn't exist or connection fails.

#### resize_pty_session(session_id, pty_size)

Resizes a PTY session to specified dimensions.

```ruby
pty_size = Daytona::PtySize.new(rows: 30, cols: 120)
session_info = sandbox.process.resize_pty_session("my-pty", pty_size)
puts "PTY resized to #{session_info.cols}x#{session_info.rows}"
```

Returns PtySessionInfo with updated dimensions.

#### get_pty_session_info(session_id)

Gets detailed information about a PTY session.

```ruby
info = sandbox.process.get_pty_session_info("my-session")
puts "ID: #{info.id}, Active: #{info.active}, CWD: #{info.cwd}, Size: #{info.cols}x#{info.rows}"
```

Returns PtySessionInfo with id, state, creation time, working directory, environment variables, and more.

#### list_pty_sessions()

Lists all PTY sessions in the sandbox.

```ruby
sessions = sandbox.process.list_pty_sessions
sessions.each { |s| puts "PTY Session #{s.id}: #{s.cols}x#{s.rows}" }
```

Returns Array of PtySessionInfo.

#### delete_pty_session(session_id)

Deletes a PTY session and terminates the associated process.