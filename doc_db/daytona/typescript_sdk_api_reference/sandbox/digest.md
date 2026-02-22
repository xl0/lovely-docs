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