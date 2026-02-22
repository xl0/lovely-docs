## Runners

Runners are machines that power Daytona's compute plane. Each runner handles:
- Workload execution for sandbox workloads
- Resource management (CPU, memory, disk allocation and monitoring)
- Health reporting to the control plane
- Network connectivity (networking, proxy, SSH access)

Runners in shared and dedicated regions are fully managed by Daytona. Custom regions require you to bring and manage your own runner machines.

:::caution
Custom runners are experimental and may change. Contact support@daytona.io for access.
:::

## Custom Regions

Custom regions are created and managed by your organization using your own runner machines, providing control over data locality, compliance, and infrastructure. No limits on concurrent resource usage.

### Configuration

**name** (required): Unique identifier containing only letters, numbers, underscores, periods, hyphens. Used when creating sandboxes.

**proxyUrl** (optional): URL of proxy service routing traffic to sandboxes. Required for private network deployments.

**sshGatewayUrl** (optional): URL of SSH gateway handling SSH connections. Required for private network deployments.

**snapshotManagerUrl** (optional): URL of snapshot manager for storage/retrieval. Required for private network deployments.

### Credentials

Daytona provides credentials for configured optional services:
- API key for proxy service authentication
- API key for SSH gateway authentication
- Basic auth credentials for snapshot manager access

Credentials can be regenerated but require redeploying services with updated credentials.

## Custom Runners

Custom runners are created and managed by your organization within custom regions.

### Configuration

**name** (required): Unique identifier containing only letters, numbers, underscores, periods, hyphens.

**regionId** (required): ID of the custom region this runner is assigned to. All runners in a region share the region's proxy and SSH gateway configuration.

### Token

When creating a custom runner, Daytona provides a secure token for runner authentication. Save it securely—it cannot be retrieved again.

### Installation

After registering a runner and obtaining its token, install and configure the Daytona runner application on your infrastructure. Detailed installation instructions will be provided in a future update. Contact support@daytona.io for assistance.