## PtyConnectOptions

Callback-based options for connecting to an existing PTY session.

**Properties**:
- `onData()` - Callback invoked with PTY output data as `Uint8Array`, can be async

## PtyCreateOptions

Configuration for creating a new PTY session.

**Properties**:
- `id` - Unique identifier for the PTY session (required)
- `cols?` - Terminal width in columns
- `rows?` - Terminal height in rows
- `cwd?` - Starting working directory (defaults to sandbox's working directory)
- `envs?` - Environment variables as key-value pairs

## PtyResult

Exit status information returned when a PTY session terminates.

**Properties**:
- `exitCode?` - Process exit code
- `error?` - Error message if the PTY failed