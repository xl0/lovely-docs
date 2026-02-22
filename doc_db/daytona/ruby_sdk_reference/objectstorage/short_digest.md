## ObjectStorage

S3-compatible object storage client.

```ruby
ObjectStorage.new(
  endpoint_url:, aws_access_key_id:, aws_secret_access_key:,
  aws_session_token:, bucket_name: "daytona-volume-builds", region: "us-east-1"
)
```

Methods: `bucket_name()`, `s3_client()`, `upload(path, organization_id, archive_base_path)` → file hash or raises `Errno::ENOENT`