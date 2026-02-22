## ObjectStorage

S3-compatible object storage client for uploading files.

### Constructor

```ruby
ObjectStorage.new(
  endpoint_url:,
  aws_access_key_id:,
  aws_secret_access_key:,
  aws_session_token:,
  bucket_name: "daytona-volume-builds",
  region: "us-east-1"
)
```

Initialize with S3-compatible credentials. All parameters except `bucket_name` and `region` are required.

### Methods

**bucket_name()** → String
Returns the S3 bucket name.

**s3_client()** → Aws::S3::Client
Returns the underlying S3 client instance.

**upload(path, organization_id, archive_base_path)** → String
Uploads a file to object storage.
- `path` (String): File path to upload
- `organization_id` (String): Organization ID for the upload
- `archive_base_path` (String, nil): Optional base path for the archive
- Returns: Hash of the uploaded file
- Raises: `Errno::ENOENT` if path does not exist