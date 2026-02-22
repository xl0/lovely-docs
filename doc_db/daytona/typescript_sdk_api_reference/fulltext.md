

## Pages

### charts
TypeScript types for matplotlib chart parsing: ChartType enum, parseChart() function, and type definitions for Bar, Pie, Line, Scatter, Box-and-Whisker, and Composite charts with metadata.

## ChartType Enum

Defines chart types: `BAR`, `LINE`, `PIE`, `SCATTER`, `UNKNOWN`

## parseChart()

```ts
function parseChart(data: any): Chart
```

Parses raw data into a Chart object.

## Base Types

### Chart
```ts
type Chart = {
  elements: any[];
  png?: string;
  title: string;
  type: ChartType;
};
```
Base chart type with metadata. PNG is base64-encoded.

### Chart2D
Extends Chart with axis labels:
```ts
type Chart2D = Chart & {
  x_label?: string;
  y_label?: string;
};
```

## Bar Chart

```ts
type BarChart = Chart2D & {
  elements: BarData[];
  type: BAR;
};

type BarData = {
  group: string;
  label: string;
  value: string;
};
```

## Box and Whisker Chart

```ts
type BoxAndWhiskerChart = Chart2D & {
  elements: BoxAndWhiskerData[];
  type: BOX_AND_WHISKER;
};

type BoxAndWhiskerData = {
  first_quartile: number;
  label: string;
  max: number;
  median: number;
  min: number;
  outliers: number[];
};
```

## Pie Chart

```ts
type PieChart = Chart & {
  elements: PieData[];
  type: PIE;
};

type PieData = {
  angle: number;
  label: string;
  radius: number;
};
```

## Point-Based Charts

### PointChart (base for Line and Scatter)
```ts
type PointChart = Chart2D & {
  elements: PointData[];
  x_scale: string;
  x_tick_labels: string[];
  x_ticks: (number | string)[];
  y_scale: string;
  y_tick_labels: string[];
  y_ticks: (number | string)[];
};

type PointData = {
  label: string;
  points: [number | string, number | string][];
};
```

### LineChart
```ts
type LineChart = PointChart & {
  type: LINE;
};
```

### ScatterChart
```ts
type ScatterChart = PointChart & {
  type: SCATTER;
};
```

## Composite Chart

```ts
type CompositeChart = Chart & {
  elements: Chart[];
  type: COMPOSITE_CHART;
};
```

Allows nesting multiple charts together.

### code-interpreter
Python code interpreter for sandbox with isolated contexts, streaming callbacks, and error handling.

## CodeInterpreter

Handles Python code interpretation and execution within a Sandbox. Provides methods to execute code in isolated interpreter contexts, manage contexts, and stream execution output via callbacks.

For other languages, use the `codeRun` method from the `Process` interface or execute commands directly in the sandbox terminal.

### Creating and Managing Contexts

```ts
// Create a new isolated context
const ctx = await sandbox.codeInterpreter.createContext(cwd?: string)

// List all user-created contexts (excludes default)
const contexts = await sandbox.codeInterpreter.listContexts()

// Delete a context and shut down its worker
await sandbox.codeInterpreter.deleteContext(ctx)
```

### Running Code

```ts
const result = await codeInterpreter.runCode(code: string, options: RunCodeOptions)
```

Returns `ExecutionResult` with `stdout`, `stderr`, and optional `error`.

**RunCodeOptions:**
- `context?` - InterpreterContext to run in (uses default if omitted)
- `envs?` - Record<string, string> of environment variables
- `timeout?` - Timeout in seconds (default 10 minutes, 0 = no timeout)
- `onStdout(message: OutputMessage)?` - Callback for stdout
- `onStderr(message: OutputMessage)?` - Callback for stderr
- `onError(error: ExecutionError)?` - Callback for runtime exceptions

### Example: Streaming Output with Callbacks

```ts
const code = `
import sys
import time
for i in range(5):
    print(i)
    time.sleep(1)
sys.stderr.write("Done!")
`

const result = await codeInterpreter.runCode(code, {
  context: ctx,
  timeout: 10,
  onStdout: (msg) => process.stdout.write(`STDOUT: ${msg.output}`),
  onStderr: (msg) => process.stdout.write(`STDERR: ${msg.output}`),
  onError: (err) => console.error(`${err.name}: ${err.value}\n${err.traceback ?? ''}`)
})
```

### Error Handling

`ExecutionError` contains:
- `name` - Error type (e.g., "ValueError", "SyntaxError")
- `value` - Error message
- `traceback?` - Full traceback if available

`ExecutionResult` contains:
- `stdout` - Standard output
- `stderr` - Standard error
- `error?` - ExecutionError if one occurred

### computer-use
ComputerUse API for desktop automation: keyboard (type, press, hotkey), mouse (click, drag, scroll, move), screenshots (full/region, compressed), display info, window management, and screen recording with process lifecycle control.

## ComputerUse

Main interface providing access to desktop automation through mouse, keyboard, screenshot, display, and recording operations.

**Properties**: `display`, `keyboard`, `mouse`, `recording`, `screenshot`

### Lifecycle Methods

```typescript
await sandbox.computerUse.start();  // Start all processes (Xvfb, xfce4, x11vnc, novnc)
await sandbox.computerUse.stop();   // Stop all processes
```

### Process Management

