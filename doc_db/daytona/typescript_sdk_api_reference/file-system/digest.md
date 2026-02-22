## FileSystem

Provides file system operations within a Sandbox.

### Constructor

```ts
new FileSystem(clientConfig: Configuration, apiClient: FileSystemApi, ensureToolboxUrl: () => Promise<void>)
```

### Methods

#### Directory Operations

**createFolder(path, mode)**
Create a directory with octal permissions.
```ts
await fs.createFolder('app/data', '755');
```

**listFiles(path)**
List directory contents, returns array of FileInfo objects with name, size, etc.
```ts
const files = await fs.listFiles('app/src');
files.forEach(f => console.log(`${f.name} (${f.size} bytes)`));
```

#### File Operations

**deleteFile(path, recursive?)**
Delete file or directory. Set `recursive: true` for directories.
```ts
await fs.deleteFile('app/temp.log');
```

**moveFiles(source, destination)**
Move or rename files/directories.
```ts
await fs.moveFiles('app/temp/data.json', 'app/data/data.json');
```

**getFileDetails(path)**
Get file metadata including size, permissions, modification time.
```ts
const info = await fs.getFileDetails('app/config.json');
console.log(`Size: ${info.size}, Modified: ${info.modTime}`);
```

**setFilePermissions(path, permissions)**
Set file permissions, owner, and group.
```ts
await fs.setFilePermissions('app/script.sh', {
  owner: 'daytona',
  group: 'users',
  mode: '755'
});
```

#### Upload Operations

**uploadFile(file, remotePath, timeout?)**
Upload single file from Buffer or local path. Streaming recommended for large files.
```ts
// From buffer
await fs.uploadFile(Buffer.from('{"setting": "value"}'), 'tmp/config.json');
// From local file
await fs.uploadFile('local_file.txt', 'tmp/file.txt');
```

**uploadFiles(files, timeout?)**
Upload multiple files. Each file can be Buffer or local path.
```ts
await fs.uploadFiles([
  { source: Buffer.from('Content 1'), destination: '/tmp/file1.txt' },
  { source: 'app/data/file2.txt', destination: '/tmp/file2.txt' },
  { source: Buffer.from('{"key": "value"}'), destination: '/tmp/config.json' }
]);
```

#### Download Operations

**downloadFile(remotePath, timeout?)**
Download file into memory as Buffer. Not recommended for large files.
```ts
const fileBuffer = await fs.downloadFile('tmp/data.json');
console.log('File content:', fileBuffer.toString());
```

**downloadFile(remotePath, localPath, timeout?)**
Download file with streaming to local path. Recommended for large files.
```ts
await fs.downloadFile('tmp/data.json', 'local_file.json');
```

**downloadFiles(files, timeoutSec?)**
Download multiple files. Returns array of FileDownloadResponse with error handling per file.
```ts
const results = await fs.downloadFiles([
  { source: 'tmp/data.json' },
  { source: 'tmp/config.json', destination: 'local_config.json' }
]);
results.forEach(result => {
  if (result.error) {
    console.error(`Error downloading ${result.source}: ${result.error}`);
  } else if (result.result) {
    console.log(`Downloaded ${result.source} to ${result.result}`);
  }
});
```

#### Search and Replace

**searchFiles(path, pattern)**
Search for files/directories by name pattern (supports globs).
```ts
const result = await fs.searchFiles('app', '*.ts');
result.files.forEach(file => console.log(file));
```

**findFiles(path, pattern)**
Search for text patterns within files.
```ts
const matches = await fs.findFiles('app/src', 'TODO:');
matches.forEach(match => {
  console.log(`${match.file}:${match.line}: ${match.content}`);
});
```

**replaceInFiles(files, pattern, newValue)**
Replace text in multiple files.
```ts
const results = await fs.replaceInFiles(
  ['app/package.json', 'app/version.ts'],
  '"version": "1.0.0"',
  '"version": "1.1.0"'
);
```

### Types

**FileInfo** - File metadata with name, size, permissions, modification time

**FileDownloadRequest** - `{ source: string, destination?: string }`

**FileDownloadResponse** - `{ source: string, result?: string | Buffer, error?: string }`

**FilePermissionsParams** - `{ mode?: string, owner?: string, group?: string }`

**FileUpload** - `{ source: string | Buffer, destination: string }`

**DownloadMetadata** - `{ destination?: string, result?: string | Buffer | Uint8Array, error?: string }`

### Notes

- Relative paths resolve based on sandbox working directory
- Timeout parameters in seconds; 0 means no timeout; default 30 minutes
- Streaming recommended for large files (use local path variants)
- Buffer variants load entire file into memory
- downloadFiles and uploadFiles handle individual file errors gracefully