## Process

Execute commands and manage sessions in a sandbox.

### Command Execution

- `exec(command:, cwd:, env:, timeout:)` - Execute shell commands
- `code_run(code:, params:, timeout:)` - Execute code in language runtime

### Sessions

Stateful background processes:
- `create_session(session_id)` / `delete_session(session_id)`
- `execute_session_command(session_id:, req:)` - Run commands maintaining state
- `get_session_command(session_id:, command_id:)` / `get_session_command_logs(session_id:, command_id:)`
- `get_session_command_logs_async(session_id:, command_id:, on_stdout:, on_stderr:)` - Stream logs via WebSocket
- `send_session_command_input(session_id:, command_id:, data:)` - Send input to interactive commands
- `list_sessions()` / `get_session(session_id)`

### PTY Sessions

Interactive terminal sessions:
- `create_pty_session(id:, cwd:, envs:, pty_size:)` - Create terminal with optional size/env
- `connect_pty_session(session_id)` - Connect to existing PTY via WebSocket
- `resize_pty_session(session_id, pty_size)` - Resize terminal
- `get_pty_session_info(session_id)` - Get session details
- `list_pty_sessions()` / `delete_pty_session(session_id)`

PtyHandle supports: `wait_for_connection()`, `send_input()`, `wait()`, `disconnect()`