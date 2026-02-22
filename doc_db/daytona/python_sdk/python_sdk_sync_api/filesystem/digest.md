## FileSystem

High-level interface for file system operations within a Daytona Sandbox.

### Initialization

```python
FileSystem(api_client: FileSystemApi, ensure_toolbox_url: Callable[[], None])
```

### Directory Operations

**create_folder(path: str, mode: str) -> None**

Creates a directory with specified permissions in octal format.

```python
sandbox.fs.create_folder("workspace/data", "755")
sandbox.fs.create_folder("workspace/secrets", "700")
```

**list_files(path: str) -> list[FileInfo]**

Lists files and directories with metadata (name, is_dir, size, mode, mod_time, permissions, owner, group).

```python
files = sandbox.fs.list_files("workspace/data")
for file in files:
    if not file.is_dir:
        print(f"{file.name}: {file.size} bytes")
```

**get_file_info(path: str) -> FileInfo**

Gets detailed information about a single file or directory.

```python
info = sandbox.fs.get_file_info("workspace/data/file.txt")
print(f"Size: {info.size}, Modified: {info.mod_time}, Mode: {info.mode}")
if sandbox.fs.get_file_info("workspace/data").is_dir:
    print("Path is a directory")
```

### File Operations

**upload_file(file: bytes | str, remote_path: str, timeout: int = 30*60) -> None**

Uploads file from bytes or local path. Supports streaming for large files.

```python
# From bytes
sandbox.fs.upload_file(b"Hello, World!", "tmp/hello.txt")
sandbox.fs.upload_file(json.dumps({"key": "value"}).encode('utf-8'), "tmp/config.json")

# From local file (streaming)
sandbox.fs.upload_file("local_file.txt", "tmp/large_file.txt")
```

**upload_files(files: list[FileUpload], timeout: int = 30*60) -> None**

Uploads multiple files. FileUpload has source (bytes | str) and destination (str).

```python
sandbox.fs.upload_files([
    FileUpload(source=b"Content 1", destination="/tmp/file1.txt"),
    FileUpload(source="local_file.txt", destination="/tmp/file2.txt"),
])
```

**download_file(remote_path: str, timeout: int = 30*60) -> bytes**

Downloads file as bytes (for small files in memory).

```python
content = sandbox.fs.download_file("workspace/data/file.txt")
with open("local_copy.txt", "wb") as f:
    f.write(content)
config = json.loads(sandbox.fs.download_file("workspace/data/config.json").decode('utf-8'))
```

**download_file(remote_path: str, local_path: str, timeout: int = 30*60) -> None**

Downloads file with streaming to local path (for large files).

```python
sandbox.fs.download_file("tmp/large_file.txt", "local_copy.txt")
size_mb = os.path.getsize("local_copy.txt") / 1024 / 1024
```

**download_files(files: list[FileDownloadRequest], timeout: int = 30*60) -> list[FileDownloadResponse]**

Downloads multiple files. FileDownloadRequest has source (str) and optional destination (str). Returns FileDownloadResponse with source, result (str | bytes | None), and error (str | None). Individual file errors don't raise exceptions.

```python
results = sandbox.fs.download_files([
    FileDownloadRequest(source="tmp/data.json"),
    FileDownloadRequest(source="tmp/config.json", destination="local_config.json")
])
for result in results:
    if result.error:
        print(f"Error: {result.error}")
    elif result.result:
        print(f"Downloaded to {result.result}")
```

**delete_file(path: str, recursive: bool = False) -> None**

Deletes a file. For directories, recursive must be True.

```python
sandbox.fs.delete_file("workspace/data/old_file.txt")
```

**move_files(source: str, destination: str) -> None**

Moves or renames files/directories. Parent directory of destination must exist.

```python
sandbox.fs.move_files("workspace/data/old_name.txt", "workspace/data/new_name.txt")
sandbox.fs.move_files("workspace/data/file.txt", "workspace/archive/file.txt")
sandbox.fs.move_files("workspace/old_dir", "workspace/new_dir")
```

**set_file_permissions(path: str, mode: str | None = None, owner: str | None = None, group: str | None = None) -> None**

Sets permissions and ownership. Any parameter can be None to leave unchanged.

```python
sandbox.fs.set_file_permissions("workspace/scripts/run.sh", mode="755")
sandbox.fs.set_file_permissions("workspace/data/file.txt", owner="daytona", group="daytona")
```

### Search and Replace

**search_files(path: str, pattern: str) -> SearchFilesResponse**

Searches for files/directories by name pattern (supports glob patterns like "*.py").

```python
result = sandbox.fs.search_files("workspace", "*.py")
for file in result.files:
    print(file)
result = sandbox.fs.search_files("workspace/data", "test_*")
```

**find_files(path: str, pattern: str) -> list[Match]**

Searches file contents for pattern (like grep). Returns Match objects with file, line, content.

```python
matches = sandbox.fs.find_files("workspace/src", "TODO:")
for match in matches:
    print(f"{match.file}:{match.line}: {match.content.strip()}")
```

**replace_in_files(files: list[str], pattern: str, new_value: str) -> list[ReplaceResult]**

Performs search and replace across multiple files. Returns ReplaceResult with file, success, error.

```python
results = sandbox.fs.replace_in_files(
    files=["workspace/src/file1.py", "workspace/src/file2.py"],
    pattern="old_function",
    new_value="new_function"
)
for result in results:
    print(f"{result.file}: {result.success if result.success else result.error}")
```

### Data Classes

**FileUpload**: source (bytes | str), destination (str)

**FileDownloadRequest**: source (str), destination (str | None)

**FileDownloadResponse**: source (str), result (str | bytes | None), error (str | None)

**FileInfo**: name, is_dir, size, mode, mod_time, permissions, owner, group

All relative paths resolve based on sandbox working directory. Default timeout is 30 minutes (0 = no timeout).