## PtyHandle

PTY session handle for managing a single PTY session with WebSocket connection.

**Property:**
- `sessionId` (string)

## Accessors

**error**: Get error message if PTY failed (string)

**exitCode**: Get exit code of PTY process if terminated (number)

## Constructor

```ts
new PtyHandle(
  ws: WebSocket,
  handleResize: (cols: number, rows: number) => Promise<PtySessionInfo>,
  handleKill: () => Promise<void>,
  onPty: (data: Uint8Array) => void | Promise<void>,
  sessionId: string
)
```

## Methods

**isConnected()**: Check if connected to PTY session (returns boolean)

**waitForConnection()**: Wait for WebSocket connection to be established. Throws if connection times out (10 seconds) or fails.

**sendInput(data: string | Uint8Array)**: Send input data to PTY session. Throws if PTY not connected or sending fails.
```ts
await ptyHandle.sendInput('ls -la\n');
await ptyHandle.sendInput(new Uint8Array([3])); // Ctrl+C
```

**resize(cols: number, rows: number)**: Resize terminal dimensions, notifies terminal apps via SIGWINCH signal. Returns Promise<PtySessionInfo>.
```ts
await ptyHandle.resize(120, 30);
```

**wait()**: Wait for PTY process to exit and return result (Promise<PtyResult> with exitCode and error).
```ts
const result = await ptyHandle.wait();
if (result.exitCode === 0) {
  console.log('Process completed successfully');
} else {
  console.log(`Process failed with code: ${result.exitCode}`);
  if (result.error) console.log(`Error: ${result.error}`);
}
```

**kill()**: Forcefully terminate PTY session and process (irreversible). Throws if kill fails.
```ts
await ptyHandle.kill();
const result = await ptyHandle.wait();
console.log(`Process terminated with exit code: ${result.exitCode}`);
```

**disconnect()**: Disconnect from PTY session and clean up resources. Closes WebSocket connection.
```ts
try {
  // ... use PTY session
} finally {
  await ptyHandle.disconnect();
}
```

## Complete Example

```ts
const ptyHandle = await process.createPty({
  id: 'my-session',
  cols: 120,
  rows: 30,
  onData: (data) => {
    const text = new TextDecoder().decode(data);
    process.stdout.write(text);
  },
});

await ptyHandle.sendInput('ls -la\n');
await ptyHandle.sendInput('exit\n');

const result = await ptyHandle.wait();
console.log(`PTY exited with code: ${result.exitCode}`);

await ptyHandle.disconnect();
```