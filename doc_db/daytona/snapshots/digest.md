## Snapshots

Snapshots are sandbox templates created from Docker or OCI compatible images. They provide consistent, reproducible sandbox environments with dependencies, settings, and resources.

### Creating Snapshots

Create snapshots via Dashboard, SDK (Python/TypeScript/Ruby/Go), CLI, or API.

**Basic parameters:**
- **name**: Identifier for referencing the snapshot
- **image**: Base image (tag or digest required; `latest`, `lts`, `stable` tags not allowed)
- **entrypoint** (optional): Long-running command; defaults to `sleep infinity`
- **resources** (optional): CPU, memory, disk; defaults to 1 vCPU, 1GiB memory, 3GiB storage
- **region_id** (optional): Region for snapshot availability

**Image sources:**
- Public images: `python:3.11-slim`
- Local images/Dockerfiles: Use CLI `daytona snapshot push` or `--dockerfile` flag
- Private registries: Configure registry credentials first (Docker Hub, Google Artifact Registry, GitHub Container Registry)

**Example - Create with custom resources:**
```python
daytona.snapshot.create(
  CreateSnapshotParams(
    name="my-snapshot",
    image=Image.debian_slim("3.12"),
    resources=Resources(cpu=2, memory=4, disk=8),
    region_id="us"
  ),
  on_logs=print
)
```

```typescript
await daytona.snapshot.create({
  name: 'my-snapshot',
  image: Image.debianSlim('3.13'),
  resources: { cpu: 2, memory: 4, disk: 8 },
  regionId: 'us'
}, { onLogs: console.log })
```

```bash
daytona snapshot create my-snapshot --image python:3.11-slim --cpu 2 --memory 4 --disk 8 --region us
```

```bash
curl https://app.daytona.io/api/snapshots \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN' \
  --data '{
    "name": "my-snapshot",
    "imageName": "python:3.11-slim",
    "cpu": 2,
    "memory": 4,
    "disk": 8,
    "regionId": "us"
  }'
```

**Local images:**
```bash
docker images  # Verify image exists
daytona snapshot push custom-alpine:3.21 --name alpine-minimal --cpu 2 --memory 4 --disk 8
```

**From Dockerfile:**
```bash
daytona snapshot create my-snapshot --dockerfile ./Dockerfile
```

**Private registries setup:**
1. Navigate to Daytona Registries dashboard
2. Add registry with credentials
3. Create snapshot using full image path (e.g., `docker.io/<username>/<image>:<tag>`, `us-central1-docker.pkg.dev/<project>/<repo>/<image>:<tag>`, `ghcr.io/<project>/<image>:<tag>`)

**Declarative Builder:** Use SDKs to programmatically define images instead of importing from registry.

### Managing Snapshots

**Get snapshot by name:**
```python
snapshot = daytona.snapshot.get("my-snapshot")
```

```typescript
const snapshot = await daytona.snapshot.get('my-snapshot')
```

```bash
curl https://app.daytona.io/api/snapshots/my-snapshot \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'
```

**List snapshots with pagination:**
```python
result = daytona.snapshot.list(page=2, limit=10)
for snapshot in result.items:
    print(f"{snapshot.name} ({snapshot.image_name})")
```

```typescript
const result = await daytona.snapshot.list(1, 10)
console.log(`Found ${result.total} snapshots`)
```

```bash
daytona snapshot list --page 2 --limit 10
```

**Activate inactive snapshots** (auto-deactivate after 2 weeks of non-use):
```python
snapshot = daytona.snapshot.get("my-inactive-snapshot")
activated = daytona.snapshot.activate(snapshot)
```

```bash
curl https://app.daytona.io/api/snapshots/my-inactive-snapshot/activate \
  --request POST \
  --header 'Authorization: Bearer YOUR_SECRET_TOKEN'
```

**Deactivate snapshots:** Via dashboard (three dots menu → Deactivate)

**Delete snapshots:**
```python
daytona.snapshot.delete(snapshot)
```

```bash
daytona snapshot delete my-snapshot
```

### Docker-in-Docker

Sandboxes can run Docker containers (Docker-in-Docker) for building, testing, deploying containerized applications, running databases, microservices, etc.

**Requirements:** Allocate at least 2 vCPU and 4GiB memory.

**Pre-built images:**
- `docker:28.3.3-dind` (Alpine-based, lightweight)
- `docker:28.3.3-dind-rootless` (enhanced security)
- `docker:28.3.2-dind-alpine3.22`

**Manual installation:**
```dockerfile
FROM ubuntu:22.04
RUN curl -fsSL https://get.docker.com | VERSION=28.3.3 sh -
```

**Docker Compose example:**
```python
sandbox = daytona.create(CreateSandboxFromSnapshotParams(snapshot='docker-dind'))
compose_content = '''
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"
'''
sandbox.fs.upload_file(compose_content.encode(), 'docker-compose.yml')
sandbox.process.exec('docker compose -p demo up -d')
sandbox.process.exec('docker compose -p demo ps')
sandbox.process.exec('docker compose -p demo down')
```

### Kubernetes (k3s)

Run k3s cluster inside sandbox:
```typescript
const sandbox = await daytona.create()
await sandbox.process.executeCommand('curl -sfL https://get.k3s.io | sh -')
const sessionName = 'k3s-server'
await sandbox.process.createSession(sessionName)
await sandbox.process.executeSessionCommand(sessionName, {
  command: 'sudo /usr/local/bin/k3s server',
  async: true
})
await new Promise(r => setTimeout(r, 30000))  // Wait for k3s startup
const pods = await sandbox.process.executeCommand('sudo /usr/local/bin/kubectl get pod -A')
```

### Default Snapshots

When no snapshot specified, Daytona uses default snapshots with Python, Node.js, language servers, and common packages.

| Snapshot | vCPU | Memory | Storage |
|----------|------|--------|---------|
| `daytona-small` | 1 | 1GiB | 3GiB |
| `daytona-medium` | 2 | 4GiB | 8GiB |
| `daytona-large` | 4 | 8GiB | 10GiB |

**Included Python packages:** anthropic, beautifulsoup4, claude-agent-sdk, daytona, django, flask, huggingface-hub, instructor, keras, langchain, llama-index, matplotlib, numpy, ollama, openai, opencv-python, pandas, pillow, pydantic-ai, requests, scikit-learn, scipy, seaborn, sqlalchemy, torch, transformers

**Included Node.js packages:** @anthropic-ai/claude-code, bun, openclaw, opencode-ai, ts-node, typescript, typescript-language-server
