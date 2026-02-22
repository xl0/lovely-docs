## AsyncLspServer

Provides Language Server Protocol functionality for IDE-like features: code completion, symbol search, diagnostics, and more.

### Initialization

```python
lsp = AsyncLspServer(
    language_id=LspLanguageId.TYPESCRIPT,  # or PYTHON, JAVASCRIPT
    path_to_project="/absolute/path/to/project",
    api_client=api_client
)
```

### Lifecycle

```python
await lsp.start()   # Initialize server before use
await lsp.stop()    # Clean up resources when done
```

### File Operations

```python
await lsp.did_open("src/index.ts")   # Notify server file opened
await lsp.did_close("src/index.ts")  # Notify server file closed
```

Relative paths are resolved based on the project path set in constructor.

### Symbol Search

```python
# Get symbols from a specific file
symbols = await lsp.document_symbols("src/index.ts")

# Search symbols across entire sandbox
symbols = await lsp.sandbox_symbols("User")  # Returns matching symbols

for symbol in symbols:
    print(f"{symbol.kind} {symbol.name}: {symbol.location}")
```

`workspace_symbols()` is deprecated; use `sandbox_symbols()` instead.

### Code Completions

```python
pos = LspCompletionPosition(line=10, character=15)
completions = await lsp.completions("src/index.ts", pos)

for item in completions.items:
    print(f"{item.label} ({item.kind}): {item.detail}")
```

Returns `CompletionList` with:
- `isIncomplete`: Whether more items might be available
- `items`: List of completion items with label, kind, detail, documentation, sortText, filterText, insertText

## LspLanguageId

Enum with members: `PYTHON`, `TYPESCRIPT`, `JAVASCRIPT`

## LspCompletionPosition

Dataclass with zero-based position:
- `line`: Line number
- `character`: Character offset on line
