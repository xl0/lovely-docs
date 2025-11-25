# Developer Documentation

## Project Overview

`lovely-docs-mcp` is a Model Context Protocol (MCP) server that serves documentation from a local filesystem database (`doc_db`). It allows LLMs to query available libraries, list pages, and retrieve documentation content in various detail levels (full text, digest, etc.).

## Architecture

The project is built with TypeScript and uses the `@modelcontextprotocol/sdk`.

### Key Components

-   **`src/index.ts`**: Entry point. Handles CLI arguments, loads libraries, and starts the server (Stdio or HTTP).
-   **`src/server.ts`**: Core MCP server factory (`getServer`). Creates a new server instance with tools and resources registered.
-   **`src/lib/doc-cache.ts`**: Handles loading, parsing, caching, and filtering of documentation libraries.
    -   Scans `../doc_db` for libraries.
    -   Loads `index.json` for structure and metadata.
    -   Loads markdown variants (`fulltext.md`, `digest.md`, etc.) for each node in the documentation tree.
    -   Uses `valibot` for schema validation.
    -   Caches the loaded data in memory.
-   **`src/lib/handlers.ts`**: Business logic for MCP requests.
    -   `libraryIndex`: Generates an index of libraries.
    -   `getPageIndex`: Returns the page tree for a library.
    -   `getPage`: Retrieves content for a specific page.

## Data Source (`doc_db`)

The server expects a `doc_db` directory at `../doc_db` (relative to the project root).
Each subdirectory in `doc_db` represents a library (e.g., `sveltejs_svelte`).

**Structure of a library:**

-   `index.json`: Metadata and the tree structure of the documentation.
-   **Documentation Nodes**: Each node in the tree corresponds to a directory containing markdown files:
    -   `fulltext.md`
    -   `digest.md`
    -   `short_digest.md`
    -   `essence.md`

## MCP Capabilities

### Tools

-   `listLibraries`: List available documentation libraries. Filters by ecosystem.
-   `listPages`: Get the tree structure of pages for a specific library.
-   `getPage`: Get the content of a documentation page. Supports different detail levels.

### Resources

-   `lovely-docs://doc-index/{ecosystem}`: List of library names.
-   `lovely-docs://doc-index-verbose/{ecosystem}`: Map of library names to their descriptions (essence).
-   `lovely-docs://index/{name}`: Page index for a library.
-   `lovely-docs://page/{path}/{level}`: Content of a specific page.

## Development

### Setup

```bash
bun install
```

### Running

-   **Stdio**: `bun run src/index.ts` (or via MCP client)
-   **HTTP**: `bun run src/index.ts --transport http --http-port 3000`

### Health Endpoint (HTTP Transport Only)

When running in HTTP mode, a health check endpoint is available at `/health`:

```bash
curl http://localhost:3000/health
```

This endpoint returns server status, uptime, and metadata. It's useful for:

-   Monitoring services (BetterStack Uptime, UptimeRobot, etc.)
-   Load balancer health checks
-   Automated testing and CI/CD pipelines

### BetterStack Logging (HTTP Transport Only)

When using HTTP transport, you can enable BetterStack (Logtail) logging by setting environment variables:

```bash
export BETTERSTACK_SOURCE_TOKEN="your-source-token"
export BETTERSTACK_ENDPOINT="https://in.logs.betterstack.com"  # Optional, defaults to this value
```

**What gets logged:**

-   Server startup/shutdown events
-   All HTTP requests with:
    -   Request method and ID
    -   Filter options applied
    -   Client IP and User-Agent
    -   Request duration (ms)
    -   Response status
-   Errors and warnings:
    -   Resource errors (e.g., page not found)
    -   Unexpected errors with stack traces
    -   Server startup failures

**Example:**

```bash
BETTERSTACK_SOURCE_TOKEN="abc123..." bun run src/index.ts --transport http
```

Logs are automatically flushed on graceful shutdown (SIGINT/SIGTERM) and on fatal errors.

### Issues / Todos

1.  **Hardcoded Path**: The `doc_db` path is hardcoded to `../doc_db` in `src/index.ts` line 27. This assumes a specific directory layout and working directory. It should be configurable via CLI or environment variable.
