## Process

Execute shell commands and code in a Sandbox.

### Commands
- `exec(command, cwd, env, timeout)`: Execute shell commands, returns `ExecuteResponse` with exit code, stdout, and matplotlib charts
- `code_run(code, params, timeout)`: Execute code in language runtime, auto-detects matplotlib charts

### Sessions
Background processes maintaining state between commands:
- `create_session(id)`, `get_session(id)`, `delete_session(id)`, `list_sessions()`
- `execute_session_command(session_id, req, timeout)`: Run commands with state, supports async
- `get_session_command(session_id, cmd_id)`: Get command info
- `get_session_command_logs(session_id, cmd_id)`: Get logs (sync or async with callbacks)
- `send_session_command_input(session_id, cmd_id, data)`: Send input to running command

### PTY Sessions
Interactive terminals:
- `create_pty_session(id, cwd, envs, pty_size)`, `connect_pty_session(session_id)`: Create/connect, returns `PtyHandle`
- `list_pty_sessions()`, `get_pty_session_info(session_id)`: List/get details
- `kill_pty_session(session_id)`, `resize_pty_session(session_id, pty_size)`: Manage lifecycle

### Data Classes
`CodeRunParams`, `SessionExecuteRequest`, `ExecutionArtifacts`, `ExecuteResponse`, `SessionExecuteResponse`, `SessionCommandLogsResponse`

### Utilities
`parse_session_command_logs()`, `demux_log()`, `OutputHandler` (sync/async callbacks)