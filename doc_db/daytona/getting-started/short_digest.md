## Access Methods

- **Dashboard**: https://app.daytona.io/
- **SDKs**: Python, TypeScript, Ruby, Go
- **CLI**: `brew install daytonaio/cli/daytona` (Mac/Linux) or PowerShell (Windows)
- **API**: RESTful endpoints
- **MCP Server**: `daytona mcp init [claude/cursor/windsurf]`

## Browser/Serverless Support

TypeScript SDK works in Node.js, browsers, and serverless (Cloudflare Workers, AWS Lambda, Azure Functions). Requires node polyfills in Vite and Next.js.

## Common Examples

Create sandbox:
```python
daytona = Daytona()
sandbox = daytona.create()
```

Create and execute:
```python
sandbox = daytona.create()
response = sandbox.process.exec("echo 'Hello, World!'")
sandbox.delete()
```

Custom resources:
```python
sandbox = daytona.create(
    CreateSandboxFromImageParams(
        image=Image.debian_slim("3.12"),
        resources=Resources(cpu=2, memory=4, disk=8)
    )
)
```

Ephemeral sandbox:
```python
sandbox = daytona.create(
    CreateSandboxFromSnapshotParams(ephemeral=True, auto_stop_interval=5)
)
```

From snapshot:
```python
sandbox = daytona.create(
    CreateSandboxFromSnapshotParams(snapshot="my-snapshot-name", language="python")
)
```

Declarative image:
```python
image = Image.debian_slim("3.12").pip_install(["requests", "pandas", "numpy"]).workdir("/home/daytona")
sandbox = daytona.create(CreateSandboxFromImageParams(image=image))
```

With volumes:
```python
volume = daytona.volume.get("my-volume", create=True)
sandbox = daytona.create(
    CreateSandboxFromSnapshotParams(
        volumes=[VolumeMount(volume_id=volume.id, mount_path="/home/daytona/data")]
    )
)
```

With Git:
```python
sandbox = daytona.create()
sandbox.git.clone("https://github.com/daytonaio/daytona.git", "/home/daytona/daytona")
status = sandbox.git.status("/home/daytona/daytona")
```

With labels:
```python
sandbox = daytona.create(
    CreateSandboxFromSnapshotParams(labels={"project": "my-app", "env": "dev"})
)
found = daytona.find_one(labels={"project": "my-app"})
```

All examples available in Python, TypeScript, Go, Ruby, CLI, and API.
