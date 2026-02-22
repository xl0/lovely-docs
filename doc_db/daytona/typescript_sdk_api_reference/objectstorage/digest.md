## ObjectStorage

Class for interacting with object storage services.

### Constructor

```ts
new ObjectStorage(config: ObjectStorageConfig): ObjectStorage
```

### Methods

#### upload()

```ts
upload(path: string, organizationId: string, archiveBasePath: string): Promise<string>
```

Upload a file or directory to object storage.

**Parameters**:
- `path` - The path to the file or directory to upload
- `organizationId` - The organization ID for the upload
- `archiveBasePath` - The base path for the archive

**Returns**: `Promise<string>` - The hash of the uploaded file or directory

## ObjectStorageConfig

Configuration object for ObjectStorage.

**Properties**:
- `accessKeyId` _string_ - Access key ID for the object storage service
- `bucketName?` _string_ - Optional bucket name
- `endpointUrl` _string_ - Endpoint URL for the object storage service
- `secretAccessKey` _string_ - Secret access key for the object storage service
- `sessionToken?` _string_ - Optional session token for temporary credentials