## CodeRunParams

Parameters for code execution with optional command line arguments and environment variables.

```ts
new CodeRunParams(): CodeRunParams
```

## Process

Handles process and code execution within a Sandbox.

### Constructor

```ts
new Process(
   clientConfig: Configuration, 
   codeToolbox: SandboxCodeToolbox, 
   apiClient: ProcessApi, 
   getPreviewToken: () => Promise<string>, 
   ensureToolboxUrl: () => Promise<void>): Process
```

### codeRun()

Executes code in the Sandbox using the appropriate language runtime.

```ts
codeRun(code: string, params?: CodeRunParams, timeout?: number): Promise<ExecuteResponse>
```

Returns `ExecuteResponse` with `exitCode`, `result` (stdout), and `artifacts` (stdout + matplotlib charts metadata).

```ts
// TypeScript
const response = await process.codeRun(`
  const x = 10, y = 20;
  console.log(\`Sum: \${x + y}\`);
`);
console.log(response.artifacts.stdout);  // Sum: 30

// Python with matplotlib
const response = await process.codeRun(`
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 30)
y = np.sin(x)

plt.figure(figsize=(8, 5))
plt.plot(x, y, 'b-', linewidth=2)
plt.title('Line Chart')
plt.xlabel('X-axis (seconds)')
plt.ylabel('Y-axis (amplitude)')
plt.grid(True)
plt.show()
`);

