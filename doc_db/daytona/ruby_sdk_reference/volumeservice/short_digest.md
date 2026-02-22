## VolumeService

Manages Daytona volumes: create, get, list, delete.

```ruby
service = VolumeService.new(volumes_api, otel_state:)
service.create("name")           # → Daytona:Volume
service.get("name", create: true) # → Daytona:Volume
service.list()                    # → Array<Daytona:Volume>
service.delete(volume)            # → void
```