```typescript
const status = await sandbox.computerUse.getStatus();
const processStatus = await sandbox.computerUse.getProcessStatus('xvfb');
const logs = await sandbox.computerUse.getProcessLogs('novnc');
const errors = await sandbox.computerUse.getProcessErrors('x11vnc');
await sandbox.computerUse.restartProcess('xfce4');
```

## Keyboard

```typescript
await sandbox.computerUse.keyboard.type('Hello, World!', 100); // with delay
await sandbox.computerUse.keyboard.press('Return');
await sandbox.computerUse.keyboard.press('c', ['ctrl']);
await sandbox.computerUse.keyboard.press('t', ['ctrl', 'shift']);
await sandbox.computerUse.keyboard.hotkey('ctrl+c');
await sandbox.computerUse.keyboard.hotkey('alt+tab');
```

## Mouse

```typescript
const result = await sandbox.computerUse.mouse.click(100, 200);
await sandbox.computerUse.mouse.click(100, 200, 'left', true);  // double-click
await sandbox.computerUse.mouse.click(100, 200, 'right');       // right-click

const position = await sandbox.computerUse.mouse.getPosition();
await sandbox.computerUse.mouse.move(100, 200);
await sandbox.computerUse.mouse.drag(50, 50, 150, 150);
await sandbox.computerUse.mouse.scroll(100, 200, 'down', 5);
```

## Screenshot

```typescript
const screenshot = await sandbox.computerUse.screenshot.takeFullScreen();
const withCursor = await sandbox.computerUse.screenshot.takeFullScreen(true);

const region = { x: 100, y: 100, width: 300, height: 200 };
const regionShot = await sandbox.computerUse.screenshot.takeRegion(region);

// Compressed versions
const compressed = await sandbox.computerUse.screenshot.takeCompressed({
  format: 'jpeg',
  quality: 95,
  showCursor: true
});

const regionCompressed = await sandbox.computerUse.screenshot.takeCompressedRegion(region, {
  format: 'webp',
  quality: 80,
  scale: 0.5
});
```

Returns `ScreenshotResponse` with `width`, `height`, `size_bytes`, and base64 encoded image data.

## Display

```typescript
const info = await sandbox.computerUse.display.getInfo();
// Returns: primary_display, total_displays, displays array with width/height/x/y

const windows = await sandbox.computerUse.display.getWindows();
// Returns: count, windows array with id and title
```

## RecordingService

```typescript
const recording = await sandbox.computerUse.recording.start('my-test-recording');
const stopped = await sandbox.computerUse.recording.stop(recording.id);
// Returns: id, fileName, filePath, status, durationSeconds

const recordings = await sandbox.computerUse.recording.list();
const details = await sandbox.computerUse.recording.get(recordingId);
await sandbox.computerUse.recording.download(recordingId, 'local_recording.mp4');
await sandbox.computerUse.recording.delete(recordingId);
```

### daytona_client
Main Daytona API client for creating/managing Sandboxes with methods for CRUD operations, resource allocation, environment configuration, and auto-lifecycle management.

## Daytona

Main class for interacting with the Daytona API. Provides methods for creating, managing, and interacting with Daytona Sandboxes.

**Properties:**
- `snapshot` - SnapshotService for managing Daytona Snapshots
- `volume` - VolumeService for managing Daytona Volumes

**Initialization:**

```ts
// Environment variables: DAYTONA_API_KEY, DAYTONA_API_URL, DAYTONA_TARGET
const daytona = new Daytona();

// Explicit configuration
const daytona = new Daytona({
  apiKey: "your-api-key",
  apiUrl: "https://your-api.com",
  target: "us"
});

// With OpenTelemetry and async disposal
await using daytona = new Daytona({ otelEnabled: true });
```

**Methods:**

### create()

Creates Sandboxes from snapshot or image with optional parameters.

```ts
// From default snapshot
const sandbox = await daytona.create();

// From custom snapshot
const sandbox = await daytona.create({
  language: 'typescript',
  snapshot: 'my-snapshot-id',
  envVars: { NODE_ENV: 'development', DEBUG: 'true' },
  autoStopInterval: 60,
  autoArchiveInterval: 60,
  autoDeleteInterval: 120
}, { timeout: 100 });

// From image (creates snapshot automatically)
const sandbox = await daytona.create(
  { image: 'debian:12.9' },
  { timeout: 90, onSnapshotCreateLogs: console.log }
);

// From custom image with resources
const image = Image.base('alpine:3.18').pipInstall('numpy');
const sandbox = await daytona.create({
  language: 'typescript',
  image,
  envVars: { NODE_ENV: 'development' },
  resources: { cpu: 2, memory: 4 },
  autoStopInterval: 60,
  autoArchiveInterval: 60,
  autoDeleteInterval: 120
}, { timeout: 100, onSnapshotCreateLogs: console.log });
```

Parameters: `CreateSandboxFromSnapshotParams` or `CreateSandboxFromImageParams`, options with `timeout` (seconds, default 60, 0 = no timeout) and `onSnapshotCreateLogs` callback.

Returns: `Promise<Sandbox>`

### get()

```ts
const sandbox = await daytona.get('my-sandbox-id-or-name');
console.log(`Sandbox state: ${sandbox.state}`);
```

Gets a Sandbox by ID or name. Returns: `Promise<Sandbox>`

### findOne()

