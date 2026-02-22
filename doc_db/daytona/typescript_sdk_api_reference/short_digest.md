**Daytona TypeScript SDK** - Complete API for sandbox lifecycle (create/start/stop/delete), code execution (immediate/sessions/PTY), file operations (CRUD/streaming), git, desktop automation (keyboard/mouse/screenshots/recording), language server protocol, and resource management.

**Key APIs:** `Daytona` (main client), `Sandbox` (execution environment), `Process` (code/commands), `FileSystem`, `Git`, `ComputerUse`, `CodeInterpreter`, `SnapshotService`, `VolumeService`, `LspServer`, `Image` (dynamic builds), error classes.

**Installation:** `npm install @daytonaio/sdk`

**Quick start:**
```ts
const daytona = new Daytona()
const sandbox = await daytona.create({ language: 'typescript' })
const response = await sandbox.process.executeCommand('echo "Hello"')
await sandbox.delete()
```

Supports Node.js, browsers, serverless with polyfill setup for Vite/Next.js.