if (response.artifacts?.charts) {
  const chart = response.artifacts.charts[0];
  console.log(\`Type: \${chart.type}, Title: \${chart.title}\`);
  if (chart.type === ChartType.LINE) {
    const lineChart = chart as LineChart;
    console.log('X Label:', lineChart.x_label);
    console.log('Y Label:', lineChart.y_label);
    console.log('X Ticks:', lineChart.x_ticks);
    console.log('Y Ticks:', lineChart.y_ticks);
    console.log('X Tick Labels:', lineChart.x_tick_labels);
    console.log('Y Tick Labels:', lineChart.y_tick_labels);
    console.log('X Scale:', lineChart.x_scale);
    console.log('Y Scale:', lineChart.y_scale);
    console.dir(lineChart.elements, { depth: null });
  }
}
```

### executeCommand()

Executes a shell command in the Sandbox.

```ts
executeCommand(command: string, cwd?: string, env?: Record<string, string>, timeout?: number): Promise<ExecuteResponse>
```

Returns `ExecuteResponse` with `exitCode`, `result` (stdout), and `artifacts`.

```ts
const response = await process.executeCommand('echo "Hello"');
console.log(response.artifacts.stdout);  // Hello

const result = await process.executeCommand('ls', 'workspace/src');
const result = await process.executeCommand('sleep 10', undefined, undefined, 5);  // 5s timeout
```

### Sessions

Long-running background sessions maintain state between commands.

```ts
createSession(sessionId: string): Promise<void>
deleteSession(sessionId: string): Promise<void>
getSession(sessionId: string): Promise<Session>
listSessions(): Promise<Session[]>
```

```ts
const sessionId = 'my-session';
await process.createSession(sessionId);
const session = await process.getSession(sessionId);
// ... do work ...
await process.deleteSession(sessionId);

const sessions = await process.listSessions();
sessions.forEach(session => {
  console.log(\`Session \${session.sessionId}:\`);
  session.commands.forEach(cmd => {
    console.log(\`- \${cmd.command} (exit: \${cmd.exitCode})\`);
  });
});
```

### executeSessionCommand()

Executes a command in an existing session, maintaining state.

```ts
executeSessionCommand(sessionId: string, req: SessionExecuteRequest, timeout?: number): Promise<SessionExecuteResponse>
```

`SessionExecuteRequest` contains: `command`, `runAsync`, `suppressInputEcho` (default false).

Returns `SessionExecuteResponse` with `cmdId`, `output`, `stdout`, `stderr`, `exitCode` (if synchronous).

```ts
const sessionId = 'my-session';
await process.executeSessionCommand(sessionId, { command: 'cd /home/daytona' });
const result = await process.executeSessionCommand(sessionId, { command: 'pwd' });
console.log('[STDOUT]:', result.stdout);
console.log('[STDERR]:', result.stderr);
```

### getSessionCommand() and getSessionCommandLogs()

```ts
getSessionCommand(sessionId: string, commandId: string): Promise<Command>
getSessionCommandLogs(sessionId: string, commandId: string): Promise<SessionCommandLogsResponse>
getSessionCommandLogs(sessionId: string, commandId: string, onStdout: (chunk: string) => void, onStderr: (chunk: string) => void): Promise<void>
sendSessionCommandInput(sessionId: string, commandId: string, data: string): Promise<void>
```

```ts
const cmd = await process.getSessionCommand('my-session', 'cmd-123');
if (cmd.exitCode === 0) console.log(\`Command \${cmd.command} succeeded\`);

const logs = await process.getSessionCommandLogs('my-session', 'cmd-123');
console.log('[STDOUT]:', logs.stdout);
console.log('[STDERR]:', logs.stderr);

await process.getSessionCommandLogs('my-session', 'cmd-123', 
  (chunk) => console.log('[STDOUT]:', chunk),
  (chunk) => console.log('[STDERR]:', chunk)
);

await process.sendSessionCommandInput('my-session', 'cmd-123', 'input data');
```

### PTY (Pseudo-Terminal) Sessions

Interactive terminal sessions supporting command history and real terminal features.

```ts
createPty(options?: PtyCreateOptions & PtyConnectOptions): Promise<PtyHandle>
connectPty(sessionId: string, options?: PtyConnectOptions): Promise<PtyHandle>
getPtySessionInfo(sessionId: string): Promise<PtySessionInfo>
listPtySessions(): Promise<PtySessionInfo[]>
killPtySession(sessionId: string): Promise<void>
resizePtySession(sessionId: string, cols: number, rows: number): Promise<PtySessionInfo>
```

```ts
// Create PTY
const ptyHandle = await process.createPty({
  id: 'my-interactive-session',
  cwd: '/workspace',
  envs: { TERM: 'xterm-256color', LANG: 'en_US.UTF-8' },
  cols: 120,
  rows: 30,
  onData: (data) => {
    const text = new TextDecoder().decode(data);
    process.stdout.write(text);
  },
});

await ptyHandle.waitForConnection();
await ptyHandle.sendInput('ls -la\n');
await ptyHandle.sendInput('echo "Hello, PTY!"\n');
await ptyHandle.sendInput('exit\n');
const result = await ptyHandle.wait();
console.log(\`PTY exited with code: \${result.exitCode}\`);
await ptyHandle.disconnect();

// Connect to existing PTY
const handle = await process.connectPty('my-session', {
  onData: (data) => {
    const text = new TextDecoder().decode(data);
    process.stdout.write(text);
  },
});
await handle.waitForConnection();
await handle.sendInput('pwd\n');
const result = await handle.wait();
console.log(\`Session exited with code: \${result.exitCode}\`);
await handle.disconnect();

// Get PTY info
const session = await process.getPtySessionInfo('my-session');
console.log(\`Session ID: \${session.id}, Active: \${session.active}, CWD: \${session.cwd}, Size: \${session.cols}x\${session.rows}\`);
if (session.processId) console.log(\`PID: \${session.processId}\`);

// List all PTY sessions
const sessions = await process.listPtySessions();
sessions.forEach(session => {
  console.log(\`\${session.id}: active=\${session.active}, created=\${session.createdAt}\`);
});

// Kill PTY session
await process.killPtySession('my-session');

// Resize PTY
const updatedInfo = await process.resizePtySession('my-session', 150, 40);
console.log(\`Resized to \${updatedInfo.cols}x\${updatedInfo.rows}\`);
```

## Constants

- `MAX_PREFIX_LEN: number`
- `STDERR_PREFIX_BYTES: Uint8Array<ArrayBuffer>`
- `STDOUT_PREFIX_BYTES: Uint8Array<ArrayBuffer>`

## SessionCommandLogsResponse

Properties: `output?`, `stderr?`, `stdout?`

## SessionExecuteResponse

Extends with properties: `cmdId`, `exitCode?`, `output?`, `stderr?`, `stdout?`