```ts
const sandbox = await daytona.findOne({ labels: { 'my-label': 'my-value' } });
console.log(`Sandbox ID: ${sandbox.id}, State: ${sandbox.state}`);
```

Finds a Sandbox by ID, name, or labels. Returns: `Promise<Sandbox>`

### list()

```ts
const result = await daytona.list({ 'my-label': 'my-value' }, 2, 10);
for (const sandbox of result.items) {
  console.log(`${sandbox.id}: ${sandbox.state}`);
}
```

Returns paginated list of Sandboxes filtered by labels. Parameters: `labels?`, `page?` (starting from 1), `limit?`. Returns: `Promise<PaginatedSandboxes>`

### start()

```ts
const sandbox = await daytona.get('my-sandbox-id');
await daytona.start(sandbox, 60);
```

Starts a Sandbox and waits for it to be ready. Parameters: `sandbox`, `timeout?` (seconds, 0 = no timeout). Returns: `Promise<void>`

### stop()

```ts
await daytona.stop(sandbox);
```

Stops a Sandbox. Returns: `Promise<void>`

### delete()

```ts
const sandbox = await daytona.get('my-sandbox-id');
await daytona.delete(sandbox);
```

Deletes a Sandbox. Parameters: `sandbox`, `timeout` (default 60 seconds). Returns: `Promise<void>`

### getProxyToolboxUrl()

```ts
const url = await daytona.getProxyToolboxUrl(sandboxId, regionId);
```

Returns: `Promise<string>`

## CodeLanguage

Enum for supported programming languages: `JAVASCRIPT`, `PYTHON` (default), `TYPESCRIPT`

## CreateSandboxBaseParams

Base parameters for sandbox creation:
- `language?` - Programming language (defaults to "python")
- `name?` - Sandbox name
- `labels?` - Record of labels
- `envVars?` - Environment variables
- `volumes?` - Array of VolumeMount
- `user?` - OS user for sandbox
- `autoStopInterval?` - Minutes (0 = disabled, default 15)
- `autoArchiveInterval?` - Minutes (0 = max interval, default 7 days)
- `autoDeleteInterval?` - Minutes (negative = disabled, 0 = delete on stop, default disabled)
- `ephemeral?` - If true, autoDeleteInterval set to 0
- `networkBlockAll?` - Block all network access
- `networkAllowList?` - Comma-separated CIDR addresses
- `public?` - Port preview public

## CreateSandboxFromImageParams

Extends CreateSandboxBaseParams:
- `image` - Docker image string or Image object (dynamically built if Image object)
- `resources?` - Resource allocation (cpu cores, memory GiB, disk GiB, gpu units)

## CreateSandboxFromSnapshotParams

Extends CreateSandboxBaseParams:
- `snapshot?` - Snapshot name to use

## DaytonaConfig

Configuration for Daytona client:
- `apiKey?` - API key for authentication
- `jwtToken?` - JWT token (requires `organizationId`)
- `organizationId?` - Organization ID for JWT auth
- `apiUrl?` - API URL (defaults to 'https://app.daytona.io/api')
- `target?` - Target location for Sandboxes
- `_experimental?` - Experimental features config

## Resources

Resource allocation:
- `cpu?` - CPU cores
- `memory?` - Memory in GiB
- `disk?` - Disk in GiB
- `gpu?` - GPU units

## SandboxFilter

Filter for finding Sandboxes:
- `idOrName?` - Sandbox ID or name
- `labels?` - Labels to filter by

## VolumeMount

Volume mount for Sandbox:
- `volumeId` - ID of Volume to mount
- `mountPath` - Path on Sandbox to mount
- `subpath?` - Optional S3 prefix within volume

### errors
Four error classes (DaytonaError base + NotFoundError, RateLimitError, TimeoutError) with optional statusCode and AxiosHeaders properties.

## Error Hierarchy

Base error class for Daytona SDK with HTTP context support.

### DaytonaError

Base error class for all Daytona SDK errors.

**Properties:**
- `statusCode?: number` - HTTP status code if available
- `headers?: AxiosHeaders` - Response headers if available

**Constructor:**
```ts
new DaytonaError(message: string, statusCode?: number, headers?: AxiosHeaders)
```

### DaytonaNotFoundError

Extends `DaytonaError`. Thrown for not found (404) scenarios.

**Constructor:**
```ts
new DaytonaNotFoundError(message: string, statusCode?: number, headers?: AxiosHeaders)
```

### DaytonaRateLimitError

Extends `DaytonaError`. Thrown when rate limit is exceeded.

**Constructor:**
```ts
new DaytonaRateLimitError(message: string, statusCode?: number, headers?: AxiosHeaders)
```

### DaytonaTimeoutError

Extends `DaytonaError`. Thrown when a timeout occurs.

**Constructor:**
```ts
new DaytonaTimeoutError(message: string, statusCode?: number, headers?: AxiosHeaders)
```

All error classes inherit `statusCode` and `headers` properties from the base `DaytonaError` class.

### execute-response
ExecuteResponse contains exitCode, result output, and optional ExecutionArtifacts (charts from matplotlib, stdout)

## ExecuteResponse

Response object returned from command execution.

**Properties**:
- `artifacts?` _ExecutionArtifacts_ - Optional artifacts generated during execution
- `exitCode` _number_ - Exit code from the executed command
- `result` _string_ - Command output as string

## ExecutionArtifacts

