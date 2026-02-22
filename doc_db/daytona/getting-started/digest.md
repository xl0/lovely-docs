## Dashboard

Daytona Dashboard at https://app.daytona.io/ is the visual UI for managing sandboxes, API keys, and usage.

## SDKs

Daytona provides SDKs for Python, TypeScript, Ruby, and Go for programmatic sandbox interaction including lifecycle management, code execution, and resource access.

## CLI

Install with:
- Mac/Linux: `brew install daytonaio/cli/daytona`
- Windows: `powershell -Command "irm https://get.daytona.io/windows | iex"`

Upgrade with `brew upgrade daytonaio/cli/daytona` (Mac/Linux) or the same Windows command.

Use `daytona` command for CLI operations. See CLI reference for all commands.

## API

RESTful API for sandbox lifecycle, snapshots, and more. See API reference.

## MCP Server

Model Context Protocol server for AI agents (Claude, Cursor, Windsurf):
```bash
daytona mcp init [claude/cursor/windsurf]
```

## Multiple Runtime Support

TypeScript SDK works across Node.js, browsers, and serverless (Cloudflare Workers, AWS Lambda, Azure Functions).

### Vite Configuration

Add to `vite.config.ts`:
```typescript
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    nodePolyfills({
      globals: { global: true, process: true, Buffer: true },
      overrides: { path: 'path-browserify-win32' },
    }),
  ],
})
```

### Next.js Configuration

Add to `next.config.ts`:
```typescript
import type { NextConfig } from 'next'
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'
import { env, nodeless } from 'unenv'

const { alias: turbopackAlias } = env(nodeless, {})

const nextConfig: NextConfig = {
  experimental: {
    turbo: { resolveAlias: { ...turbopackAlias } },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) config.plugins.push(new NodePolyfillPlugin())
    return config
  },
}

export default nextConfig
```

## Examples

### Create a sandbox

Python:
```python
from daytona import Daytona
daytona = Daytona()
sandbox = daytona.create()
print(f"Sandbox ID: {sandbox.id}")
```

TypeScript:
```typescript
import { Daytona } from '@daytonaio/sdk'
const daytona = new Daytona()
const sandbox = await daytona.create()
console.log(`Sandbox ID: ${sandbox.id}`)
```

Go:
```go
client, _ := daytona.NewClient()
sandbox, _ := client.Create(context.Background(), nil)
fmt.Printf("Sandbox ID: %s\n", sandbox.ID)
```

Ruby:
```ruby
daytona = Daytona::Daytona.new
sandbox = daytona.create
puts "Sandbox ID: #{sandbox.id}"
```

CLI: `daytona create`

API: `curl 'https://app.daytona.io/api/sandbox' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{}'`

### Create and run code in a sandbox

Python:
```python
daytona = Daytona()
sandbox = daytona.create()
response = sandbox.process.exec("echo 'Hello, World!'")
print(response.result)
sandbox.delete()
```

TypeScript:
```typescript
const daytona = new Daytona()
const sandbox = await daytona.create()
const response = await sandbox.process.executeCommand('echo "Hello, World!"')
console.log(response.result)
await sandbox.delete()
```

Go:
```go
sandbox, _ := client.Create(context.Background(), nil)
response, _ := sandbox.Process.ExecuteCommand(context.Background(), "echo 'Hello, World!'")
fmt.Println(response.Result)
sandbox.Delete(context.Background())
```

Ruby:
```ruby
sandbox = daytona.create
response = sandbox.process.exec(command: "echo 'Hello, World!'")
puts response.result
daytona.delete(sandbox)
```

CLI:
```shell
daytona create --name my-sandbox
daytona exec my-sandbox -- echo 'Hello, World!'
daytona delete my-sandbox
```

API:
```bash
curl 'https://app.daytona.io/api/sandbox' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{}'
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/process/execute' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{"command": "echo '\''Hello, World!'\''"}'
curl 'https://app.daytona.io/api/sandbox/{sandboxId}' --request DELETE --header 'Authorization: Bearer <API_KEY>'
```

### Create a sandbox with custom resources

Python:
```python
sandbox = daytona.create(
    CreateSandboxFromImageParams(
        image=Image.debian_slim("3.12"),
        resources=Resources(cpu=2, memory=4, disk=8)
    )
)
```

TypeScript:
```typescript
const sandbox = await daytona.create({
    image: Image.debianSlim('3.12'),
    resources: { cpu: 2, memory: 4, disk: 8 }
})
```

