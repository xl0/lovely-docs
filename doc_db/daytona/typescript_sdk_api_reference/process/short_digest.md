## Process API

Execute code and shell commands in sandbox with `codeRun()` and `executeCommand()`, returning `ExecuteResponse` with exit code, stdout, and matplotlib charts.

**Sessions** maintain state between commands: `createSession()`, `executeSessionCommand()`, `getSessionCommand()`, `getSessionCommandLogs()`, `listSessions()`.

**PTY sessions** provide interactive terminals: `createPty()`, `connectPty()`, `getPtySessionInfo()`, `listPtySessions()`, `killPtySession()`, `resizePtySession()`.

```ts
// Code execution
const response = await process.codeRun('console.log("Hello")');
console.log(response.artifacts.stdout);

// Shell command
const result = await process.executeCommand('ls -la', '/workspace');

// Session with state
await process.createSession('my-session');
await process.executeSessionCommand('my-session', { command: 'cd /home' });
const logs = await process.getSessionCommandLogs('my-session', 'cmd-id');

// Interactive PTY
const pty = await process.createPty({ id: 'term', cols: 120, rows: 30 });
await pty.sendInput('ls\n');
await pty.disconnect();
```