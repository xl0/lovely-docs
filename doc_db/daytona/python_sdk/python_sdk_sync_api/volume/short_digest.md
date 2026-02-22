## Volume
Shared storage volume for Sandboxes with attributes: `id`, `name`, `organization_id`, `state`, `created_at`, `updated_at`, `last_used_at`.

## VolumeService
- `list()` - Get all volumes
- `get(name, create=False)` - Get volume by name, optionally create
- `create(name)` - Create new volume
- `delete(volume)` - Delete volume

## VolumeMount
Mount configuration with `volume_id`, `mount_path`, and optional `subpath` (S3 prefix; omit to mount entire volume).