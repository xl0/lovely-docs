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