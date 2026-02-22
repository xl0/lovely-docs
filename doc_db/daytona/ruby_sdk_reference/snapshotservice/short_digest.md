## SnapshotService

Manage snapshots: list, get, create from images, delete, activate.

```ruby
daytona = Daytona::Daytona.new

# List snapshots
daytona.snapshot.list(page: 1, limit: 10).items.each { |s| puts s.name }

# Get snapshot
snapshot = daytona.snapshot.get("demo")

# Create from image with logs
image = Image.debianSlim('3.12').pipInstall('numpy')
params = CreateSnapshotParams.new(name: 'my-snapshot', image: image)
snapshot = daytona.snapshot.create(params) { |chunk| print chunk }

# Delete
daytona.snapshot.delete(snapshot)

# Activate
daytona.snapshot.activate(snapshot)
```