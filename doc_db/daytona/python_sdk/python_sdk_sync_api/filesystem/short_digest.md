## FileSystem

File system operations in Daytona Sandbox.

**Directories**: create_folder(path, mode), list_files(path), get_file_info(path)

**Upload**: upload_file(bytes|path, remote_path), upload_files(list[FileUpload])

**Download**: download_file(remote_path) → bytes, download_file(remote_path, local_path), download_files(list[FileDownloadRequest]) → list[FileDownloadResponse]

**Modify**: delete_file(path, recursive=False), move_files(source, dest), set_file_permissions(path, mode, owner, group)

**Search**: search_files(path, pattern) for names, find_files(path, pattern) for content, replace_in_files(files, pattern, new_value)

All methods support relative paths (resolved from sandbox working directory) and 30-minute default timeout.