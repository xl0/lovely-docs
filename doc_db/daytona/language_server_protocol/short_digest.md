## LSP Support in Daytona

Create and manage Language Server Protocol servers for Python and TypeScript in sandboxes.

### Create, Start, Stop

```python
lsp = sandbox.create_lsp_server(LspLanguageId.PYTHON, "workspace/project")
lsp.start()
lsp.stop()
```

### Features

- **Code Completions:** `lsp.completions(path, position)` - get completions at line/character
- **File Notifications:** `lsp.did_open(path)`, `lsp.did_close(path)` - track open/closed files
- **Document Symbols:** `lsp.document_symbols(path)` - retrieve functions, classes, variables in a file
- **Sandbox Symbols:** `lsp.sandbox_symbols(query)` - search symbols across all files

Available in Python, TypeScript, Ruby, Go SDKs and REST API.