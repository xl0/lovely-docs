## Image

Sandbox image definition. Use factory methods (`Image.debian_slim()`, etc.) instead of constructor.

### Methods

**Package installation:**
```ruby
image.pip_install("requests", index_url: "...", pre: true)
image.pip_install_from_requirements("requirements.txt")
image.pip_install_from_pyproject("pyproject.toml", optional_dependencies: ["dev"])
```

**File operations:**
```ruby
image.add_local_file("file", "/remote/path")
image.add_local_dir("dir", "/remote/path")
```

**Container setup:**
```ruby
image.run_commands("cmd1", "cmd2")
      .env({"VAR" => "value"})
      .workdir("/home/daytona")
      .entrypoint(["/bin/bash"])
      .cmd(["/bin/bash"])
      .dockerfile_commands(["RUN ..."], context_dir: "/path")
```

All methods chainable. Pip methods support `find_links`, `index_url`, `extra_index_urls`, `pre`, `extra_options`.