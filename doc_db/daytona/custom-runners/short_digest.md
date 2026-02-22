## Runners

Runners execute sandbox workloads and manage resources, health reporting, and networking. Shared/dedicated regions are Daytona-managed; custom regions use your own runners.

## Custom Regions

Organization-managed regions with your own runner machines. No concurrent resource limits.

**Configuration**: name (required), proxyUrl, sshGatewayUrl, snapshotManagerUrl (optional for private networks)

**Credentials**: Daytona provides API keys for proxy/SSH gateway and basic auth for snapshot manager. Regenerable but requires service redeployment.

## Custom Runners

Organization-managed runners within custom regions.

**Configuration**: name (required), regionId (required, must be custom region)

**Token**: Secure token provided at creation for runner authentication. Non-retrievable.

**Installation**: Deploy Daytona runner application on infrastructure with the token. Detailed instructions coming soon; contact support@daytona.io.