## Creating API Keys

1. Navigate to Daytona Dashboard at https://app.daytona.io/dashboard/keys
2. Click **Create Key** button
3. Enter key name, set expiration date, and select permissions
4. Click **Create** button
5. Copy the generated API key

Set the `DAYTONA_API_KEY` environment variable to use the key in your application.

Configuration options: in code, environment variables, .env file, or default values.

## Permissions & Scopes

| Resource   | Scope                   | Description              |
| ---------- | ----------------------- | ------------------------ |
| Sandboxes  | `write:sandboxes`       | Create/modify sandboxes  |
|            | `delete:sandboxes`      | Delete sandboxes         |
| Snapshots  | `write:snapshots`       | Create/modify snapshots  |
|            | `delete:snapshots`      | Delete snapshots         |
| Registries | `write:registries`      | Create/modify registries |
|            | `delete:registries`     | Delete registries        |
| Volumes    | `read:volumes`          | View volumes             |
|            | `write:volumes`         | Create/modify volumes    |
|            | `delete:volumes`        | Delete volumes           |
| Audit      | `read:audit_logs`       | View audit logs          |
| Regions    | `write:regions`         | Create/modify regions    |
|            | `delete:regions`        | Delete regions           |
| Runners    | `read:runners`          | View runners             |
|            | `write:runners`         | Create/modify runners    |
|            | `delete:runners`        | Delete runners           |