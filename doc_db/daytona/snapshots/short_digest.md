## Snapshots

Sandbox templates from Docker/OCI images. Create via Dashboard, SDK, CLI, or API with image, name, optional entrypoint, resources, and region.

**Create snapshot:**
```python
daytona.snapshot.create(CreateSnapshotParams(
  name="my-snapshot",
  image=Image.debian_slim("3.12"),
  resources=Resources(cpu=2, memory=4, disk=8),
  region_id="us"
), on_logs=print)
```

**Image sources:** public images, local images/Dockerfiles (`daytona snapshot push`), private registries (configure credentials first).

**Manage snapshots:**
- Get: `daytona.snapshot.get("name")`
- List: `daytona.snapshot.list(page, limit)`
- Activate: `daytona.snapshot.activate(snapshot)` (auto-deactivate after 2 weeks)
- Delete: `daytona.snapshot.delete(snapshot)`

**Docker-in-Docker:** Use `docker:28.3.3-dind` or similar images; requires 2+ vCPU, 4+ GiB memory. Run Docker Compose or Kubernetes (k3s) inside sandboxes.

**Default snapshots** (no snapshot specified): `daytona-small` (1 vCPU, 1GiB), `daytona-medium` (2 vCPU, 4GiB), `daytona-large` (4 vCPU, 8GiB). Include Python, Node.js, language servers, and common packages.
