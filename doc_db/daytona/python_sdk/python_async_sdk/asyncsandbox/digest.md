## AsyncSandbox

Represents a Daytona Sandbox with async operations. Inherits from `SandboxDto`.

### Attributes

Core interfaces:
- `fs` - AsyncFileSystem for file operations
- `git` - AsyncGit for version control
- `process` - AsyncProcess for executing processes
- `computer_use` - AsyncComputerUse for desktop automation
- `code_interpreter` - AsyncCodeInterpreter for stateful code execution (Python)

Sandbox metadata:
- `id`, `name`, `organization_id`, `user` - Identifiers and ownership
- `snapshot` - Daytona snapshot used for creation
- `env` - Environment variables (dict)
- `labels` - Custom labels (dict)
- `public` - Public accessibility flag
- `target` - Runner location

Resources:
- `cpu`, `gpu`, `memory` (GiB), `disk` (GiB)

State:
- `state` - Current state (e.g., "started", "stopped")
- `error_reason` - Error message if in error state
- `recoverable` - Whether error is recoverable
- `backup_state`, `backup_created_at` - Backup information

Lifecycle:
- `auto_stop_interval`, `auto_archive_interval`, `auto_delete_interval` - Inactivity timeouts (minutes)
- `created_at`, `updated_at` - Timestamps

Network:
- `network_block_all` - Block all network access
- `network_allow_list` - Comma-separated CIDR addresses

Other:
- `volumes` - Attached volumes
- `build_info` - Build information if created from dynamic build

### Methods

#### Initialization
```python
AsyncSandbox(sandbox_dto, toolbox_api, sandbox_api, code_toolbox, get_toolbox_base_url)
```

#### Data & State
```python
await sandbox.refresh_data()  # Refresh from API
await sandbox.refresh_activity()  # Reset lifecycle timer

home = await sandbox.get_user_home_dir()  # Get user home path
work_dir = await sandbox.get_work_dir()  # Get working directory (WORKDIR from Dockerfile or home)
```

#### Lifecycle Control
```python
await sandbox.start(timeout=60)  # Start and wait (0 = no timeout)
await sandbox.stop(timeout=60)   # Stop and wait
await sandbox.recover(timeout=60)  # Recover from recoverable error
await sandbox.delete(timeout=60)  # Delete sandbox

await sandbox.wait_for_sandbox_start(timeout=60)  # Poll until started
await sandbox.wait_for_sandbox_stop(timeout=60)   # Poll until stopped (treats destroyed as stopped)
```

#### Resource Management
```python
await sandbox.resize(Resources(cpu=4, memory=8, disk=30), timeout=60)
# Hot resize (running): CPU/memory can only increase
# Disk resize: requires stopped sandbox, can only increase
await sandbox.wait_for_resize_complete(timeout=60)
```

#### Lifecycle Configuration
```python
await sandbox.set_autostop_interval(60)  # Auto-stop after 60 min idle (0 = disable)
await sandbox.set_auto_archive_interval(60)  # Auto-archive after 60 min stopped (0 = max)
await sandbox.set_auto_delete_interval(60)  # Auto-delete after 60 min stopped (-1 = disable, 0 = immediate)
await sandbox.archive()  # Archive (must be stopped, moves filesystem to object storage)
```

#### Labels
```python
labels = await sandbox.set_labels({"project": "my-project", "env": "dev"})
```

#### Language Server Protocol
```python
lsp = sandbox.create_lsp_server("python", "workspace/project")
# Relative paths resolved from sandbox working directory
```

#### Preview Links
```python
preview = await sandbox.get_preview_link(3000)  # Auto-opens port, includes token for private sandboxes
print(preview.url, preview.token)

signed = await sandbox.create_signed_preview_url(3000, expires_in_seconds=60)
await sandbox.expire_signed_preview_url(3000, token)
```

#### SSH Access
```python
ssh = await sandbox.create_ssh_access(expires_in_minutes=60)
await sandbox.revoke_ssh_access(token)
validation = await sandbox.validate_ssh_access(token)
```

### Resources Dataclass

```python
@dataclass
class Resources:
    cpu: int | None  # CPU cores
    memory: int | None  # GiB
    disk: int | None  # GiB
    gpu: int | None  # GPU count
```

### AsyncPaginatedSandboxes

Paginated list of sandboxes:
- `items` - List of AsyncSandbox instances
- `total` - Total count across all pages
- `page` - Current page number
- `total_pages` - Total pages available

### Error Handling

Methods decorated with `@intercept_errors` raise `DaytonaError` with descriptive messages. Timeout-related methods raise `DaytonaError` if timeout is negative or operation times out.