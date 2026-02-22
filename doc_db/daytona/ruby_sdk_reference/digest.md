## Ruby SDK Reference

Complete API documentation for the Daytona Ruby SDK for creating and managing sandboxes.

### Installation & Setup
```ruby
gem 'daytona'
require 'daytona'

config = Daytona::Config.new(
  api_key: 'your-api-key',
  api_url: 'https://app.daytona.io/api',
  target: 'us'
)
daytona = Daytona::Daytona.new(config)
```

Configure via environment variables: `DAYTONA_API_KEY`, `DAYTONA_API_URL`, `DAYTONA_TARGET`, `DAYTONA_JWT_TOKEN`, `DAYTONA_ORGANIZATION_ID`.

### Core Sandbox Lifecycle
```ruby
# Create, execute, delete
sandbox = daytona.create(params)
sandbox.start(timeout: 60)
response = sandbox.process.exec(command: "echo 'Hello'")
sandbox.stop(timeout: 60)
sandbox.archive()  # Move to storage
daytona.delete(sandbox)

# Retrieve sandboxes
sandbox = daytona.get(id)
sandbox = daytona.find_one(id: id, labels: {})
sandboxes = daytona.list(labels, page: 1, limit: 10)
```

### Sandbox Properties & Configuration
Getters: `id()`, `organization_id()`, `user()`, `state()`, `desired_state()`, `error_reason()`, `snapshot()`, `env()`, `labels()`, `target()`, `public()`, `network_block_all()`, `network_allow_list()`, `cpu()`, `gpu()`, `memory()`, `disk()`, `backup_state()`, `backup_created_at()`, `auto_stop_interval()`, `auto_archive_interval()`, `auto_delete_interval()`, `volumes()`, `build_info()`, `created_at()`, `updated_at()`, `daemon_version()`.

Setters: `auto_stop_interval=`, `auto_archive_interval=`, `auto_delete_interval=`, `labels=`.

Resize resources: `sandbox.resize(Daytona::Resources.new(cpu: 4, memory: 8))` (can increase while running; stop first to resize disk or decrease).

### Process Execution
```ruby
# Shell commands
response = sandbox.process.exec("ls -la", cwd: "workspace", timeout: 30)
puts response.artifacts.stdout

# Code execution
response = sandbox.process.code_run(<<~CODE)
  x = 10
  print(f"Sum: {x + 20}")
CODE

# Sessions (stateful background processes)
sandbox.process.create_session("my-session")
sandbox.process.execute_session_command(
  session_id: "my-session",
  req: Daytona::SessionExecuteRequest.new(command: "cd /workspace")
)
result = sandbox.process.execute_session_command(
  session_id: "my-session",
  req: Daytona::SessionExecuteRequest.new(command: "cat test.txt")
)
puts "#{result.stdout}, #{result.stderr}, exit: #{result.exit_code}"
sandbox.process.get_session_command_logs(session_id: "my-session", command_id: "cmd-123")
sandbox.process.delete_session("my-session")

# PTY sessions (interactive terminals)
pty_size = Daytona::PtySize.new(rows: 30, cols: 120)
pty = sandbox.process.create_pty_session(id: "my-pty", cwd: "/workspace", pty_size: pty_size)
pty.wait_for_connection
pty.send_input("ls -la\n")
result = pty.wait
pty.disconnect
```

### File System Operations
```ruby
sandbox.fs.create_folder("workspace/data", "755")
sandbox.fs.delete_file("workspace/old_file.txt", recursive: true)

info = sandbox.fs.get_file_info("workspace/data/file.txt")
puts "Size: #{info.size}, Mode: #{info.mode}, IsDir: #{info.is_dir}"

files = sandbox.fs.list_files("workspace/data")
files.each { |f| puts "#{f.name}: #{f.size} bytes" unless f.is_dir }

# Upload/download
sandbox.fs.upload_file("Hello, World!", "tmp/hello.txt")
sandbox.fs.upload_file("local_file.txt", "tmp/file.txt")
sandbox.fs.upload_files([
  FileUpload.new("Content", "/tmp/file1.txt"),
  FileUpload.new("workspace/data/file2.txt", "/tmp/file2.txt")
])
content = sandbox.fs.download_file("workspace/data/file.txt")
sandbox.fs.download_file("workspace/data/file.txt", "local_copy.txt")

# Search and replace
matches = sandbox.fs.find_files("workspace/src", "TODO:")
matches.each { |m| puts "#{m.file}:#{m.line}: #{m.content}" }
result = sandbox.fs.search_files("workspace", "*.rb")
result.files.each { |f| puts f }
results = sandbox.fs.replace_in_files(
  files: ["workspace/src/file1.rb", "workspace/src/file2.rb"],
  pattern: "old_function",
  new_value: "new_function"
)

sandbox.fs.move_files("workspace/data/old_name.txt", "workspace/data/new_name.txt")
sandbox.fs.set_file_permissions(path: "workspace/scripts/run.sh", mode: "755", owner: "daytona")
```

