## Complete TypeScript SDK API Reference

### Installation & Setup
```bash
npm install @daytonaio/sdk
```

Configure via environment variables (`DAYTONA_API_KEY`, `DAYTONA_API_URL`, `DAYTONA_TARGET`) or constructor:
```ts
const daytona = new Daytona({ apiKey: 'key', apiUrl: 'https://...', target: 'us' })
```

Supports Node.js, browsers, and serverless (Cloudflare Workers, AWS Lambda, Azure Functions) with polyfill setup for Vite/Next.js.

### Core Client: Daytona

Main entry point for sandbox lifecycle and resource management.

**Sandbox CRUD:**
- `create(params, options)` - From snapshot or image with resource allocation, environment variables, auto-lifecycle settings
- `get(idOrName)` - Retrieve by ID or name
- `findOne(filter)` - Find by ID, name, or labels
- `list(labels, page, limit)` - Paginated list with label filtering
- `start(sandbox, timeout)` - Start and wait for ready
- `stop(sandbox)` - Stop sandbox
- `delete(sandbox, timeout)` - Delete sandbox

**Services:**
- `snapshot` - SnapshotService for managing pre-configured sandboxes
- `volume` - VolumeService for managing shared storage volumes

### Sandbox: Isolated Execution Environment

Represents a running or stopped sandbox with full lifecycle and operation interfaces.

**Properties:** `id`, `name`, `state`, `cpu`, `memory`, `disk`, `gpu`, `env`, `labels`, `autoStopInterval`, `autoArchiveInterval`, `autoDeleteInterval`, `public`, `networkBlockAll`, `networkAllowList`

**Lifecycle:**
```ts
await sandbox.start(timeout)
await sandbox.stop(timeout)
await sandbox.archive()
await sandbox.delete(timeout)
await sandbox.recover(timeout)
await sandbox.waitUntilStarted(timeout)
await sandbox.waitUntilStopped(timeout)
```

**Resources:**
```ts
await sandbox.resize({ cpu, memory, disk }, timeout)  // Hot resize: CPU/memory only when running
```

**Activity & Configuration:**
```ts
await sandbox.refreshActivity()  // Reset auto-stop timer
await sandbox.refreshData()      // Refresh from API
await sandbox.setLabels({ key, value })
await sandbox.setAutostopInterval(minutes)
await sandbox.setAutoArchiveInterval(minutes)
await sandbox.setAutoDeleteInterval(minutes)
```

**Access:**
```ts
const preview = await sandbox.getPreviewLink(port)  // Returns { url, token }
const signed = await sandbox.getSignedPreviewUrl(port, expiresInSeconds)
await sandbox.expireSignedPreviewUrl(port, token)
const ssh = await sandbox.createSshAccess(expiresInMinutes)  // Returns token
await sandbox.validateSshAccess(token)
await sandbox.revokeSshAccess(token)
```

**Interfaces:**
- `codeInterpreter` - Stateful Python code execution with isolated contexts
- `computerUse` - Desktop automation (keyboard, mouse, screenshots, recording)
- `fs` - File system operations
- `git` - Git operations
- `process` - Process execution and PTY sessions
- `createLspServer(languageId, pathToProject)` - Language Server Protocol for code intelligence

### Process: Code & Command Execution

Execute code and shell commands with streaming output and session support.

**Immediate Execution:**
```ts
const response = await process.codeRun(`console.log('Hello')`, params, timeout)
const response = await process.executeCommand('echo "Hello"', cwd, env, timeout)
// Returns: { exitCode, result (stdout), artifacts { stdout, charts[] } }
```

**Sessions (Stateful):**
```ts
await process.createSession(sessionId)
await process.executeSessionCommand(sessionId, { command, runAsync, suppressInputEcho }, timeout)
// Returns: { cmdId, output, stdout, stderr, exitCode? }
const cmd = await process.getSessionCommand(sessionId, commandId)
const logs = await process.getSessionCommandLogs(sessionId, commandId)
await process.getSessionCommandLogs(sessionId, commandId, onStdout, onStderr)  // Streaming
await process.sendSessionCommandInput(sessionId, commandId, data)
await process.deleteSession(sessionId)
const sessions = await process.listSessions()
```