Go:
```go
sandbox, _ := client.Create(context.Background(), types.ImageParams{
    Image: daytona.DebianSlim(nil),
    Resources: &types.Resources{ CPU: 2, Memory: 4, Disk: 8 },
})
```

Ruby:
```ruby
sandbox = daytona.create(
    Daytona::CreateSandboxFromImageParams.new(
        image: Daytona::Image.debian_slim('3.12'),
        resources: Daytona::Resources.new(cpu: 2, memory: 4, disk: 8)
    )
)
```

CLI: `daytona create --class small`

API: `curl 'https://app.daytona.io/api/sandbox' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{"cpu": 2, "memory": 4, "disk": 8}'`

### Create an ephemeral sandbox

Python:
```python
sandbox = daytona.create(
    CreateSandboxFromSnapshotParams(ephemeral=True, auto_stop_interval=5)
)
```

TypeScript:
```typescript
const sandbox = await daytona.create({
    ephemeral: true,
    autoStopInterval: 5
})
```

Go:
```go
autoStop := 5
sandbox, _ := client.Create(context.Background(), types.SnapshotParams{
    SandboxBaseParams: types.SandboxBaseParams{
        Ephemeral: true,
        AutoStopInterval: &autoStop,
    },
})
```

Ruby:
```ruby
sandbox = daytona.create(
    Daytona::CreateSandboxFromSnapshotParams.new(ephemeral: true, auto_stop_interval: 5)
)
```

CLI: `daytona create --auto-stop 5 --auto-delete 0`

API: `curl 'https://app.daytona.io/api/sandbox' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{"autoStopInterval": 5, "autoDeleteInterval": 0}'`

### Create a sandbox from a snapshot

Python:
```python
sandbox = daytona.create(
    CreateSandboxFromSnapshotParams(
        snapshot="my-snapshot-name",
        language="python"
    )
)
```

TypeScript:
```typescript
const sandbox = await daytona.create({
    snapshot: 'my-snapshot-name',
    language: 'typescript'
})
```

Go:
```go
sandbox, _ := client.Create(context.Background(), types.SnapshotParams{
    Snapshot: "my-snapshot-name",
    SandboxBaseParams: types.SandboxBaseParams{
        Language: types.CodeLanguagePython,
    },
})
```

Ruby:
```ruby
sandbox = daytona.create(
    Daytona::CreateSandboxFromSnapshotParams.new(
        snapshot: 'my-snapshot-name',
        language: Daytona::CodeLanguage::PYTHON
    )
)
```

CLI: `daytona create --snapshot my-snapshot-name`

API: `curl 'https://app.daytona.io/api/sandbox' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{"snapshot": "my-snapshot-name"}'`

### Create a sandbox with a declarative image

Python:
```python
image = (
    Image.debian_slim("3.12")
    .pip_install(["requests", "pandas", "numpy"])
    .workdir("/home/daytona")
)
sandbox = daytona.create(
    CreateSandboxFromImageParams(image=image),
    on_snapshot_create_logs=print
)
```

TypeScript:
```typescript
const image = Image.debianSlim('3.12')
    .pipInstall(['requests', 'pandas', 'numpy'])
    .workdir('/home/daytona')
const sandbox = await daytona.create(
    { image },
    { onSnapshotCreateLogs: console.log }
)
```

Go:
```go
image := daytona.DebianSlim(nil).
    PipInstall([]string{"requests", "pandas", "numpy"}).
    Workdir("/home/daytona")
sandbox, _ := client.Create(context.Background(), types.ImageParams{ Image: image })
```

Ruby:
```ruby
image = Daytona::Image
    .debian_slim('3.12')
    .pip_install(['requests', 'pandas', 'numpy'])
    .workdir('/home/daytona')
sandbox = daytona.create(
    Daytona::CreateSandboxFromImageParams.new(image: image),
    on_snapshot_create_logs: proc { |chunk| puts chunk }
)
```

CLI: `daytona create --dockerfile ./Dockerfile`

API: `curl 'https://app.daytona.io/api/sandbox' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{"buildInfo": {"dockerfileContent": "FROM python:3.12-slim\nRUN pip install requests pandas numpy\nWORKDIR /home/daytona"}}'`

### Create a sandbox with volumes

Python:
```python
volume = daytona.volume.get("my-volume", create=True)
sandbox = daytona.create(
    CreateSandboxFromSnapshotParams(
        volumes=[VolumeMount(volume_id=volume.id, mount_path="/home/daytona/data")]
    )
)
```