Container for artifacts produced by command execution.

**Properties**:
- `charts?` _Chart[]_ - Optional list of chart metadata from matplotlib
- `stdout` _string_ - Standard output from command (same as `result` in ExecuteResponse)

### file-system
FileSystem API for Sandbox: directory/file CRUD, streaming upload/download (single/batch), search by name/content, text replacement, permission management.

## FileSystem

Provides file system operations within a Sandbox.

### Constructor

```ts
new FileSystem(clientConfig: Configuration, apiClient: FileSystemApi, ensureToolboxUrl: () => Promise<void>)
```

### Methods

#### Directory Operations

**createFolder(path, mode)**
Create a directory with octal permissions.
```ts
await fs.createFolder('app/data', '755');
```

**listFiles(path)**
List directory contents, returns array of FileInfo objects with name, size, etc.
```ts
const files = await fs.listFiles('app/src');
files.forEach(f => console.log(`${f.name} (${f.size} bytes)`));
```

#### File Operations

**deleteFile(path, recursive?)**
Delete file or directory. Set `recursive: true` for directories.
```ts
await fs.deleteFile('app/temp.log');
```

**moveFiles(source, destination)**
Move or rename files/directories.
```ts
await fs.moveFiles('app/temp/data.json', 'app/data/data.json');
```

**getFileDetails(path)**
Get file metadata including size, permissions, modification time.
```ts
const info = await fs.getFileDetails('app/config.json');
console.log(`Size: ${info.size}, Modified: ${info.modTime}`);
```

**setFilePermissions(path, permissions)**
Set file permissions, owner, and group.
```ts
await fs.setFilePermissions('app/script.sh', {
  owner: 'daytona',
  group: 'users',
  mode: '755'
});
```

#### Upload Operations

**uploadFile(file, remotePath, timeout?)**
Upload single file from Buffer or local path. Streaming recommended for large files.
```ts
// From buffer
await fs.uploadFile(Buffer.from('{"setting": "value"}'), 'tmp/config.json');
// From local file
await fs.uploadFile('local_file.txt', 'tmp/file.txt');
```

**uploadFiles(files, timeout?)**
Upload multiple files. Each file can be Buffer or local path.
```ts
await fs.uploadFiles([
  { source: Buffer.from('Content 1'), destination: '/tmp/file1.txt' },
  { source: 'app/data/file2.txt', destination: '/tmp/file2.txt' },
  { source: Buffer.from('{"key": "value"}'), destination: '/tmp/config.json' }
]);
```

#### Download Operations

**downloadFile(remotePath, timeout?)**
Download file into memory as Buffer. Not recommended for large files.
```ts
const fileBuffer = await fs.downloadFile('tmp/data.json');
console.log('File content:', fileBuffer.toString());
```

**downloadFile(remotePath, localPath, timeout?)**
Download file with streaming to local path. Recommended for large files.
```ts
await fs.downloadFile('tmp/data.json', 'local_file.json');
```

**downloadFiles(files, timeoutSec?)**
Download multiple files. Returns array of FileDownloadResponse with error handling per file.
```ts
const results = await fs.downloadFiles([
  { source: 'tmp/data.json' },
  { source: 'tmp/config.json', destination: 'local_config.json' }
]);
results.forEach(result => {
  if (result.error) {
    console.error(`Error downloading ${result.source}: ${result.error}`);
  } else if (result.result) {
    console.log(`Downloaded ${result.source} to ${result.result}`);
  }
});
```

#### Search and Replace

**searchFiles(path, pattern)**
Search for files/directories by name pattern (supports globs).
```ts
const result = await fs.searchFiles('app', '*.ts');
result.files.forEach(file => console.log(file));
```

**findFiles(path, pattern)**
Search for text patterns within files.
```ts
const matches = await fs.findFiles('app/src', 'TODO:');
matches.forEach(match => {
  console.log(`${match.file}:${match.line}: ${match.content}`);
});
```

**replaceInFiles(files, pattern, newValue)**
Replace text in multiple files.
```ts
const results = await fs.replaceInFiles(
  ['app/package.json', 'app/version.ts'],
  '"version": "1.0.0"',
  '"version": "1.1.0"'
);
```

### Types

**FileInfo** - File metadata with name, size, permissions, modification time

**FileDownloadRequest** - `{ source: string, destination?: string }`

**FileDownloadResponse** - `{ source: string, result?: string | Buffer, error?: string }`

**FilePermissionsParams** - `{ mode?: string, owner?: string, group?: string }`

**FileUpload** - `{ source: string | Buffer, destination: string }`

**DownloadMetadata** - `{ destination?: string, result?: string | Buffer | Uint8Array, error?: string }`

### Notes

- Relative paths resolve based on sandbox working directory
- Timeout parameters in seconds; 0 means no timeout; default 30 minutes
- Streaming recommended for large files (use local path variants)
- Buffer variants load entire file into memory
- downloadFiles and uploadFiles handle individual file errors gracefully

### git
Git class providing clone, add, commit, push, pull, branch management, and status operations for sandbox repositories with optional authentication.

## Git

Provides Git operations within a Sandbox.

### Constructor

```ts
new Git(apiClient: GitApi): Git
```

### Methods

#### add()

Stages files for the next commit.

```ts
add(path: string, files: string[]): Promise<void>
```

- `path`: Path to Git repository root (relative to sandbox working directory)
- `files`: List of file paths or directories to stage, relative to repository root

