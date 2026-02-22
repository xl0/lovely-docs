## Sandbox Class

Core class for managing isolated execution environments in Daytona SDK.

### Constructor

```ruby
Sandbox.new(code_toolbox:, sandbox_dto:, config:, sandbox_api:, get_proxy_toolbox_url:, otel_state:)
```

### Properties (Getters)

**Identification & Organization**
- `id()` → String
- `organization_id()` → String
- `user()` → String

**Configuration**
- `snapshot()` → String
- `env()` → Hash<String, String>
- `labels()` → Hash<String, String>
- `target()` → String

**Network & Access**
- `public()` → Boolean (HTTP preview visibility)
- `network_block_all()` → Boolean
- `network_allow_list()` → String (comma-separated CIDR addresses)

**Resource Quotas**
- `cpu()` → Float
- `gpu()` → Float
- `memory()` → Float
- `disk()` → Float

**State Management**
- `state()` → DaytonaApiClient:SandboxState
- `desired_state()` → DaytonaApiClient:SandboxDesiredState
- `error_reason()` → String

**Backup & Lifecycle**
- `backup_state()` → String
- `backup_created_at()` → String
- `auto_stop_interval()` → Float (minutes, 0 = disabled)
- `auto_archive_interval()` → Float (minutes)
- `auto_delete_interval()` → Float (minutes, negative = disabled, 0 = immediate)

**Storage & Build**
- `volumes()` → Array<DaytonaApiClient:SandboxVolume>
- `build_info()` → DaytonaApiClient:BuildInfo

**Timestamps**
- `created_at()` → String
- `updated_at()` → String
- `daemon_version()` → String

**Tooling Access**
- `code_toolbox()` → Daytona:SandboxPythonCodeToolbox | Daytona:SandboxTsCodeToolbox
- `config()` → Daytona:Config
- `sandbox_api()` → DaytonaApiClient:SandboxApi
- `process()` → Daytona:Process
- `fs()` → Daytona:FileSystem
- `git()` → Daytona:Git
- `computer_use()` → Daytona:ComputerUse
- `code_interpreter()` → Daytona:CodeInterpreter

### Lifecycle Methods

**Start/Stop/Recover**
```ruby
sandbox.start(timeout: 60)           # Start and wait (default 60s)
sandbox.stop(timeout: 60)            # Stop and wait
sandbox.recover(timeout: 40)         # Recover from error and wait
sandbox.refresh()                    # Refresh data from API
sandbox.refresh_activity()           # Reset activity timer for lifecycle management
```

**Archive & Delete**
```ruby
sandbox.archive()  # Move to cost-effective storage (must be stopped first)
sandbox.delete()   # Delete sandbox
```

**Resize**
```ruby
# Increase CPU/memory while running
sandbox.resize(Daytona::Resources.new(cpu: 4, memory: 8))

# Stop first to resize disk or decrease resources
sandbox.stop
sandbox.resize(Daytona::Resources.new(cpu: 2, memory: 4, disk: 30))

sandbox.wait_for_resize_complete(timeout: 60)
```

### Lifecycle Configuration (Setters)

```ruby
sandbox.auto_stop_interval = 30      # Auto-stop after 30 min idle (no SDK events)
sandbox.auto_archive_interval = 120  # Auto-archive after 120 min stopped
sandbox.auto_delete_interval = 1440  # Auto-delete after 1440 min stopped
sandbox.labels = {"env" => "prod"}
```

### Directory Access

```ruby
user_home = sandbox.get_user_home_dir()  # User's home directory
work_dir = sandbox.get_work_dir()        # WORKDIR from Dockerfile or home fallback
```

### Preview URLs

```ruby
# Get preview URL (opens port automatically if closed, includes token for private sandboxes)
preview = sandbox.preview_url(3000)

# Create signed URL with expiration
signed = sandbox.create_signed_preview_url(3000, expires_in_seconds: 120)
puts signed.url
puts signed.token

# Expire signed URL
sandbox.expire_signed_preview_url(3000, "token-value")
```

### SSH Access

```ruby
# Create SSH token
ssh = sandbox.create_ssh_access(expires_in_minutes: 60)

# Validate token
validation = sandbox.validate_ssh_access(token)

# Revoke token
sandbox.revoke_ssh_access(token)
```

### Language Server Protocol

```ruby
lsp = sandbox.create_lsp_server(
  language_id: Daytona::LspServer::Language::PYTHON,
  path_to_project: "/path/to/project"  # Relative to sandbox working directory
)
```

### Wait Methods

```ruby
sandbox.wait_for_sandbox_start(timeout: 60)  # Poll until 'started' state
sandbox.wait_for_sandbox_stop(timeout: 60)   # Poll until 'stopped' state (treats destroyed as stopped)
```

### Error Handling

Methods that modify state raise `Daytona:Sdk:Error` on failure:
- `auto_stop_interval=`
- `auto_archive_interval=`
- `auto_delete_interval=`
- `resize`