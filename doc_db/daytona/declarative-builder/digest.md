## Declarative Builder

Code-first approach to defining dependencies for Daytona Sandboxes using the SDK instead of importing pre-built container images.

### Two Primary Workflows

1. **Declarative images**: Build images with varying dependencies on-demand when creating sandboxes. Cached for 24 hours and automatically reused on subsequent runs.
2. **Pre-built Snapshots**: Create and register ready-to-use snapshots that can be shared across multiple sandboxes and permanently cached.

### Building Declarative Images

```python
declarative_image = (
  Image.debian_slim("3.12")
  .pip_install(["requests", "pytest"])
  .workdir("/home/daytona")
)

sandbox = daytona.create(
  CreateSandboxFromImageParams(image=declarative_image),
  timeout=0,
  on_snapshot_create_logs=print,
)
```

```typescript
const declarativeImage = Image.debianSlim('3.12')
  .pipInstall(['requests', 'pytest'])
  .workdir('/home/daytona')

const sandbox = await daytona.create(
  { image: declarativeImage },
  { timeout: 0, onSnapshotCreateLogs: console.log }
)
```

```ruby
declarative_image = Daytona::Image
  .debian_slim('3.12')
  .pip_install(['requests', 'pytest'])
  .workdir('/home/daytona')

sandbox = daytona.create(
  Daytona::CreateSandboxFromImageParams.new(image: declarative_image),
  timeout: 0,
  on_snapshot_create_logs: proc { |chunk| puts chunk }
)
```

### Creating Pre-built Snapshots

```python
snapshot_name = "data-science-snapshot"
image = (
  Image.debian_slim("3.12")
  .pip_install(["pandas", "numpy"])
  .workdir("/home/daytona")
)

daytona.snapshot.create(
  CreateSnapshotParams(name=snapshot_name, image=image),
  on_logs=print,
)

sandbox = daytona.create(
  CreateSandboxFromSnapshotParams(snapshot=snapshot_name)
)
```

```typescript
const snapshotName = 'data-science-snapshot'
const image = Image.debianSlim('3.12')
  .pipInstall(['pandas', 'numpy'])
  .workdir('/home/daytona')

await daytona.snapshot.create(
  { name: snapshotName, image },
  { onLogs: console.log }
)

const sandbox = await daytona.create({ snapshot: snapshotName })
```

```ruby
snapshot_name = 'data-science-snapshot'
image = Daytona::Image
  .debian_slim('3.12')
  .pip_install(['pandas', 'numpy'])
  .workdir('/home/daytona')

daytona.snapshot.create(
  Daytona::CreateSnapshotParams.new(name: snapshot_name, image: image),
  on_logs: proc { |chunk| puts chunk }
)

sandbox = daytona.create(
  Daytona::CreateSandboxFromSnapshotParams.new(snapshot: snapshot_name)
)
```

### Best Practices

- Layer Optimization: Group related operations to minimize Docker layers
- Cache Utilization: Identical build commands are cached; subsequent builds are instant
- Security: Create non-root users for application workloads
- Resource Efficiency: Use slim base images when appropriate
- Context Minimization: Only include necessary files in the build context

### Image Configuration

#### Base Image Selection

```python
image = Image.base("python:3.12-slim-bookworm")
image = Image.debian_slim("3.12")
```

```typescript
const image = Image.base('python:3.12-slim-bookworm')
const image = Image.debianSlim('3.12')
```

```ruby
image = Daytona::Image.base('python:3.12-slim-bookworm')
image = Daytona::Image.debian_slim('3.12')
```

#### Package Management

```python
image = Image.debian_slim("3.12").pip_install("requests", "pandas")
image = Image.debian_slim("3.12").pip_install_from_requirements("requirements.txt")
image = Image.debian_slim("3.12").pip_install_from_pyproject("pyproject.toml", optional_dependencies=["dev"])
```

```typescript
const image = Image.debianSlim('3.12').pipInstall(['requests', 'pandas'])
const image = Image.debianSlim('3.12').pipInstallFromRequirements('requirements.txt')
const image = Image.debianSlim('3.12').pipInstallFromPyproject('pyproject.toml', {
  optionalDependencies: ['dev']
})
```

```ruby
image = Daytona::Image.debian_slim('3.12').pip_install(['requests', 'pandas'])
image = Daytona::Image.debian_slim('3.12').pip_install_from_requirements('requirements.txt')
image = Daytona::Image.debian_slim('3.12').pip_install_from_pyproject('pyproject.toml', 
  optional_dependencies: ['dev']
)
```

#### File System Operations

```python
image = Image.debian_slim("3.12").add_local_file("package.json", "/home/daytona/package.json")
image = Image.debian_slim("3.12").add_local_dir("src", "/home/daytona/src")
```

```typescript
const image = Image.debianSlim('3.12').addLocalFile('package.json', '/home/daytona/package.json')
const image = Image.debianSlim('3.12').addLocalDir('src', '/home/daytona/src')
```

```ruby
image = Daytona::Image.debian_slim('3.12').add_local_file('package.json', '/home/daytona/package.json')
image = Daytona::Image.debian_slim('3.12').add_local_dir('src', '/home/daytona/src')
```

#### Environment Configuration

```python
image = Image.debian_slim("3.12").env({"PROJECT_ROOT": "/home/daytona"})
image = Image.debian_slim("3.12").workdir("/home/daytona")
```

```typescript
const image = Image.debianSlim('3.12').env({ PROJECT_ROOT: '/home/daytona' })
const image = Image.debianSlim('3.12').workdir('/home/daytona')
```

```ruby
image = Daytona::Image.debian_slim('3.12').env('PROJECT_ROOT': '/home/daytona')
image = Daytona::Image.debian_slim('3.12').workdir('/home/daytona')
```

#### Commands and Entrypoints

```python
image = Image.debian_slim("3.12").run_commands(
    'apt-get update && apt-get install -y git',
    'groupadd -r daytona && useradd -r -g daytona -m daytona',
    'mkdir -p /home/daytona/workspace'
)
image = Image.debian_slim("3.12").entrypoint(["/bin/bash"])
image = Image.debian_slim("3.12").cmd(["/bin/bash"])
```

```typescript
const image = Image.debianSlim('3.12').runCommands(
    'apt-get update && apt-get install -y git',
    'groupadd -r daytona && useradd -r -g daytona -m daytona',
    'mkdir -p /home/daytona/workspace'
)
const image = Image.debianSlim('3.12').entrypoint(['/bin/bash'])
const image = Image.debianSlim('3.12').cmd(['/bin/bash'])
```

```ruby
image = Daytona::Image.debian_slim('3.12').run_commands(
  'apt-get update && apt-get install -y git',
  'groupadd -r daytona && useradd -r -g daytona -m daytona',
  'mkdir -p /home/daytona/workspace'
)
image = Daytona::Image.debian_slim('3.12').entrypoint(['/bin/bash'])
image = Daytona::Image.debian_slim('3.12').cmd(['/bin/bash'])
```

#### Dockerfile Integration

```python
image = Image.debian_slim("3.12").dockerfile_commands(["RUN echo 'Hello, world!'"])
image = Image.from_dockerfile("Dockerfile")
image = Image.from_dockerfile("app/Dockerfile").pip_install(["numpy"])
```

```typescript
const image = Image.debianSlim('3.12').dockerfileCommands(['RUN echo "Hello, world!"'])
const image = Image.fromDockerfile('Dockerfile')
const image = Image.fromDockerfile("app/Dockerfile").pipInstall(['numpy'])
```