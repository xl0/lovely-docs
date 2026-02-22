## AsyncVolumeService

Async methods for volume management:
- `list()` → `list[Volume]` - all volumes
- `get(name, create=False)` → `Volume` - get/create by name
- `create(name)` → `Volume` - create new
- `delete(volume)` - delete volume

## Volume & VolumeMount

`Volume`: shared storage with `id`, `name`, `organization_id`, `state`, timestamps.

`VolumeMount`: mount config with `volume_id`, `mount_path`, optional `subpath` (S3 prefix).