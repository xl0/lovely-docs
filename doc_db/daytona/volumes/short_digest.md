## Overview
FUSE-based shared file mounts across sandboxes, stored in S3-compatible object store.

## Create
```python
daytona = Daytona()
volume = daytona.volume.create("my-awesome-volume")
```

## Mount
Mount paths must be absolute (e.g., `/home/daytona/volume`), cannot be root or system directories. Supports subpaths for multi-tenancy:
```python
params = CreateSandboxFromSnapshotParams(
    language="python",
    volumes=[VolumeMount(volume_id=volume.id, mount_path="/home/daytona/volume", subpath="users/alice")],
)
sandbox = daytona.create(params)
```

## Operations
```python
# Read/write like normal files; data persists after sandbox deletion
with open("/home/daytona/volume/example.txt", "w") as f:
    f.write("Hello!")

# Get by name
volume = daytona.volume.get("my-awesome-volume", create=True)

# List all
volumes = daytona.volume.list()

# Delete (irreversible)
daytona.volume.delete(volume)
```

## Limits
- Cannot use for block storage (databases)
- Slower than local filesystem
- Max 100 volumes per organization, no storage quota cost
