## LspServer

Provides Language Server Protocol functionality for IDE-like features: code completion, symbol search, diagnostics, and more.

### Initialization

```python
lsp = LspServer(
    language_id=LspLanguageId.TYPESCRIPT,  # or PYTHON, JAVASCRIPT
    path_to_project="/absolute/path/to/project",
    api_client=api_client
)
```

### Lifecycle

```python
lsp.start()   # Initialize server before use
lsp.stop()    # Clean up resources when done
```

### File Operations

```python
lsp.did_open("src/index.ts")   # Notify server file opened
lsp.did_close("src/index.ts")  # Notify server file closed
```

Paths can be relative (resolved from project root) or absolute.

### Symbol Search

```python
# Get symbols from a specific file
symbols = lsp.document_symbols("src/index.ts")

# Search symbols across entire sandbox
symbols = lsp.sandbox_symbols("User")  # Returns matching symbols

for symbol in symbols:
    print(f"{symbol.kind} {symbol.name}: {symbol.location}")
```

Returns `list[LspSymbol]` with: name, kind (function/class/variable/etc.), location.

Note: `workspace_symbols()` is deprecated, use `sandbox_symbols()` instead.

### Code Completions

```python
pos = LspCompletionPosition(line=10, character=15)
completions = lsp.completions("src/index.ts", pos)

for item in completions.items:
    print(f"{item.label} ({item.kind}): {item.detail}")
```

Returns `CompletionList` with:
- `isIncomplete`: Whether more items available
- `items`: List of completion items with label, kind, detail, documentation, sortText, filterText, insertText

### Language Support

```python
class LspLanguageId(str, Enum):
    PYTHON = "python"
    TYPESCRIPT = "typescript"
    JAVASCRIPT = "javascript"
```

### Position Format

```python
@dataclass
class LspCompletionPosition:
    line: int        # Zero-based line number
    character: int   # Zero-based character offset
```

All methods include error handling with descriptive prefixes and instrumentation.