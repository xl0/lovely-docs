Complete Daytona documentation covering sandbox management, SDKs (Python/TypeScript/Ruby/Go), CLI, and REST API. Includes:

**Core Concepts**: Sandboxes are isolated runtimes (Python/TypeScript/JavaScript) with configurable resources (default 1 vCPU/1GB/3GiB). Lifecycle: create → start → stop → archive → delete. Auto-stop after 15min inactivity, auto-archive after 7 days, optional auto-delete.

**SDKs**: Python (sync/async), TypeScript (Node.js/browser/serverless), Ruby, Go. All support sandbox lifecycle, file operations, git, process execution, code interpretation, desktop automation, LSP, snapshots, volumes.

**Sandbox Operations**:
- Create: `daytona.create(CreateSandboxFromSnapshotParams(snapshot="name"))` or from Docker image with custom resources
- File system: upload/download (streaming), list, delete, permissions, find/replace text, move
- Git: clone, branch management, add, commit, push/pull with auth
- Process: execute commands, code execution (stateless/stateful Python), background sessions, PTY interactive terminals
- Code interpreter: stateful Python with isolated contexts, streaming output
- Desktop automation: mouse/keyboard/screenshot/recording/display operations
- LSP: code completion, symbol search for Python/TypeScript

**Advanced Features**:
- Snapshots: pre-configured templates from Docker images with custom resources
- Volumes: FUSE-based shared mounts across sandboxes, S3-backed
- Preview links: standard (token in header) or signed (token in URL, custom expiry)
- SSH access: time-limited tokens for IDE integration
- VNC: browser-based desktop with Computer Use automation
- Network limiting: tier-based or per-sandbox allow/block lists
- VPN: Tailscale (browser/auth key/terminal) or OpenVPN (config file)
- Webhooks: HTTP callbacks for sandbox/snapshot/volume lifecycle events
- Audit logs: track organization activity with filtering
- Rate limiting: per-tier request limits with retry strategies
- OpenTelemetry: experimental distributed tracing

**AI Agent Integration**: Complete guides for Claude SDK, DSPy RLMs, AgentKit, OpenAI Codex, Google ADK, LangChain, Letta, Mastra, OpenClaw, OpenCode, TRL/GRPO. Agents can create web apps, run tests, execute scripts, with real-time execution and preview links.

**Configuration**: Via code (DaytonaConfig), environment variables (DAYTONA_API_KEY, DAYTONA_API_URL, DAYTONA_TARGET), .env file, or defaults. Precedence: code > env vars > .env > defaults.

**Deployment**: Docker Compose setup for local development with API, Runner, Proxy, SSH Gateway, PostgreSQL, Redis, Dex OIDC, Registry, MinIO, MailDev, Jaeger. Comprehensive environment variable configuration for all services. Optional Auth0 integration.

**Regions**: Shared (us/eu), dedicated, or custom regions with own runners. Set via `target` parameter.

**Organizations**: Personal (single user) or collaborative (team with role-based access). Roles: Owner (full access), Member (resource access via assignments). Assignments: Viewer, Developer, various Admins, Super Admin, Auditor.

**Billing**: Wallet with automatic top-up rules, coupon redemption, billing emails. Tier-based resource quotas (Tier 1-4 with increasing CPU/RAM/storage).

**Playground**: Interactive browser environment with Sandbox tab (management, file system, Git, code execution), Terminal tab (web CLI), VNC tab (GUI desktop with controls).

**MCP Server**: Model Context Protocol for AI agents (Claude, Cursor, Windsurf) to programmatically manage sandboxes, files, git, execute commands.

**Error Handling**: Specialized error types (DaytonaError, DaytonaNotFoundError, DaytonaRateLimitError, DaytonaTimeoutError) with status codes and headers.

**Limits**: Resource quotas by tier, rate limits (general/sandbox creation/lifecycle), best practices for handling 429 errors with exponential backoff.

**Declarative Builder**: Code-first image definition with chainable methods for base images, package managers, file operations, environment config, Dockerfile integration. Supports pip install, requirements.txt, pyproject.toml, local files/directories.

**Log Streaming**: Real-time logs from processes with separate stdout/stderr callbacks (async) or snapshot retrieval. Session command logs available in two streams.

**Image Builder**: Dynamic sandbox image building with factory methods (base, debian_slim, from_dockerfile) and chainable configuration (workdir, env, run_commands, pip_install, add_local_file/dir, cmd, entrypoint, dockerfile_commands).

**Chart Models**: Matplotlib chart hierarchy (Chart, Chart2D, PointChart, LineChart, ScatterChart, BarChart, PieChart, BoxAndWhiskerChart, CompositeChart) with type enum and metadata.

**API Keys**: Create with granular permission scopes (read/write/delete for sandboxes, snapshots, registries, volumes, audit logs, regions, runners).

**Getting Started**: Account creation, API key generation, SDK installation, sandbox creation/code execution workflow. Examples for creating sandboxes with custom resources, ephemeral mode, snapshots, declarative images, volumes, Git repos, labels.

**CLI**: Commands for sandbox lifecycle (create, start, stop, archive, delete), snapshots, volumes, organizations, authentication, MCP server, utilities (autocomplete, docs, version).

**REST API**: Interactive API reference component for all Daytona operations and endpoints.

