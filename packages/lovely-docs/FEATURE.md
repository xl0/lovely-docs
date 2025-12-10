# Lovely Docs CLI

## Overview

CLI tool for installing hierarchically optimized documentation into projects. Documentation is structured with multi-level summaries (essence, digest, fulltext) to enable efficient AI agent navigation.

## Architecture

### Core Components

**`doc-cache.ts`**: Library loading and data structures

- `loadLibrariesFromJson(path)` - Loads all libraries from doc_db, returns `Map<string, LibraryDBItem>`
- `getLibrarySummaries(libraries)` - Converts to summary format for display/filtering
- `getLibrary(libraries, name)` - Retrieves specific library
- `getNodeMarkdown(libraries, library, path, level)` - Gets markdown at specific detail level
- No global cache - libraries map is passed explicitly

**`handlers.ts`**: Request handlers for MCP server

- `getPageIndex(libraries, library, verbose)` - Builds page tree
- `getPage(libraries, library, page, level)` - Retrieves page content with children
- All functions accept `libraries: Map<string, LibraryDBItem>` parameter

**`server.ts`**: MCP server implementation

- `getServer(options, libraries)` - Creates MCP server with tools and resources
- Pre-computes filtered summaries once at server creation
- Validates library access against filtered set

**`installer.ts`**: File transformation

- Reads `doc_db` structure (index.json + markdown variants)
- Transforms to `.lovely-docs/` hierarchy
- Generates `LLM_MAP.md` from essence tree in YAML-like format (`./path.md: description`)

### Commands

All commands follow pattern:

1. Load config from `.lovely-docs.yaml`
2. Determine doc_db path (git sync or local)
3. Load libraries: `libraries = await loadLibrariesFromJson(docDbPath)`
4. Convert to summaries for display: `getLibrarySummaries(libraries)`

**`init`**: Creates `.lovely-docs.yaml`, syncs git repo
**`list`**: Shows available libraries grouped by ecosystem
**`add`**: Installs libraries using `Installer` class
**`remove`**: Deletes library files and updates config
**`update`**: Re-installs all configured libraries
**`mcp`**: Runs MCP server (stdio or HTTP)

### Data Flow

```
doc_db/ (git repo)
  ├── library_name/
  │   ├── index.json          # Tree structure + metadata
  │   ├── essence.md          # One-line summary
  │   ├── digest.md           # Condensed version
  │   ├── fulltext.md         # Complete docs
  │   └── child/
  │       └── ...

↓ loadLibrariesFromJson()

Map<string, LibraryDBItem>  # In-memory representation

↓ Installer.install()

.lovely-docs/
  ├── library.md              # digest
  ├── library.orig.md         # fulltext
  └── library/
      ├── LLM_MAP.md          # Essence tree
      ├── child.md            # digest
      └── child.orig.md       # fulltext
```

## Key Design Decisions

**No Global Cache**: Libraries map is loaded once and passed explicitly to all functions. Improves testability and makes data flow explicit.

**Lazy Loading**: Only loads libraries when needed. CLI commands load on-demand, MCP server loads once at startup.

**Filtering**: MCP server pre-computes filtered library set based on options. Validates all requests against this set.

**Error Handling**: `listLibraries` continues on malformed JSON, logging errors but returning valid libraries.

## Technical Stack

- **Runtime**: Node.js / Bun
- **CLI**: `commander`, `@clack/prompts`
- **Git**: `simple-git`
- **MCP**: `@modelcontextprotocol/sdk`
- **Logging**: `@logtail/node` (HTTP mode only)
- **Config**: `yaml`
- **Validation**: `valibot`

## Build

```bash
bun install
bun run build    # Compiles to dist/
```

## Development

```bash
# Run CLI in dev mode
bun run src/index.ts init

# Run MCP server in dev mode with auto-reload
LOVELY_DOCS_DEV=1 bun --watch run src/index.ts mcp --transport http
```

`LOVELY_DOCS_DEV=1` uses local `../doc_db` instead of git sync.
