## Overview

Docker Compose configuration for running Daytona Open Source locally. Includes API, Proxy, Runner, SSH Gateway, PostgreSQL, Redis, Dex (OIDC), Docker Registry, MinIO (S3), MailDev, Jaeger, and PgAdmin.

**⚠️ Not production-safe** - development setup only.

## Quick Start

1. Clone Daytona repository
2. Install Docker and Docker Compose
3. Run from repo root:
   ```bash
   docker compose -f docker/docker-compose.yaml up -d
   ```
4. Access services:
   - Dashboard: http://localhost:3000 (dev@daytona.io / password)
   - PgAdmin: http://localhost:5050
   - Registry UI: http://localhost:5100
   - MinIO: http://localhost:9001 (minioadmin / minioadmin)

## DNS Setup for Proxy URLs

For local development, resolve `*.proxy.localhost` to `127.0.0.1`:
```bash
./scripts/setup-proxy-dns.sh
```
Configures dnsmasq with `address=/proxy.localhost/127.0.0.1`. Required for SDK examples and proxy access.

## Network Configuration

### HTTP Proxy

Set environment variables in docker-compose.yaml for services requiring outbound access (API service pulls images):
```yaml
environment:
  - HTTP_PROXY=<your-proxy>
  - HTTPS_PROXY=<your-proxy>
  - NO_PROXY=localhost,runner,dex,registry,minio,jaeger,otel-collector,<your-proxy>
```

### Extra CA Certificates

For TLS connections (e.g., with `DB_TLS` env vars):
```yaml
environment:
  - NODE_EXTRA_CA_CERTS=/path/to/cert-bundle.pem
```

## Environment Variables

### API Service

Core configuration:
- `ENCRYPTION_KEY` (string, default: `supersecretkey`) - **Must override in production**
- `ENCRYPTION_SALT` (string, default: `supersecretsalt`) - **Must override in production**
- `PORT` (number, default: `3000`)
- `ENVIRONMENT` (string, default: `dev`)

Database:
- `DB_HOST` (string, default: `db`)
- `DB_PORT` (number, default: `5432`)
- `DB_USERNAME` (string, default: `user`)
- `DB_PASSWORD` (string, default: `pass`)
- `DB_DATABASE` (string, default: `daytona`)
- `DB_TLS_ENABLED` (boolean, default: `false`)
- `DB_TLS_REJECT_UNAUTHORIZED` (boolean, default: `true`)
- `RUN_MIGRATIONS` (boolean, default: `true`)

Redis:
- `REDIS_HOST` (string, default: `redis`)
- `REDIS_PORT` (number, default: `6379`)

OIDC Authentication:
- `OIDC_CLIENT_ID` (string, default: `daytona`)
- `OIDC_ISSUER_BASE_URL` (string, default: `http://dex:5556/dex`)
- `PUBLIC_OIDC_DOMAIN` (string, default: `http://localhost:5556/dex`)
- `OIDC_AUDIENCE` (string, default: `daytona`)
- `OIDC_MANAGEMENT_API_ENABLED` (boolean)
- `OIDC_MANAGEMENT_API_CLIENT_ID` (string)
- `OIDC_MANAGEMENT_API_CLIENT_SECRET` (string)
- `OIDC_MANAGEMENT_API_AUDIENCE` (string)
- `SKIP_USER_EMAIL_VERIFICATION` (boolean, default: `true`)

Dashboard & URLs:
- `DASHBOARD_URL` (string, default: `http://localhost:3000/dashboard`)
- `DASHBOARD_BASE_API_URL` (string, default: `http://localhost:3000`)
- `DEFAULT_SNAPSHOT` (string, default: `daytonaio/sandbox:0.4.3`)

Analytics:
- `POSTHOG_API_KEY` (string, default: `phc_bYtEsdMDrNLydXPD4tufkBrHKgfO2zbycM30LOowYNv`)
- `POSTHOG_HOST` (string, default: `https://d18ag4dodbta3l.cloudfront.net`)
- `POSTHOG_ENVIRONMENT` (string, default: `local`)

Registry (Transient & Internal):
- `TRANSIENT_REGISTRY_URL` (string, default: `http://registry:6000`)
- `TRANSIENT_REGISTRY_ADMIN` (string, default: `admin`)
- `TRANSIENT_REGISTRY_PASSWORD` (string, default: `password`)
- `TRANSIENT_REGISTRY_PROJECT_ID` (string, default: `daytona`)
- `INTERNAL_REGISTRY_URL` (string, default: `http://registry:6000`)
- `INTERNAL_REGISTRY_ADMIN` (string, default: `admin`)
- `INTERNAL_REGISTRY_PASSWORD` (string, default: `password`)
- `INTERNAL_REGISTRY_PROJECT_ID` (string, default: `daytona`)

