## Personal vs Collaborative Organizations

Every user starts with a personal organization for solo use. Collaborative organizations are manually created for team collaboration.

| Feature | Personal | Collaborative |
|---------|----------|---------------|
| Creation | Automatic on signup | Manual |
| Members | Single user | Multiple (invite-based) |
| Access Control | No roles/permissions | Roles with granular assignments |
| Billing | Per user | Shared across team |
| Use Case | Personal testing, small projects | Company/team development, production |
| Quota Scope | Per user | Shared across members |
| Deletable | No | Yes (by Owner) |

Switch between organizations using the dropdown in the Dashboard sidebar. Each organization has its own sandboxes, API keys, and resource quotas.

## Organization Roles

- **Owners**: Full administrative access to organization and resources
- **Members**: No administrative access; resource access based on assignments

## Administrative Actions

Owners can:
- Invite new users
- Manage pending invitations
- Change user roles
- Update member assignments
- Remove users
- Inspect audit logs
- Delete organization

## Available Assignments

| Assignment | Description |
|-----------|-------------|
| **Viewer (required)** | Read access to all resources |
| **Developer** | Create sandboxes and API keys |
| **Sandboxes Admin** | Admin access to sandboxes |
| **Snapshots Admin** | Admin access to snapshots |
| **Registries Admin** | Admin access to registries |
| **Volumes Admin** | Admin access to volumes |
| **Super Admin** | Full access to all resources |
| **Auditor** | Access to audit logs |
| **Infrastructure Admin** | Admin access to infrastructure |

## Manage Members

### Invite Users

As Owner:
1. Navigate to Members page
2. Click Invite Member
3. Enter email address
4. Select role (Owner or Member with specific assignments)

### Remove Users

As Owner:
1. Navigate to Members page
2. Click Remove next to user
3. Confirm removal

## Manage Invitations

View pending invitations on the Invitations page (accessible from sidebar dropdown). Accepting an invitation grants access to organization's resource quotas and allows creating API keys and sandboxes.

## Organization Settings

The Settings subpage allows viewing Organization ID and Name, and deleting the organization (irreversible). Personal organizations cannot be deleted.