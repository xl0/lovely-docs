## AsyncLspServer

Language Server Protocol implementation for code intelligence (completions, symbols, diagnostics).

**Lifecycle**: `start()` → use methods → `stop()`

**File tracking**: `did_open(path)`, `did_close(path)`

**Symbol search**: `document_symbols(path)` (single file), `sandbox_symbols(query)` (all files)

**Completions**: `completions(path, LspCompletionPosition(line, character))` → `CompletionList`

**Languages**: Python, TypeScript, JavaScript via `LspLanguageId` enum