```ts
await git.add('workspace/repo', ['file.txt']);
await git.add('workspace/repo', ['.']); // Stage whole repository
```

#### branches()

Lists branches in the repository.

```ts
branches(path: string): Promise<ListBranchResponse>
```

```ts
const response = await git.branches('workspace/repo');
console.log(`Branches: ${response.branches}`);
```

#### checkoutBranch()

Checks out a branch.

```ts
checkoutBranch(path: string, branch: string): Promise<void>
```

```ts
await git.checkoutBranch('workspace/repo', 'new-feature');
```

#### clone()

Clones a Git repository. Supports specific branches, commits, and authentication.

```ts
clone(
  url: string, 
  path: string, 
  branch?: string, 
  commitId?: string, 
  username?: string, 
  password?: string
): Promise<void>
```

```ts
// Default branch
await git.clone('https://github.com/user/repo.git', 'workspace/repo');

// Specific branch with authentication
await git.clone(
  'https://github.com/user/private-repo.git',
  'workspace/private',
  'develop',
  undefined,
  'user',
  'token'
);

// Specific commit (detached HEAD)
await git.clone(
  'https://github.com/user/repo.git',
  'workspace/repo-old',
  undefined,
  'abc123'
);
```

#### commit()

Commits staged changes.

```ts
commit(
  path: string, 
  message: string, 
  author: string, 
  email: string, 
  allowEmpty?: boolean
): Promise<GitCommitResponse>
```

- `allowEmpty`: Allow creating an empty commit when no changes are staged

```ts
await git.add('workspace/repo', ['README.md']);
await git.commit(
  'workspace/repo',
  'Update documentation',
  'John Doe',
  'john@example.com',
  true
);
```

Returns `GitCommitResponse` with `sha` property (commit SHA).

#### createBranch()

Creates a new branch.

```ts
createBranch(path: string, name: string): Promise<void>
```

```ts
await git.createBranch('workspace/repo', 'new-feature');
```

#### deleteBranch()

Deletes a branch.

```ts
deleteBranch(path: string, name: string): Promise<void>
```

```ts
await git.deleteBranch('workspace/repo', 'new-feature');
```

#### pull()

Pulls changes from the remote repository.

```ts
pull(path: string, username?: string, password?: string): Promise<void>
```

```ts
await git.pull('workspace/repo');
await git.pull('workspace/repo', 'user', 'token'); // Private repo
```

#### push()

Pushes local changes to the remote repository.

```ts
push(path: string, username?: string, password?: string): Promise<void>
```

```ts
await git.push('workspace/repo');
await git.push('workspace/repo', 'user', 'token'); // Private repo
```

#### status()

Gets the current status of the Git repository.

```ts
status(path: string): Promise<GitStatus>
```

Returns object with:
- `currentBranch`: Name of the current branch
- `ahead`: Number of commits ahead of remote
- `behind`: Number of commits behind remote
- `branchPublished`: Whether branch is published to remote
- `fileStatus`: List of file statuses

```ts
const status = await git.status('workspace/repo');
console.log(`Current branch: ${status.currentBranch}`);
console.log(`Commits ahead: ${status.ahead}`);
console.log(`Commits behind: ${status.behind}`);
```

### image
Image class for defining sandbox images with factory methods (base, debianSlim, fromDockerfile), chainable configuration (workdir, env, cmd, entrypoint, runCommands, dockerfileCommands, addLocalDir, addLocalFile), and Python package installation (pipInstall, pipInstallFromRequirements, pipInstallFromPyproject with index/find-links options).

## Image

Represents a sandbox image definition. Do not construct directly; use static factory methods.

### Factory Methods

**`Image.base(image: string)`** - Create from existing base image
```ts
const image = Image.base('python:3.12-slim-bookworm')
```

**`Image.debianSlim(pythonVersion?: "3.9" | "3.10" | "3.11" | "3.12" | "3.13")`** - Debian slim with Python
```ts
const image = Image.debianSlim('3.12')
```

**`Image.fromDockerfile(path: string)`** - Create from Dockerfile
```ts
const image = Image.fromDockerfile('Dockerfile')
```

### Configuration Methods (all return Image for chaining)

**`addLocalDir(localPath: string, remotePath: string)`** - Add local directory
```ts
.addLocalDir('src', '/home/daytona/src')
```

**`addLocalFile(localPath: string, remotePath: string)`** - Add local file
```ts
.addLocalFile('requirements.txt', '/home/daytona/requirements.txt')
```

**`workdir(dirPath: string)`** - Set working directory
```ts
.workdir('/home/daytona')
```

**`env(envVars: Record<string, string>)`** - Set environment variables
```ts
.env({ FOO: 'bar' })
```

**`cmd(cmd: string[])`** - Set default command
```ts
.cmd(['/bin/bash'])
```

**`entrypoint(entrypointCommands: string[])`** - Set entrypoint
```ts
.entrypoint(['/bin/bash'])
```

**`runCommands(...commands: (string | string[])[])`** - Run commands during build
```ts
.runCommands(
  'echo "Hello, world!"',
  ['bash', '-c', 'echo Hello, world, again!']
)
```

**`dockerfileCommands(dockerfileCommands: string[], contextDir?: string)`** - Add arbitrary Dockerfile commands
```ts
.dockerfileCommands(['RUN echo "Hello, world!"'])
```

