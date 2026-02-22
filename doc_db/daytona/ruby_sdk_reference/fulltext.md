

## Pages

### computer-use
ComputerUse class for managing VNC desktop processes (Xvfb, xfce4, x11vnc, novnc) and providing mouse, keyboard, screenshot, display, and recording interfaces in a sandbox.

## ComputerUse

Class for controlling VNC desktop processes and computer interaction in a sandbox.

### Constructor

```ruby
ComputerUse.new(sandbox_id:, toolbox_api:, otel_state:)
```

### Properties

- `sandbox_id()` - Returns the sandbox ID
- `toolbox_api()` - Returns the API client for sandbox operations

### Desktop Control

- `start()` - Starts all VNC processes (Xvfb, xfce4, x11vnc, novnc)
- `stop()` - Stops all VNC processes
- `status()` - Gets status of all VNC processes
- `restart_process(process_name:)` - Restarts a specific process (e.g., "xvfb", "xfce4", "x11vnc", "novnc")
- `get_process_status(process_name:)` - Gets status of a specific process
- `get_process_logs(process_name:)` - Gets logs for a specific process
- `get_process_errors(process_name:)` - Gets error logs for a specific process

### Interaction Interfaces

- `mouse()` - Returns Mouse operations interface
- `keyboard()` - Returns Keyboard operations interface
- `screenshot()` - Returns Screenshot operations interface
- `display()` - Returns Display operations interface
- `recording()` - Returns Screen recording operations interface

### Examples

```ruby
# Start/stop desktop
result = sandbox.computer_use.start
puts "Computer use processes started: #{result.message}"

result = sandbox.computer_use.stop
puts "Computer use processes stopped: #{result.message}"

# Check status
response = sandbox.computer_use.status
puts "Computer use status: #{response.status}"

# Manage specific processes
xvfb_status = sandbox.computer_use.get_process_status("xvfb")
novnc_status = sandbox.computer_use.get_process_status("novnc")

result = sandbox.computer_use.restart_process("xfce4")
puts "XFCE4 process restarted: #{result.message}"

# Get process logs
logs = sandbox.computer_use.get_process_logs("novnc")
errors = sandbox.computer_use.get_process_errors("x11vnc")
```

All methods raise `Daytona:Sdk:Error` on failure.

### config
Daytona::Config class initializes SDK with API credentials (api_key/jwt_token), endpoint (api_url), organization_id, target environment, and experimental options; all parameters optional with env var defaults.

## Config

Main class for configuring Daytona SDK authentication and API connection.

### Constructor

```ruby
Daytona::Config.new(
  api_key: ENV['DAYTONA_API_KEY'],
  jwt_token: ENV['DAYTONA_JWT_TOKEN'],
  api_url: ENV['DAYTONA_API_URL'] || Daytona::Config::API_URL,
  organization_id: ENV['DAYTONA_ORGANIZATION_ID'],
  target: ENV['DAYTONA_TARGET'],
  _experimental: nil
)
```

All parameters are optional and default to environment variables or built-in defaults.

### Properties

All properties have getter and setter methods:

- `api_key` - String for API authentication
- `jwt_token` - String for JWT authentication
- `api_url` - String for Daytona API endpoint
- `organization_id` - String for organization identification
- `target` - String for sandbox target environment
- `_experimental` - Hash for experimental configuration options

### daytona_class_reference
Main Daytona SDK class providing sandbox creation, lifecycle management (start/stop/delete), retrieval (get/find/list), and API access methods.

## Daytona Class

Main class for the Daytona SDK.

### Constructor

```ruby
Daytona.new(config)
```

Creates a new Daytona instance. `config` parameter accepts a `Daytona::Config` object (defaults to `Daytona::Config.new`).

### Configuration & API Access

- `config()` - Returns the `Daytona::Config` instance
- `api_client()` - Returns the `DaytonaApiClient`
- `sandbox_api()` - Returns `DaytonaApiClient::SandboxApi`
- `object_storage_api()` - Returns `DaytonaApiClient::ObjectStorageApi`
- `snapshots_api()` - Returns `DaytonaApiClient::SnapshotsApi`
- `volume()` - Returns `Daytona::VolumeService`
- `snapshot()` - Returns `Daytona::SnapshotService`

### Sandbox Lifecycle Management

