## AsyncFileSystem

High-level async interface for file system operations within a Daytona Sandbox.

### Initialization

```python
AsyncFileSystem(api_client: FileSystemApi, ensure_toolbox_url: Callable[[], Awaitable[None]])
```

### Directory Operations

**create_folder(path: str, mode: str) -> None**

Creates a directory with specified permissions (octal format).

```python
await sandbox.fs.create_folder("workspace/data", "755")
await sandbox.fs.create_folder("workspace/secrets", "700")
```

### File Deletion

**delete_file(path: str, recursive: bool = False) -> None**

Deletes files or directories. Set `recursive=True` to delete directories.

```python
await sandbox.fs.delete_file("workspace/data/old_file.txt")
```

### File Download

**download_file(remote_path: str, timeout: int = 30*60) -> bytes**

Downloads file into memory as bytes.

```python
content = await sandbox.fs.download_file("workspace/data/file.txt")
config = json.loads(content.decode('utf-8'))
```

**download_file(remote_path: str, local_path: str, timeout: int = 30*60) -> None**

Downloads file to disk using streaming (for large files).

```python
await sandbox.fs.download_file("tmp/large_file.txt", "local_copy.txt")
```

**download_files(files: list[FileDownloadRequest], timeout: int = 30*60) -> list[FileDownloadResponse]**

Downloads multiple files. Individual errors returned in response, not raised.

```python
results = await sandbox.fs.download_files([
    FileDownloadRequest(source="tmp/data.json"),
    FileDownloadRequest(source="tmp/config.json", destination="local_config.json")
])
for result in results:
    if result.error:
        print(f"Error: {result.error}")
    else:
        print(f"Downloaded to {result.result}")
```

### File Search

**find_files(path: str, pattern: str) -> list[Match]**

Searches file contents (grep-like). Returns matches with file, line number, and content.

```python
matches = await sandbox.fs.find_files("workspace/src", "TODO:")
for match in matches:
    print(f"{match.file}:{match.line}: {match.content.strip()}")
```

**search_files(path: str, pattern: str) -> SearchFilesResponse**

Searches file/directory names with glob pattern support.

```python
result = await sandbox.fs.search_files("workspace", "*.py")
result = await sandbox.fs.search_files("workspace/data", "test_*")
```

### File Information

**get_file_info(path: str) -> FileInfo**

Returns file metadata: name, is_dir, size, mode, mod_time, permissions, owner, group.

```python
info = await sandbox.fs.get_file_info("workspace/data/file.txt")
print(f"Size: {info.size}, Modified: {info.mod_time}, Mode: {info.mode}")

info = await sandbox.fs.get_file_info("workspace/data")
if info.is_dir:
    print("Path is a directory")
```

**list_files(path: str) -> list[FileInfo]**

Lists directory contents with full metadata (ls -l equivalent).

```python
files = await sandbox.fs.list_files("workspace/data")
for file in files:
    if not file.is_dir:
        print(f"{file.name}: {file.size} bytes")
dirs = [f for f in files if f.is_dir]
```

### File Movement

**move_files(source: str, destination: str) -> None**

Moves or renames files/directories. Parent directory of destination must exist.

```python
await sandbox.fs.move_files("workspace/data/old_name.txt", "workspace/data/new_name.txt")
await sandbox.fs.move_files("workspace/data/file.txt", "workspace/archive/file.txt")
await sandbox.fs.move_files("workspace/old_dir", "workspace/new_dir")
```

### File Replacement

**replace_in_files(files: list[str], pattern: str, new_value: str) -> list[ReplaceResult]**

Search and replace across multiple files. Returns results with success/error per file.

```python
results = await sandbox.fs.replace_in_files(
    files=["workspace/src/file1.py", "workspace/src/file2.py"],
    pattern="old_function",
    new_value="new_function"
)
for result in results:
    print(f"{result.file}: {result.success or result.error}")
```

### File Permissions

**set_file_permissions(path: str, mode: str | None = None, owner: str | None = None, group: str | None = None) -> None**

Sets permissions and ownership. Any parameter can be None to leave unchanged.

```python
await sandbox.fs.set_file_permissions("workspace/scripts/run.sh", mode="755")
await sandbox.fs.set_file_permissions("workspace/data/file.txt", owner="daytona", group="daytona")
```

### File Upload

**upload_file(file: bytes, remote_path: str, timeout: int = 30*60) -> None**

Uploads bytes to sandbox (for small files).

```python
await sandbox.fs.upload_file(b"Hello, World!", "tmp/hello.txt")
with open("local_file.txt", "rb") as f:
    await sandbox.fs.upload_file(f.read(), "tmp/file.txt")
data = json.dumps({"key": "value"}).encode('utf-8')
await sandbox.fs.upload_file(data, "tmp/config.json")
```

**upload_file(local_path: str, remote_path: str, timeout: int = 30*60) -> None**

Uploads file from disk using streaming (for large files).

```python
await sandbox.fs.upload_file("local_file.txt", "tmp/large_file.txt")
```

**upload_files(files: list[FileUpload], timeout: int = 30*60) -> None**

Uploads multiple files. Source can be bytes or local file path.

```python
files = [
    FileUpload(source=b"Content of file 1", destination="/tmp/file1.txt"),
    FileUpload(source="workspace/data/file2.txt", destination="/tmp/file2.txt"),
    FileUpload(source=b'{"key": "value"}', destination="/tmp/config.json")
]
await sandbox.fs.upload_files(files)
```

## Data Classes

**FileUpload**
- `source: bytes | str` - File contents or local file path
- `destination: str` - Absolute destination path in sandbox

**FileDownloadRequest**
- `source: str` - Source path in sandbox
- `destination: str | None` - Local destination path (optional; if not provided, downloads to bytes buffer)

**FileDownloadResponse**
- `source: str` - Original source path
- `result: str | bytes | None` - File path (if destination provided) or bytes content
- `error: str | None` - Error message if failed

## Notes

- Relative paths resolve based on sandbox working directory
- Timeout default is 30 minutes; 0 means no timeout
- All methods decorated with error interception and instrumentation
- Download/upload operations support streaming for large files
- Batch operations (download_files, upload_files, replace_in_files) return per-item results rather than raising on individual failures