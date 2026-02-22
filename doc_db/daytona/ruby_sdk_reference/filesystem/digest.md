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