Email (SMTP):
- `SMTP_HOST` (string, default: `maildev`)
- `SMTP_PORT` (number, default: `1025`)
- `SMTP_USER` (string)
- `SMTP_PASSWORD` (string)
- `SMTP_SECURE` (boolean)
- `SMTP_EMAIL_FROM` (string, default: `"Daytona Team <no-reply@daytona.io>"`)

S3 Storage (MinIO):
- `S3_ENDPOINT` (string, default: `http://minio:9000`)
- `S3_STS_ENDPOINT` (string, default: `http://minio:9000/minio/v1/assume-role`)
- `S3_REGION` (string, default: `us-east-1`)
- `S3_ACCESS_KEY` (string, default: `minioadmin`)
- `S3_SECRET_KEY` (string, default: `minioadmin`)
- `S3_DEFAULT_BUCKET` (string, default: `daytona`)
- `S3_ACCOUNT_ID` (string, default: `/`)
- `S3_ROLE_NAME` (string, default: `/`)

Proxy:
- `PROXY_DOMAIN` (string, default: `proxy.localhost:4000`)
- `PROXY_PROTOCOL` (string, default: `http`)
- `PROXY_API_KEY` (string, default: `super_secret_key`)
- `PROXY_TEMPLATE_URL` (string, default: `http://{{PORT}}-{{sandboxId}}.proxy.localhost:4000`)
- `PROXY_TOOLBOX_BASE_URL` (string, default: `{PROXY_PROTOCOL}://{PROXY_DOMAIN}`)

Runner Configuration:
- `DEFAULT_RUNNER_DOMAIN` (string, default: `runner:3003`)
- `DEFAULT_RUNNER_API_URL` (string, default: `http://runner:3003`)
- `DEFAULT_RUNNER_PROXY_URL` (string, default: `http://runner:3003`)
- `DEFAULT_RUNNER_API_KEY` (string, default: `secret_api_token`)
- `DEFAULT_RUNNER_CPU` (number, default: `4`)
- `DEFAULT_RUNNER_MEMORY` (number, default: `8` GB)
- `DEFAULT_RUNNER_DISK` (number, default: `50` GB)
- `DEFAULT_RUNNER_API_VERSION` (string, default: `0`)

Organization Quotas (defaults):
- `DEFAULT_ORG_QUOTA_TOTAL_CPU_QUOTA` (number, default: `10000`)
- `DEFAULT_ORG_QUOTA_TOTAL_MEMORY_QUOTA` (number, default: `10000`)
- `DEFAULT_ORG_QUOTA_TOTAL_DISK_QUOTA` (number, default: `100000`)
- `DEFAULT_ORG_QUOTA_MAX_CPU_PER_SANDBOX` (number, default: `100`)
- `DEFAULT_ORG_QUOTA_MAX_MEMORY_PER_SANDBOX` (number, default: `100`)
- `DEFAULT_ORG_QUOTA_MAX_DISK_PER_SANDBOX` (number, default: `1000`)
- `DEFAULT_ORG_QUOTA_SNAPSHOT_QUOTA` (number, default: `1000`)
- `DEFAULT_ORG_QUOTA_MAX_SNAPSHOT_SIZE` (number, default: `1000`)
- `DEFAULT_ORG_QUOTA_VOLUME_QUOTA` (number, default: `10000`)

SSH Gateway:
- `SSH_GATEWAY_API_KEY` (string, default: `ssh_secret_api_token`)
- `SSH_GATEWAY_COMMAND` (string, default: `ssh -p 2222 {{TOKEN}}@localhost`)
- `SSH_GATEWAY_PUBLIC_KEY` (string, Base64-encoded OpenSSH public key)
- `SSH_GATEWAY_URL` (string, default: `localhost:2222`)

Runner Health & Scoring:
- `RUNNER_DECLARATIVE_BUILD_SCORE_THRESHOLD` (number, default: `10`)
- `RUNNER_AVAILABILITY_SCORE_THRESHOLD` (number, default: `10`)
- `RUNNER_HEALTH_TIMEOUT_SECONDS` (number, default: `3`)
- `RUNNER_START_SCORE_THRESHOLD` (number, default: `3`)

