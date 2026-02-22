**Daytona** - Main client for sandbox creation/management from snapshots or images with resource config and auto-lifecycle intervals.

**Sandbox** - Sandbox instance with operations: `fs` (file upload/download/search/replace), `git` (clone/commit/push/pull/branch), `process` (exec/code_run/sessions/PTY), `code_interpreter` (Python execution with isolated contexts), `computer_use` (mouse/keyboard/screenshot/recording).

**FileSystem** - Upload/download files (bytes or streaming), create/list/delete directories, move/rename, set permissions, search by name/content, replace text.

**Git** - Clone, add, commit, push, pull, status, branch management with optional auth.

**Process** - Execute shell commands or language code, detect matplotlib charts, create background sessions with state persistence, interactive PTY sessions.

**CodeInterpreter** - Execute Python with output streaming callbacks, create isolated execution contexts with separate namespaces.

**ComputerUse** - Desktop automation: mouse (move/click/drag/scroll), keyboard (type/press/hotkeys), screenshots (full/region/compressed), display info, screen recording.

**LspServer** - Code intelligence: symbol search (document/sandbox), completions, file tracking for Python/TypeScript/JavaScript.

**SnapshotService** - List/get/create/delete pre-configured sandbox templates from Image definitions.

**VolumeService** - Create/manage shared storage volumes, mount in sandboxes with optional S3 subpath filtering.

**ObjectStorage** - Upload files to S3-compatible storage, returns file hash.

**Resources** - CPU, memory, disk, GPU allocation. **Image** - Declarative Docker image builder. **CreateSandboxParams** - Sandbox creation with language, resources, env vars, labels, auto-lifecycle intervals, volumes, network settings.