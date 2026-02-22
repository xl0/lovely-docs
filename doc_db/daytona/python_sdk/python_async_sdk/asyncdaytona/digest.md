## AsyncDaytona

Main async class for interacting with the Daytona API. Provides methods to create, manage, and interact with Daytona Sandboxes.

**Attributes**:
- `volume` - AsyncVolumeService for managing volumes
- `snapshot` - AsyncSnapshotService for managing snapshots

### Initialization

```python
from daytona import AsyncDaytona, DaytonaConfig

# Using environment variables (DAYTONA_API_KEY, DAYTONA_API_URL, DAYTONA_TARGET)
async with AsyncDaytona() as daytona:
    sandbox = await daytona.create()

# Using explicit configuration
config = DaytonaConfig(api_key="key", api_url="https://api.com", target="us")
daytona = AsyncDaytona(config)
try:
    sandbox = await daytona.create()
finally:
    await daytona.close()

# With OpenTelemetry tracing
config = DaytonaConfig(api_key="key", experimental={"otelEnabled": True})
async with AsyncDaytona(config) as daytona:
    sandbox = await daytona.create()
    # All operations traced, flushed on close
```

**Raises**: `DaytonaError` if API key not provided via config or environment variables.

### Resource Management

```python
async def close() -> None
```
Closes HTTP session and cleans up resources. Use as async context manager to ensure cleanup.

### Sandbox Creation

```python
async def create(
    params: CreateSandboxFromSnapshotParams | None = None,
    timeout: float = 60
) -> AsyncSandbox
```
Creates sandbox from snapshot (default or specified).

```python
async def create(
    params: CreateSandboxFromImageParams | None = None,
    timeout: float = 60,
    on_snapshot_create_logs: Callable[[str], None] | None = None
) -> AsyncSandbox
```
Creates sandbox from image (registry or declarative). Daytona creates snapshot from image first.

**Examples**:
```python
# Default Python sandbox
sandbox = await daytona.create()

# From snapshot with custom params
params = CreateSandboxFromSnapshotParams(
    language="python",
    snapshot="my-snapshot-id",
    env_vars={"DEBUG": "true"},
    auto_stop_interval=0,
    auto_archive_interval=60,
    auto_delete_interval=120
)
sandbox = await daytona.create(params, timeout=40)

# From registry image
sandbox = await daytona.create(CreateSandboxFromImageParams(image="debian:12.9"))

# From declarative image with resources and logs
from daytona import Image, Resources
declarative_image = (
    Image.base("alpine:3.18")
    .pipInstall(["numpy", "pandas"])
    .env({"MY_ENV_VAR": "value"})
)
params = CreateSandboxFromImageParams(
    language="python",
    image=declarative_image,
    env_vars={"DEBUG": "true"},
    resources=Resources(cpu=2, memory=4),
    auto_stop_interval=0,
    auto_archive_interval=60,
    auto_delete_interval=120
)
sandbox = await daytona.create(
    params,
    timeout=40,
    on_snapshot_create_logs=lambda chunk: print(chunk, end="")
)
```

**Raises**: `DaytonaError` if timeout/auto_stop_interval/auto_archive_interval negative or sandbox fails to start.

### Sandbox Retrieval

```python
async def get(sandbox_id_or_name: str) -> AsyncSandbox
```
Gets sandbox by ID or name.

```python
async def find_one(
    sandbox_id_or_name: str | None = None,
    labels: dict[str, str] | None = None
) -> AsyncSandbox
```
Finds first sandbox matching ID/name or labels.

```python
async def list(
    labels: dict[str, str] | None = None,
    page: int | None = None,
    limit: int | None = None
) -> AsyncPaginatedSandboxes
```
Returns paginated list of sandboxes filtered by labels.

**Examples**:
```python
sandbox = await daytona.get("my-sandbox-id-or-name")
print(sandbox.state)

sandbox = await daytona.find_one(labels={"my-label": "my-value"})
print(f"Sandbox ID: {sandbox.id} State: {sandbox.state}")

result = await daytona.list(labels={"my-label": "my-value"}, page=2, limit=10)
for sandbox in result.items:
    print(f"{sandbox.id}: {sandbox.state}")
```

### Sandbox Lifecycle

```python
async def start(sandbox: AsyncSandbox, timeout: float = 60) -> None
```
Starts sandbox and waits for it to be ready.

```python
async def stop(sandbox: AsyncSandbox, timeout: float = 60) -> None
```
Stops sandbox and waits for it to be stopped.

```python
async def delete(sandbox: AsyncSandbox, timeout: float = 60) -> None
```
Deletes sandbox.

**Example**:
```python
sandbox = await daytona.create()
await daytona.start(sandbox)
# ... use sandbox ...
await daytona.stop(sandbox)
await daytona.delete(sandbox)
```

**Raises**: `DaytonaError` if timeout negative or operation fails.

## DaytonaConfig

Configuration for Daytona client.

**Attributes**:
- `api_key` - API key for authentication (or use `DAYTONA_API_KEY` env var)
- `jwt_token` - JWT token for authentication (or use `DAYTONA_JWT_TOKEN` env var)
- `organization_id` - Required with JWT token (or use `DAYTONA_ORGANIZATION_ID` env var)
- `api_url` - Daytona API URL, defaults to `https://app.daytona.io/api` (or use `DAYTONA_API_URL` env var)
- `server_url` - Deprecated, use `api_url` instead
- `target` - Target runner location (or use `DAYTONA_TARGET` env var)
- `_experimental` - Configuration for experimental features

**Examples**:
```python
config = DaytonaConfig(api_key="your-api-key")
config = DaytonaConfig(jwt_token="your-jwt-token", organization_id="your-organization-id")
```

## CodeLanguage

Enum of supported programming languages: `PYTHON`, `TYPESCRIPT`, `JAVASCRIPT`

## CreateSandboxBaseParams

Base parameters for sandbox creation.

**Attributes**:
- `name` - Sandbox name
- `language` - Programming language, defaults to "python"
- `os_user` - OS user for sandbox
- `env_vars` - Environment variables dict
- `labels` - Custom labels dict
- `public` - Whether sandbox is public
- `timeout` - Timeout in seconds for creation/start
- `auto_stop_interval` - Minutes until auto-stop if no activity (default 15, 0 = disabled)
- `auto_archive_interval` - Minutes until auto-archive when stopped (default 7 days, 0 = max interval)
- `auto_delete_interval` - Minutes until auto-delete when stopped (default disabled, 0 = delete immediately)
- `volumes` - List of VolumeMount objects
- `network_block_all` - Block all network access
- `network_allow_list` - Comma-separated CIDR addresses to allow
- `ephemeral` - If True, sets auto_delete_interval to 0

## CreateSandboxFromSnapshotParams

Extends CreateSandboxBaseParams.

**Attributes**:
- `snapshot` - Name of snapshot to use

## CreateSandboxFromImageParams

Extends CreateSandboxBaseParams.

**Attributes**:
- `image` - Docker image string or Image object (dynamically built if Image object)
- `resources` - Resources configuration (cpu, memory); uses defaults if not provided