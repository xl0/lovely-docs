## Sandbox Class

Manages isolated execution environments with lifecycle, resource, and access control.

### Core Operations
```ruby
sandbox.start(timeout: 60)
sandbox.stop(timeout: 60)
sandbox.recover(timeout: 40)
sandbox.delete()
sandbox.archive()  # Move to storage (must be stopped)
```

### Configuration
```ruby
sandbox.auto_stop_interval = 30      # Idle timeout (minutes)
sandbox.auto_archive_interval = 120  # Auto-archive when stopped
sandbox.auto_delete_interval = 1440  # Auto-delete when stopped
sandbox.labels = {"env" => "prod"}
sandbox.resize(Daytona::Resources.new(cpu: 4, memory: 8))
```

### Access & Previews
```ruby
sandbox.get_user_home_dir()
sandbox.get_work_dir()
sandbox.preview_url(3000)
sandbox.create_signed_preview_url(3000, expires_in_seconds: 120)
sandbox.create_ssh_access(expires_in_minutes: 60)
```

### Tooling
```ruby
sandbox.code_toolbox()
sandbox.process()
sandbox.fs()
sandbox.git()
sandbox.computer_use()
sandbox.code_interpreter()
sandbox.create_lsp_server(language_id: :python, path_to_project: "/path")
```

### State & Properties
- `id()`, `organization_id()`, `user()`, `snapshot()`
- `state()`, `desired_state()`, `error_reason()`
- `cpu()`, `gpu()`, `memory()`, `disk()`
- `env()`, `labels()`, `public()`, `network_block_all()`, `network_allow_list()`
- `volumes()`, `build_info()`, `created_at()`, `updated_at()`, `daemon_version()`