Admin Setup (initial setup only):
- `ADMIN_API_KEY` (string) - Auto-generated if empty, not recommended for production
- `ADMIN_TOTAL_CPU_QUOTA` (number, default: `0`)
- `ADMIN_TOTAL_MEMORY_QUOTA` (number, default: `0`)
- `ADMIN_TOTAL_DISK_QUOTA` (number, default: `0`)
- `ADMIN_MAX_CPU_PER_SANDBOX` (number, default: `0`)
- `ADMIN_MAX_MEMORY_PER_SANDBOX` (number, default: `0`)
- `ADMIN_MAX_DISK_PER_SANDBOX` (number, default: `0`)
- `ADMIN_SNAPSHOT_QUOTA` (number, default: `100`)
- `ADMIN_MAX_SNAPSHOT_SIZE` (number, default: `100`)
- `ADMIN_VOLUME_QUOTA` (number, default: `0`)

Rate Limiting (all empty by default - disabled):
- `RATE_LIMIT_ANONYMOUS_TTL` (number, seconds)
- `RATE_LIMIT_ANONYMOUS_LIMIT` (number, requests per TTL)
- `RATE_LIMIT_AUTHENTICATED_TTL` (number, seconds)
- `RATE_LIMIT_AUTHENTICATED_LIMIT` (number, requests per TTL)
- `RATE_LIMIT_SANDBOX_CREATE_TTL` (number, seconds)
- `RATE_LIMIT_SANDBOX_CREATE_LIMIT` (number, requests per TTL)
- `RATE_LIMIT_SANDBOX_LIFECYCLE_TTL` (number, seconds)
- `RATE_LIMIT_SANDBOX_LIFECYCLE_LIMIT` (number, requests per TTL)
- `RATE_LIMIT_FAILED_AUTH_TTL` (number, seconds)
- `RATE_LIMIT_FAILED_AUTH_LIMIT` (number, requests per TTL)

Regions:
- `DEFAULT_REGION_ID` (string, default: `us`)
- `DEFAULT_REGION_NAME` (string, default: `us`)
- `DEFAULT_REGION_ENFORCE_QUOTAS` (boolean, default: `false`)

Observability:
- `OTEL_ENABLED` (boolean, default: `true`)
- `OTEL_COLLECTOR_URL` (string, default: `http://jaeger:4318/v1/traces`)
- `OTEL_COLLECTOR_API_KEY` (string, default: `otel_collector_api_key`)
- `CLICKHOUSE_HOST` (string)
- `CLICKHOUSE_DATABASE` (string, default: `otel`)
- `CLICKHOUSE_PORT` (number, default: `8123`)
- `CLICKHOUSE_USERNAME` (string)
- `CLICKHOUSE_PASSWORD` (string)
- `CLICKHOUSE_PROTOCOL` (string, default: `https`)
- `SANDBOX_OTEL_ENDPOINT_URL` (string)

Other:
- `MAX_AUTO_ARCHIVE_INTERVAL` (number, default: `43200` seconds)
- `MAINTENANCE_MODE` (boolean, default: `false`)
- `HEALTH_CHECK_API_KEY` (string, default: `supersecretkey`)

### Runner Service

- `DAYTONA_API_URL` (string, default: `http://api:3000/api`)
- `DAYTONA_RUNNER_TOKEN` (string, default: `secret_api_token`)
- `VERSION` (string, default: `0.0.1`)
- `ENVIRONMENT` (string, default: `development`)
- `API_PORT` (number, default: `3003`)
- `LOG_FILE_PATH` (string, default: `/home/daytona/runner/runner.log`)
- `RESOURCE_LIMITS_DISABLED` (boolean, default: `true`)
- `AWS_ENDPOINT_URL` (string, default: `http://minio:9000`)
- `AWS_REGION` (string, default: `us-east-1`)
- `AWS_ACCESS_KEY_ID` (string, default: `minioadmin`)
- `AWS_SECRET_ACCESS_KEY` (string, default: `minioadmin`)
- `AWS_DEFAULT_BUCKET` (string, default: `daytona`)
- `DAEMON_START_TIMEOUT_SEC` (number, default: `60`)
- `SANDBOX_START_TIMEOUT_SEC` (number, default: `30`)
- `USE_SNAPSHOT_ENTRYPOINT` (boolean, default: `false`)
- `RUNNER_DOMAIN` (string)
- `VOLUME_CLEANUP_INTERVAL_SEC` (number, default: `30`, minimum: `10`)
- `COLLECTOR_WINDOW_SIZE` (number, default: `60`)
- `CPU_USAGE_SNAPSHOT_INTERVAL` (string, default: `5s`, minimum: `1s`)
- `ALLOCATED_RESOURCES_SNAPSHOT_INTERVAL` (string, default: `5s`, minimum: `1s`)
- `POLL_TIMEOUT` (string, default: `30s`)
- `POLL_LIMIT` (number, default: `10`, min: `1`, max: `100`)
- `HEALTHCHECK_INTERVAL` (string, default: `30s`, minimum: `10s`)
- `HEALTHCHECK_TIMEOUT` (string, default: `10s`)
- `API_VERSION` (number, default: `2`)

