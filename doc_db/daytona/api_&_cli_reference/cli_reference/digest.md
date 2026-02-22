## Commands

### Sandbox Lifecycle
- `daytona create [flags]` - Create sandbox with options for auto-archive/delete/stop intervals, resource allocation (cpu, memory, disk, gpu), environment variables, labels, volumes, network settings, snapshot selection, and target region
- `daytona start [SANDBOX_ID|NAME]` - Start a sandbox
- `daytona stop [SANDBOX_ID|NAME]` - Stop a sandbox
- `daytona archive [SANDBOX_ID|NAME]` - Archive a sandbox
- `daytona delete [SANDBOX_ID|NAME]` - Delete a sandbox (or `--all` for all sandboxes)

### Sandbox Operations
- `daytona exec [SANDBOX_ID|NAME] -- [COMMAND] [ARGS...]` - Execute command with `--cwd` for working directory and `--timeout` in seconds
- `daytona ssh [SANDBOX_ID|NAME]` - SSH into sandbox with `--expires` for token expiration (defaults to 24 hours)
- `daytona info [SANDBOX_ID|NAME]` - Get sandbox info in yaml/json format
- `daytona list` - List sandboxes with pagination (`--limit`, `--page`) and output format options
- `daytona preview-url [SANDBOX_ID|NAME]` - Get signed preview URL for sandbox port with `--port` (required) and `--expires` in seconds

### Snapshots
- `daytona snapshot create [SNAPSHOT]` - Create snapshot from Dockerfile with resource defaults (cpu: 1, memory: 1GB, disk: 3GB), context specification, entrypoint, image name, and region
- `daytona snapshot push [SNAPSHOT]` - Push local snapshot with resource allocation and optional name override
- `daytona snapshot list` - List snapshots with pagination and format options
- `daytona snapshot delete [SNAPSHOT_ID]` - Delete snapshot (or `--all`)

### Volumes
- `daytona volume create [NAME]` - Create volume with `--size` in GB
- `daytona volume delete [VOLUME_ID]` - Delete volume
- `daytona volume get [VOLUME_ID]` - Get volume details in yaml/json
- `daytona volume list` - List all volumes with format options

### Organizations
- `daytona organization create [NAME]` - Create organization and set as active
- `daytona organization use [ORGANIZATION]` - Set active organization
- `daytona organization list` - List organizations with format options
- `daytona organization delete [ORGANIZATION]` - Delete organization

### Authentication
- `daytona login` - Login with optional `--api-key`
- `daytona logout` - Logout

### MCP Server
- `daytona mcp init [AGENT_NAME]` - Initialize MCP Server (supports: claude, windsurf, cursor)
- `daytona mcp start` - Start MCP Server
- `daytona mcp config [AGENT_NAME]` - Output JSON configuration

### Utilities
- `daytona autocomplete [bash|zsh|fish|powershell]` - Add shell completion (requires bash-completion on Linux/macOS)
- `daytona docs` - Open documentation in browser
- `daytona version` - Print version number
- `daytona --version` / `-v` - Display version

All commands support `--help` flag for per-command documentation.