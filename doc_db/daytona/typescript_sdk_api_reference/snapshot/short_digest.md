## SnapshotService

CRUD operations for Daytona Snapshots (pre-configured sandboxes).

**Methods:**
- `create(params: CreateSnapshotParams, options?: {onLogs?, timeout?}): Promise<Snapshot>` - Create from Image
- `get(name: string): Promise<Snapshot>` - Get by name
- `list(page?, limit?): Promise<PaginatedSnapshots>` - List paginated
- `delete(snapshot: Snapshot): Promise<void>` - Delete snapshot
- `activate(snapshot: Snapshot): Promise<Snapshot>` - Activate snapshot

**Example:**
```ts
const image = Image.debianSlim('3.12').pipInstall('numpy');
const snapshot = await daytona.snapshot.create({ name: 'my-snapshot', image }, { onLogs: console.log });
const retrieved = await daytona.snapshot.get("my-snapshot");
const list = await daytona.snapshot.list(1, 10);
await daytona.snapshot.delete(snapshot);
```

**Types:**
- `CreateSnapshotParams` - {name, image, entrypoint?, regionId?, resources?}
- `PaginatedSnapshots` - {items: Snapshot[], page, total, totalPages}
- `Snapshot` - Branded SnapshotDto type