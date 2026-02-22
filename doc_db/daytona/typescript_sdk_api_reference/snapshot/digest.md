## SnapshotService

Service for managing Daytona Snapshots (pre-configured sandboxes). Provides CRUD operations and activation.

### Constructor

```ts
new SnapshotService(
   clientConfig: Configuration, 
   snapshotsApi: SnapshotsApi, 
   objectStorageApi: ObjectStorageApi, 
   defaultRegionId?: string): SnapshotService
```

### Methods

#### activate()
```ts
activate(snapshot: Snapshot): Promise<Snapshot>
```
Activates a snapshot.

#### create()
```ts
create(params: CreateSnapshotParams, options: {
  onLogs?: (chunk: string) => void;
  timeout?: number;
}): Promise<Snapshot>
```
Creates and registers a new snapshot from an Image definition.

**Example:**
```ts
const image = Image.debianSlim('3.12').pipInstall('numpy');
await daytona.snapshot.create({ name: 'my-snapshot', image: image }, { onLogs: console.log });
```

#### delete()
```ts
delete(snapshot: Snapshot): Promise<void>
```
Deletes a Snapshot. Throws if snapshot does not exist or cannot be deleted.

**Example:**
```ts
const snapshot = await daytona.snapshot.get("snapshot-name");
await daytona.snapshot.delete(snapshot);
```

#### get()
```ts
get(name: string): Promise<Snapshot>
```
Gets a Snapshot by name. Throws if snapshot does not exist or cannot be accessed.

**Example:**
```ts
const snapshot = await daytona.snapshot.get("snapshot-name");
console.log(`Snapshot ${snapshot.name} is in state ${snapshot.state}`);
```

#### list()
```ts
list(page?: number, limit?: number): Promise<PaginatedSnapshots>
```
Lists paginated snapshots.

**Example:**
```ts
const result = await daytona.snapshot.list(2, 10);
console.log(`Found ${result.total} snapshots`);
result.items.forEach(snapshot => console.log(`${snapshot.name} (${snapshot.imageName})`));
```

## PaginatedSnapshots

Paginated list of snapshots with properties:
- `items: Snapshot[]` - Snapshots in current page
- `page: number` - Current page number
- `total: number` - Total snapshots across all pages
- `totalPages: number` - Total pages available

## CreateSnapshotParams

```ts
type CreateSnapshotParams = {
  entrypoint?: string[];
  image: string | Image;
  name: string;
  regionId?: string;
  resources?: Resources;
};
```

Parameters for snapshot creation. Image can be a string reference or Image instance.

## Snapshot

```ts
type Snapshot = SnapshotDto & {
  __brand: "Snapshot";
};
```

Branded type representing a pre-configured sandbox.