### Git Operations
```ruby
sandbox.git.clone(
  url: "https://github.com/user/repo.git",
  path: "workspace/repo",
  branch: "develop",
  username: "user",
  password: "token"
)
sandbox.git.clone(url: "https://github.com/user/repo.git", path: "workspace/repo-old", commit_id: "abc123")

sandbox.git.add("workspace/repo", ["file.txt", "src/main.rb"])
response = sandbox.git.commit(
  path: "workspace/repo",
  message: "Update docs",
  author: "John Doe",
  email: "john@example.com",
  allow_empty: true
)
puts response.sha

sandbox.git.push(path: "workspace/repo", username: "user", password: "token")
sandbox.git.pull(path: "workspace/repo", username: "user", password: "token")

status = sandbox.git.status("workspace/repo")
puts "Branch: #{status.current_branch}, Ahead: #{status.ahead}, Behind: #{status.behind}"

response = sandbox.git.branches("workspace/repo")
sandbox.git.checkout_branch("workspace/repo", "feature-branch")
sandbox.git.create_branch("workspace/repo", "new-feature")
sandbox.git.delete_branch("workspace/repo", "old-feature")
```

### Desktop/VNC Control (ComputerUse)
```ruby
sandbox.computer_use.start()
sandbox.computer_use.stop()
response = sandbox.computer_use.status()
puts "Status: #{response.status}"

xvfb_status = sandbox.computer_use.get_process_status("xvfb")
sandbox.computer_use.restart_process("xfce4")
logs = sandbox.computer_use.get_process_logs("novnc")
errors = sandbox.computer_use.get_process_errors("x11vnc")

# Interaction interfaces
sandbox.computer_use.mouse()
sandbox.computer_use.keyboard()
sandbox.computer_use.screenshot()
sandbox.computer_use.display()
sandbox.computer_use.recording()
```

### Language Server Protocol (LSP)
```ruby
lsp = sandbox.create_lsp_server(
  language_id: Daytona::LspServer::Language::PYTHON,
  path_to_project: "/path/to/project"
)
lsp.start()
lsp.did_open("file.py")

completions = lsp.completions(path: "file.py", position: {line: 10, character: 5})
symbols = lsp.document_symbols("file.py")
search_results = lsp.sandbox_symbols("MyClass")

lsp.did_close("file.py")
lsp.stop()
```

### Images & Snapshots
```ruby
# Define custom image
image = Image.debian_slim('3.12')
  .pip_install("requests", "pandas", index_url: "https://...")
  .pip_install_from_requirements("requirements.txt", find_links: [...])
  .pip_install_from_pyproject("pyproject.toml", optional_dependencies: ["dev"])
  .add_local_file("package.json", "/home/daytona/package.json")
  .add_local_dir("src", "/home/daytona/src")
  .run_commands('echo "Hello"', 'echo "Hello again!"')
  .env({"PROJECT_ROOT" => "/home/daytona"})
  .workdir("/home/daytona")
  .entrypoint(["/bin/bash"])
  .cmd(["/bin/bash"])

# Create sandbox from image
params = Daytona::CreateSandboxFromImageParams.new(image: image)
sandbox = daytona.create(params)

# Snapshots
response = daytona.snapshot.list(page: 1, limit: 10)
snapshot = daytona.snapshot.get("demo")
params = Daytona::CreateSnapshotParams.new(name: 'my-snapshot', image: image)
snapshot = daytona.snapshot.create(params) { |chunk| print chunk }
daytona.snapshot.delete(snapshot)
daytona.snapshot.activate(snapshot)
```

### Volumes
```ruby
volume = daytona.volume.create("my-volume")
volume = daytona.volume.get("my-volume", create: true)
volumes = daytona.volume.list()
daytona.volume.delete(volume)

# Volume properties
puts "#{volume.id}, #{volume.name}, #{volume.state}, #{volume.created_at}"
```

### Network & Access
```ruby
# Preview URLs
preview = sandbox.preview_url(3000)
signed = sandbox.create_signed_preview_url(3000, expires_in_seconds: 120)
puts signed.url
sandbox.expire_signed_preview_url(3000, "token-value")

# SSH access
ssh = sandbox.create_ssh_access(expires_in_minutes: 60)
validation = sandbox.validate_ssh_access(token)
sandbox.revoke_ssh_access(token)

# Directory access
user_home = sandbox.get_user_home_dir()
work_dir = sandbox.get_work_dir()
```

### Lifecycle Management
```ruby
sandbox.refresh()  # Refresh data from API
sandbox.refresh_activity()  # Reset activity timer
sandbox.recover(timeout: 40)  # Recover from error
sandbox.wait_for_sandbox_start(timeout: 60)
sandbox.wait_for_sandbox_stop(timeout: 60)
sandbox.wait_for_resize_complete(timeout: 60)

daytona.close()  # Shutdown OTel providers
```

### Object Storage
```ruby
storage = ObjectStorage.new(
  endpoint_url: "...",
  aws_access_key_id: "...",
  aws_secret_access_key: "...",
  aws_session_token: "...",
  bucket_name: "daytona-volume-builds",
  region: "us-east-1"
)
file_hash = storage.upload("path/to/file", "org-id", "archive/base/path")
```

All methods raise `Daytona::Sdk::Error` on failure unless otherwise noted.