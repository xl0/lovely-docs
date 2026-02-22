## LspServer

Language Server Protocol wrapper for code intelligence (completions, symbols, diagnostics).

**Setup:**
```ts
const lsp = await sandbox.createLspServer('typescript', 'workspace/project');
await lsp.start();
```

**File Operations:**
```ts
await lsp.didOpen('src/index.ts');
await lsp.didClose('src/index.ts');
```

**Code Intelligence:**
```ts
// Completions at position
const completions = await lsp.completions('src/index.ts', { line: 10, character: 15 });

// Symbols in file
const symbols = await lsp.documentSymbols('src/index.ts');

// Search across sandbox
const results = await lsp.sandboxSymbols('query');
```

**Cleanup:**
```ts
await lsp.stop();
```

Supports: JavaScript, Python, TypeScript