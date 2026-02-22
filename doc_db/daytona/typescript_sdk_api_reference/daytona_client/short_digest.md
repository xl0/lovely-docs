## Daytona Client

Main API class for creating and managing Sandboxes.

**Initialization:**
```ts
const daytona = new Daytona(); // uses env vars
const daytona = new Daytona({ apiKey, apiUrl, target });
```

**Core Methods:**
- `create(params?, options?)` - Create from snapshot or image with timeout and log callbacks
- `get(idOrName)` - Get Sandbox by ID or name
- `findOne(filter)` - Find by ID, name, or labels
- `list(labels?, page?, limit?)` - Paginated list
- `start(sandbox, timeout?)` - Start and wait
- `stop(sandbox)` - Stop
- `delete(sandbox, timeout?)` - Delete

**Sandbox Parameters:**
- `language` - "python" (default), "javascript", "typescript"
- `image` - Docker image string or Image object
- `snapshot` - Snapshot name
- `resources` - {cpu, memory (GiB), disk (GiB), gpu}
- `envVars` - Environment variables
- `volumes` - Array of {volumeId, mountPath, subpath?}
- `autoStopInterval`, `autoArchiveInterval`, `autoDeleteInterval` - Minutes
- `ephemeral` - Auto-delete on stop
- `labels`, `name`, `user`, `networkBlockAll`, `networkAllowList`, `public`

**Config:**
- `apiKey` or `jwtToken` + `organizationId` for auth
- `apiUrl` (default: https://app.daytona.io/api)
- `target` - Sandbox location