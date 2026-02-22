## ObjectStorage

Class for uploading files/directories to object storage.

```ts
new ObjectStorage(config: ObjectStorageConfig)
upload(path: string, organizationId: string, archiveBasePath: string): Promise<string>
```

**Config properties**: `accessKeyId`, `endpointUrl`, `secretAccessKey`, optional `bucketName` and `sessionToken`