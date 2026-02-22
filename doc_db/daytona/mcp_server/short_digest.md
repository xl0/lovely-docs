## Setup

```bash
brew install daytonaio/cli/daytona  # Mac/Linux
# or Windows: powershell -Command "irm https://get.daytona.io/windows | iex"
daytona login
daytona mcp init [claude/cursor/windsurf]
```

Manual config: `daytona mcp config` outputs JSON for custom agent integration.

## Tools

**Sandbox**: Create (name, target, snapshot, auto_stop_interval, auto_archive_interval, auto_delete_interval, volumes, network_block_all, network_allow_list, public, cpu, gpu, memory, disk, user, build_info, env, labels), Destroy (id)

**Files**: Download (id, file_path), Upload (id, file_path, content, encoding, overwrite), Create Folder (id, folder_path, mode), Get Info (id, file_path), List (id, path), Move (id, source_path, dest_path), Delete (id, file_path)

**Preview**: Preview Link (id, port, description, check_server)

**Git**: Clone (id, url, path, branch, commit_id, username, password)

**Command**: Execute (id, command) - returns stdout, stderr, exit code