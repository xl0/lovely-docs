## Image

Represents an image definition for a Daytona sandbox. Do not construct directly; use static factory methods.

### Factory Methods

```python
# From existing base image
Image.base("python:3.12-slim-bookworm")

# From Dockerfile
Image.from_dockerfile("Dockerfile")

# Debian slim with Python
Image.debian_slim("3.12")
```

### Package Installation

```python
# Install packages
Image.debian_slim("3.12").pip_install("requests", "pandas")

# From requirements.txt
Image.debian_slim("3.12").pip_install_from_requirements("requirements.txt")

# From pyproject.toml with optional dependencies
Image.debian_slim("3.12").pip_install_from_pyproject(
    "pyproject.toml", 
    optional_dependencies=["dev"]
)
```

All pip methods support: `find_links`, `index_url`, `extra_index_urls`, `pre` (pre-release), `extra_options`.

### File Operations

```python
# Add single file
Image.debian_slim("3.12").add_local_file("package.json", "/home/daytona/package.json")

# Add directory
Image.debian_slim("3.12").add_local_dir("src", "/home/daytona/src")
```

### Image Configuration

```python
image = Image.debian_slim("3.12")
    .workdir("/home/daytona")
    .env({"PROJECT_ROOT": "/home/daytona"})
    .run_commands('echo "Hello, world!"', ['bash', '-c', 'echo Hello, world, again!'])
    .entrypoint(["/bin/bash"])
    .cmd(["/bin/bash"])
    .dockerfile_commands(["RUN echo 'Hello, world!'"], context_dir=None)
```

### Methods

- `dockerfile()` - Returns generated Dockerfile string
- `pip_install(*packages, find_links, index_url, extra_index_urls, pre, extra_options)` - Install packages
- `pip_install_from_requirements(requirements_txt, ...)` - Install from requirements file
- `pip_install_from_pyproject(pyproject_toml, optional_dependencies, ...)` - Install from pyproject.toml
- `add_local_file(local_path, remote_path)` - Add file to image
- `add_local_dir(local_path, remote_path)` - Add directory to image
- `run_commands(*commands)` - Execute commands in image
- `env(env_vars)` - Set environment variables
- `workdir(path)` - Set working directory
- `entrypoint(entrypoint_commands)` - Set entrypoint
- `cmd(cmd)` - Set default command
- `dockerfile_commands(dockerfile_commands, context_dir)` - Add raw Dockerfile commands

All methods return `Image` for chaining.

## Context

```python
class Context(BaseModel)
```

Context for an image with attributes:
- `source_path` (str) - Path to source file or directory
- `archive_path` (str | None) - Path inside archive file in object storage