### Python Package Installation

**`pipInstall(packages: string | string[], options?: PipInstallOptions)`** - Install packages
```ts
.pipInstall('numpy', { findLinks: ['https://pypi.org/simple'] })
```

**`pipInstallFromRequirements(requirementsTxt: string, options?: PipInstallOptions)`** - Install from requirements.txt
```ts
.pipInstallFromRequirements('requirements.txt', { findLinks: ['https://pypi.org/simple'] })
```

**`pipInstallFromPyproject(pyprojectToml: string, options?: PyprojectOptions)`** - Install from pyproject.toml
```ts
.pipInstallFromPyproject('pyproject.toml', { optionalDependencies: ['dev'] })
```

### PipInstallOptions

- `indexUrl?: string` - Index URL for pip
- `extraIndexUrls?: string[]` - Additional index URLs
- `findLinks?: string[]` - Find-links for pip
- `pre?: boolean` - Install pre-release versions
- `extraOptions?: string` - Extra options passed directly to pip

### PyprojectOptions

Extends PipInstallOptions with:
- `optionalDependencies?: string[]` - Optional dependencies to install

### Accessors

- `contextList: Context[]` - List of context files to be added
- `dockerfile: string` - Generated Dockerfile content

### Context

Represents a context file to be added to the image.

- `sourcePath: string` - Path to source file or directory
- `archivePath: string` - Path inside archive file in object storage

### typescript_sdk_reference
TypeScript SDK installation, sandbox creation/execution, configuration options, and polyfill setup for Vite/Next.js/serverless environments.

## Installation

```bash
npm install @daytonaio/sdk
# or
yarn add @daytonaio/sdk
```

## Create and Execute in Sandbox

```typescript
import { Daytona } from '@daytonaio/sdk'

const daytona = new Daytona()
const sandbox = await daytona.create({
  language: 'typescript',
  envVars: { NODE_ENV: 'development' },
})
const response = await sandbox.process.executeCommand('echo "Hello, World!"')
console.log(response.result)
```

## Configuration

Configure via environment variables (`DAYTONA_API_KEY`, `DAYTONA_API_URL`, `DAYTONA_TARGET`) or constructor:

```typescript
const daytona = new Daytona({
  apiKey: 'YOUR_API_KEY',
  apiUrl: 'https://app.daytona.io/api',
  target: 'us'
})
```

## Runtime Support

Works across Node.js, browsers, and serverless platforms (Cloudflare Workers, AWS Lambda, Azure Functions).

### Vite Configuration

Add to `vite.config.ts`:

```typescript
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    nodePolyfills({
      globals: { global: true, process: true, Buffer: true },
      overrides: { path: 'path-browserify-win32' },
    }),
  ],
})
```

### Next.js Configuration

Add to `next.config.ts`:

```typescript
import type { NextConfig } from 'next'
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'
import { env, nodeless } from 'unenv'

const { alias: turbopackAlias } = env(nodeless, {})

const nextConfig: NextConfig = {
  experimental: {
    turbo: { resolveAlias: turbopackAlias },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) config.plugins.push(new NodePolyfillPlugin())
    return config
  },
}

export default nextConfig
```

### lspserver
LSP server wrapper providing code completion, symbol search (document/sandbox-wide), and file lifecycle management for JavaScript/Python/TypeScript projects.

## LspServer

Provides Language Server Protocol functionality for IDE-like code intelligence features including code completion, symbol search, and diagnostics.

### Constructor

```ts
new LspServer(languageId: LspLanguageId, pathToProject: string, apiClient: LspApi)
```

Supported languages: `JAVASCRIPT`, `PYTHON`, `TYPESCRIPT`

### Core Methods

#### start() / stop()
```ts
await lsp.start();   // Initialize the server before use
await lsp.stop();    // Clean up resources when done
```

#### didOpen() / didClose()
```ts
await lsp.didOpen('workspace/project/src/index.ts');   // Enable language features for file
await lsp.didClose('workspace/project/src/index.ts');  // Notify server file is closed
```

#### completions()
```ts
const completions = await lsp.completions('workspace/project/src/index.ts', {
  line: 10,
  character: 15
});
// Returns: { isIncomplete, items[] } with label, kind, detail, documentation, sortText, filterText, insertText
completions.items.forEach(item => console.log(`${item.label} (${item.kind}): ${item.detail}`));
```

#### documentSymbols()
```ts
const symbols = await lsp.documentSymbols('workspace/project/src/index.ts');
// Returns: LspSymbol[] with name, kind, location
symbols.forEach(symbol => console.log(`${symbol.kind} ${symbol.name}: ${symbol.location}`));
```

#### sandboxSymbols()
```ts
const symbols = await lsp.sandboxSymbols('User');  // Search across entire sandbox
symbols.forEach(symbol => console.log(`${symbol.name} (${symbol.kind}) in ${symbol.location}`));
```

#### workspaceSymbols() (deprecated)
Use `sandboxSymbols()` instead.

### Position Type
```ts
interface Position {
  line: number;      // Zero-based line number
  character: number; // Zero-based character offset
}
```

### Typical Workflow
```ts
const lsp = await sandbox.createLspServer('typescript', 'workspace/project');
await lsp.start();
await lsp.didOpen('src/index.ts');
const completions = await lsp.completions('src/index.ts', { line: 10, character: 15 });
const symbols = await lsp.documentSymbols('src/index.ts');
const results = await lsp.sandboxSymbols('MyClass');
await lsp.didClose('src/index.ts');
await lsp.stop();
```

