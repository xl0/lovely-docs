# Lovely Docs

[![](https://alexey.work/badge/)](https://alexey.work?ref=ld-md)


**Lovely Docs** is a dual-interface documentation platform designed to serve both humans and AI agents. It provides a curated collection of documentation for popular libraries and frameworks, accessible through a modern web interface and a Model Context Protocol (MCP) server.

## Overview

In the age of AI-assisted coding, documentation needs to be accessible not just to developers reading in a browser, but also to the AI agents helping them write code. Lovely Docs solves this by providing:

1.  **A Human-Friendly Website**: A beautiful, responsive web application for browsing documentation.
2.  **An AI-Friendly MCP Server**: A standard interface for AI agents to query and retrieve documentation context.
3.  **Curated Content**: Pre-processed and structured documentation for libraries like Svelte, SvelteKit, Shadcn-Svelte, Bits UI, and more.

## Project Structure

- **`website/`**: A SvelteKit application that serves the web interface. It uses Tailwind CSS and provides a "Human" vs "Robot" view toggle.
- **`lovely-docs-mcp/`**: A TypeScript-based MCP server that exposes the documentation to AI clients. It supports both stdio and HTTP transports.
- **`doc_db/`**: The database of processed documentation files (Markdown).
- **`lovely_docs/`**: Python library and tools (built with `nbdev`) for ingesting and processing documentation into the `doc_db` format.
- **`nbs/`**: Jupyter notebooks used to develop the `lovely_docs` python library.

## Getting Started

### Prerequisites

- **Python** (for the data processing tools)
- **Bun** (for the website and MCP server)
- **Node.js** (optional, if not using Bun)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/xl0/lovely-docs.git
    cd lovely-docs
    ```

2.  Install Python dependencies (if you plan to work on the data processing):
    ```bash
    pip install -e .
    ```

### Running the Website

The website is a SvelteKit app that allows you to browse the documentation.

```bash
cd website
bun install
bun run dev
```

The site will be available at `http://localhost:5173`.

### Running the MCP Server

The MCP server allows AI agents to access the documentation.

```bash
cd lovely-docs-mcp
bun install
bun run dev
```

To use it with an MCP client (like Claude Desktop), add the following to your configuration:

```json
{
  "mcpServers": {
    "lovely-docs": {
      "command": "npx",
      "args": ["-y", "lovely-docs-mcp"]
    }
  }
}
```

_Note: For local development, point the command to your local `lovely-docs-mcp` directory._

## Features

- **Dual View**: Toggle between a standard documentation view and an MCP-optimized view to see exactly what the AI sees.
- **Search & Navigation**: Efficient tools for finding libraries and pages.
- **Verbose Mode**: Get detailed summaries of pages directly in the listing.
- **BetterStack Integration**: Optional logging for the MCP server when running in HTTP mode.

## Contributing

### Python Library (`lovely_docs`)

This project uses `nbdev`. Most development happens in the Jupyter notebooks located in the `nbs/` directory.

```bash
# After making changes in nbs/
nbdev_prepare
```

### Documentation Data

The documentation content lives in `doc_db`. This is currently a local folder but is designed to be synced from a Git repository in production.

## License

MIT
