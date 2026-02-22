## Overview

Audit logs track user and system activity for security audits, debugging, and compliance. Access via dashboard at `https://app.daytona.io/dashboard/audit-logs` or API.

## API

```bash
# All audit logs
curl https://app.daytona.io/api/audit \
  --header 'Authorization: Bearer YOUR_API_KEY'

# Organization-specific logs
curl https://app.daytona.io/api/audit/organizations/{organizationId} \
  --header 'Authorization: Bearer YOUR_API_KEY'
```

## Log Fields

`id`, `actorId`, `actorEmail`, `organizationId`, `action`, `targetType`, `targetId`, `statusCode`, `errorMessage`, `ipAddress`, `userAgent`, `source`, `metadata`, `createdAt`

## Actions

CRUD operations, authentication, access control, sandbox lifecycle (start/stop/archive), backups, SSH access, webhooks, and toolbox operations (file management, git, command execution, computer use).

## Targets

`api_key`, `organization`, `organization_invitation`, `organization_role`, `organization_user`, `docker_registry`, `runner`, `sandbox`, `snapshot`, `user`, `volume`

## Outcomes

Info (1xx), Success (2xx), Redirect (3xx), Error (4xx/5xx)