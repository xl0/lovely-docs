## Daytona Client

Main API class for creating and managing sandboxes.

**Init**:
```python
daytona = Daytona()  # Uses env vars: DAYTONA_API_KEY, DAYTONA_API_URL, DAYTONA_TARGET
daytona = Daytona(DaytonaConfig(api_key="key", api_url="url", target="us"))
```

**Create sandboxes**:
```python
# From snapshot (default)
sandbox = daytona.create()
sandbox = daytona.create(CreateSandboxFromSnapshotParams(snapshot="id", env_vars={...}), timeout=40)

# From image
sandbox = daytona.create(CreateSandboxFromImageParams(image="debian:12.9"))
sandbox = daytona.create(CreateSandboxFromImageParams(
    image=Image.base("alpine").pipInstall(["numpy"]),
    resources=Resources(cpu=2, memory=4)
), on_snapshot_create_logs=lambda chunk: print(chunk, end=""))
```

**Manage sandboxes**:
```python
daytona.get("id-or-name")
daytona.find_one(labels={"key": "value"})
daytona.list(labels={...}, page=2, limit=10)
daytona.start(sandbox, timeout=60)
daytona.stop(sandbox, timeout=60)
daytona.delete(sandbox, timeout=60)
```

**Config options**: api_key/jwt_token, organization_id, api_url, target, experimental features

**Sandbox params**: name, language, env_vars, labels, public, auto_stop/archive/delete intervals, volumes, network settings, ephemeral