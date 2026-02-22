## AsyncFileSystem

Async file system operations for Daytona Sandbox: create/delete folders, upload/download files (bytes or streaming), list/search files, get metadata, move/rename, set permissions, search/replace content.

**Key methods:**
- `create_folder(path, mode)` - Create directory with octal permissions
- `delete_file(path, recursive)` - Delete files/directories
- `download_file(remote_path) -> bytes` or `download_file(remote_path, local_path)` - Stream to memory or disk
- `upload_file(bytes, remote_path)` or `upload_file(local_path, remote_path)` - Stream from memory or disk
- `download_files/upload_files` - Batch operations with per-item error handling
- `list_files(path) -> list[FileInfo]` - Directory listing with metadata
- `search_files(path, pattern)` - Glob pattern search on names
- `find_files(path, pattern)` - Content search (grep-like)
- `move_files(source, dest)` - Rename/move files
- `replace_in_files(files, pattern, new_value)` - Multi-file search/replace
- `get_file_info(path) -> FileInfo` - File metadata (size, mode, timestamps, owner, group)
- `set_file_permissions(path, mode, owner, group)` - Change permissions/ownership

**Data classes:**
- `FileUpload(source: bytes|str, destination: str)`
- `FileDownloadRequest(source: str, destination: str|None)`
- `FileDownloadResponse(source: str, result: str|bytes|None, error: str|None)`

Default timeout: 30 minutes (0 = no timeout). Relative paths resolve from sandbox working directory.