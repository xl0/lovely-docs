**Sync & Async Python SDK** for sandbox lifecycle, file/git/process ops, code execution, desktop automation, LSP, snapshots, volumes.

**Setup:** `pip install daytona`, configure via env vars or `DaytonaConfig(api_key, api_url, target)`.

**Sandbox lifecycle:** Create from image/snapshot with resources/env/autostop, start/stop/delete/recover, resize, get home/work dirs, create LSP server, preview links, SSH access.

**File ops:** Create/delete folders, upload/download (streaming), list/search (glob/grep), move, permissions, replace text.

**Git:** Clone (branch/commit/auth), add/commit/push/pull, status, branch management.

**Process:** `exec()` shell, `code_run()` with chart detection, background sessions (state), PTY sessions (interactive terminal).

**Code interpreter:** Run Python with isolated contexts, output streaming, configurable timeout.

**Desktop:** Mouse (move/click/drag/scroll), keyboard (type/press/hotkey), screenshots (full/region/compressed), display info, window mgmt, screen recording.

**LSP:** Code completion, symbol search, diagnostics (Python/TypeScript/JavaScript).

**Snapshots:** List/get/create/delete/activate pre-configured templates.

**Volumes:** List/create/delete shared storage, mount with optional S3 subpath filtering.

**Image builder:** Chainable `Image.base()`, `Image.debian_slim()`, `Image.from_dockerfile()` with pip install, file ops, env, workdir, run commands.

**Charts:** Matplotlib hierarchy—`Chart`, `Chart2D`, `PointChart`/`LineChart`/`ScatterChart`, `BarChart`, `PieChart`, `BoxAndWhiskerChart`, `CompositeChart`.

**Errors:** `DaytonaError`, `DaytonaNotFoundError`, `DaytonaRateLimitError`, `DaytonaTimeoutError`.