**Create**
```ruby
daytona.create(params, on_snapshot_create_logs:)
```
Creates a sandbox with specified parameters. `params` can be `Daytona::CreateSandboxFromSnapshotParams`, `Daytona::CreateSandboxFromImageParams`, or `Nil`. Raises `Daytona::Sdk::Error` if `auto_stop_interval` or `auto_archive_interval` is negative.

**Start/Stop**
```ruby
daytona.start(sandbox, timeout)  # timeout defaults to 60s
daytona.stop(sandbox, timeout)   # timeout defaults to 60s
```
Starts or stops a sandbox and waits for the operation to complete.

**Delete**
```ruby
daytona.delete(sandbox)
```

### Sandbox Retrieval

**Get by ID**
```ruby
daytona.get(id)
```

**Find by ID or labels**
```ruby
daytona.find_one(id:, labels:)
```
Raises `Daytona::Sdk::Error` if not found.

**List with filtering**
```ruby
daytona.list(labels, page:, limit:)
```
Returns `Daytona::PaginatedResource`. Raises `Daytona::Sdk::Error` on error.

### Cleanup

```ruby
daytona.close()
```
Shuts down OTel providers and flushes pending telemetry data.

### filesystem
FileSystem class for Sandbox file operations: create/delete/move files, upload/download, list/search, find/replace, set permissions.

## FileSystem

Main class for file system operations in a Sandbox.

### Constructor

```ruby
FileSystem.new(sandbox_id:, toolbox_api:, otel_state:)
```

Initializes a FileSystem instance with a Sandbox ID, API client, and optional telemetry state.

### Properties

- `sandbox_id()` - Returns the Sandbox ID
- `toolbox_api()` - Returns the FileSystemApi client

### File Operations

#### create_folder(path, mode)
Creates a directory with specified permissions in octal format.
```ruby
sandbox.fs.create_folder("workspace/data", "755")
sandbox.fs.create_folder("workspace/secrets", "700")
```

#### delete_file(path, recursive:)
Deletes a file or directory. Set `recursive: true` to delete directories.
```ruby
sandbox.fs.delete_file("workspace/data/old_file.txt")
sandbox.fs.delete_file("workspace/old_dir", recursive: true)
```

#### get_file_info(path)
Returns `FileInfo` object with size, permissions, timestamps, and `is_dir` flag.
```ruby
info = sandbox.fs.get_file_info("workspace/data/file.txt")
puts "Size: #{info.size}, Modified: #{info.mod_time}, Mode: #{info.mode}"
puts "Is directory" if info.is_dir
```

#### list_files(path)
Returns `Array<FileInfo>` of files and directories in a path.
```ruby
files = sandbox.fs.list_files("workspace/data")
files.each { |f| puts "#{f.name}: #{f.size} bytes" unless f.is_dir }
dirs = files.select(&:is_dir)
```

#### download_file(remote_path, local_path = nil)
Downloads file from Sandbox. Returns file contents as string if `local_path` is nil, otherwise saves to disk and returns nil. For smaller files only.
```ruby
content = sandbox.fs.download_file("workspace/data/file.txt")
sandbox.fs.download_file("workspace/data/file.txt", "local_copy.txt")
```

#### upload_file(source, remote_path)
Uploads file from string/bytes, local path, or IO object. Overwrites existing files.
```ruby
sandbox.fs.upload_file("Hello, World!", "tmp/hello.txt")
sandbox.fs.upload_file("local_file.txt", "tmp/file.txt")
sandbox.fs.upload_file({ key: "value" }.to_json, "tmp/config.json")
```

#### upload_files(files)
Uploads multiple `FileUpload` objects at once.
```ruby
files = [
  FileUpload.new("Content of file 1", "/tmp/file1.txt"),
  FileUpload.new("workspace/data/file2.txt", "/tmp/file2.txt"),
  FileUpload.new('{"key": "value"}', "/tmp/config.json")
]
sandbox.fs.upload_files(files)
```

### Search and Replace

#### find_files(path, pattern)
Searches file contents for pattern (like grep). Returns `Array<Match>` with file, line, and content.
```ruby
matches = sandbox.fs.find_files("workspace/src", "TODO:")
matches.each { |m| puts "#{m.file}:#{m.line}: #{m.content.strip}" }
```

