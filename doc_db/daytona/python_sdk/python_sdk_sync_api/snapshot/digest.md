## Snapshot

Pre-configured sandbox representation with attributes: `id`, `organization_id`, `general`, `name`, `image_name`, `state`, `size`, `entrypoint`, `cpu`, `gpu`, `mem`, `disk`, `error_reason`, `created_at`, `updated_at`, `last_used_at`.

## SnapshotService

Service for managing snapshots.

### list(page, limit) → PaginatedSnapshots

Returns paginated list of snapshots.

```python
daytona = Daytona()
result = daytona.snapshot.list(page=2, limit=10)
for snapshot in result.items:
    print(f"{snapshot.name} ({snapshot.image_name})")
```

### get(name) → Snapshot

Get snapshot by name.

```python
snapshot = daytona.snapshot.get("test-snapshot-name")
print(f"{snapshot.name} ({snapshot.image_name})")
```

### create(params, on_logs, timeout) → Snapshot

Creates and registers new snapshot from Image definition. `on_logs` callback handles creation logs. `timeout` in seconds (0 = no timeout).

```python
image = Image.debianSlim('3.12').pipInstall('numpy')
daytona.snapshot.create(
    CreateSnapshotParams(name='my-snapshot', image=image),
    on_logs=lambda chunk: print(chunk, end=""),
)
```

### delete(snapshot) → None

Delete a snapshot.

```python
snapshot = daytona.snapshot.get("test-snapshot")
daytona.snapshot.delete(snapshot)
```

### activate(snapshot) → Snapshot

Activate a snapshot.

### process_image_context(object_storage_api, image) → list[str]

Static method. Processes image context by uploading to object storage. Returns list of context hashes.

## PaginatedSnapshots

Paginated list container with attributes: `items` (list of Snapshot), `total`, `page`, `total_pages`.

## CreateSnapshotParams

Parameters for snapshot creation:
- `name` (str) - Snapshot name
- `image` (str | Image) - Image reference or Image instance
- `resources` (Resources | None) - Resource allocation
- `entrypoint` (list[str] | None) - Container entrypoint
- `region_id` (str | None) - Region ID (defaults to organization default)