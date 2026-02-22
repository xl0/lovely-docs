## Webhooks

HTTP callbacks that Daytona sends to specified endpoints when events occur. Enable real-time notifications, automated workflows, monitoring, integrations, and audit logging.

## Accessing Webhooks

Navigate to Daytona Dashboard → Webhooks in sidebar. Available to organization admins and members with appropriate permissions. Contact support@daytona.io with organization ID to enable if not visible.

## Create Webhook Endpoints

1. Dashboard → Webhooks → Add Endpoint
2. Configure:
   - **Endpoint URL**: HTTPS endpoint to receive events
   - **Description**: endpoint description
   - **Subscribe to events**: select event types
3. Click Create

## Test Webhook Endpoints

1. Dashboard → Webhooks → select endpoint
2. Testing tab → select event type → Send Example
3. Verify endpoint receives payload and application handles webhook format

## Edit Webhook Endpoints

1. Dashboard → Webhooks → select endpoint
2. Click Edit next to option
3. Update details → Save

## Delete Webhook Endpoints

1. Dashboard → Webhooks → select endpoint
2. Click ⋮ menu → Delete → Confirm

## Webhook Events

### Sandbox Events
- `sandbox.created`: New sandbox created
- `sandbox.state.updated`: Sandbox state changed

### Snapshot Events
- `snapshot.created`: New snapshot created
- `snapshot.state.updated`: Snapshot state changed
- `snapshot.removed`: Snapshot removed

### Volume Events
- `volume.created`: New volume created
- `volume.state.updated`: Volume state changed

## Webhook Payload Format

All payloads are JSON with common fields:
- `event` (string): Event type identifier
- `timestamp` (string): ISO 8601 timestamp

### sandbox.created
```json
{
  "event": "sandbox.created",
  "timestamp": "2025-12-19T10:30:00.000Z",
  "id": "sandbox123",
  "organizationId": "org123",
  "state": "started",
  "class": "small",
  "createdAt": "2025-12-19T10:30:00.000Z"
}
```

### sandbox.state.updated
```json
{
  "event": "sandbox.state.updated",
  "timestamp": "2025-12-19T10:30:00.000Z",
  "id": "sandbox123",
  "organizationId": "org123",
  "oldState": "started",
  "newState": "stopped",
  "updatedAt": "2025-12-19T10:30:00.000Z"
}
```

### snapshot.created
```json
{
  "event": "snapshot.created",
  "timestamp": "2025-12-19T10:30:00.000Z",
  "id": "snapshot123",
  "name": "my-snapshot",
  "organizationId": "org123",
  "state": "active",
  "createdAt": "2025-12-19T10:30:00.000Z"
}
```

### snapshot.state.updated
```json
{
  "event": "snapshot.state.updated",
  "timestamp": "2025-12-19T10:30:00.000Z",
  "id": "snapshot123",
  "name": "my-snapshot",
  "organizationId": "org123",
  "oldState": "building",
  "newState": "active",
  "updatedAt": "2025-12-19T10:30:00.000Z"
}
```

### snapshot.removed
```json
{
  "event": "snapshot.removed",
  "timestamp": "2025-12-19T10:30:00.000Z",
  "id": "snapshot123",
  "name": "my-snapshot",
  "organizationId": "org123",
  "removedAt": "2025-12-19T10:30:00.000Z"
}
```

### volume.created
```json
{
  "event": "volume.created",
  "timestamp": "2025-12-19T10:30:00.000Z",
  "id": "vol-12345678",
  "name": "my-volume",
  "organizationId": "org123",
  "state": "ready",
  "createdAt": "2025-12-19T10:30:00.000Z"
}
```

### volume.state.updated
```json
{
  "event": "volume.state.updated",
  "timestamp": "2025-12-19T10:30:00.000Z",
  "id": "vol-12345678",
  "name": "my-volume",
  "organizationId": "org123",
  "oldState": "creating",
  "newState": "ready",
  "updatedAt": "2025-12-19T10:30:00.000Z"
}
```

## Webhook Logs

Dashboard → Webhooks → Logs sidebar. Shows detailed webhook delivery information: message logs, event types, message IDs, timestamps.