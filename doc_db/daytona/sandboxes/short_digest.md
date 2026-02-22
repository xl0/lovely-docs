## Sandboxes

Isolated runtime environments with default 1 vCPU, 1GB RAM, 3GiB disk (orgs: 4 vCPU, 8GB RAM, 10GB disk). Support Python, TypeScript, JavaScript.

**Create**: `daytona.create(CreateSandboxFromSnapshotParams(language="python", name="...", labels={...}, resources=Resources(cpu=2, memory=4, disk=8), ephemeral=True, auto_stop_interval=5))`

**Lifecycle**: start, list, stop (filesystem persists), archive (to storage), recover (from error), resize, delete.

**Auto-management**: auto_stop_interval (default 15min, resets on preview/SSH/API calls), auto_archive_interval (default 7 days), auto_delete_interval (default never). Set to 0 to disable/max, -1 to disable deletion.

Stopped sandboxes can be retrieved with `find_one(id)` and restarted. Resize: started sandboxes can only increase CPU/memory; stopped can change all (disk only increases).