**Custom Domain Authentication**: Deploy custom preview proxy with custom domains, authentication, auto-start, custom error pages, Daytona control headers (skip-warning, disable-CORS, skip-activity-update, preview-token).

**Linked Accounts**: Link/unlink Google or GitHub accounts; GitHub linking enables Tier 2 upgrade.

**Object Storage**: Upload files to S3-compatible storage, returns file hash.

**Audit Logs**: Track organization activity (create, read, update, delete, login, etc.) with actor, action, target, outcome, metadata, IP address, user agent, source. Accessible via dashboard or API with time filtering and real-time refresh.

**Computer Use**: Desktop automation API with mouse (click, move, drag, scroll, position), keyboard (type, press, hotkey), screenshot (full/region/compressed), recording (start/stop/list/download/delete), display (info, windows). Lifecycle: start/stop/status/restart/logs/errors.

**File System**: Create/delete folders, upload/download (single/batch/streaming), list, get info, set permissions, find/replace text, move/rename files.

**Git**: Clone (with branch/commit/auth), add, commit, push, pull, status, branch management (create/checkout/delete).

**Language Server Protocol**: IDE features (code completion, symbol search, diagnostics) for Python/TypeScript. Lifecycle: start/stop, file notifications (did_open/did_close), document symbols, sandbox symbols.

**Process Execution**: Shell commands with cwd/env/timeout, code execution (stateless/stateful), background sessions (create/execute/get/list/delete), PTY interactive terminals (create/connect/list/info/kill/resize).

**PTY Sessions**: Pseudo-terminal for interactive terminal sessions. Create with size/cwd/env, connect to existing, send input, wait for completion, resize, kill. Supports REPLs, debuggers, build processes, system administration, terminal UIs.

**Snapshots**: Pre-configured templates from Docker/OCI images with custom resources and regions. Support Docker-in-Docker and Kubernetes (k3s). Default snapshots include Python packages (anthropic, beautifulsoup4, claude-agent-sdk, daytona, django, flask, huggingface-hub, instructor, keras, langchain, llama-index, matplotlib, numpy, ollama, openai, opencv-python, pandas, pillow, pydantic-ai, requests, scikit-learn, scipy, seaborn, sqlalchemy, torch, transformers) and Node.js packages (anthropic, bun, openclaw, opencode-ai, ts-node, typescript, typescript-language-server).

**Volumes**: FUSE-based shared file mounts across sandboxes with S3 storage. Create, mount to absolute paths (with subpath support), read/write like normal files, list, delete. Max 100 per org, slower than local FS, no block storage.

**Network Limits**: Tier-based restrictions or per-sandbox allow/block lists. Essential services (package registries, container registries, Git, CDN, AI/ML APIs, Docker, Maven, Google Fonts, AWS S3, Daytona) always whitelisted.

**Preview**: Two types - standard (token in header, resets on restart) for programmatic access, signed (token in URL, custom expiry, persistent) for sharing. Public sandboxes need no auth. Warning page shown on first visit (skip with header or Tier 3).

**SSH Access**: Create time-limited tokens for sandbox access, connect via `ssh <token>@ssh.app.daytona.io`, integrate with VSCode/JetBrains, revoke anytime.

**Web Terminal**: Web-based terminal on port 22222, accessible only to Organization members regardless of public settings.

**OSS Deployment**: Docker Compose for local development with comprehensive environment variable configuration for API, Runner, Proxy, SSH Gateway, PostgreSQL, Redis, Dex, Registry, MinIO, MailDev, Jaeger. Optional Auth0 integration.

**Configuration**: Via code (DaytonaConfig), environment variables, .env file, or defaults. Precedence: code > env vars > .env > defaults. Requires api_key, optional api_url and target region.

**Limits**: Resource quotas by tier (Tier 1: 10 vCPU/10GiB/30GiB, Tier 2: 100/200GiB/300GiB, Tier 3: 250/500GiB/2000GiB, Tier 4: 500/1000GiB/5000GiB). Rate limits per tier (general/sandbox creation/lifecycle). Running sandboxes count CPU/memory/storage, stopped count storage only, archived count nothing.

**OpenTelemetry**: Experimental distributed tracing for SDK operations and sandbox telemetry. Enable with config flag or env var, configure OTLP endpoint/headers, traces all SDK calls and sandbox metrics/logs/HTTP requests.

**Billing**: Wallet with cost breakdown chart, automatic top-up rules (threshold/target), coupon redemption, billing email notifications.

**Linked Accounts**: Link/unlink Google or GitHub accounts; GitHub linking enables Tier 2 upgrade.

**Audit Logs**: Track organization activity with fields for actor, action, target, outcome, metadata; supports real-time refresh and filters by time.

**Webhooks**: HTTP callbacks for sandbox/snapshot/volume lifecycle events with HTTPS endpoint management, event filtering, testing, and delivery logs. Events: sandbox.created, sandbox.state.updated, snapshot.created, snapshot.state.updated, snapshot.removed, volume.created, volume.state.updated.

**VPN Connections**: Connect sandboxes to Tailscale (browser login, auth key, or web terminal) or OpenVPN (config file + programmatic/terminal setup) for private network access. Requires Tier 3+ and VPN credentials.

**Regions**: Shared (us/eu), dedicated, or custom regions with own runners. Set via `target` parameter during initialization.