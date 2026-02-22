## Custom Preview Proxy

Deploy your own preview proxy to handle sandbox preview URLs with complete control over domains, authentication, error handling, and styling.

### Capabilities

- Custom domain hosting (e.g., `preview.yourcompany.com`)
- Custom user authentication for private previews
- Automatic sandbox startup before forwarding requests
- Custom error pages and styling
- Disable Daytona's preview warning
- Override CORS settings

### Request Flow

1. User visits preview URL
2. Custom proxy authenticates user
3. Proxy checks sandbox status and starts if needed
4. Request forwarded to sandbox
5. Response handled with custom styling/error pages
6. Custom headers sent to control Daytona behavior

### Daytona Control Headers

**Disable preview warning:**
```
X-Daytona-Skip-Preview-Warning: true
```

**Override CORS:**
```
X-Daytona-Disable-CORS: true
```

**Skip last activity updates** (prevents auto-stop from keeping sandbox running):
```
X-Daytona-Skip-Last-Activity-Update: true
```

Example:
```bash
curl -H "X-Daytona-Skip-Last-Activity-Update: true" \
https://3000-sandbox-123456.proxy.daytona.work
```

**Authentication for private previews:**
```
X-Daytona-Preview-Token: {sandboxToken}
```

Fetch `sandboxToken` via Daytona SDK or API.

### Examples

Reference implementations available on Github (daytona-proxy-samples):
- Typescript example
- Golang example