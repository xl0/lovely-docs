## ObjectStorage

Class for interacting with object storage services.

### Attributes

- `endpoint_url` (str) - The endpoint URL for the object storage service
- `aws_access_key_id` (str) - Access key ID for the object storage service
- `aws_secret_access_key` (str) - Secret access key for the object storage service
- `aws_session_token` (str) - Session token for temporary credentials
- `bucket_name` (str) - Bucket name to use (defaults to "daytona-volume-builds")

### Methods

#### upload(path, organization_id, archive_base_path=None) → str

Uploads a file to the object storage service.

**Parameters:**
- `path` (str) - Path to the file to upload
- `organization_id` (str) - Organization ID to use
- `archive_base_path` (str, optional) - Base path for the archive

**Returns:** str - Hash of the uploaded file