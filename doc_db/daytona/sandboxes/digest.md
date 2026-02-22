## Sandbox Lifecycle

Sandboxes are isolated runtime environments managed by Daytona. Default resources: 1 vCPU, 1GB RAM, 3GiB disk. Organizations can request up to 4 vCPUs, 8GB RAM, 10GB disk.

Sandboxes transition through states: created → running → stopped → archived → deleted, with error states possible.

## Runtime Support

Supports Python, TypeScript, and JavaScript. Default is Python. Set via `language` parameter.

Sandbox names are optional and reusable (become available after deletion).

## Creating Sandboxes

```python
from daytona import Daytona, CreateSandboxFromSnapshotParams, Resources, Image

daytona = Daytona()

# Basic creation
sandbox = daytona.create()

# With language, name, labels
sandbox = daytona.create(CreateSandboxFromSnapshotParams(
    language="python",
    name="my_awesome_sandbox",
    labels={"LABEL": "label"}
))

# Custom resources (CPU, memory, disk)
sandbox = daytona.create(CreateSandboxFromImageParams(
    image=Image.debian_slim("3.12"),
    resources=Resources(cpu=2, memory=4, disk=8)
))

# Ephemeral sandbox (auto-deleted when stopped)
sandbox = daytona.create(CreateSandboxFromSnapshotParams(
    ephemeral=True,
    auto_stop_interval=5  # minutes of inactivity
))
```

TypeScript: `await daytona.create({...})`, Ruby: `daytona.create(...)`, Go: `client.Create(ctx, params)`, CLI: `daytona create [flags]`, API: `POST /api/sandbox`.

Resource parameters are optional; defaults apply if omitted. Daytona maintains warm sandbox pools for fast launches.

## Lifecycle Operations

**Start**: `sandbox.start()` (Python/Ruby), `await sandbox.start()` (TypeScript), `sandbox.Start(ctx)` (Go), `daytona start [ID|NAME]` (CLI), `POST /api/sandbox/{id}/start` (API).

**List**: `daytona.list()` returns all sandboxes with ID, root directory, state. Supports label filtering: `daytona.list(labels={"env": "dev"})`.

**Stop**: `sandbox.stop()` - maintains filesystem, clears memory, incurs only disk costs. Can be restarted. Use `daytona.find_one(id)` to retrieve stopped sandbox.

**Archive**: `sandbox.archive()` - moves filesystem to cost-effective storage. Must be stopped first. Slower startup than stopped state.

**Recover**: `sandbox.recover()` - recovers from error state if `sandbox.recoverable` is true. Check before attempting.

**Resize**: `sandbox.resize(Resources(cpu=2, memory=4, disk=8))` - started sandboxes can only increase CPU/memory (not disk); stopped sandboxes can change all (disk only increases).

**Delete**: `sandbox.delete()` - permanently removes sandbox.

## Automated Lifecycle Management

**Auto-stop interval** (default 15 minutes): Stops running sandbox after inactivity. Set to `0` to disable. Resets on: preview access, SSH connections, Toolbox SDK API calls. Does NOT reset on: background scripts, long-running tasks without interaction.

```python
sandbox = daytona.create(CreateSandboxFromSnapshotParams(
    auto_stop_interval=0  # Run indefinitely
))
```

**Auto-archive interval** (default 7 days): Archives stopped sandbox after specified time. Set to `0` for max 30 days.

```python
sandbox = daytona.create(CreateSandboxFromSnapshotParams(
    auto_archive_interval=60  # 1 hour
))
```

**Auto-delete interval** (default: never): Deletes stopped sandbox after specified time. Set to `0` for immediate deletion after stop, `-1` to disable.

```python
sandbox = daytona.create(CreateSandboxFromSnapshotParams(
    auto_delete_interval=60  # 1 hour
))
sandbox.set_auto_delete_interval(0)  # Immediate
sandbox.set_auto_delete_interval(-1)  # Disable
```

All SDKs support setting these intervals on creation and via setter methods.