#### search_files(path, pattern)
Searches for files/directories by name using glob patterns. Returns `SearchFilesResponse`.
```ruby
result = sandbox.fs.search_files("workspace", "*.rb")
result.files.each { |f| puts f }
result = sandbox.fs.search_files("workspace/data", "test_*")
```

#### replace_in_files(files:, pattern:, new_value:)
Performs search and replace across multiple files. Returns `Array<ReplaceResult>` with success/error status.
```ruby
results = sandbox.fs.replace_in_files(
  files: ["workspace/src/file1.rb", "workspace/src/file2.rb"],
  pattern: "old_function",
  new_value: "new_function"
)
results.each { |r| puts r.success ? "#{r.file}: OK" : "#{r.file}: #{r.error}" }
```

### File Management

#### move_files(source, destination)
Moves or renames files/directories. Parent directory of destination must exist.
```ruby
sandbox.fs.move_files("workspace/data/old_name.txt", "workspace/data/new_name.txt")
sandbox.fs.move_files("workspace/data/file.txt", "workspace/archive/file.txt")
sandbox.fs.move_files("workspace/old_dir", "workspace/new_dir")
```

#### set_file_permissions(path:, mode:, owner:, group:)
Sets permissions and ownership. Any parameter can be nil to leave unchanged.
```ruby
sandbox.fs.set_file_permissions(path: "workspace/scripts/run.sh", mode: "755")
sandbox.fs.set_file_permissions(path: "workspace/data/file.txt", owner: "daytona", group: "daytona")
```

### Notes

- All relative paths are resolved based on sandbox working directory
- All methods raise `Daytona:Sdk:Error` on failure
- `download_file` is for smaller files only
- `upload_file` overwrites existing files

### git.mdx
Git handler for sandbox repositories: clone, add, commit, push, pull, status, branch operations with optional authentication.

## Git Handler

Main class for Git operations in a sandbox environment.

### Constructor

```ruby
Git.new(sandbox_id:, toolbox_api:, otel_state:)
```

Initializes a Git handler with sandbox context and API client.

### Properties

- `sandbox_id()` - Returns the Sandbox ID
- `toolbox_api()` - Returns the DaytonaToolboxApiClient:GitApi instance

### Methods

#### clone(url:, path:, branch:, commit_id:, username:, password:)

Clones a Git repository to the specified path. Supports cloning specific branches or commits, with optional authentication.

```ruby
# Clone default branch
sandbox.git.clone(url: "https://github.com/user/repo.git", path: "workspace/repo")

# Clone specific branch with authentication
sandbox.git.clone(
  url: "https://github.com/user/private-repo.git",
  path: "workspace/private",
  branch: "develop",
  username: "user",
  password: "token"
)

# Clone specific commit (detached HEAD)
sandbox.git.clone(url: "https://github.com/user/repo.git", path: "workspace/repo-old", commit_id: "abc123")
```

#### add(path, files)

Stages files for commit (equivalent to `git add`).

```ruby
sandbox.git.add("workspace/repo", ["file.txt"])
sandbox.git.add("workspace/repo", ["src/main.rb", "spec/main_spec.rb", "README.md"])
```

#### commit(path:, message:, author:, email:, allow_empty:)

Creates a commit with staged changes. Returns `GitCommitResponse` with the commit SHA.

```ruby
sandbox.git.add("workspace/repo", ["README.md"])
response = sandbox.git.commit(
  path: "workspace/repo",
  message: "Update documentation",
  author: "John Doe",
  email: "john@example.com",
  allow_empty: true
)
puts response.sha
```

#### push(path:, username:, password:)

Pushes local commits to remote repository. Authentication optional.

```ruby
sandbox.git.push("workspace/repo")
sandbox.git.push(path: "workspace/repo", username: "user", password: "github_token")
```

#### pull(path:, username:, password:)

Pulls changes from remote repository. Authentication optional.

```ruby
sandbox.git.pull("workspace/repo")
sandbox.git.pull(path: "workspace/repo", username: "user", password: "github_token")
```

#### status(path)

Returns repository status including current branch, commits ahead/behind.

```ruby
status = sandbox.git.status("workspace/repo")
puts "On branch: #{status.current_branch}"
puts "Commits ahead: #{status.ahead}"
puts "Commits behind: #{status.behind}"
```

#### branches(path)

Lists all branches in the repository.

```ruby
response = sandbox.git.branches("workspace/repo")
puts "Branches: #{response.branches}"
```

