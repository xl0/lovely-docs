## Quick Start

```bash
docker compose -f docker/docker-compose.yaml up -d
```

Access: Dashboard (http://localhost:3000, dev@daytona.io/password), PgAdmin (5050), Registry (5100), MinIO (9001).

## DNS Setup

```bash
./scripts/setup-proxy-dns.sh
```

Resolves `*.proxy.localhost` to `127.0.0.1` for SDK examples and proxy access.

## Network Configuration

**HTTP Proxy** - Set in docker-compose.yaml:
```yaml
environment:
  - HTTP_PROXY=<your-proxy>
  - HTTPS_PROXY=<your-proxy>
  - NO_PROXY=localhost,runner,dex,registry,minio,jaeger,otel-collector,<your-proxy>
```

**CA Certificates:**
```yaml
environment:
  - NODE_EXTRA_CA_CERTS=/path/to/cert-bundle.pem
```

## Key Environment Variables

**API Service** - Database: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`, `DB_TLS_ENABLED`

**OIDC** - `OIDC_CLIENT_ID`, `OIDC_ISSUER_BASE_URL`, `OIDC_AUDIENCE`, `OIDC_MANAGEMENT_API_*`

**Storage** - S3/MinIO: `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_DEFAULT_BUCKET`

**Proxy** - `PROXY_DOMAIN`, `PROXY_PROTOCOL`, `PROXY_API_KEY`, `PROXY_TEMPLATE_URL`

**Runner** - `DEFAULT_RUNNER_DOMAIN`, `DEFAULT_RUNNER_API_URL`, `DEFAULT_RUNNER_CPU`, `DEFAULT_RUNNER_MEMORY`, `DEFAULT_RUNNER_DISK`

**Quotas** - `DEFAULT_ORG_QUOTA_*` for CPU, memory, disk, snapshots, volumes

**Rate Limiting** - `RATE_LIMIT_*_TTL` and `RATE_LIMIT_*_LIMIT` (empty = disabled)

**Observability** - `OTEL_ENABLED`, `OTEL_COLLECTOR_URL`, ClickHouse config for sandbox traces

**SSH Gateway** - `SSH_GATEWAY_API_KEY`, `SSH_GATEWAY_PUBLIC_KEY`, `SSH_GATEWAY_URL`

**Runner Service** - `DAYTONA_API_URL`, `DAYTONA_RUNNER_TOKEN`, `RESOURCE_LIMITS_DISABLED`, AWS/MinIO config, timeouts, health checks

**Proxy Service** - `DAYTONA_API_URL`, `PROXY_PORT`, `PROXY_API_KEY`, OIDC config, Redis config

## Auth0 Setup (Optional)

1. Create SPA app at Auth0, add callback URIs: `http://localhost:3000`, `http://localhost:3000/api/oauth2-redirect.html`, `http://localhost:4000/callback`, `http://proxy.localhost:4000/callback`
2. Create M2M app, authorize Auth0 Management API with `read:users`, `update:users`, `read:connections`, `create:guardian_enrollment_tickets`, `read:connections_options`
3. Create custom API with scopes: `read:node`, `create:node`, `create:user`, `read:users`, `regenerate-key-pair:users`, `read:workspaces`, `create:registry`, `read:registries`, `read:registry`, `write:registry`
4. Configure API: `OIDC_CLIENT_ID`, `OIDC_ISSUER_BASE_URL`, `OIDC_AUDIENCE`, `OIDC_MANAGEMENT_API_*`
5. Configure Proxy: `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET=` (empty), `OIDC_DOMAIN`, `OIDC_AUDIENCE/`