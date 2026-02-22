## FileSystem

File system operations in Sandbox: create/delete/move directories and files, upload/download (single or batch with streaming), search by name/content, replace text, manage permissions.

### Key Methods

**Directories**: `createFolder(path, mode)`, `listFiles(path)`

**Files**: `deleteFile(path, recursive?)`, `moveFiles(src, dst)`, `getFileDetails(path)`, `setFilePermissions(path, perms)`

**Upload**: `uploadFile(file|path, remotePath)`, `uploadFiles(files[])`

**Download**: `downloadFile(remotePath)` or `downloadFile(remotePath, localPath)`, `downloadFiles(requests[])`

**Search**: `searchFiles(path, pattern)` (by name), `findFiles(path, pattern)` (by content), `replaceInFiles(files[], pattern, newValue)`

### Example

```ts
// Create, upload, search, download
await fs.createFolder('data', '755');
await fs.uploadFile('local.json', 'data/config.json');
const matches = await fs.findFiles('data', 'TODO');
await fs.downloadFile('data/config.json', 'output.json');
await fs.replaceInFiles(['data/config.json'], 'old', 'new');
```

Streaming recommended for large files; timeout default 30min; relative paths use sandbox working directory.