#### checkout_branch(path, branch)

Checks out a branch.

```ruby
sandbox.git.checkout_branch("workspace/repo", "feature-branch")
```

#### create_branch(path, name)

Creates a new branch.

```ruby
sandbox.git.create_branch("workspace/repo", "new-feature")
```

#### delete_branch(path, name)

Deletes a branch.

```ruby
sandbox.git.delete_branch("workspace/repo", "old-feature")
```

### Error Handling

All methods raise `Daytona:Sdk:Error` on failure. Relative paths are resolved from the sandbox working directory.

### image
Image class for defining Daytona sandbox images with pip package installation, file operations, and container configuration via chainable methods.

## Image

Represents an image definition for a Daytona sandbox. Do not construct directly; use static factory methods like `Image.base()`, `Image.debian_slim()`, or `Image.from_dockerfile()`.

### Constructor

```ruby
Image.new(dockerfile:, context_list:)
```

- `dockerfile` (String, nil) - Dockerfile content
- `context_list` (Array<Context>) - List of context files

### Accessors

- `dockerfile()` - Returns the generated Dockerfile
- `context_list()` - Returns list of context files

### Package Installation

```ruby
image.pip_install("requests", "pandas", index_url: "https://...", pre: true)
image.pip_install_from_requirements("requirements.txt", find_links: [...])
image.pip_install_from_pyproject("pyproject.toml", optional_dependencies: ["dev"])
```

All pip methods support: `find_links`, `index_url`, `extra_index_urls`, `pre` (pre-release), `extra_options`.

### File Operations

```ruby
image.add_local_file("package.json", "/home/daytona/package.json")
image.add_local_dir("src", "/home/daytona/src")
```

### Container Configuration

```ruby
image.run_commands('echo "Hello"', 'echo "Hello again!"')
image.env({"PROJECT_ROOT" => "/home/daytona"})
image.workdir("/home/daytona")
image.entrypoint(["/bin/bash"])
image.cmd(["/bin/bash"])
image.dockerfile_commands(["RUN echo 'Hello'"], context_dir: "/path")
```

All methods return the Image instance for chaining.

### Error Handling

- `pip_install_from_requirements` raises `Sdk:Error` if requirements file doesn't exist
- `pip_install_from_pyproject` raises `Sdk:Error` if pyproject.toml parsing unsupported
- `env()` can raise `Sdk:Error`

### sdk_reference
Ruby SDK for programmatically creating/managing Daytona Sandboxes; install via gem, configure with API key or JWT token, create sandboxes and execute commands via process.exec().

## Installation

Install via Bundler:
```ruby
gem 'daytona'
```

Or directly:
```bash
gem install daytona
```

## Getting Started

```ruby
require 'daytona'

daytona = Daytona::Daytona.new
sandbox = daytona.create
response = sandbox.process.exec(command: "echo 'Hello, World!'")
puts response.result
daytona.delete(sandbox)
```

## Configuration

Configure via environment variables or constructor:

```ruby
# Environment variables (DAYTONA_API_KEY, DAYTONA_API_URL, DAYTONA_TARGET)
daytona = Daytona::Daytona.new

# Explicit configuration
config = Daytona::Config.new(
  api_key: 'your-api-key',
  api_url: 'https://app.daytona.io/api',
  target: 'us'
)
daytona = Daytona::Daytona.new(config)
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DAYTONA_API_KEY` | API key for authentication |
| `DAYTONA_API_URL` | URL of the Daytona API (defaults to `https://app.daytona.io/api`) |
| `DAYTONA_TARGET` | Target location for Sandboxes |
| `DAYTONA_JWT_TOKEN` | JWT token for authentication (alternative to API key) |
| `DAYTONA_ORGANIZATION_ID` | Organization ID (required when using JWT token) |

### lspserver
LspServer class providing LSP integration with methods for file tracking, completions, and symbol search across sandbox files.

## LspServer

Ruby SDK class for Language Server Protocol integration with Daytona.

### Constructor

```ruby
LspServer.new(
  language_id:,      # Symbol
  path_to_project:,  # String
  toolbox_api:,      # DaytonaToolboxApiClient:LspApi
  sandbox_id:,       # String
  otel_state:        # Daytona:OtelState or nil
)
```

### Properties

- `language_id()` → Symbol
- `path_to_project()` → String
- `toolbox_api()` → DaytonaToolboxApiClient:LspApi
- `sandbox_id()` → String

