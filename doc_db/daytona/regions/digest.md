## Regions

Sandboxes run on runners organized into **regions** — geographic or logical groupings of compute infrastructure. Specify a region via the `target` parameter during initialization.

### Configuration

**Python:**
```python
from daytona import Daytona, DaytonaConfig

config = DaytonaConfig(target="us")
daytona = Daytona(config)
```

**TypeScript:**
```typescript
import { Daytona } from '@daytonaio/sdk';
const daytona = new Daytona({ target: "eu" });
```

**Go:**
```go
client, _ := daytona.NewClientWithConfig(&types.DaytonaConfig{
    Target: "us",
})
```

**Ruby:**
```ruby
require 'daytona'
config = Daytona::Config.new(target: "eu")
daytona = Daytona::Daytona.new(config)
```

### Shared Regions

Managed by Daytona, available to all organizations without setup. Limits apply to your organization's default region. Contact sales@daytona.io for access to different shared regions.

| Region        | Target   |
| ------------- | -------- |
| United States | `us`     |
| Europe        | `eu`     |

### Dedicated Regions

Managed by Daytona, provisioned exclusively for individual organizations. Contact sales@daytona.io to set up.

### Custom Regions

Created and managed by your organization using your own runner machines. Provides maximum control over data locality, compliance, and infrastructure configuration. No limits on concurrent resource usage. See the runners guide for details.

### Benefits

- Choose specific geographic locations for reduced latency
- Comply with data residency requirements
- Use your own runner machines for custom regions
- Scale compute resources independently within each custom region