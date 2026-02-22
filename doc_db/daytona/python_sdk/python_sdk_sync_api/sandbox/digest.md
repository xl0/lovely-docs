## Sandbox

Main class representing a Daytona Sandbox with interfaces for file system, git, process execution, computer use automation, and code interpretation.

### Attributes

- `fs`, `git`, `process`, `computer_use`, `code_interpreter` - Operation interfaces
- `id`, `name`, `organization_id`, `user` - Identification
- `snapshot`, `build_info` - Creation source
- `env`, `labels` - Configuration (dict[str, str])
- `public`, `network_block_all`, `network_allow_list` - Network settings
- `target` - Runner location
- `cpu`, `gpu`, `memory`, `disk` - Resource allocation (int)
- `state`, `error_reason`, `recoverable` - Status
- `backup_state`, `backup_created_at` - Backup info
- `auto_stop_interval`, `auto_archive_interval`, `auto_delete_interval` - Lifecycle (minutes)
- `volumes` - Attached volumes
- `created_at`, `updated_at` - Timestamps

### Initialization

```python
sandbox = Sandbox(sandbox_dto, toolbox_api, sandbox_api, code_toolbox, get_toolbox_base_url)
```

### Data & State Management

```python
sandbox.refresh_data()  # Refresh from API
sandbox.refresh_activity()  # Reset auto-stop timer

# State transitions
sandbox.start(timeout=60)  # Start and wait (default 60s, 0=no timeout)
sandbox.stop(timeout=60)
sandbox.recover(timeout=60)  # Recover from recoverable error
sandbox.delete(timeout=60)
sandbox.archive()  # Move to cost-effective storage (must be stopped)

# Wait for state
sandbox.wait_for_sandbox_start(timeout=60)
sandbox.wait_for_sandbox_stop(timeout=60)
```

### Directory Access

```python
home = sandbox.get_user_home_dir()  # User home path
work = sandbox.get_work_dir()  # WORKDIR from Dockerfile or home
```

### Labels & Configuration

```python
labels = sandbox.set_labels({"project": "my-project", "env": "dev"})
sandbox.set_autostop_interval(60)  # Minutes of inactivity (0=disable)
sandbox.set_auto_archive_interval(60)  # Minutes stopped (0=max)
sandbox.set_auto_delete_interval(60)  # Minutes stopped (0=immediate, -1=disable)
```

### Resources

```python
sandbox.resize(Resources(cpu=4, memory=8, disk=30), timeout=60)
# Hot resize (running): CPU/memory can only increase
# Disk resize: requires stopped sandbox, can only increase
sandbox.wait_for_resize_complete(timeout=60)
```

### Language Server Protocol

```python
lsp = sandbox.create_lsp_server("python", "workspace/project")
# Relative paths resolved from sandbox working directory
```

### Preview & Access

```python
# Public preview link (auto-opens port, includes token for private sandboxes)
preview = sandbox.get_preview_link(3000)
print(preview.url, preview.token)

# Signed preview URLs
signed = sandbox.create_signed_preview_url(3000, expires_in_seconds=60)
sandbox.expire_signed_preview_url(3000, token)

# SSH access
ssh = sandbox.create_ssh_access(expires_in_minutes=60)
sandbox.revoke_ssh_access(token)
validation = sandbox.validate_ssh_access(token)
```

## PaginatedSandboxes

Paginated list wrapper for Sandbox instances.

**Attributes**: `items` (list[Sandbox]), `total` (int), `page` (int), `total_pages` (int)

## Resources

Dataclass for resource configuration.

```python
resources = Resources(cpu=2, memory=4, disk=20, gpu=1)
```

**Attributes**: `cpu`, `memory`, `disk`, `gpu` (all int | None)