# File System Operations

Daytona's `fs` module provides file operations in sandboxes, defaulting to home directory (use `/` for absolute paths).

## Basic Operations

List files, get info, create directories:
```python
files = sandbox.fs.list_files("workspace")
info = sandbox.fs.get_file_info("workspace/file.txt")
sandbox.fs.create_folder("workspace/new-dir", "755")
```

Upload/download single or multiple files:
```python
# Single
sandbox.fs.upload_file(content, "remote.txt")
content = sandbox.fs.download_file("remote.txt")

# Multiple
sandbox.fs.upload_files([FileUpload(source, dest), ...])
results = sandbox.fs.download_files([FileDownloadRequest(source, dest), ...])
```

Delete files/directories:
```python
sandbox.fs.delete_file("workspace/file.txt")
sandbox.fs.delete_file("workspace/dir", recursive=True)
```

## Advanced Operations

File permissions:
```python
sandbox.fs.set_file_permissions("file.txt", "644")
sandbox.fs.set_file_permissions("file.txt", owner="user", group="group")
```

Find and replace text:
```python
results = sandbox.fs.find_files("workspace/src", "pattern")
sandbox.fs.replace_in_files(["file1.txt", "file2.txt"], "old", "new")
```

Move/rename:
```python
sandbox.fs.move_files("old_path", "new_path")
```