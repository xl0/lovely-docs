## FileSystem

File system operations in a Sandbox.

### Core Methods

**File Info & Listing:**
```ruby
info = sandbox.fs.get_file_info("path")  # Returns FileInfo with size, mode, mod_time, is_dir
files = sandbox.fs.list_files("path")    # Returns Array<FileInfo>
```

**Upload/Download:**
```ruby
sandbox.fs.upload_file(source, "remote_path")      # source: string/path/IO
sandbox.fs.upload_files([FileUpload.new(...), ...])
content = sandbox.fs.download_file("remote_path")  # Returns string or saves to local_path
```

**Create/Delete:**
```ruby
sandbox.fs.create_folder("path", "755")
sandbox.fs.delete_file("path", recursive: true)
```

**Search & Replace:**
```ruby
matches = sandbox.fs.find_files("path", "pattern")           # grep-like search
result = sandbox.fs.search_files("path", "*.rb")             # glob pattern search
results = sandbox.fs.replace_in_files(files:, pattern:, new_value:)
```

**Move & Permissions:**
```ruby
sandbox.fs.move_files("source", "destination")
sandbox.fs.set_file_permissions(path:, mode:, owner:, group:)
```

All relative paths resolve from sandbox working directory. All methods raise `Daytona:Sdk:Error` on failure.