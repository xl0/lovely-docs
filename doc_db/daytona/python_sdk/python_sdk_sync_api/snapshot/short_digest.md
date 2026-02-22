## Snapshot

Pre-configured sandbox with attributes: id, name, image_name, state, cpu, gpu, mem, disk, created_at, updated_at, last_used_at.

## SnapshotService

- `list(page, limit)` - Paginated snapshot list
- `get(name)` - Get snapshot by name
- `create(params, on_logs, timeout)` - Create from Image definition
- `delete(snapshot)` - Delete snapshot
- `activate(snapshot)` - Activate snapshot
- `process_image_context(object_storage_api, image)` - Upload image context to storage

```python
daytona = Daytona()
snapshot = daytona.snapshot.get("test-snapshot-name")
daytona.snapshot.create(
    CreateSnapshotParams(name='my-snapshot', image=Image.debianSlim('3.12')),
    on_logs=lambda chunk: print(chunk, end=""),
)
daytona.snapshot.delete(snapshot)
```

## CreateSnapshotParams

- `name` (str)
- `image` (str | Image)
- `resources` (Resources | None)
- `entrypoint` (list[str] | None)
- `region_id` (str | None)