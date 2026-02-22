## Image

Represents a sandbox image definition. Do not construct directly; use static factory methods.

### Factory Methods

**`Image.base(image: string)`** - Create from existing base image
```ts
const image = Image.base('python:3.12-slim-bookworm')
```

**`Image.debianSlim(pythonVersion?: "3.9" | "3.10" | "3.11" | "3.12" | "3.13")`** - Debian slim with Python
```ts
const image = Image.debianSlim('3.12')
```

**`Image.fromDockerfile(path: string)`** - Create from Dockerfile
```ts
const image = Image.fromDockerfile('Dockerfile')
```

### Configuration Methods (all return Image for chaining)

**`addLocalDir(localPath: string, remotePath: string)`** - Add local directory
```ts
.addLocalDir('src', '/home/daytona/src')
```

**`addLocalFile(localPath: string, remotePath: string)`** - Add local file
```ts
.addLocalFile('requirements.txt', '/home/daytona/requirements.txt')
```

**`workdir(dirPath: string)`** - Set working directory
```ts
.workdir('/home/daytona')
```

**`env(envVars: Record<string, string>)`** - Set environment variables
```ts
.env({ FOO: 'bar' })
```

**`cmd(cmd: string[])`** - Set default command
```ts
.cmd(['/bin/bash'])
```

**`entrypoint(entrypointCommands: string[])`** - Set entrypoint
```ts
.entrypoint(['/bin/bash'])
```

**`runCommands(...commands: (string | string[])[])`** - Run commands during build
```ts
.runCommands(
  'echo "Hello, world!"',
  ['bash', '-c', 'echo Hello, world, again!']
)
```

**`dockerfileCommands(dockerfileCommands: string[], contextDir?: string)`** - Add arbitrary Dockerfile commands
```ts
.dockerfileCommands(['RUN echo "Hello, world!"'])
```

### Python Package Installation

**`pipInstall(packages: string | string[], options?: PipInstallOptions)`** - Install packages
```ts
.pipInstall('numpy', { findLinks: ['https://pypi.org/simple'] })
```

**`pipInstallFromRequirements(requirementsTxt: string, options?: PipInstallOptions)`** - Install from requirements.txt
```ts
.pipInstallFromRequirements('requirements.txt', { findLinks: ['https://pypi.org/simple'] })
```

**`pipInstallFromPyproject(pyprojectToml: string, options?: PyprojectOptions)`** - Install from pyproject.toml
```ts
.pipInstallFromPyproject('pyproject.toml', { optionalDependencies: ['dev'] })
```

### PipInstallOptions

- `indexUrl?: string` - Index URL for pip
- `extraIndexUrls?: string[]` - Additional index URLs
- `findLinks?: string[]` - Find-links for pip
- `pre?: boolean` - Install pre-release versions
- `extraOptions?: string` - Extra options passed directly to pip

### PyprojectOptions

Extends PipInstallOptions with:
- `optionalDependencies?: string[]` - Optional dependencies to install

### Accessors

- `contextList: Context[]` - List of context files to be added
- `dockerfile: string` - Generated Dockerfile content

### Context

Represents a context file to be added to the image.

- `sourcePath: string` - Path to source file or directory
- `archivePath: string` - Path inside archive file in object storage