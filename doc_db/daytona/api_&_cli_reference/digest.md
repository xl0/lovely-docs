## API Reference
Complete reference of all Daytona API operations and endpoints via interactive API reference component.

## CLI Reference
Comprehensive command-line interface for managing Daytona resources:

**Sandbox Lifecycle**: `create` (with cpu/memory/disk/gpu allocation, auto-archive/delete/stop intervals, environment variables, labels, volumes, network settings, snapshot selection, region targeting), `start`, `stop`, `archive`, `delete` (single or `--all`)

**Sandbox Operations**: `exec` (with `--cwd` and `--timeout`), `ssh` (with `--expires` token expiration, defaults 24h), `info` (yaml/json output), `list` (pagination: `--limit`, `--page`), `preview-url` (requires `--port`, `--expires` in seconds)

**Snapshots**: `create` (from Dockerfile with resource defaults: cpu 1, memory 1GB, disk 3GB; supports context, entrypoint, image name, region), `push` (local snapshot with resource allocation and optional name override), `list` (pagination), `delete` (single or `--all`)

**Volumes**: `create [NAME]` (with `--size` in GB), `delete`, `get` (yaml/json), `list`

**Organizations**: `create [NAME]` (sets as active), `use`, `list`, `delete`

**Authentication**: `login` (optional `--api-key`), `logout`

**MCP Server**: `init [AGENT_NAME]` (claude/windsurf/cursor), `start`, `config [AGENT_NAME]` (JSON output)

**Utilities**: `autocomplete` (bash/zsh/fish/powershell), `docs` (open in browser), `version`, `--version`/`-v`

All commands support `--help` flag.