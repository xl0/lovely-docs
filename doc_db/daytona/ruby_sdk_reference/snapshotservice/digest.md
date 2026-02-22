## SnapshotService

Service class for managing snapshots in Daytona SDK.

### Constructor

```ruby
SnapshotService.new(snapshots_api:, object_storage_api:, default_region_id:, otel_state:)
```

- `snapshots_api` - DaytonaApiClient:SnapshotsApi instance
- `object_storage_api` - DaytonaApiClient:ObjectStorageApi instance
- `default_region_id` - String or nil, default region for snapshot creation
- `otel_state` - Daytona:OtelState or nil

### Methods

#### list(page:, limit:)
List all snapshots with pagination.

```ruby
daytona = Daytona::Daytona.new
response = daytona.snapshot.list(page: 1, limit: 10)
response.items.each { |snapshot| puts "#{snapshot.name} (#{snapshot.image_name})" }
```

Returns `Daytona:PaginatedResource`. Raises `Daytona:Sdk:Error`.

#### get(name)
Get a snapshot by name.

```ruby
snapshot = daytona.snapshot.get("demo")
puts "#{snapshot.name} (#{snapshot.image_name})"
```

Returns `Daytona:Snapshot`.

#### create(params, on_logs:)
Create and register a new snapshot from an Image definition.

```ruby
image = Image.debianSlim('3.12').pipInstall('numpy')
params = CreateSnapshotParams.new(name: 'my-snapshot', image: image)
snapshot = daytona.snapshot.create(params) do |chunk|
  print chunk
end
```

- `params` - Daytona:CreateSnapshotParams with snapshot configuration
- `on_logs` - Optional Proc callback for handling creation logs (receives chunks)

Returns `Daytona:Snapshot`.

#### delete(snapshot)
Delete a snapshot.

```ruby
snapshot = daytona.snapshot.get("demo")
daytona.snapshot.delete(snapshot)
```

- `snapshot` - Daytona:Snapshot instance to delete

Returns void.

#### activate(snapshot)
Activate a snapshot.

```ruby
activated = daytona.snapshot.activate(snapshot)
```

- `snapshot` - Daytona:Snapshot instance

Returns `Daytona:Snapshot`.