## Image

Sandbox image definition with factory methods and chainable configuration.

```python
# Create image
image = Image.debian_slim("3.12")  # or Image.base(...) or Image.from_dockerfile(...)

# Install packages
image.pip_install("requests", "pandas")
image.pip_install_from_requirements("requirements.txt")
image.pip_install_from_pyproject("pyproject.toml", optional_dependencies=["dev"])

# Configure
image.add_local_file("file", "/path").add_local_dir("dir", "/path")
image.workdir("/home/daytona").env({"VAR": "value"})
image.run_commands("echo hello", ["bash", "-c", "cmd"])
image.entrypoint(["/bin/bash"]).cmd(["/bin/bash"])
image.dockerfile_commands(["RUN ..."])
image.dockerfile()  # Get generated Dockerfile
```

Pip methods support `find_links`, `index_url`, `extra_index_urls`, `pre`, `extra_options`.

## Context

Image context with `source_path` (str) and `archive_path` (str | None).