## Image

Represents an image definition for a Daytona sandbox. Do not construct directly; use static factory methods like `Image.base()`, `Image.debian_slim()`, or `Image.from_dockerfile()`.

### Constructor

```ruby
Image.new(dockerfile:, context_list:)
```

- `dockerfile` (String, nil) - Dockerfile content
- `context_list` (Array<Context>) - List of context files

### Accessors

- `dockerfile()` - Returns the generated Dockerfile
- `context_list()` - Returns list of context files

### Package Installation

```ruby
image.pip_install("requests", "pandas", index_url: "https://...", pre: true)
image.pip_install_from_requirements("requirements.txt", find_links: [...])
image.pip_install_from_pyproject("pyproject.toml", optional_dependencies: ["dev"])
```

All pip methods support: `find_links`, `index_url`, `extra_index_urls`, `pre` (pre-release), `extra_options`.

### File Operations

```ruby
image.add_local_file("package.json", "/home/daytona/package.json")
image.add_local_dir("src", "/home/daytona/src")
```

### Container Configuration

```ruby
image.run_commands('echo "Hello"', 'echo "Hello again!"')
image.env({"PROJECT_ROOT" => "/home/daytona"})
image.workdir("/home/daytona")
image.entrypoint(["/bin/bash"])
image.cmd(["/bin/bash"])
image.dockerfile_commands(["RUN echo 'Hello'"], context_dir: "/path")
```

All methods return the Image instance for chaining.

### Error Handling

- `pip_install_from_requirements` raises `Sdk:Error` if requirements file doesn't exist
- `pip_install_from_pyproject` raises `Sdk:Error` if pyproject.toml parsing unsupported
- `env()` can raise `Sdk:Error`