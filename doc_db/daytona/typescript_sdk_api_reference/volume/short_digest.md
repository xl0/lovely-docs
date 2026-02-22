## VolumeService

Manages Daytona Volumes (shared storage for Sandboxes). Supports mounting with optional S3 prefix subpath.

**Methods:**
- `create(name)` - Create new volume
- `get(name, create?)` - Get volume by name, optionally create if missing
- `list()` - List all volumes
- `delete(volume)` - Delete volume

**Example:**
```ts
const daytona = new Daytona();
const volume = await daytona.volume.get("my-volume", true);
const volumes = await daytona.volume.list();
await daytona.volume.delete(volume);
```