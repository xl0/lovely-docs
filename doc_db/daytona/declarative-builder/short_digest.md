## Declarative Builder

Define sandbox dependencies programmatically via SDK instead of pre-built images.

### Two Workflows

1. **Declarative images**: Build on-demand, cached 24 hours, auto-reused
2. **Pre-built Snapshots**: Create persistent, reusable snapshots

### Quick Example

```python
image = Image.debian_slim("3.12").pip_install(["requests", "pytest"]).workdir("/home/daytona")
sandbox = daytona.create(CreateSandboxFromImageParams(image=image), on_snapshot_create_logs=print)
```

### Image Configuration Methods

- **Base images**: `Image.base()`, `Image.debian_slim()`
- **Packages**: `pip_install()`, `pip_install_from_requirements()`, `pip_install_from_pyproject()`
- **Files**: `add_local_file()`, `add_local_dir()`
- **Environment**: `env()`, `workdir()`
- **Commands**: `run_commands()`, `entrypoint()`, `cmd()`
- **Dockerfile**: `dockerfile_commands()`, `from_dockerfile()`

### Snapshots

```python
daytona.snapshot.create(CreateSnapshotParams(name="snapshot-name", image=image), on_logs=print)
sandbox = daytona.create(CreateSandboxFromSnapshotParams(snapshot="snapshot-name"))
```

Available in Python, TypeScript, and Ruby SDKs.