### Lifecycle Methods

- `start()` - Initializes the language server for the specified language and project. Must be called before using other LSP functionality.
- `stop()` - Shuts down the language server and frees system resources.

### File Tracking

- `did_open(path)` - Notifies server that a file has been opened, enabling language features like diagnostics and completions. Server begins tracking file contents.
- `did_close(path)` - Notifies server that a file has been closed, allowing cleanup of associated resources.

### Language Features

- `completions(path:, position:)` → DaytonaApiClient:CompletionList - Gets completion suggestions at a specific position in a file.
- `document_symbols(path)` → Array<DaytonaToolboxApiClient:LspSymbol> - Extracts symbol information (functions, classes, variables, etc.) from a document.
- `sandbox_symbols(query)` → Array<DaytonaToolboxApiClient:LspSymbol> - Searches for symbols matching a query string across all files in the sandbox.

### objectstorage
S3-compatible object storage client with upload capability, configurable bucket and region, returns file hash on upload or raises ENOENT if path missing.

## ObjectStorage

S3-compatible object storage client for uploading files.

### Constructor

```ruby
ObjectStorage.new(
  endpoint_url:,
  aws_access_key_id:,
  aws_secret_access_key:,
  aws_session_token:,
  bucket_name: "daytona-volume-builds",
  region: "us-east-1"
)
```

Initialize with S3-compatible credentials. All parameters except `bucket_name` and `region` are required.

### Methods

**bucket_name()** → String
Returns the S3 bucket name.

**s3_client()** → Aws::S3::Client
Returns the underlying S3 client instance.

**upload(path, organization_id, archive_base_path)** → String
Uploads a file to object storage.
- `path` (String): File path to upload
- `organization_id` (String): Organization ID for the upload
- `archive_base_path` (String, nil): Optional base path for the archive
- Returns: Hash of the uploaded file
- Raises: `Errno::ENOENT` if path does not exist

### process
Ruby SDK Process class for executing shell commands, code, and managing stateful sessions and interactive PTY terminals in sandboxes.

## Process

Initialize a new Process instance with code toolbox, sandbox ID, toolbox API, preview link function, and optional OpenTelemetry state.

### Accessors

- `code_toolbox()` - Returns SandboxPythonCodeToolbox or SandboxTsCodeToolbox
- `sandbox_id()` - Returns String
- `toolbox_api()` - Returns ProcessApi client
- `get_preview_link()` - Returns Proc for getting preview links

### Command Execution

#### exec(command:, cwd:, env:, timeout:)

Execute shell commands in the sandbox.

```ruby
# Simple command
response = sandbox.process.exec("echo 'Hello'")
puts response.artifacts.stdout  # => "Hello\n"

# With working directory and timeout
result = sandbox.process.exec("ls", cwd: "workspace/src")
result = sandbox.process.exec("sleep 10", timeout: 5)
```

Returns ExecuteResponse with exit_code, result, and artifacts.

#### code_run(code:, params:, timeout:)

Execute code using the appropriate language runtime.

```ruby
response = sandbox.process.code_run(<<~CODE)
  x = 10
  y = 20
  print(f"Sum: {x + y}")
CODE
puts response.artifacts.stdout  # Prints: Sum: 30
```

Returns ExecuteResponse with exit_code, result, and artifacts.

### Sessions

Background processes that maintain state between commands.

#### create_session(session_id)

Creates a new long-running background session.

#### get_session(session_id)

Gets session information including session_id and commands.

```ruby
session = sandbox.process.get_session("my-session")
session.commands.each { |cmd| puts "Command: #{cmd.command}" }
```

#### execute_session_command(session_id:, req:)

Executes a command in the session, maintaining state across commands.

```ruby
session_id = "my-session"
sandbox.process.execute_session_command(
  session_id:,
  req: Daytona::SessionExecuteRequest.new(command: "cd /workspace")
)
sandbox.process.execute_session_command(
  session_id:,
  req: Daytona::SessionExecuteRequest.new(command: "echo 'Hello' > test.txt")
)
result = sandbox.process.execute_session_command(
  session_id:,
  req: Daytona::SessionExecuteRequest.new(command: "cat test.txt")
)
puts "stdout: #{result.stdout}, stderr: #{result.stderr}"
```