### SSH Gateway Service

- `API_URL` (string, default: `http://api:3000/api`)
- `API_KEY` (string, default: `ssh_secret_api_token`)
- `SSH_PRIVATE_KEY` (string, Base64-encoded OpenSSH private key)
- `SSH_HOST_KEY` (string, Base64-encoded OpenSSH host key)
- `SSH_GATEWAY_PORT` (number, default: `2222`)

### Proxy Service

- `DAYTONA_API_URL` (string, default: `http://api:3000/api`)
- `PROXY_PORT` (number, default: `4000`)
- `PROXY_API_KEY` (string, default: `super_secret_key`)
- `PROXY_PROTOCOL` (string, default: `http`)
- `COOKIE_DOMAIN` (string, default: `$PROXY_DOMAIN`)
- `OIDC_CLIENT_ID` (string, default: `daytona`)
- `OIDC_CLIENT_SECRET` (string, empty for SPA)
- `OIDC_DOMAIN` (string, default: `http://dex:5556/dex`)
- `OIDC_PUBLIC_DOMAIN` (string, default: `http://localhost:5556/dex`)
- `OIDC_AUDIENCE` (string, default: `daytona`)
- `REDIS_HOST` (string, default: `redis`)
- `REDIS_PORT` (number, default: `6379`)
- `TOOLBOX_ONLY_MODE` (boolean, default: `false`)
- `PREVIEW_WARNING_ENABLED` (boolean, default: `false`)
- `SHUTDOWN_TIMEOUT_SEC` (number, default: `3600`)

## Auth0 Configuration (Optional)

Default setup uses local Dex OIDC. To use Auth0 instead:

### Step 1: Create Auth0 Tenant
- Sign up at https://auth0.com/signup
- Choose account type (Company/Personal)
- Create Single Page Application (SPA) named e.g., "My Daytona"
- Select "Email and Password" authentication

### Step 2: Configure SPA Application
In `Applications > Applications`, select your app, go to `Settings` tab:

**Allowed Callback URIs:**
```
http://localhost:3000
http://localhost:3000/api/oauth2-redirect.html
http://localhost:4000/callback
http://proxy.localhost:4000/callback
```

**Allowed Logout URIs:**
```
http://localhost:3000
```

**Allowed Web Origins:**
```
http://localhost:3000
```

### Step 3: Create Machine-to-Machine Application
- Go to `Applications > Applications`, click `Create Application`
- Choose `Machine to Machine Applications`
- Name it e.g., "My Management API M2M"
- In `APIs` tab, authorize `Auth0 Management API`
- Grant permissions:
  - `read:users`
  - `update:users`
  - `read:connections`
  - `create:guardian_enrollment_tickets`
  - `read:connections_options`

### Step 4: Set Up Custom API
- Go to `Applications > APIs`, click `Create API`
- Name: e.g., "My Daytona API"
- Identifier: e.g., "my-daytona-api"
- In `Permissions` tab, add scopes:
  - `read:node` - Get workspace node info
  - `create:node` - Create new workspace node record
  - `create:user` - Create user account
  - `read:users` - Get all user accounts
  - `regenerate-key-pair:users` - Regenerate user SSH key-pair
  - `read:workspaces` - Read workspaces (user scope)
  - `create:registry` - Create docker registry auth record
  - `read:registries` - Get all docker registry records
  - `read:registry` - Get docker registry record
  - `write:registry` - Create or update docker registry record

### Step 5: Configure Environment Variables

**API Service:**
```bash
OIDC_CLIENT_ID=your_spa_app_client_id
OIDC_ISSUER_BASE_URL=your_spa_app_domain
OIDC_AUDIENCE=your_custom_api_identifier
OIDC_MANAGEMENT_API_ENABLED=true
OIDC_MANAGEMENT_API_CLIENT_ID=your_m2m_app_client_id
OIDC_MANAGEMENT_API_CLIENT_SECRET=your_m2m_app_client_secret
OIDC_MANAGEMENT_API_AUDIENCE=your_auth0_managment_api_identifier
```

**Proxy Service:**
```bash
OIDC_CLIENT_ID=your_spa_app_client_id
OIDC_CLIENT_SECRET=
OIDC_DOMAIN=your_spa_app_domain
OIDC_AUDIENCE=your_custom_api_identifier/
```

Note: `OIDC_CLIENT_SECRET` must be empty for proxy (SPA apps don't have secrets).

## Development Notes

- Shared networking for service communication
- Database and storage data persisted in Docker volumes
- Registry allows image deletion for testing
- Sandbox resource limits disabled (DinD environment limitation)