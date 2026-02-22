## Overview

The Daytona Model Context Protocol (MCP) Server enables AI agents to interact with Daytona's features programmatically. Supports Claude Desktop App, Claude Code, Cursor, and Windsurf.

## Prerequisites

- Daytona account
- Daytona CLI installed
- Compatible AI agent

## Installation

### Mac/Linux
```bash
brew install daytonaio/cli/daytona
daytona login
daytona mcp init [claude/cursor/windsurf]
```

### Windows
```bash
powershell -Command "irm https://get.daytona.io/windows | iex"
daytona login
daytona mcp init [claude/cursor/windsurf]
```

## Manual Configuration

Generate MCP configuration for other agents:
```bash
daytona mcp config
```

Output JSON configuration:
```json
{
  "mcpServers": {
    "daytona-mcp": {
      "command": "daytona",
      "args": ["mcp", "start"],
      "env": {
        "HOME": "${HOME}",
        "PATH": "${HOME}:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin",
        "APPDATA": "${APPDATA}"  // Windows only
      },
      "logFile": "${HOME}/Library/Logs/daytona/daytona-mcp-server.log"
    }
  }
}
```

## Sandbox Management

**Create Sandbox**
- Parameters: `name`, `target`, `snapshot`, `auto_stop_interval` (default: 15 min), `auto_archive_interval` (default: 10080 min), `auto_delete_interval` (default: -1, disabled), `volumes`, `network_block_all`, `network_allow_list` (comma-separated CIDR), `public`, `cpu`, `gpu`, `memory` (GB), `disk` (GB), `user`, `build_info`, `env`, `labels`

**Destroy Sandbox**
- Parameters: `id`

## File Operations

**Download File**
- Returns content as text or base64-encoded image
- Parameters: `id`, `file_path`

**Upload File**
- Supports text or base64-encoded binary content
- Creates parent directories automatically
- Parameters: `id`, `file_path`, `content`, `encoding`, `overwrite`

**Create Folder**
- Parameters: `id`, `folder_path`, `mode` (default: 0755)

**Get File Info**
- Parameters: `id`, `file_path`

**List Files**
- Parameters: `id`, `path` (defaults to current directory)

**Move File**
- Parameters: `id`, `source_path`, `dest_path`

**Delete File**
- Parameters: `id`, `file_path`

## Preview

**Preview Link**
- Generates accessible preview URLs for web applications
- Creates secure tunnels to expose local ports externally
- Validates server status on specified ports
- Parameters: `id`, `port`, `description`, `check_server`

## Git Operations

**Git Clone**
- Parameters: `id`, `url`, `path` (defaults to current), `branch`, `commit_id`, `username`, `password`

## Command Execution

**Execute Command**
- Runs shell commands with sandbox user permissions
- Returns stdout, stderr, exit code
- Parameters: `id`, `command`

## Troubleshooting

- Authentication: Run `daytona login`
- Connection errors: Verify MCP server configuration
- Sandbox errors: Use `daytona sandbox list`