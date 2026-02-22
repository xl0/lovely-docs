## OpenTelemetry Collection

Experimental feature for distributed tracing of Daytona SDK operations. Currently requires access request to support@daytona.io.

### Sandbox Telemetry Collection

Configure in Dashboard → Settings → Experimental:
- **OTLP Endpoint**: e.g., `https://otlp.nr-data.net`
- **OTLP Headers**: `key=value` format, e.g., `api-key=YOUR_API_KEY`

**Collected metrics:**
- `daytona.sandbox.cpu.utilization`, `daytona.sandbox.cpu.limit`
- `daytona.sandbox.memory.utilization`, `daytona.sandbox.memory.usage`, `daytona.sandbox.memory.limit`
- `daytona.sandbox.filesystem.utilization`, `daytona.sandbox.filesystem.usage`, `daytona.sandbox.filesystem.available`, `daytona.sandbox.filesystem.total`

**Collected data:**
- HTTP requests/responses
- Custom spans from application code
- Application logs (stdout/stderr), system logs, runtime errors

View in Dashboard → Sandbox Details → Logs/Traces/Metrics tabs. Data retained for 3 days; use external OTLP collector for longer retention.

### SDK Tracing Configuration

Enable with `otelEnabled: true` in config or `DAYTONA_EXPERIMENTAL_OTEL_ENABLED=true` environment variable.

**Python:**
```python
from daytona import Daytona, DaytonaConfig

async with Daytona(DaytonaConfig(_experimental={"otelEnabled": True})) as daytona:
    sandbox = await daytona.create()
    await sandbox.process.code_run("import numpy as np\nprint(np.__version__)")
    await sandbox.fs.upload_file("local.txt", "/home/daytona/remote.txt")
    await daytona.delete(sandbox)
```

**TypeScript:**
```typescript
import { Daytona } from '@daytonaio/sdk'

await using daytona = new Daytona({ _experimental: { otelEnabled: true } })
const sandbox = await daytona.create()
await sandbox.process.codeRun("import numpy as np\nprint(np.__version__)")
await sandbox.fs.uploadFile('local.txt', '/home/daytona/remote.txt')
await daytona.delete(sandbox)
```

**Go:**
```go
client, err := daytona.NewClientWithConfig(&types.DaytonaConfig{
    Experimental: &types.ExperimentalConfig{OtelEnabled: true},
})
defer client.Close(context.Background())
sandbox, err := client.Create(ctx, nil)
sandbox.Process.CodeRun(ctx, &types.CodeRunParams{Code: "import numpy as np\nprint(np.__version__)"})
sandbox.Fs.UploadFile(ctx, "local.txt", "/home/daytona/remote.txt")
client.Delete(ctx, sandbox, nil)
```

**Ruby:**
```ruby
config = Daytona::Config.new(_experimental: { 'otel_enabled' => true })
daytona = Daytona::Daytona.new(config)
begin
  sandbox = daytona.create
  sandbox.process.code_run("import numpy as np\nprint(np.__version__)")
  sandbox.fs.upload_file("local.txt", "/home/daytona/remote.txt")
  daytona.delete(sandbox)
ensure
  daytona.close
end
```

**OTLP Configuration (environment variables):**
```bash
OTEL_EXPORTER_OTLP_ENDPOINT=https://otlp.nr-data.net:4317
OTEL_EXPORTER_OTLP_HEADERS="api-key=your-api-key-here"
```

### Provider-Specific Configuration

**New Relic:**
```bash
OTEL_EXPORTER_OTLP_ENDPOINT=https://otlp.nr-data.net:4317
OTEL_EXPORTER_OTLP_HEADERS="api-key=YOUR_NEW_RELIC_LICENSE_KEY"
```

**Jaeger (Local):**
```bash
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

**Grafana Cloud:**
```bash
OTEL_EXPORTER_OTLP_ENDPOINT=https://otlp-gateway-prod-<region>.grafana.net/otlp
OTEL_EXPORTER_OTLP_HEADERS="Authorization=Basic <BASE64_ENCODED_CREDENTIALS>"
```

### What Gets Traced

**SDK Operations:**
- `create()`, `get()`, `findOne()`, `list()`, `start()`, `stop()`, `delete()`
- All sandbox, snapshot, volume operations (file system, code execution, process management)

**HTTP Requests:**
- All API calls to Daytona backend with duration and status codes
- Error information for failed requests

**Trace Attributes:**
- Service name and version
- HTTP method, URL, status code
- Request/response duration
- Error details
- Custom SDK operation metadata

### Troubleshooting

**Traces not appearing:**
- Verify `otelEnabled: true` in config
- Check OTLP endpoint and headers are correct
- Ensure Daytona instance is properly closed/disposed to flush traces

**Connection refused:**
- Verify OTLP endpoint URL is correct and accessible
- Check firewall rules

**Authentication errors:**
- Verify API key format matches provider requirements
- Check `OTEL_EXPORTER_OTLP_HEADERS` format (key=value pairs)

### Best Practices

1. Always close the client to ensure traces are flushed (use context managers/defer/ensure blocks)
2. Monitor trace volume; tracing increases network traffic and storage
3. Test OTEL configuration in development first
4. Configure trace sampling for high-volume applications to reduce costs

### Dashboard Examples

Examples available for New Relic and Grafana in the Daytona repository.