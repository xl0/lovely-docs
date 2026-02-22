## Preview Links

Generate preview links for accessing Sandboxes. Any process listening on ports 3000–9999 can be previewed.

### Authentication

Public sandboxes (with `public` property set to `true`) have publicly accessible preview links. Private sandboxes require authentication, which differs by preview URL type.

### Standard Preview URL

URL structure: `https://{port}-{sandboxId}.{daytonaProxyDomain}`

Authentication via header token that resets on sandbox restart.

```python
preview_info = sandbox.get_preview_link(3000)
import requests
response = requests.get(
    preview_info.url,
    headers={"x-daytona-preview-token": preview_info.token}
)
```

```typescript
const previewInfo = await sandbox.getPreviewLink(3000);
const response = await fetch(previewInfo.url, {
  headers: { 'x-daytona-preview-token': previewInfo.token }
});
```

```ruby
preview_info = sandbox.preview_url(3000)
```

Use for: Programmatic access and API integrations where you control HTTP headers.

### Signed Preview URL

URL structure: `https://{port}-{token}.{daytonaProxyDomain}`

Token embedded in URL, no headers needed. Set custom expiry time (defaults to 60 seconds). Token persists across sandbox restarts until expiry. Can be manually revoked.

```python
signed_url = sandbox.create_signed_preview_url(3000, expires_in_seconds=3600)
import requests
response = requests.get(signed_url.url)
sandbox.expire_signed_preview_url(3000, signed_url.token)  # revoke
```

```typescript
const signedUrl = await sandbox.getSignedPreviewUrl(3000, 3600);
const response = await fetch(signedUrl.url);
await sandbox.expireSignedPreviewUrl(3000, signedUrl.token);  // revoke
```

```ruby
signed_url = sandbox.create_signed_preview_url(3000, expires_in_seconds=3600)
```

Use for: Sharing with users, embedding in iframes/emails, time-limited shareable links, webhooks.

### Warning Page

Browser warning page shown on first visit as security measure. Skip by:
- Sending `X-Daytona-Skip-Preview-Warning: true` header
- Upgrading to Tier 3
- Deploying custom preview proxy