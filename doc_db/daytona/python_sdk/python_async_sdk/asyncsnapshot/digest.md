## Snapshot

Pre-configured sandbox representation with attributes: `id`, `organization_id`, `general`, `name`, `image_name`, `state`, `size`, `entrypoint`, `cpu`, `gpu`, `mem`, `disk`, `error_reason`, `created_at`, `updated_at`, `last_used_at`.

## AsyncSnapshotService

Service for managing snapshots with async methods.

### list
```python
async def list(page: int | None = None, limit: int | None = None) -> PaginatedSnapshots
```
Returns paginated list of snapshots.

```python
async with AsyncDaytona() as daytona:
    result = await daytona.snapshot.list(page=2, limit=10)
    for snapshot in result.items:
        print(f"{snapshot.name} ({snapshot.image_name})")
```

### get
```python
async def get(name: str) -> Snapshot
```
Get snapshot by name.

```python
snapshot = await daytona.snapshot.get("test-snapshot-name")
```

### create
```python
async def create(params: CreateSnapshotParams,
                 *,
                 on_logs: Callable[[str], None] | None = None,
                 timeout: float | None = 0) -> Snapshot
```
Creates and registers new snapshot from Image definition. `on_logs` callback handles creation logs. `timeout` in seconds (0 = no timeout).

```python
image = Image.debianSlim('3.12').pipInstall('numpy')
snapshot = await daytona.snapshot.create(
    CreateSnapshotParams(name='my-snapshot', image=image),
    on_logs=lambda chunk: print(chunk, end=""),
)
```

### delete
```python
async def delete(snapshot: Snapshot) -> None
```
Delete a snapshot.

```python
snapshot = await daytona.snapshot.get("test-snapshot")
await daytona.snapshot.delete(snapshot)
```

### activate
```python
async def activate(snapshot: Snapshot) -> Snapshot
```
Activate a snapshot, returns activated instance.

### process_image_context
```python
@staticmethod
async def process_image_context(object_storage_api: ObjectStorageApi,
                                image: Image) -> list[str]
```
Processes image context by uploading to object storage, returns list of context hashes.

## PaginatedSnapshots

Paginated list container with attributes: `items` (list of Snapshot), `total`, `page`, `total_pages`.

## CreateSnapshotParams

Parameters for snapshot creation:
- `name` _str_ - Snapshot name
- `image` _str | Image_ - Image reference or Image instance (string must be available on registry)
- `resources` _Resources | None_ - Resource allocation
- `entrypoint` _list[str] | None_ - Container entrypoint
- `region_id` _str | None_ - Region ID (defaults to organization default region)