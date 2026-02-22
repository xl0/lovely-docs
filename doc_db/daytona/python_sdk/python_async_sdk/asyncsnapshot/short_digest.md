## AsyncSnapshotService

Async service for managing snapshots: `list(page, limit)`, `get(name)`, `create(params, on_logs, timeout)`, `delete(snapshot)`, `activate(snapshot)`, `process_image_context(object_storage_api, image)`.

## Snapshot

Pre-configured sandbox with: id, organization_id, general, name, image_name, state, size, entrypoint, cpu, gpu, mem, disk, error_reason, created_at, updated_at, last_used_at.

## CreateSnapshotParams

- `name` _str_
- `image` _str | Image_
- `resources` _Resources | None_
- `entrypoint` _list[str] | None_
- `region_id` _str | None_

Example:
```python
async with AsyncDaytona() as daytona:
    image = Image.debianSlim('3.12').pipInstall('numpy')
    snapshot = await daytona.snapshot.create(
        CreateSnapshotParams(name='my-snapshot', image=image),
        on_logs=lambda chunk: print(chunk, end=""),
    )
    result = await daytona.snapshot.list(page=1, limit=10)
    await daytona.snapshot.delete(snapshot)
```