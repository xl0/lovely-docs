## LspServer

Provides Language Server Protocol functionality for IDE-like code intelligence features including code completion, symbol search, and diagnostics.

### Constructor

```ts
new LspServer(languageId: LspLanguageId, pathToProject: string, apiClient: LspApi)
```

Supported languages: `JAVASCRIPT`, `PYTHON`, `TYPESCRIPT`

### Core Methods

#### start() / stop()
```ts
await lsp.start();   // Initialize the server before use
await lsp.stop();    // Clean up resources when done
```

#### didOpen() / didClose()
```ts
await lsp.didOpen('workspace/project/src/index.ts');   // Enable language features for file
await lsp.didClose('workspace/project/src/index.ts');  // Notify server file is closed
```

#### completions()
```ts
const completions = await lsp.completions('workspace/project/src/index.ts', {
  line: 10,
  character: 15
});
// Returns: { isIncomplete, items[] } with label, kind, detail, documentation, sortText, filterText, insertText
completions.items.forEach(item => console.log(`${item.label} (${item.kind}): ${item.detail}`));
```

#### documentSymbols()
```ts
const symbols = await lsp.documentSymbols('workspace/project/src/index.ts');
// Returns: LspSymbol[] with name, kind, location
symbols.forEach(symbol => console.log(`${symbol.kind} ${symbol.name}: ${symbol.location}`));
```

#### sandboxSymbols()
```ts
const symbols = await lsp.sandboxSymbols('User');  // Search across entire sandbox
symbols.forEach(symbol => console.log(`${symbol.name} (${symbol.kind}) in ${symbol.location}`));
```

#### workspaceSymbols() (deprecated)
Use `sandboxSymbols()` instead.

### Position Type
```ts
interface Position {
  line: number;      // Zero-based line number
  character: number; // Zero-based character offset
}
```

### Typical Workflow
```ts
const lsp = await sandbox.createLspServer('typescript', 'workspace/project');
await lsp.start();
await lsp.didOpen('src/index.ts');
const completions = await lsp.completions('src/index.ts', { line: 10, character: 15 });
const symbols = await lsp.documentSymbols('src/index.ts');
const results = await lsp.sandboxSymbols('MyClass');
await lsp.didClose('src/index.ts');
await lsp.stop();
```