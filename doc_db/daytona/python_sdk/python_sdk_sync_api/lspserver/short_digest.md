## LspServer

Language Server Protocol implementation for code intelligence (completions, symbols, diagnostics).

```python
lsp = LspServer(LspLanguageId.TYPESCRIPT, "/project/path", api_client)
lsp.start()

# File tracking
lsp.did_open("src/index.ts")
lsp.did_close("src/index.ts")

# Symbol search
symbols = lsp.document_symbols("src/index.ts")
symbols = lsp.sandbox_symbols("User")

# Completions
pos = LspCompletionPosition(line=10, character=15)
items = lsp.completions("src/index.ts", pos).items

lsp.stop()
```

Supports Python, TypeScript, JavaScript. Returns symbols with name/kind/location and completions with label/kind/detail/documentation.