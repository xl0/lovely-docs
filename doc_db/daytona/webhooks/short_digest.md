## Webhooks

HTTP callbacks for sandbox, snapshot, and volume lifecycle events. Create HTTPS endpoints via Dashboard → Webhooks → Add Endpoint, configure event subscriptions, test with example payloads.

## Event Types

- `sandbox.created`, `sandbox.state.updated`
- `snapshot.created`, `snapshot.state.updated`, `snapshot.removed`
- `volume.created`, `volume.state.updated`

## Payload Format

All JSON payloads include `event` (type identifier) and `timestamp` (ISO 8601). Event-specific fields include `id`, `organizationId`, state info, and timestamps.

Example:
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

## Management

- **Create**: Dashboard → Webhooks → Add Endpoint (HTTPS URL, description, event subscriptions)
- **Test**: Select endpoint → Testing tab → Send Example
- **Edit**: Select endpoint → Edit → Save
- **Delete**: Select endpoint → ⋮ → Delete
- **Logs**: Dashboard → Webhooks → Logs