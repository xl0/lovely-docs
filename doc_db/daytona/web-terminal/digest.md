## Web Terminal

A web-based terminal interface for interacting with running Sandboxes.

### Access

Open the Web Terminal by clicking the Terminal icon `>_` in the Sandbox list under the Access column for any running Sandbox. It runs on port `22222` and is available by default.

### Security

Terminal access is restricted to users in your Organization only, regardless of the `public` parameter setting in `CreateSandboxFromSnapshotParams` or `CreateSandboxFromImageParams`.

### Example

```text
ID                    State         Region     Created             Access
──────────────────────────────────────────────────────────────────────────────
sandbox-963e3f71      STARTED       us         12 minutes ago      >_
```

The `>_` icon in the Access column indicates the Web Terminal is available for that Sandbox.