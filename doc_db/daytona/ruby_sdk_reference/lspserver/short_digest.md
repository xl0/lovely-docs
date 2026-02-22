## LspServer

Language Server Protocol integration for Daytona Ruby SDK.

**Lifecycle**: `start()` → use methods → `stop()`

**File tracking**: `did_open(path)`, `did_close(path)`

**Language features**: `completions(path, position)`, `document_symbols(path)`, `sandbox_symbols(query)`

**Properties**: `language_id`, `path_to_project`, `toolbox_api`, `sandbox_id`