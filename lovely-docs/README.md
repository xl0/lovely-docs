# lovely-docs

Hierarchically optimized documentation for AI coding agents.

## Why?

MCP is token-inefficient and inflexible for documentation. Instead, `lovely-docs` installs hierarchically summarized documentation directly into your project. AI agents access it using their native file reading and summarization tools—more efficient, more flexible.

## Installation

```bash
npx -y lovely-docs init
npx -y lovely-docs add sveltejs_svelte
```

## File Structure

Documentation is installed in `lovely-docs/`:

```
lovely-docs/
├── sveltejs_svelte.md           # Library overview (digest)
├── sveltejs_svelte.orig.md      # Full library docs
└── sveltejs_svelte/
    ├── LLM_MAP.md               # Hierarchical essence tree
    ├── runes.md                 # Section digest
    ├── runes.orig.md            # Section fulltext
    └── runes/
        ├── $derived.md          # Page digest
        └── $derived.orig.md     # Page fulltext
```

**LLM_MAP.md** provides a hierarchical overview with essence summaries at each level. Agents read this first to understand structure, then drill down to specific pages as needed.

Example LLM_MAP.md format:

```
# sveltejs/svelte

Cybernetically enhanced web apps

  ./introduction.md: Introduction to Svelte and its core concepts
  ./runes.md: Svelte 5's reactivity primitives for state and effects
    ./runes/$state.md: Reactive state declaration
    ./runes/$derived.md: Computed values that update automatically
```

## Usage

```bash
# Initialize
npx -y lovely-docs init           # Interactive setup
npx -y lovely-docs init -y        # Skip prompts

# Manage libraries
npx -y lovely-docs list           # Show available docs
npx -y lovely-docs add <library>  # Add documentation
npx -y lovely-docs remove <library> # Remove documentation
npx -y lovely-docs update         # Update installed docs

# Interactive mode
npx -y lovely-docs                # Select ecosystems & libraries
```

## Configuration

Stored in `.lovely-docs.yaml`:

```yaml
source:
  type: git
  repo: https://github.com/xl0/lovely-docs
  branch: master
  gitCacheDir: /home/xl0/.cache/lovely-docs/github.com/xl0/lovely-docs
installDir: lovely-docs
ecosystems:
  - svelte
  - webdev
installed:
  - sveltejs_svelte
  - sveltejs_sveltekit
```

## MCP Server (Optional)

For web-based AI services (Claude Chat, etc.) that can't access local files:

```bash
# Stdio mode
npx -y lovely-docs mcp

# HTTP mode
npx -y lovely-docs mcp --transport http --port 3000
```

### MCP Configuration

Add to your MCP client config:

```json
{
	"mcpServers": {
		"lovely-docs": {
			"command": "npx",
			"args": ["-y", "lovely-docs", "mcp"]
		}
	}
}
```

### MCP Tools

- `listLibraries` - List available libraries
- `listPages` - Get page tree for a library
- `getPage` - Retrieve page content

### MCP Resources

- `lovely-docs://doc-index/{ecosystem}?verbose=true`
- `lovely-docs://index/{library}?verbose=true`
- `lovely-docs://page/{library}/{path}?level=digest`

## Environment Variables

- `LOVELY_DOCS_REPO` - Git repository URL
- `LOVELY_DOCS_BRANCH` - Git branch
- `LOVELY_DOCS_DOC_DIR` - Direct path to doc_db (skips git)
- `BETTERSTACK_SOURCE_TOKEN` - Logging token (HTTP mode)

## License

MIT