Returns SessionExecuteResponse with cmd_id, output, stdout, stderr, and exit_code.

#### get_session_command(session_id:, command_id:)

Gets information about a specific command in a session.

```ruby
cmd = sandbox.process.get_session_command(session_id: "my-session", command_id: "cmd-123")
puts "Command #{cmd.command} completed successfully" if cmd.exit_code == 0
```

#### get_session_command_logs(session_id:, command_id:)

Get logs for a command executed in a session.

```ruby
logs = sandbox.process.get_session_command_logs(session_id: "my-session", command_id: "cmd-123")
puts "stdout: #{logs.stdout}, stderr: #{logs.stderr}"
```

#### get_session_command_logs_async(session_id:, command_id:, on_stdout:, on_stderr:)

Asynchronously retrieves logs as they become available via WebSocket.

```ruby
sandbox.process.get_session_command_logs_async(
  session_id: "my-session",
  command_id: "cmd-123",
  on_stdout: ->(log) { puts "[STDOUT]: #{log}" },
  on_stderr: ->(log) { puts "[STDERR]: #{log}" }
)
```

Returns WebSocket::Client::Simple::Client.

#### send_session_command_input(session_id:, command_id:, data:)

Sends input data to an interactive command running in a session.

#### list_sessions()

Returns Array of all sessions in the sandbox.

```ruby
sessions = sandbox.process.list_sessions
sessions.each { |s| puts "Session #{s.session_id}: #{s.commands.length} commands" }
```

#### delete_session(session_id)

Terminates and removes a session, cleaning up resources.

### PTY Sessions

Interactive terminal sessions supporting command history and user input.

#### create_pty_session(id:, cwd:, envs:, pty_size:)

Creates a new PTY session.

```ruby
pty_handle = sandbox.process.create_pty_session(id: "my-pty")

pty_size = Daytona::PtySize.new(rows: 30, cols: 120)
pty_handle = sandbox.process.create_pty_session(
  id: "my-pty",
  cwd: "/workspace",
  envs: {"NODE_ENV" => "development"},
  pty_size: pty_size
)

pty_handle.wait_for_connection
pty_handle.send_input("ls -la\n")
result = pty_handle.wait
pty_handle.disconnect
```

Returns PtyHandle for managing the session. Raises Daytona::Sdk::Error if creation fails or session ID already exists.

#### connect_pty_session(session_id)

Connects to an existing PTY session via WebSocket.

```ruby
pty_handle = sandbox.process.connect_pty_session("my-pty-session")
pty_handle.wait_for_connection
pty_handle.send_input("echo 'Hello World'\n")
result = pty_handle.wait
pty_handle.disconnect
```

Returns PtyHandle. Raises Daytona::Sdk::Error if session doesn't exist or connection fails.

#### resize_pty_session(session_id, pty_size)

Resizes a PTY session to specified dimensions.

```ruby
pty_size = Daytona::PtySize.new(rows: 30, cols: 120)
session_info = sandbox.process.resize_pty_session("my-pty", pty_size)
puts "PTY resized to #{session_info.cols}x#{session_info.rows}"
```

Returns PtySessionInfo with updated dimensions.

#### get_pty_session_info(session_id)

Gets detailed information about a PTY session.

```ruby
info = sandbox.process.get_pty_session_info("my-session")
puts "ID: #{info.id}, Active: #{info.active}, CWD: #{info.cwd}, Size: #{info.cols}x#{info.rows}"
```

Returns PtySessionInfo with id, state, creation time, working directory, environment variables, and more.

#### list_pty_sessions()

Lists all PTY sessions in the sandbox.

```ruby
sessions = sandbox.process.list_pty_sessions
sessions.each { |s| puts "PTY Session #{s.id}: #{s.cols}x#{s.rows}" }
```

Returns Array of PtySessionInfo.

#### delete_pty_session(session_id)

Deletes a PTY session and terminates the associated process.

### sandbox
Sandbox class: lifecycle management (start/stop/archive/delete), resource configuration (CPU/memory/disk), network/SSH/preview access, and tooling integration (code execution, filesystem, git, LSP).

## Sandbox Class

Core class for managing isolated execution environments in Daytona SDK.

### Constructor

```ruby
Sandbox.new(code_toolbox:, sandbox_dto:, config:, sandbox_api:, get_proxy_toolbox_url:, otel_state:)
```

### Properties (Getters)