**PTY (Interactive Terminal):**
```ts
const ptyHandle = await process.createPty({
  id, cols, rows, cwd, envs,
  onData: (data: Uint8Array) => {}
})
await ptyHandle.waitForConnection()
await ptyHandle.sendInput('command\n')
await ptyHandle.resize(cols, rows)
const result = await ptyHandle.wait()  // { exitCode, error? }
await ptyHandle.kill()
await ptyHandle.disconnect()

// Connect to existing PTY
const handle = await process.connectPty(sessionId, { onData })
const session = await process.getPtySessionInfo(sessionId)
const sessions = await process.listPtySessions()
await process.killPtySession(sessionId)
await process.resizePtySession(sessionId, cols, rows)
```

### CodeInterpreter: Stateful Python Execution

Isolated Python contexts with streaming callbacks.

```ts
const ctx = await codeInterpreter.createContext(cwd)
const contexts = await codeInterpreter.listContexts()
await codeInterpreter.deleteContext(ctx)

const result = await codeInterpreter.runCode(code, {
  context,
  envs: { VAR: 'value' },
  timeout: 10,  // seconds, 0 = no timeout, default 10 minutes
  onStdout: (msg) => {},
  onStderr: (msg) => {},
  onError: (err) => {}
})
// Returns: { stdout, stderr, error? { name, value, traceback? } }
```

### FileSystem: File Operations

CRUD, streaming upload/download, search, permissions.

```ts
await fs.createFolder('path', '755')
const files = await fs.listFiles('path')  // FileInfo[]
await fs.deleteFile('path', recursive)
await fs.moveFiles('source', 'destination')
const info = await fs.getFileDetails('path')  // { size, permissions, modTime }
await fs.setFilePermissions('path', { owner, group, mode })

// Upload
await fs.uploadFile(Buffer.from('...') | 'local_path', 'remote_path', timeout)
await fs.uploadFiles([{ source: Buffer | string, destination }, ...], timeout)

// Download
const buffer = await fs.downloadFile('remote_path', timeout)
await fs.downloadFile('remote_path', 'local_path', timeout)  // Streaming
const results = await fs.downloadFiles([{ source, destination? }, ...], timeout)

// Search
const result = await fs.searchFiles('path', '*.ts')  // Glob pattern
const matches = await fs.findFiles('path', 'TODO:')  // Text search
const results = await fs.replaceInFiles(['file1', 'file2'], pattern, newValue)
```

### Git: Repository Operations

Clone, branch management, commit, push/pull with optional authentication.

```ts
await git.clone(url, path, branch, commitId, username, password)
await git.add('repo_path', ['file.txt'] | ['.'])
await git.commit('repo_path', message, author, email, allowEmpty)
// Returns: { sha }
await git.push('repo_path', username, password)
await git.pull('repo_path', username, password)

await git.createBranch('repo_path', name)
await git.checkoutBranch('repo_path', branch)
await git.deleteBranch('repo_path', name)
const response = await git.branches('repo_path')  // { branches }

const status = await git.status('repo_path')
// Returns: { currentBranch, ahead, behind, branchPublished, fileStatus[] }
```

### ComputerUse: Desktop Automation

Keyboard, mouse, screenshots, display info, window management, screen recording.

**Lifecycle:**
```ts
await sandbox.computerUse.start()
await sandbox.computerUse.stop()
const status = await sandbox.computerUse.getStatus()
await sandbox.computerUse.restartProcess('xfce4')
const logs = await sandbox.computerUse.getProcessLogs('novnc')
```

**Keyboard:**
```ts
await computerUse.keyboard.type('text', delayMs)
await computerUse.keyboard.press('Return')
await computerUse.keyboard.press('c', ['ctrl'])
await computerUse.keyboard.hotkey('ctrl+c')
```

**Mouse:**
```ts
await computerUse.mouse.click(x, y, button, doubleClick)
const pos = await computerUse.mouse.getPosition()
await computerUse.mouse.move(x, y)
await computerUse.mouse.drag(x1, y1, x2, y2)
await computerUse.mouse.scroll(x, y, direction, amount)
```

**Screenshots:**
```ts
const screenshot = await computerUse.screenshot.takeFullScreen(showCursor)
const region = await computerUse.screenshot.takeRegion({ x, y, width, height })
const compressed = await computerUse.screenshot.takeCompressed({ format, quality, showCursor })
const regionCompressed = await computerUse.screenshot.takeCompressedRegion(region, { format, quality, scale })
// Returns: { width, height, size_bytes, base64 image data }
```

**Display & Windows:**
```ts
const info = await computerUse.display.getInfo()  // { primary_display, total_displays, displays[] }
const windows = await computerUse.display.getWindows()  // { count, windows[] }
```

