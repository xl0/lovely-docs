## Volume

Wrapper class for volume data transfer objects from the Daytona API.

### Constructor

```ruby
Volume.new(volume_dto)
```

Initializes a Volume instance from a `DaytonaApiClient::SandboxVolume` DTO.

### Properties

Access volume attributes via methods:

- `id()` - String identifier
- `name()` - String name
- `organization_id()` - String organization identifier
- `state()` - String state
- `created_at()` - String creation timestamp
- `updated_at()` - String last update timestamp
- `last_used_at()` - String last usage timestamp
- `error_reason()` - String or nil, error details if applicable