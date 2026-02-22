## OpenTelemetry Collection

Experimental distributed tracing for SDK operations (requires access request).

**Sandbox Telemetry:** Configure OTLP endpoint and headers in Dashboard → Settings → Experimental. Collects CPU, memory, filesystem metrics; HTTP traces; application/system logs. Data retained 3 days.

**SDK Tracing:** Enable with `otelEnabled: true` or `DAYTONA_EXPERIMENTAL_OTEL_ENABLED=true`. Set OTLP environment variables:
```bash
OTEL_EXPORTER_OTLP_ENDPOINT=https://otlp.nr-data.net:4317
OTEL_EXPORTER_OTLP_HEADERS="api-key=YOUR_API_KEY"
```

**Example (Python):**
```python
async with Daytona(DaytonaConfig(_experimental={"otelEnabled": True})) as daytona:
    sandbox = await daytona.create()
    await sandbox.process.code_run("code")
    await daytona.delete(sandbox)
```

Similar patterns for TypeScript, Go, Ruby. Traces all SDK operations (create, delete, file operations, code execution) and HTTP requests with metadata.

**Providers:** New Relic, Jaeger, Grafana Cloud with specific endpoint/header configurations.

**Best practices:** Always close client to flush traces; monitor trace volume; test in development; use sampling for high-volume apps.