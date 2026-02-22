## Volume

Data class representing a shared storage volume for Sandboxes.

**Attributes**: `id`, `name`, `organization_id`, `state`, `created_at`, `updated_at`, `last_used_at` (all strings)

## AsyncVolumeService

Service for managing volumes with async methods.

### list()
```python
async with AsyncDaytona() as daytona:
    volumes = await daytona.volume.list()
    for volume in volumes:
        print(f"{volume.name} ({volume.id})")
```
Returns `list[Volume]` of all volumes.

### get(name: str, create: bool = False)
```python
volume = await daytona.volume.get("test-volume-name", create=True)
print(f"{volume.name} ({volume.id})")
```
Get volume by name. If `create=True`, creates it if it doesn't exist. Returns `Volume`.

### create(name: str)
```python
volume = await daytona.volume.create("test-volume")
print(f"{volume.name} ({volume.id}); state: {volume.state}")
```
Create new volume. Returns `Volume`.

### delete(volume: Volume)
```python
volume = await daytona.volume.get("test-volume")
await daytona.volume.delete(volume)
```
Delete a volume.

## VolumeMount

Configuration for mounting a volume in a Sandbox.

**Attributes**:
- `volume_id` _str_ - ID of the volume to mount
- `mount_path` _str_ - Path where volume is mounted in sandbox
- `subpath` _str | None_ - Optional S3 subpath/prefix within volume; when specified, only this prefix is accessible; when omitted, entire volume is mounted