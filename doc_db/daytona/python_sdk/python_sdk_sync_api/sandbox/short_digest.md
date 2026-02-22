## Sandbox

Main class for sandbox operations with interfaces for fs, git, process, computer use, and code execution.

### Core Operations

```python
sandbox.start(timeout=60)
sandbox.stop(timeout=60)
sandbox.recover(timeout=60)  # From recoverable error
sandbox.delete(timeout=60)
sandbox.archive()  # Cost-effective storage (must be stopped)
sandbox.refresh_data()
sandbox.refresh_activity()  # Reset auto-stop timer
```

### Configuration

```python
sandbox.set_labels({"key": "value"})
sandbox.set_autostop_interval(60)  # Minutes idle (0=disable)
sandbox.set_auto_archive_interval(60)  # Minutes stopped (0=max)
sandbox.set_auto_delete_interval(60)  # Minutes stopped (0=immediate, -1=disable)
sandbox.resize(Resources(cpu=4, memory=8, disk=30), timeout=60)
```

### Access

```python
home = sandbox.get_user_home_dir()
work = sandbox.get_work_dir()
lsp = sandbox.create_lsp_server("python", "path/to/project")

preview = sandbox.get_preview_link(3000)  # Auto-opens port
signed = sandbox.create_signed_preview_url(3000, expires_in_seconds=60)
sandbox.expire_signed_preview_url(3000, token)

ssh = sandbox.create_ssh_access(expires_in_minutes=60)
sandbox.revoke_ssh_access(token)
sandbox.validate_ssh_access(token)
```

## PaginatedSandboxes

Paginated list: `items`, `total`, `page`, `total_pages`

## Resources

```python
Resources(cpu=2, memory=4, disk=20, gpu=1)
```