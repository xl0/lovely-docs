## PtyHandle

Manages PTY session with WebSocket connection.

**Key methods:**
- `sendInput(data)`: Send commands/input to terminal
- `resize(cols, rows)`: Change terminal dimensions
- `wait()`: Wait for process exit, returns result with exitCode and error
- `kill()`: Forcefully terminate session
- `disconnect()`: Clean up resources
- `isConnected()`: Check connection status
- `waitForConnection()`: Wait for connection establishment (10s timeout)

**Properties:** `sessionId`, `error`, `exitCode`

**Example:**
```ts
const ptyHandle = await process.createPty({
  id: 'my-session', cols: 120, rows: 30,
  onData: (data) => process.stdout.write(new TextDecoder().decode(data)),
});
await ptyHandle.sendInput('ls -la\n');
const result = await ptyHandle.wait();
console.log(`Exit code: ${result.exitCode}`);
await ptyHandle.disconnect();
```