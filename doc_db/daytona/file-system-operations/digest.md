# File System Operations

Daytona's `fs` module provides comprehensive file system operations in sandboxes. File operations default to the sandbox user's home directory; use leading `/` for absolute paths.

## Basic Operations

### List Files and Directories

```python
files = sandbox.fs.list_files("workspace")
for file in files:
    print(f"{file.name}: dir={file.is_dir}, size={file.size}, modified={file.mod_time}")
```

```typescript
const files = await sandbox.fs.listFiles('workspace')
files.forEach(file => console.log(`${file.name}: ${file.isDir}, ${file.size}`))
```

### Get File Information

```python
info = sandbox.fs.get_file_info("workspace/data/file.txt")
print(f"Size: {info.size}, Modified: {info.mod_time}, Mode: {info.mode}")
if info.is_dir:
    print("Is directory")
```

### Create Directories

```python
sandbox.fs.create_folder("workspace/new-dir", "755")
```

```typescript
await sandbox.fs.createFolder('workspace/new-dir', '755')
```

### Upload Files

Single file:
```python
with open("local_file.txt", "rb") as f:
    sandbox.fs.upload_file(f.read(), "remote_file.txt")
```

```typescript
const fileContent = Buffer.from('Hello, World!')
await sandbox.fs.uploadFile(fileContent, 'data.txt')
```

Multiple files:
```python
files_to_upload = [
    FileUpload(source=b"Content 1", destination="data/file1.txt"),
    FileUpload(source=b"Content 2", destination="data/file2.txt"),
]
sandbox.fs.upload_files(files_to_upload)
```

```typescript
const files = [
  { source: Buffer.from('Content 1'), destination: 'data/file1.txt' },
  { source: Buffer.from('Content 2'), destination: 'data/file2.txt' },
]
await sandbox.fs.uploadFiles(files)
```

### Download Files

Single file:
```python
content = sandbox.fs.download_file("file1.txt")
with open("local_file.txt", "wb") as f:
    f.write(content)
```

```typescript
const downloadedFile = await sandbox.fs.downloadFile('file1.txt')
console.log(downloadedFile.toString())
```

Multiple files:
```python
files_to_download = [
    FileDownloadRequest(source="data/file1.txt"),  # to memory
    FileDownloadRequest(source="data/file2.txt", destination="local_file2.txt"),  # to disk
]
results = sandbox.fs.download_files(files_to_download)
for result in results:
    if result.error:
        print(f"Error: {result.error}")
    else:
        print(f"Downloaded to {result.result}")
```

```typescript
const files = [
  { source: 'data/file1.txt' },  // to memory
  { source: 'data/file2.txt', destination: 'local_file2.txt' },  // to disk
]
const results = await sandbox.fs.downloadFiles(files)
results.forEach(result => {
  if (result.error) console.error(`Error: ${result.error}`)
  else console.log(`Downloaded to ${result.result}`)
})
```

### Delete Files

```python
sandbox.fs.delete_file("workspace/file.txt")
sandbox.fs.delete_file("workspace/old_dir", recursive=True)
```

```typescript
await sandbox.fs.deleteFile('workspace/file.txt')
```

## Advanced Operations

### File Permissions

```python
sandbox.fs.set_file_permissions("workspace/file.txt", "644")
file_info = sandbox.fs.get_file_info("workspace/file.txt")
print(f"Permissions: {file_info.permissions}")
```

```typescript
await sandbox.fs.setFilePermissions('workspace/file.txt', { mode: '644' })
const fileInfo = await sandbox.fs.getFileDetails('workspace/file.txt')
console.log(`Permissions: ${fileInfo.permissions}`)
```

Set owner and group:
```python
sandbox.fs.set_file_permissions("workspace/file.txt", owner="daytona", group="daytona")
```

### Find and Replace Text

```python
results = sandbox.fs.find_files(path="workspace/src", pattern="text-of-interest")
for match in results:
    print(f"{match.file}:{match.line}: {match.content}")

sandbox.fs.replace_in_files(
    files=["workspace/file1.txt", "workspace/file2.txt"],
    pattern="old_text",
    new_value="new_text"
)
```

```typescript
const results = await sandbox.fs.findFiles({
    path: "workspace/src",
    pattern: "text-of-interest"
})
results.forEach(match => console.log(`${match.file}:${match.line}: ${match.content}`))

await sandbox.fs.replaceInFiles(
    ["workspace/file1.txt", "workspace/file2.txt"],
    "old_text",
    "new_text"
)
```

### Move or Rename Files

```python
sandbox.fs.move_files("workspace/data/old_name.txt", "workspace/data/new_name.txt")
sandbox.fs.move_files("workspace/data/file.txt", "workspace/archive/file.txt")
sandbox.fs.move_files("workspace/old_dir", "workspace/new_dir")
```

```typescript
await sandbox.fs.moveFiles('app/temp/data.json', 'app/data/data.json')
```

## API Endpoints

- List files: `GET /toolbox/{sandboxId}/files`
- Get file info: `GET /toolbox/{sandboxId}/files/info?path=`
- Create folder: `POST /toolbox/{sandboxId}/files/folder?path=&mode=`
- Upload file: `POST /toolbox/{sandboxId}/files/upload?path=`
- Upload multiple: `POST /toolbox/{sandboxId}/files/bulk-upload`
- Download file: `GET /toolbox/{sandboxId}/files/download?path=`
- Download multiple: `POST /toolbox/{sandboxId}/files/bulk-download`
- Delete: `DELETE /toolbox/{sandboxId}/files?path=`
- Set permissions: `POST /toolbox/{sandboxId}/files/permissions?path=`
- Find text: `GET /toolbox/{sandboxId}/files/find?path=&pattern=`
- Replace text: `POST /toolbox/{sandboxId}/files/replace`
- Move/rename: `POST /toolbox/{sandboxId}/files/move?source=&destination=`