TypeScript:
```typescript
const volume = await daytona.volume.get('my-volume', true)
const sandbox = await daytona.create({
    volumes: [{ volumeId: volume.id, mountPath: '/home/daytona/data' }]
})
```

Go:
```go
volume, _ := client.Volume.Get(context.Background(), "my-volume")
sandbox, _ := client.Create(context.Background(), types.SnapshotParams{
    SandboxBaseParams: types.SandboxBaseParams{
        Volumes: []types.VolumeMount{{
            VolumeID: volume.ID,
            MountPath: "/home/daytona/data",
        }},
    },
})
```

Ruby:
```ruby
volume = daytona.volume.get('my-volume', create: true)
sandbox = daytona.create(
    Daytona::CreateSandboxFromSnapshotParams.new(
        volumes: [DaytonaApiClient::SandboxVolume.new(
            volume_id: volume.id,
            mount_path: '/home/daytona/data'
        )]
    )
)
```

CLI:
```shell
daytona volume create my-volume
daytona create --volume my-volume:/home/daytona/data
```

API: `curl 'https://app.daytona.io/api/sandbox' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{"volumes": [{"volumeId": "<VOLUME_ID>", "mountPath": "/home/daytona/data"}]}'`

### Create a sandbox with a Git repository cloned

Python:
```python
sandbox = daytona.create()
sandbox.git.clone("https://github.com/daytonaio/daytona.git", "/home/daytona/daytona")
status = sandbox.git.status("/home/daytona/daytona")
print(f"Branch: {status.current_branch}")
```

TypeScript:
```typescript
const sandbox = await daytona.create()
await sandbox.git.clone('https://github.com/daytonaio/daytona.git', '/home/daytona/daytona')
const status = await sandbox.git.status('/home/daytona/daytona')
console.log(`Branch: ${status.currentBranch}`)
```

Go:
```go
sandbox, _ := client.Create(context.Background(), nil)
sandbox.Git.Clone(context.Background(), "https://github.com/daytonaio/daytona.git", "/home/daytona/daytona")
status, _ := sandbox.Git.Status(context.Background(), "/home/daytona/daytona")
fmt.Printf("Branch: %s\n", status.CurrentBranch)
```

Ruby:
```ruby
sandbox = daytona.create
sandbox.git.clone(url: "https://github.com/daytonaio/daytona.git", path: "/home/daytona/daytona")
status = sandbox.git.status("/home/daytona/daytona")
puts "Branch: #{status.current_branch}"
```

API:
```bash
curl 'https://app.daytona.io/api/sandbox' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{}'
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/git/clone' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{"url": "https://github.com/daytonaio/daytona.git", "path": "/home/daytona/daytona"}'
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/git/status?path=/home/daytona/daytona' --header 'Authorization: Bearer <API_KEY>'
```

### Create a sandbox with labels

Python:
```python
sandbox = daytona.create(
    CreateSandboxFromSnapshotParams(labels={"project": "my-app", "env": "dev"})
)
found = daytona.find_one(labels={"project": "my-app"})
print(f"Found sandbox: {found.id}")
```

TypeScript:
```typescript
const sandbox = await daytona.create({
    labels: { project: 'my-app', env: 'dev' }
})
const found = await daytona.findOne({ labels: { project: 'my-app' } })
console.log(`Found sandbox: ${found.id}`)
```

Go:
```go
labels := map[string]string{"project": "my-app", "env": "dev"}
sandbox, _ := client.Create(context.Background(), types.SnapshotParams{
    SandboxBaseParams: types.SandboxBaseParams{Labels: labels},
})
found, _ := client.FindOne(context.Background(), nil, map[string]string{"project": "my-app"})
fmt.Printf("Found sandbox: %s\n", found.ID)
```

Ruby:
```ruby
sandbox = daytona.create(
    Daytona::CreateSandboxFromSnapshotParams.new(labels: { 'project' => 'my-app', 'env' => 'dev' })
)
found = daytona.find_one(labels: { 'project' => 'my-app' })
puts "Found sandbox: #{found.id}"
```

CLI: `daytona create --label project=my-app --label env=dev`

API: `curl 'https://app.daytona.io/api/sandbox' --request POST --header 'Authorization: Bearer <API_KEY>' --header 'Content-Type: application/json' --data '{"labels": {"project": "my-app", "env": "dev"}}'`
