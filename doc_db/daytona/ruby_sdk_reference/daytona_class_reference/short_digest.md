## Daytona Class

Main SDK class for sandbox management.

**Constructor**: `Daytona.new(config)` with optional `Daytona::Config`

**API Access**: `api_client()`, `sandbox_api()`, `object_storage_api()`, `snapshots_api()`, `volume()`, `snapshot()`

**Sandbox Operations**:
- `create(params, on_snapshot_create_logs:)` - Create from snapshot or image
- `start(sandbox, timeout)` / `stop(sandbox, timeout)` - Lifecycle control (60s default timeout)
- `delete(sandbox)` - Remove sandbox
- `get(id)` - Retrieve by ID
- `find_one(id:, labels:)` - Find by ID or labels
- `list(labels, page:, limit:)` - List with pagination and filtering

**Cleanup**: `close()` - Flush telemetry and shutdown