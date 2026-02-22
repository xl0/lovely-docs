## Custom Preview Proxy

Deploy custom proxy for sandbox previews with custom domains, authentication, and error handling.

### Control Headers

- `X-Daytona-Skip-Preview-Warning: true` - disable preview warning
- `X-Daytona-Disable-CORS: true` - override CORS
- `X-Daytona-Skip-Last-Activity-Update: true` - prevent auto-stop from keeping sandbox running
- `X-Daytona-Preview-Token: {sandboxToken}` - authenticate private previews

Example:
```bash
curl -H "X-Daytona-Skip-Last-Activity-Update: true" \
https://3000-sandbox-123456.proxy.daytona.work
```

Reference implementations: Typescript and Golang examples on daytona-proxy-samples Github repo.