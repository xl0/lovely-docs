## Overview

FUSE-based mounts providing shared file access across sandboxes. Enable instant reads from large files without manual uploads. Data stored in S3-compatible object store.

- Multiple volumes can mount to single sandbox
- Single volume can mount to multiple sandboxes

## Create Volumes

Via dashboard: Navigate to Daytona Volumes, click Create Volume, enter name.

Via SDK:
```python
daytona = Daytona()
volume = daytona.volume.create("my-awesome-volume")
```

```typescript
const daytona = new Daytona();
const volume = await daytona.volume.create("my-awesome-volume");
```

```ruby
daytona = Daytona::Daytona.new
volume = daytona.volume.create("my-awesome-volume")
```

## Mount Volumes

Mount via `CreateSandboxFromSnapshotParams` with `volumes` parameter containing `VolumeMount` objects.

Mount path requirements:
- Absolute paths starting with `/` (e.g., `/home/daytona/volume`)
- Cannot be root (`/` or `//`)
- No relative components (`/../`, `/./`, ending with `/..` or `/.`)
- No consecutive slashes (except at start)
- Cannot mount to system directories: `/proc`, `/sys`, `/dev`, `/boot`, `/etc`, `/bin`, `/sbin`, `/lib`, `/lib64`

Example with subpath (useful for multi-tenancy):
```python
from daytona import CreateSandboxFromSnapshotParams, Daytona, VolumeMount

daytona = Daytona()
volume = daytona.volume.get("my-volume", create=True)

params = CreateSandboxFromSnapshotParams(
    language="python",
    volumes=[VolumeMount(volume_id=volume.id, mount_path="/home/daytona/volume", subpath="users/alice")],
)
sandbox = daytona.create(params)
```

```typescript
const daytona = new Daytona()
const volume = await daytona.volume.get('my-volume', true)

const sandbox = await daytona.create({
  language: 'typescript',
  volumes: [{ volumeId: volume.id, mountPath: '/home/daytona/volume', subpath: 'users/alice' }],
})
```

```ruby
daytona = Daytona::Daytona.new
volume = daytona.volume.get('my-volume', create: true)

params = Daytona::CreateSandboxFromSnapshotParams.new(
  language: Daytona::CodeLanguage::PYTHON,
  volumes: [DaytonaApiClient::SandboxVolume.new(
    volume_id: volume.id,
    mount_path: '/home/daytona/volume',
    subpath: 'users/alice'
  )]
)
sandbox = daytona.create(params)
```

## Work with Volumes

Read/write like any directory. Data persists beyond sandbox lifecycle.

```python
with open("/home/daytona/volume/example.txt", "w") as f:
    f.write("Hello from Daytona volume!")
sandbox.delete()  # Volume persists
```

```typescript
import fs from 'fs/promises'
await fs.writeFile('/home/daytona/volume/example.txt', 'Hello from Daytona volume!')
await daytona.delete(sandbox1)
```

```ruby
sandbox.fs.upload_file('Hello from Daytona volume!', '/home/daytona/volume/example.txt')
daytona.delete(sandbox)
```

## Get Volume by Name

```python
daytona = Daytona()
volume = daytona.volume.get("my-awesome-volume", create=True)
print(f"{volume.name} ({volume.id})")
```

```typescript
const daytona = new Daytona()
const volume = await daytona.volume.get('my-awesome-volume', true)
console.log(`Volume ${volume.name} is in state ${volume.state}`)
```

## List Volumes

```python
daytona = Daytona()
volumes = daytona.volume.list()
for volume in volumes:
    print(f"{volume.name} ({volume.id})")
```

```typescript
const daytona = new Daytona()
const volumes = await daytona.volume.list()
volumes.forEach(vol => console.log(`${vol.name} (${vol.id})`))
```

## Delete Volumes

Deleted volumes cannot be recovered.

```python
volume = daytona.volume.get("my-volume", create=True)
daytona.volume.delete(volume)
```

```typescript
const volume = await daytona.volume.get('my-volume', true)
await daytona.volume.delete(volume)
```

```ruby
volume = daytona.volume.get('my-volume', create: true)
daytona.volume.delete(volume)
```

## Limitations

- Cannot be used for block storage access (database tables)
- Slower read/write compared to local sandbox filesystem

## Pricing & Limits

- Included at no additional cost
- Up to 100 volumes per organization
- Volume data doesn't count against storage quota
