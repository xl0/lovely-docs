## ObjectStorage

Class for uploading files to object storage with AWS credentials.

**Attributes:** endpoint_url, aws_access_key_id, aws_secret_access_key, aws_session_token, bucket_name (defaults to "daytona-volume-builds")

**Method:** `upload(path, organization_id, archive_base_path=None)` - uploads file and returns its hash