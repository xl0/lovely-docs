## Sandbox

Isolated execution environment with configurable resources (CPU, memory, disk, GPU), lifecycle automation (auto-stop/archive/delete), and operational interfaces (code execution, file system, Git, process management).

### Key Methods

Lifecycle: `start()`, `stop()`, `archive()`, `delete()`, `recover()`

Resources: `resize({ cpu?, memory?, disk? })`

Activity: `refreshActivity()`, `refreshData()`

Paths: `getUserHomeDir()`, `getWorkDir()`

Preview: `getPreviewLink(port)`, `getSignedPreviewUrl(port, expiresInSeconds?)`

SSH: `createSshAccess()`, `validateSshAccess(token)`, `revokeSshAccess(token)`

Config: `setLabels()`, `setAutostopInterval()`, `setAutoArchiveInterval()`, `setAutoDeleteInterval()`

LSP: `createLspServer(languageId, pathToProject)`

### Properties

State: `id`, `name`, `state`, `createdAt`, `updatedAt`, `errorReason`, `recoverable`

Resources: `cpu`, `memory`, `disk`, `gpu`

Networking: `public`, `networkBlockAll`, `networkAllowList`

Config: `env`, `labels`, `snapshot`, `buildInfo`, `volumes`

Interfaces: `codeInterpreter`, `computerUse`, `fs`, `git`, `process`