### objectstorage
ObjectStorage class with upload() method for files/directories; requires accessKeyId, endpointUrl, secretAccessKey, optional bucketName and sessionToken

## ObjectStorage

Class for interacting with object storage services.

### Constructor

```ts
new ObjectStorage(config: ObjectStorageConfig): ObjectStorage
```

### Methods

#### upload()

```ts
upload(path: string, organizationId: string, archiveBasePath: string): Promise<string>
```

Upload a file or directory to object storage.

**Parameters**:
- `path` - The path to the file or directory to upload
- `organizationId` - The organization ID for the upload
- `archiveBasePath` - The base path for the archive

**Returns**: `Promise<string>` - The hash of the uploaded file or directory

## ObjectStorageConfig

Configuration object for ObjectStorage.

**Properties**:
- `accessKeyId` _string_ - Access key ID for the object storage service
- `bucketName?` _string_ - Optional bucket name
- `endpointUrl` _string_ - Endpoint URL for the object storage service
- `secretAccessKey` _string_ - Secret access key for the object storage service
- `sessionToken?` _string_ - Optional session token for temporary credentials

### process
Process execution API: codeRun() and executeCommand() for immediate execution, sessions for stateful command sequences, PTY for interactive terminals.

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

### ptyhandle
PTY session handle with methods to send input, resize terminal, wait for completion, kill process, and manage WebSocket connection.

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

### pty
PTY session interfaces: PtyCreateOptions (id, cols, rows, cwd, envs), PtyConnectOptions (onData callback), PtyResult (exitCode, error)

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

### sandbox
Sandbox class: isolated execution environment with resource allocation, lifecycle automation, preview/SSH access, and code/file/git/process operation interfaces.

## Sandbox

Represents a Daytona Sandbox - an isolated execution environment with configurable resources and lifecycle management.

### Properties

Core identifiers and metadata:
- `id` - Unique identifier
- `name` - Sandbox name
- `organizationId` - Organization ID
- `target` - Target location of the runner
- `user` - OS user running in the Sandbox

Resource allocation:
- `cpu` - Number of CPUs
- `memory` - Memory in GiB
- `disk` - Disk space in GiB
- `gpu` - Number of GPUs

State and lifecycle:
- `state` - Current state (started, stopped, resizing, etc.)
- `createdAt`, `updatedAt` - Timestamps
- `errorReason` - Error message if in error state
- `recoverable` - Whether error is recoverable

Lifecycle automation:
- `autoStopInterval` - Minutes of inactivity before auto-stop
- `autoArchiveInterval` - Minutes stopped before auto-archive
- `autoDeleteInterval` - Minutes stopped before auto-delete

Networking and access:
- `public` - Whether publicly accessible
- `networkBlockAll` - Block all network access
- `networkAllowList` - Comma-separated CIDR addresses

Configuration:
- `env` - Environment variables (Record<string, string>)
- `labels` - Custom labels (Record<string, string>)
- `snapshot` - Daytona snapshot used to create the Sandbox
- `buildInfo` - Build information if created from dynamic build
- `volumes` - Attached volumes

Backup:
- `backupState` - Current backup state
- `backupCreatedAt` - When backup was created

Interfaces:
- `codeInterpreter` - Stateful Python code execution
- `computerUse` - Desktop automation operations
- `fs` - File system operations
- `git` - Git operations
- `process` - Process execution

### Methods

#### Lifecycle Management

```ts
await sandbox.start(timeout?: number);
await sandbox.stop(timeout?: number);
await sandbox.archive();
await sandbox.delete(timeout: number);
await sandbox.recover(timeout?: number);
```

Wait for state transitions:
```ts
await sandbox.waitUntilStarted(timeout?: number);
await sandbox.waitUntilStopped(timeout?: number);
await sandbox.waitForResizeComplete(timeout?: number);
```

#### Resource Management

```ts
await sandbox.resize({ cpu?: number, memory?: number, disk?: number }, timeout?: number);
```

Hot resize (running sandbox) allows CPU/memory increases only. Disk resize requires stopped sandbox.

#### Activity and Refresh

```ts
await sandbox.refreshActivity();  // Reset auto-stop timer
await sandbox.refreshData();      // Refresh from API
```

#### Directory Information

```ts
const homeDir = await sandbox.getUserHomeDir();
const workDir = await sandbox.getWorkDir();
```

#### Preview Links

```ts
const preview = await sandbox.getPreviewLink(port: number);
// Returns: { url: string, token: string }

const signed = await sandbox.getSignedPreviewUrl(port: number, expiresInSeconds?: number);
// Returns: { url: string, token: string, expiresAt: string }

await sandbox.expireSignedPreviewUrl(port: number, token: string);
```

#### SSH Access

```ts
const ssh = await sandbox.createSshAccess(expiresInMinutes?: number);
// Returns: SshAccessDto with token

await sandbox.validateSshAccess(token: string);
// Returns: SshAccessValidationDto

await sandbox.revokeSshAccess(token: string);
```

#### Configuration

