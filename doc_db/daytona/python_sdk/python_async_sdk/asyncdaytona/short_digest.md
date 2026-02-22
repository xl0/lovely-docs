## AsyncDaytona

Async client for Daytona API. Initialize with config or environment variables (DAYTONA_API_KEY, DAYTONA_API_URL, DAYTONA_TARGET).

```python
async with AsyncDaytona() as daytona:
    sandbox = await daytona.create()
    await daytona.start(sandbox)
    await daytona.stop(sandbox)
    await daytona.delete(sandbox)
```

**Create from snapshot**:
```python
params = CreateSandboxFromSnapshotParams(
    snapshot="my-snapshot",
    env_vars={"DEBUG": "true"},
    auto_stop_interval=0,
    auto_archive_interval=60
)
sandbox = await daytona.create(params, timeout=40)
```

**Create from image**:
```python
from daytona import Image, Resources
image = Image.base("alpine:3.18").pipInstall(["numpy"])
params = CreateSandboxFromImageParams(
    image=image,
    resources=Resources(cpu=2, memory=4),
    env_vars={"DEBUG": "true"}
)
sandbox = await daytona.create(
    params,
    on_snapshot_create_logs=lambda chunk: print(chunk, end="")
)
```

**Retrieve sandboxes**:
```python
sandbox = await daytona.get("sandbox-id-or-name")
sandbox = await daytona.find_one(labels={"key": "value"})
result = await daytona.list(labels={"key": "value"}, page=2, limit=10)
```

## DaytonaConfig

Configuration: `api_key` or `jwt_token` + `organization_id`, `api_url` (default: https://app.daytona.io/api), `target`, `_experimental`.

## CreateSandboxBaseParams

Base params: `name`, `language` (default: python), `env_vars`, `labels`, `auto_stop_interval` (default: 15 min), `auto_archive_interval` (default: 7 days), `auto_delete_interval`, `volumes`, `network_block_all`, `network_allow_list`, `ephemeral`.

## CreateSandboxFromSnapshotParams / CreateSandboxFromImageParams

Snapshot params: `snapshot` name. Image params: `image` (string or Image object), `resources` (cpu, memory).