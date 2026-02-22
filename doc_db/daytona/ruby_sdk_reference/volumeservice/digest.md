## VolumeService

Service for managing Daytona Volumes with operations to list, get, create, and delete volumes.

### Constructor

```ruby
VolumeService.new(volumes_api, otel_state:)
```

**Parameters:**
- `volumes_api` - DaytonaApiClient:VolumesApi instance
- `otel_state` - Daytona:OtelState or nil

### Methods

#### create(name)
Creates a new volume.

```ruby
volume = service.create("my-volume")
```

**Parameters:** `name` (String)  
**Returns:** Daytona:Volume

#### get(name, create:)
Retrieves a volume by name, optionally creating it if it doesn't exist.

```ruby
volume = service.get("my-volume", create: true)
```

**Parameters:**
- `name` (String)
- `create` (Boolean) - whether to create if not found

**Returns:** Daytona:Volume

#### list()
Lists all volumes.

```ruby
volumes = service.list()
```

**Returns:** Array<Daytona:Volume>

#### delete(volume)
Deletes a volume.

```ruby
service.delete(volume)
```

**Parameters:** `volume` (Daytona:Volume)  
**Returns:** void