**Identification & Organization**
- `id()` → String
- `organization_id()` → String
- `user()` → String

**Configuration**
- `snapshot()` → String
- `env()` → Hash<String, String>
- `labels()` → Hash<String, String>
- `target()` → String

**Network & Access**
- `public()` → Boolean (HTTP preview visibility)
- `network_block_all()` → Boolean
- `network_allow_list()` → String (comma-separated CIDR addresses)

**Resource Quotas**
- `cpu()` → Float
- `gpu()` → Float
- `memory()` → Float
- `disk()` → Float

**State Management**
- `state()` → DaytonaApiClient:SandboxState
- `desired_state()` → DaytonaApiClient:SandboxDesiredState
- `error_reason()` → String

**Backup & Lifecycle**
- `backup_state()` → String
- `backup_created_at()` → String
- `auto_stop_interval()` → Float (minutes, 0 = disabled)
- `auto_archive_interval()` → Float (minutes)
- `auto_delete_interval()` → Float (minutes, negative = disabled, 0 = immediate)

**Storage & Build**
- `volumes()` → Array<DaytonaApiClient:SandboxVolume>
- `build_info()` → DaytonaApiClient:BuildInfo

**Timestamps**
- `created_at()` → String
- `updated_at()` → String
- `daemon_version()` → String

**Tooling Access**
- `code_toolbox()` → Daytona:SandboxPythonCodeToolbox | Daytona:SandboxTsCodeToolbox
- `config()` → Daytona:Config
- `sandbox_api()` → DaytonaApiClient:SandboxApi
- `process()` → Daytona:Process
- `fs()` → Daytona:FileSystem
- `git()` → Daytona:Git
- `computer_use()` → Daytona:ComputerUse
- `code_interpreter()` → Daytona:CodeInterpreter

### Lifecycle Methods

**Start/Stop/Recover**
```ruby
sandbox.start(timeout: 60)           # Start and wait (default 60s)
sandbox.stop(timeout: 60)            # Stop and wait
sandbox.recover(timeout: 40)         # Recover from error and wait
sandbox.refresh()                    # Refresh data from API
sandbox.refresh_activity()           # Reset activity timer for lifecycle management
```

**Archive & Delete**
```ruby
sandbox.archive()  # Move to cost-effective storage (must be stopped first)
sandbox.delete()   # Delete sandbox
```

**Resize**
```ruby
# Increase CPU/memory while running
sandbox.resize(Daytona::Resources.new(cpu: 4, memory: 8))

# Stop first to resize disk or decrease resources
sandbox.stop
sandbox.resize(Daytona::Resources.new(cpu: 2, memory: 4, disk: 30))

sandbox.wait_for_resize_complete(timeout: 60)
```

### Lifecycle Configuration (Setters)

```ruby
sandbox.auto_stop_interval = 30      # Auto-stop after 30 min idle (no SDK events)
sandbox.auto_archive_interval = 120  # Auto-archive after 120 min stopped
sandbox.auto_delete_interval = 1440  # Auto-delete after 1440 min stopped
sandbox.labels = {"env" => "prod"}
```

### Directory Access

```ruby
user_home = sandbox.get_user_home_dir()  # User's home directory
work_dir = sandbox.get_work_dir()        # WORKDIR from Dockerfile or home fallback
```

### Preview URLs

```ruby
# Get preview URL (opens port automatically if closed, includes token for private sandboxes)
preview = sandbox.preview_url(3000)

# Create signed URL with expiration
signed = sandbox.create_signed_preview_url(3000, expires_in_seconds: 120)
puts signed.url
puts signed.token

# Expire signed URL
sandbox.expire_signed_preview_url(3000, "token-value")
```

### SSH Access

```ruby
# Create SSH token
ssh = sandbox.create_ssh_access(expires_in_minutes: 60)

# Validate token
validation = sandbox.validate_ssh_access(token)

# Revoke token
sandbox.revoke_ssh_access(token)
```

### Language Server Protocol

```ruby
lsp = sandbox.create_lsp_server(
  language_id: Daytona::LspServer::Language::PYTHON,
  path_to_project: "/path/to/project"  # Relative to sandbox working directory
)
```

### Wait Methods

```ruby
sandbox.wait_for_sandbox_start(timeout: 60)  # Poll until 'started' state
sandbox.wait_for_sandbox_stop(timeout: 60)   # Poll until 'stopped' state (treats destroyed as stopped)
```