**Recording:**
```ts
const recording = await computerUse.recording.start('name')
const stopped = await computerUse.recording.stop(recordingId)  // { id, fileName, filePath, status, durationSeconds }
const recordings = await computerUse.recording.list()
const details = await computerUse.recording.get(recordingId)
await computerUse.recording.download(recordingId, 'local_path')
await computerUse.recording.delete(recordingId)
```

### Image: Dynamic Sandbox Image Building

Define custom sandbox images with factory methods and chainable configuration.

```ts
const image = Image.base('python:3.12-slim-bookworm')
  .workdir('/home/daytona')
  .env({ FOO: 'bar' })
  .runCommands('echo "Hello"', ['bash', '-c', 'echo again'])
  .pipInstall('numpy', { indexUrl: 'https://...', findLinks: [...], pre: true })
  .pipInstallFromRequirements('requirements.txt', options)
  .pipInstallFromPyproject('pyproject.toml', { optionalDependencies: ['dev'] })
  .addLocalDir('src', '/home/daytona/src')
  .addLocalFile('config.json', '/home/daytona/config.json')
  .cmd(['/bin/bash'])
  .entrypoint(['/bin/bash'])
  .dockerfileCommands(['RUN echo "..."'], contextDir)

// Alternatives
const image = Image.debianSlim('3.12')
const image = Image.fromDockerfile('Dockerfile')

// Access
image.dockerfile  // Generated Dockerfile content
image.contextList  // Context files to add
```

### SnapshotService: Pre-configured Sandboxes

Create, retrieve, list, delete, and activate snapshots.

```ts
const snapshot = await daytona.snapshot.create(
  { name, image: Image | string, entrypoint?, resources?, regionId? },
  { onLogs: (chunk) => {}, timeout }
)
const snapshot = await daytona.snapshot.get(name)
const result = await daytona.snapshot.list(page, limit)  // { items, page, total, totalPages }
await daytona.snapshot.delete(snapshot)
await daytona.snapshot.activate(snapshot)
```

### VolumeService: Shared Storage

Create, retrieve, list, delete volumes. Mount to sandboxes with optional S3 subpath.

```ts
const volume = await daytona.volume.create(name)
const volume = await daytona.volume.get(name, create)
const volumes = await daytona.volume.list()
await daytona.volume.delete(volume)

// Mount in sandbox creation
await daytona.create({
  volumes: [{ volumeId, mountPath, subpath? }]
})
```

### LspServer: Language Server Protocol

Code completion, symbol search, file lifecycle for IDE-like features.

```ts
const lsp = await sandbox.createLspServer('typescript', 'workspace/project')
await lsp.start()
await lsp.didOpen('src/index.ts')

const completions = await lsp.completions('src/index.ts', { line, character })
// Returns: { isIncomplete, items[] { label, kind, detail, documentation, sortText, filterText, insertText } }

const symbols = await lsp.documentSymbols('src/index.ts')  // LspSymbol[]
const symbols = await lsp.sandboxSymbols('MyClass')  // Search entire sandbox

await lsp.didClose('src/index.ts')
await lsp.stop()
```

### Charts: Matplotlib Parsing

Parse matplotlib charts into typed objects with metadata.

```ts
type Chart = { elements, png?, title, type: ChartType }
type Chart2D = Chart & { x_label?, y_label? }
type BarChart = Chart2D & { elements: BarData[], type: BAR }
type PieChart = Chart & { elements: PieData[], type: PIE }
type LineChart = PointChart & { type: LINE }
type ScatterChart = PointChart & { type: SCATTER }
type BoxAndWhiskerChart = Chart2D & { elements: BoxAndWhiskerData[], type: BOX_AND_WHISKER }
type CompositeChart = Chart & { elements: Chart[], type: COMPOSITE_CHART }

const chart = parseChart(data)
```

### Error Handling

Four error classes with optional HTTP context:

```ts
class DaytonaError extends Error { statusCode?, headers? }
class DaytonaNotFoundError extends DaytonaError
class DaytonaRateLimitError extends DaytonaError
class DaytonaTimeoutError extends DaytonaError
```

### ObjectStorage

Upload files/directories to object storage.

```ts
const storage = new ObjectStorage({
  accessKeyId, secretAccessKey, endpointUrl,
  bucketName?, sessionToken?
})
const hash = await storage.upload(path, organizationId, archiveBasePath)
```