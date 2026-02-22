## Language Server Protocol (LSP) Support

Daytona provides LSP support through sandbox instances, enabling code completion, diagnostics, and other advanced language features.

### Creating LSP Servers

Create LSP servers with `create_lsp_server()`. The `path_to_project` argument is relative to the sandbox working directory (specified by WORKDIR in Dockerfile, or user home directory by default). Leading `/` makes it absolute.

```python
from daytona import Daytona, LspLanguageId
daytona = Daytona()
sandbox = daytona.create()
lsp_server = sandbox.create_lsp_server(
    language_id=LspLanguageId.PYTHON,
    path_to_project="workspace/project"
)
```

```typescript
import { Daytona, LspLanguageId } from '@daytonaio/sdk'
const daytona = new Daytona()
const sandbox = await daytona.create({ language: 'typescript' })
const lspServer = await sandbox.createLspServer(
  LspLanguageId.TYPESCRIPT,
  'workspace/project'
)
```

```ruby
require 'daytona'
daytona = Daytona::Daytona.new
sandbox = daytona.create
lsp_server = sandbox.create_lsp_server(
  language_id: Daytona::LspServer::Language::PYTHON,
  path_to_project: 'workspace/project'
)
```

```go
client, err := daytona.NewClient()
sandbox, err := client.Create(context.Background(), nil)
lsp := sandbox.Lsp(types.LspLanguagePython, "workspace/project")
```

**Supported languages:** `LspLanguageId.PYTHON`, `LspLanguageId.TYPESCRIPT`

### Starting and Stopping LSP Servers

```python
lsp = sandbox.create_lsp_server("typescript", "workspace/project")
lsp.start()  # Initialize
# ... use LSP features ...
lsp.stop()   # Clean up
```

```typescript
const lsp = await sandbox.createLspServer('typescript', 'workspace/project')
await lsp.start()
// ... use LSP features ...
await lsp.stop()
```

```ruby
lsp = sandbox.create_lsp_server(language_id: Daytona::LspServer::Language::PYTHON, path_to_project: 'workspace/project')
lsp.start
lsp.stop
```

```go
lsp := sandbox.Lsp(types.LspLanguagePython, "workspace/project")
err := lsp.Start(ctx)
// ... use LSP features ...
err := lsp.Stop(ctx)
```

```bash
# API
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/lsp/start' \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{"languageId": "", "pathToProject": ""}'

curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/lsp/stop' \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{"languageId": "", "pathToProject": ""}'
```

### Code Completions

Get code completions at a specific position in a file:

```python
completions = lsp_server.completions(
    path="workspace/project/main.py",
    position={"line": 10, "character": 15}
)
```

```typescript
const completions = await lspServer.completions('workspace/project/main.ts', {
  line: 10,
  character: 15,
})
```

```ruby
completions = lsp_server.completions(
  path: 'workspace/project/main.py',
  position: { line: 10, character: 15 }
)
```

```go
completions, err := lsp.Completions(ctx, "workspace/project/main.py",
  types.Position{Line: 10, Character: 15},
)
```

```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/lsp/completions' \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{
  "context": {"triggerCharacter": "", "triggerKind": 1},
  "languageId": "",
  "pathToProject": "",
  "position": {"character": 1, "line": 1},
  "uri": ""
}'
```

### File Notifications

Notify the LSP server when files are opened or closed to enable diagnostics and completion tracking:

```python
lsp_server.did_open("workspace/project/main.py")
lsp_server.did_close("workspace/project/main.py")
```

```typescript
await lspServer.didOpen('workspace/project/main.ts')
await lspServer.didClose('workspace/project/main.ts')
```

```ruby
lsp_server.did_open('workspace/project/main.py')
lsp_server.did_close('workspace/project/main.py')
```

```go
err := lsp.DidOpen(ctx, "workspace/project/main.py")
err := lsp.DidClose(ctx, "workspace/project/main.py")
```

```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/lsp/did-open' \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{"languageId": "", "pathToProject": "", "uri": ""}'

curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/lsp/did-close' \
  --request POST \
  --header 'Content-Type: application/json' \
  --data '{"languageId": "", "pathToProject": "", "uri": ""}'
```

### Document Symbols

Retrieve symbols (functions, classes, variables, etc.) from a document:

```python
symbols = lsp_server.document_symbols("workspace/project/main.py")
for symbol in symbols:
    print(f"Symbol: {symbol.name}, Kind: {symbol.kind}")
```

```typescript
const symbols = await lspServer.documentSymbols('workspace/project/main.ts')
symbols.forEach((symbol) => {
  console.log(`Symbol: ${symbol.name}, Kind: ${symbol.kind}`)
})
```

```ruby
symbols = lsp_server.document_symbols('workspace/project/main.py')
symbols.each { |symbol| puts "Symbol: #{symbol.name}, Kind: #{symbol.kind}" }
```

```go
symbols, err := lsp.DocumentSymbols(ctx, "workspace/project/main.py")
for _, symbol := range symbols {
  fmt.Printf("Symbol: %v\n", symbol)
}
```

```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/lsp/document-symbols?languageId=&pathToProject=&uri='
```

### Sandbox Symbols

Search for symbols across all files in the sandbox:

```python
symbols = lsp_server.sandbox_symbols("MyClass")
for symbol in symbols:
    print(f"Found: {symbol.name} at {symbol.location}")
```

```typescript
const symbols = await lspServer.sandboxSymbols('MyClass')
symbols.forEach((symbol) => {
  console.log(`Found: ${symbol.name} at ${symbol.location}`)
})
```

```ruby
symbols = lsp_server.sandbox_symbols('MyClass')
symbols.each { |symbol| puts "Found: #{symbol.name} at #{symbol.location}" }
```

```go
symbols, err := lsp.SandboxSymbols(ctx, "MyClass")
for _, symbol := range symbols {
  fmt.Printf("Found: %v\n", symbol)
}
```

```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/lsp/workspacesymbols?query=&languageId=&pathToProject='
```