### Error Handling

Methods that modify state raise `Daytona:Sdk:Error` on failure:
- `auto_stop_interval=`
- `auto_archive_interval=`
- `auto_delete_interval=`
- `resize`

### snapshotservice
SnapshotService: list, get, create (from Image with log callback), delete, activate snapshots

## SnapshotService

Service class for managing snapshots in Daytona SDK.

### Constructor

```ruby
SnapshotService.new(snapshots_api:, object_storage_api:, default_region_id:, otel_state:)
```

- `snapshots_api` - DaytonaApiClient:SnapshotsApi instance
- `object_storage_api` - DaytonaApiClient:ObjectStorageApi instance
- `default_region_id` - String or nil, default region for snapshot creation
- `otel_state` - Daytona:OtelState or nil

### Methods

#### list(page:, limit:)
List all snapshots with pagination.

```ruby
daytona = Daytona::Daytona.new
response = daytona.snapshot.list(page: 1, limit: 10)
response.items.each { |snapshot| puts "#{snapshot.name} (#{snapshot.image_name})" }
```

Returns `Daytona:PaginatedResource`. Raises `Daytona:Sdk:Error`.

#### get(name)
Get a snapshot by name.

```ruby
snapshot = daytona.snapshot.get("demo")
puts "#{snapshot.name} (#{snapshot.image_name})"
```

Returns `Daytona:Snapshot`.

#### create(params, on_logs:)
Create and register a new snapshot from an Image definition.

```ruby
image = Image.debianSlim('3.12').pipInstall('numpy')
params = CreateSnapshotParams.new(name: 'my-snapshot', image: image)
snapshot = daytona.snapshot.create(params) do |chunk|
  print chunk
end
```

- `params` - Daytona:CreateSnapshotParams with snapshot configuration
- `on_logs` - Optional Proc callback for handling creation logs (receives chunks)

Returns `Daytona:Snapshot`.

#### delete(snapshot)
Delete a snapshot.

```ruby
snapshot = daytona.snapshot.get("demo")
daytona.snapshot.delete(snapshot)
```

- `snapshot` - Daytona:Snapshot instance to delete

Returns void.

#### activate(snapshot)
Activate a snapshot.

```ruby
activated = daytona.snapshot.activate(snapshot)
```

- `snapshot` - Daytona:Snapshot instance

Returns `Daytona:Snapshot`.

### volumeservice
Ruby VolumeService API for creating, retrieving, listing, and deleting Daytona volumes.

## VolumeService

Service for managing Daytona Volumes with operations to list, get, create, and delete volumes.

### Constructor

```ruby
VolumeService.new(volumes_api, otel_state:)
```

**Parameters:**
- `volumes_api` - DaytonaApiClient:VolumesApi instance
- `otel_state` - Daytona:OtelState or nil

### Methods

#### create(name)
Creates a new volume.

```ruby
volume = service.create("my-volume")
```

**Parameters:** `name` (String)  
**Returns:** Daytona:Volume

#### get(name, create:)
Retrieves a volume by name, optionally creating it if it doesn't exist.

```ruby
volume = service.get("my-volume", create: true)
```

**Parameters:**
- `name` (String)
- `create` (Boolean) - whether to create if not found

**Returns:** Daytona:Volume

#### list()
Lists all volumes.

```ruby
volumes = service.list()
```

**Returns:** Array<Daytona:Volume>

#### delete(volume)
Deletes a volume.

```ruby
service.delete(volume)
```

**Parameters:** `volume` (Daytona:Volume)  
**Returns:** void

### volume
Volume class wraps SandboxVolume DTO with getter methods for id, name, organization_id, state, timestamps (created_at, updated_at, last_used_at), and optional error_reason.

## Volume

Wrapper class for volume data transfer objects from the Daytona API.

### Constructor

```ruby
Volume.new(volume_dto)
```

Initializes a Volume instance from a `DaytonaApiClient::SandboxVolume` DTO.

### Properties

Access volume attributes via methods:

- `id()` - String identifier
- `name()` - String name
- `organization_id()` - String organization identifier
- `state()` - String state
- `created_at()` - String creation timestamp
- `updated_at()` - String last update timestamp
- `last_used_at()` - String last usage timestamp
- `error_reason()` - String or nil, error details if applicable

