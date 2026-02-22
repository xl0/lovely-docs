## Daytona Class

Main class for the Daytona SDK.

### Constructor

```ruby
Daytona.new(config)
```

Creates a new Daytona instance. `config` parameter accepts a `Daytona::Config` object (defaults to `Daytona::Config.new`).

### Configuration & API Access

- `config()` - Returns the `Daytona::Config` instance
- `api_client()` - Returns the `DaytonaApiClient`
- `sandbox_api()` - Returns `DaytonaApiClient::SandboxApi`
- `object_storage_api()` - Returns `DaytonaApiClient::ObjectStorageApi`
- `snapshots_api()` - Returns `DaytonaApiClient::SnapshotsApi`
- `volume()` - Returns `Daytona::VolumeService`
- `snapshot()` - Returns `Daytona::SnapshotService`

### Sandbox Lifecycle Management

**Create**
```ruby
daytona.create(params, on_snapshot_create_logs:)
```
Creates a sandbox with specified parameters. `params` can be `Daytona::CreateSandboxFromSnapshotParams`, `Daytona::CreateSandboxFromImageParams`, or `Nil`. Raises `Daytona::Sdk::Error` if `auto_stop_interval` or `auto_archive_interval` is negative.

**Start/Stop**
```ruby
daytona.start(sandbox, timeout)  # timeout defaults to 60s
daytona.stop(sandbox, timeout)   # timeout defaults to 60s
```
Starts or stops a sandbox and waits for the operation to complete.

**Delete**
```ruby
daytona.delete(sandbox)
```

### Sandbox Retrieval

**Get by ID**
```ruby
daytona.get(id)
```

**Find by ID or labels**
```ruby
daytona.find_one(id:, labels:)
```
Raises `Daytona::Sdk::Error` if not found.

**List with filtering**
```ruby
daytona.list(labels, page:, limit:)
```
Returns `Daytona::PaginatedResource`. Raises `Daytona::Sdk::Error` on error.

### Cleanup

```ruby
daytona.close()
```
Shuts down OTel providers and flushes pending telemetry data.