```ts
await sandbox.setLabels({ key: string, value: string });
await sandbox.setAutostopInterval(minutes: number);  // 0 to disable
await sandbox.setAutoArchiveInterval(minutes: number);  // 0 for max
await sandbox.setAutoDeleteInterval(minutes: number);  // -1 to disable, 0 for immediate
```

#### Language Server Protocol

```ts
const lsp = await sandbox.createLspServer(languageId: string, pathToProject: string);
// languageId examples: "typescript"
// Returns: LspServer instance
```

### Constructor

```ts
new Sandbox(
  sandboxDto: Sandbox,
  clientConfig: Configuration,
  axiosInstance: AxiosInstance,
  sandboxApi: SandboxApi,
  codeToolbox: SandboxCodeToolbox,
  getToolboxBaseUrl: (sandboxId: string, regionId: string) => Promise<string>
)
```

### PaginatedSandboxes

Extends paginated response with:
- `items` - Array of Sandbox objects
- `page` - Current page number
- `total` - Total items
- `totalPages` - Total pages

### SandboxCodeToolbox

Interface for code execution toolboxes:
```ts
getRunCommand(code: string, params?: CodeRunParams): string
```

Generates command to run provided code.

### snapshot
SnapshotService: create, get, list, delete, activate pre-configured sandboxes with Image-based creation and pagination support.

## SnapshotService

Service for managing Daytona Snapshots (pre-configured sandboxes). Provides CRUD operations and activation.

### Constructor

```ts
new SnapshotService(
   clientConfig: Configuration, 
   snapshotsApi: SnapshotsApi, 
   objectStorageApi: ObjectStorageApi, 
   defaultRegionId?: string): SnapshotService
```

### Methods

#### activate()
```ts
activate(snapshot: Snapshot): Promise<Snapshot>
```
Activates a snapshot.

#### create()
```ts
create(params: CreateSnapshotParams, options: {
  onLogs?: (chunk: string) => void;
  timeout?: number;
}): Promise<Snapshot>
```
Creates and registers a new snapshot from an Image definition.

**Example:**
```ts
const image = Image.debianSlim('3.12').pipInstall('numpy');
await daytona.snapshot.create({ name: 'my-snapshot', image: image }, { onLogs: console.log });
```

#### delete()
```ts
delete(snapshot: Snapshot): Promise<void>
```
Deletes a Snapshot. Throws if snapshot does not exist or cannot be deleted.

**Example:**
```ts
const snapshot = await daytona.snapshot.get("snapshot-name");
await daytona.snapshot.delete(snapshot);
```

#### get()
```ts
get(name: string): Promise<Snapshot>
```
Gets a Snapshot by name. Throws if snapshot does not exist or cannot be accessed.

**Example:**
```ts
const snapshot = await daytona.snapshot.get("snapshot-name");
console.log(`Snapshot ${snapshot.name} is in state ${snapshot.state}`);
```

#### list()
```ts
list(page?: number, limit?: number): Promise<PaginatedSnapshots>
```
Lists paginated snapshots.

**Example:**
```ts
const result = await daytona.snapshot.list(2, 10);
console.log(`Found ${result.total} snapshots`);
result.items.forEach(snapshot => console.log(`${snapshot.name} (${snapshot.imageName})`));
```

## PaginatedSnapshots

Paginated list of snapshots with properties:
- `items: Snapshot[]` - Snapshots in current page
- `page: number` - Current page number
- `total: number` - Total snapshots across all pages
- `totalPages: number` - Total pages available

## CreateSnapshotParams

```ts
type CreateSnapshotParams = {
  entrypoint?: string[];
  image: string | Image;
  name: string;
  regionId?: string;
  resources?: Resources;
};
```

Parameters for snapshot creation. Image can be a string reference or Image instance.

## Snapshot

```ts
type Snapshot = SnapshotDto & {
  __brand: "Snapshot";
};
```

Branded type representing a pre-configured sandbox.

### volume
VolumeService API for creating, retrieving, listing, and deleting shared storage volumes with optional S3 subpath mounting.

## VolumeService

Service for managing Daytona Volumes - shared storage volumes for Sandboxes.

Volumes can be mounted to Sandboxes with an optional subpath parameter to mount only a specific S3 prefix within the volume. When no subpath is specified, the entire volume is mounted.

### Constructor

```ts
new VolumeService(volumesApi: VolumesApi): VolumeService
```

### Methods

#### create(name: string): Promise<Volume>

Creates a new Volume with the specified name.

```ts
const daytona = new Daytona();
const volume = await daytona.volume.create("my-data-volume");
console.log(`Created volume ${volume.name} with ID ${volume.id}`);
```

#### delete(volume: Volume): Promise<void>

Deletes a Volume.

```ts
const volume = await daytona.volume.get("volume-name");
await daytona.volume.delete(volume);
```

#### get(name: string, create?: boolean): Promise<Volume>

Gets a Volume by name. Optional `create` parameter (default: false) creates the Volume if it doesn't exist.

```ts
const volume = await daytona.volume.get("volume-name", true);
console.log(`Volume ${volume.name} is in state ${volume.state}`);
```

#### list(): Promise<Volume[]>

Lists all available Volumes.

```ts
const volumes = await daytona.volume.list();
volumes.forEach(vol => console.log(`${vol.name} (${vol.id})`));
```

## Volume Type

```ts
type Volume = VolumeDto & {
  __brand: "Volume";
};
```

Represents a Daytona Volume - a shared storage volume for Sandboxes.

