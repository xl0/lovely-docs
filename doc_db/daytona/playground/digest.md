## Overview

Daytona Playground is an interactive browser-based environment for creating sandboxes, running SDK operations, and exploring features. Access it at https://app.daytona.io/dashboard/playground.

## Sandbox Tab

Configure and manage sandboxes through the left panel (parameters) and right panel (auto-generated SDK code snippets).

### Management Section
Configure sandbox parameters:
- **Sandbox language**: select programming language runtime
- **Sandbox resources**: allocate CPU, memory, storage
- **Sandbox lifecycle**: set lifecycle policies

Note: Sandboxes are only created when explicitly clicking **Run**. In Terminal or VNC tabs, sandboxes auto-create if none exist.

### File System Section
Manage files and directories:
- Create directories with custom permissions
- List files and directories at specified paths
- Delete files and directories

### Git Operations Section
Manage Git repositories:
- Clone repositories (specify URL, destination, branch, commit ID, credentials)
- Get repository status
- List branches

### Process and Code Execution Section
Run code and commands:
- Execute shell commands (fixed)
- Run code snippets (language-dependent, changes based on selected sandbox language)

## Terminal Tab

Web-based terminal connected to the sandbox, running on port 22222. Provides direct command-line access for running commands, viewing files, and debugging. Remains active while sandbox runs; restart sandbox if it stops due to inactivity.

Access restricted to authenticated organization members.

## VNC Tab

Graphical desktop access for GUI application interaction and Computer Use feature testing. Left panel contains interaction controls, right panel shows desktop view.

### Display Section
- Get display information
- List open windows

### Keyboard Section
- Press hotkey combinations
- Press individual keys with optional modifiers
- Type text into active window

### Mouse Section
- Click at specified positions
- Drag between positions
- Move cursor
- Get current cursor position

### Screenshot Section
- Capture screenshots with configurable format, scale, quality
- Show/hide cursor
- Capture full screen or specific regions