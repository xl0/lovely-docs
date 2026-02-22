## Volume

Data class representing a shared storage volume for Sandboxes.

**Attributes**: `id`, `name`, `organization_id`, `state`, `created_at`, `updated_at`, `last_used_at`

## VolumeService

Service for managing volumes.

### list()
Returns all volumes.

```python
daytona = Daytona()
volumes = daytona.volume.list()
for volume in volumes:
    print(f"{volume.name} ({volume.id})")
```

### get(name, create=False)
Get volume by name, optionally creating if missing.

```python
volume = daytona.volume.get("test-volume-name", create=True)
print(f"{volume.name} ({volume.id})")
```

### create(name)
Create new volume.

```python
volume = daytona.volume.create("test-volume")
print(f"{volume.name} ({volume.id}); state: {volume.state}")
```

### delete(volume)
Delete a volume.

```python
volume = daytona.volume.get("test-volume")
daytona.volume.delete(volume)
```

## VolumeMount

Configuration for mounting a volume in a Sandbox.

**Attributes**:
- `volume_id` - ID of volume to mount
- `mount_path` - Path where volume is mounted in sandbox
- `subpath` - Optional S3 subpath/prefix within volume; when specified, only this prefix is accessible; when omitted, entire volume is mounted