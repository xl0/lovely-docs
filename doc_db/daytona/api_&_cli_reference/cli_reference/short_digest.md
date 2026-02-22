## Core Commands

**Sandbox**: `create`, `start`, `stop`, `archive`, `delete`, `exec`, `ssh`, `info`, `list`, `preview-url`

**Snapshots**: `snapshot create` (from Dockerfile, defaults: 1 cpu, 1GB mem, 3GB disk), `snapshot push`, `list`, `delete`

**Volumes**: `volume create [NAME] --size [GB]`, `delete`, `get`, `list`

**Organizations**: `organization create`, `use`, `list`, `delete`

**Auth**: `login [--api-key]`, `logout`

**MCP**: `mcp init [agent]` (claude/windsurf/cursor), `mcp start`, `mcp config`

**Utils**: `autocomplete [shell]`, `docs`, `version`

All commands support `--help` and most support output format flags (`-f yaml|json`).