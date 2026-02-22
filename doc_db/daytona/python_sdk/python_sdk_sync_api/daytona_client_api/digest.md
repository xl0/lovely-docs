## Daytona

Main class for interacting with the Daytona API. Provides methods to create, manage, and interact with Daytona Sandboxes.

**Attributes**:
- `volume` - VolumeService for managing volumes
- `snapshot` - SnapshotService for managing snapshots

### Initialization

```python
from daytona import Daytona, DaytonaConfig

# Environment variables: DAYTONA_API_KEY, DAYTONA_API_URL, DAYTONA_TARGET
daytona = Daytona()

# Explicit config
config = DaytonaConfig(api_key="key", api_url="https://api.com", target="us")
daytona = Daytona(config)

# With OpenTelemetry tracing
config = DaytonaConfig(api_key="key", experimental={"otelEnabled": True})
async with Daytona(config) as daytona:
    sandbox = daytona.create()
```

Raises `DaytonaError` if API key not provided.

### Creating Sandboxes

**From snapshot** (default):
```python
sandbox = daytona.create()

params = CreateSandboxFromSnapshotParams(
    language="python",
    snapshot="my-snapshot-id",
    env_vars={"DEBUG": "true"},
    auto_stop_interval=0,
    auto_archive_interval=60,
    auto_delete_interval=120
)
sandbox = daytona.create(params, timeout=40)
```

**From image**:
```python
sandbox = daytona.create(CreateSandboxFromImageParams(image="debian:12.9"))

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
sandbox = daytona.create(params, timeout=40, on_snapshot_create_logs=lambda chunk: print(chunk, end=""))
```

`timeout` parameter (default 60s, 0 = no timeout). Raises `DaytonaError` if timeout/auto_stop_interval/auto_archive_interval is negative or sandbox fails to start.

### Sandbox Management

```python
# Get by ID or name
sandbox = daytona.get("sandbox-id-or-name")

# Find by ID/name or labels
sandbox = daytona.find_one(labels={"my-label": "my-value"})

# List with pagination
result = daytona.list(labels={"my-label": "my-value"}, page=2, limit=10)
for sandbox in result.items:
    print(f"{sandbox.id}: {sandbox.state}")

# Start/stop
daytona.start(sandbox, timeout=60)
daytona.stop(sandbox, timeout=60)

# Delete
daytona.delete(sandbox, timeout=60)
```

All management methods raise `DaytonaError` on failure or timeout.

## CodeLanguage

Enum of supported languages: `PYTHON`, `TYPESCRIPT`, `JAVASCRIPT`

## DaytonaConfig

Configuration for Daytona client.

**Attributes**:
- `api_key` - API key for authentication (or use `DAYTONA_API_KEY` env var)
- `jwt_token` - JWT token for authentication (or use `DAYTONA_JWT_TOKEN` env var)
- `organization_id` - Required with JWT token (or use `DAYTONA_ORGANIZATION_ID` env var)
- `api_url` - Daytona API URL (defaults to `https://app.daytona.io/api`, or use `DAYTONA_API_URL` env var)
- `server_url` - Deprecated, use `api_url`
- `target` - Target runner location (or use `DAYTONA_TARGET` env var)
- `_experimental` - Experimental feature configuration

```python
config = DaytonaConfig(api_key="key")
config = DaytonaConfig(jwt_token="token", organization_id="org-id")
```

## CreateSandboxBaseParams

Base parameters for sandbox creation.

**Attributes**:
- `name` - Sandbox name
- `language` - CodeLanguage (defaults to "python")
- `os_user` - OS user for sandbox
- `env_vars` - Environment variables dict
- `labels` - Custom labels dict
- `public` - Whether sandbox is public
- `timeout` - Creation/start timeout in seconds
- `auto_stop_interval` - Minutes until auto-stop if no activity (default 15, 0 = disabled)
- `auto_archive_interval` - Minutes until auto-archive when stopped (default 7 days, 0 = max interval)
- `auto_delete_interval` - Minutes until auto-delete when stopped (default disabled, 0 = delete immediately)
- `volumes` - List of VolumeMount objects
- `network_block_all` - Block all network access
- `network_allow_list` - Comma-separated CIDR addresses to allow
- `ephemeral` - If True, sets auto_delete_interval to 0

## CreateSandboxFromImageParams

Extends CreateSandboxBaseParams.

**Attributes**:
- `image` - Docker image string or Image object (dynamically built if Image object)
- `resources` - Resources object with cpu/memory configuration

## CreateSandboxFromSnapshotParams

Extends CreateSandboxBaseParams.

**Attributes**:
- `snapshot` - Snapshot name to use