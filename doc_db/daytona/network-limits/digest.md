## Network Egress Limiting

Daytona provides network egress limiting for sandboxes to control internet access, automatically applied based on organization billing tier or manually configured per sandbox.

### Tier-Based Restrictions

- **Tier 1 & 2**: Network access restricted, cannot be overridden at sandbox level. Organization-level restrictions take precedence over sandbox-level `networkAllowList` settings.
- **Tier 3 & 4**: Full internet access by default, custom network settings configurable.

### Creating Sandboxes with Network Restrictions

```python
from daytona import CreateSandboxFromSnapshotParams, Daytona

daytona = Daytona()

# Allow specific IPs/subnets
sandbox = daytona.create(CreateSandboxFromSnapshotParams(
    network_allow_list='208.80.154.232/32,199.16.156.103/32,192.168.1.0/24'
))

# Block all network access
sandbox = daytona.create(CreateSandboxFromSnapshotParams(
    network_block_all=True
))
```

TypeScript:
```typescript
const daytona = new Daytona()
const sandbox = await daytona.create({
  networkAllowList: '208.80.154.232/32,199.16.156.103/32,192.168.1.0/24'
})
const sandbox = await daytona.create({ networkBlockAll: true })
```

Ruby:
```ruby
daytona = Daytona::Daytona.new
sandbox = daytona.create(
  Daytona::CreateSandboxFromSnapshotParams.new(
    network_allow_list: '208.80.154.232/32,199.16.156.103/32,192.168.1.0/24'
  )
)
```

**Note**: If both `networkBlockAll` and `networkAllowList` are specified, `networkBlockAll` takes precedence.

### Network Allow List Format

`networkAllowList` accepts up to 5 CIDR blocks separated by commas:
- Single IP: `208.80.154.232/32`
- Subnet: `192.168.1.0/24`
- Multiple: `208.80.154.232/32,199.16.156.103/32,10.0.0.0/8`

### Essential Services (Whitelisted on All Tiers)

Package registries, container registries, Git repositories, CDN services, platform services, system package managers are always accessible.

**NPM**: `registry.npmjs.org`, `registry.npmjs.com`, `nodejs.org`, `nodesource.com`, `npm.pkg.github.com`, `classic.yarnpkg.com`, `registry.yarnpkg.com`, `repo.yarnpkg.com`, `releases.yarnpkg.com`, `yarn.npmjs.org`, `yarnpkg.netlify.com`, `dl.yarnpkg.com`, `yarnpkg.com`

**Git**: `github.com`, `api.github.com`, `raw.githubusercontent.com`, `github-releases.githubusercontent.com`, `codeload.github.com`, `ghcr.io`, `packages.github.com`, `gitlab.com`, `registry.gitlab.com`, `bitbucket.org`

**Python**: `pypi.org`, `pypi.python.org`, `files.pythonhosted.org`, `bootstrap.pypa.io`

**Ubuntu/Debian**: `archive.ubuntu.com`, `security.ubuntu.com`, `deb.debian.org`, `security.debian.org`, `cdn-fastly.deb.debian.org`, `ftp.debian.org`

**CDN**: `fastly.com`, `cloudflare.com`, `unpkg.com`, `jsdelivr.net`

**AI/ML**: `api.anthropic.com`, `api.openai.com`, `api.perplexity.ai`, `api.deepseek.com`, `api.groq.com`, `api.expo.dev`, `openrouter.ai`

**Docker**: `download.docker.com`, `registry-1.docker.io`, `registry.docker.io`, `auth.docker.io`, `index.docker.io`, `hub.docker.com`, `docker.io`, `mcr.microsoft.com`, `registry.k8s.io`, `gcr.io`, `asia.gcr.io`, `eu.gcr.io`, `us.gcr.io`, `marketplace.gcr.io`, `registry.cloud.google.com`, `quay.io`, `quay-registry.s3.amazonaws.com`

**Maven**: `repo1.maven.org`, `repo.maven.apache.org`

**Google Fonts**: `fonts.googleapis.com`, `fonts.gstatic.com`

**AWS S3**: `s3.us-east-1.amazonaws.com`, `s3.us-east-2.amazonaws.com`, `s3.us-west-1.amazonaws.com`, `s3.us-west-2.amazonaws.com`, `s3.eu-central-1.amazonaws.com`, `s3.eu-west-1.amazonaws.com`, `s3.eu-west-2.amazonaws.com`

**Daytona**: `app.daytona.io`

### Testing Network Access

```bash
curl -I https://208.80.154.232
apt update
npm ping
pip install --dry-run requests
```

### Security Benefits

- Prevents data exfiltration
- Reduces attack surface
- Complies with security policies
- Enables fine-grained control

**Caution**: Unrestricted network access poses security risks with untrusted code. Use `networkAllowList` or `networkBlockAll` instead.

### Organization Configuration

Network access policies are set automatically by tier and cannot be modified by administrators.