**AsyncDaytona**: Create/manage sandboxes from snapshots/images, lifecycle control (start/stop/delete/recover), config via DaytonaConfig or env vars.

**AsyncSandbox**: Sandbox instance with lifecycle, resource management, labels, preview/SSH links. Provides: `fs` (file ops), `git` (clone/commit/push/pull/branch), `process` (exec/code_run/sessions/PTY), `computer_use` (mouse/keyboard/screenshots/recording), `code_interpreter` (stateful Python with contexts).

**AsyncFileSystem**: CRUD, streaming upload/download, list, search (grep/glob), replace, permissions.

**AsyncGit**: clone (branch/commit/auth), add, commit, push, pull, status, branch ops.

**AsyncProcess**: exec (shell), code_run (auto-chart capture), sessions (background), PTY (interactive terminal).

**AsyncCodeInterpreter**: Stateful Python with isolated contexts, output callbacks, configurable timeout.

**AsyncComputerUse**: Mouse/keyboard, screenshots (full/region/compressed), display info, window mgmt, screen recording.

**AsyncLspServer**: IDE features (completions, symbol search) for Python/TypeScript/JavaScript.

**AsyncSnapshotService**: list/get/create/delete/activate snapshots.

**AsyncVolumeService**: list/get/create/delete volumes, VolumeMount with optional S3 subpath.

**AsyncObjectStorage**: Upload files, returns hash.