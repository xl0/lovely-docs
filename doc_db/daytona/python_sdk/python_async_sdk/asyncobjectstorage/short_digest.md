## AsyncObjectStorage

Async class for uploading files to object storage with AWS credentials.

**Attributes:** endpoint_url, aws_access_key_id, aws_secret_access_key, aws_session_token, bucket_name (defaults to "daytona-volume-builds")

**Method:** `upload(path, organization_id, archive_base_path=None) -> str` - Uploads file and returns its hash