## LspServer

Ruby SDK class for Language Server Protocol integration with Daytona.

### Constructor

```ruby
LspServer.new(
  language_id:,      # Symbol
  path_to_project:,  # String
  toolbox_api:,      # DaytonaToolboxApiClient:LspApi
  sandbox_id:,       # String
  otel_state:        # Daytona:OtelState or nil
)
```

### Properties

- `language_id()` → Symbol
- `path_to_project()` → String
- `toolbox_api()` → DaytonaToolboxApiClient:LspApi
- `sandbox_id()` → String

### Lifecycle Methods

- `start()` - Initializes the language server for the specified language and project. Must be called before using other LSP functionality.
- `stop()` - Shuts down the language server and frees system resources.

### File Tracking

- `did_open(path)` - Notifies server that a file has been opened, enabling language features like diagnostics and completions. Server begins tracking file contents.
- `did_close(path)` - Notifies server that a file has been closed, allowing cleanup of associated resources.

### Language Features

- `completions(path:, position:)` → DaytonaApiClient:CompletionList - Gets completion suggestions at a specific position in a file.
- `document_symbols(path)` → Array<DaytonaToolboxApiClient:LspSymbol> - Extracts symbol information (functions, classes, variables, etc.) from a document.
- `sandbox_symbols(query)` → Array<DaytonaToolboxApiClient:LspSymbol> - Searches for symbols matching a query string across all files in the sandbox.