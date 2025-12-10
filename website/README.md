# Lovely Docs Website

SvelteKit 5 + Tailwind 4 + shadcn-svelte documentation browser.

## Development

```sh
bun install
bun run dev
```

## Structure

```
src/
├── routes/
│   ├── +page.svelte          # Landing page
│   ├── human/                 # Human-readable doc pages
│   │   └── [...name]/         # Dynamic doc routes
│   └── mcp/                   # MCP server interface
│       ├── resources/         # MCP resource endpoints
│       └── tools/             # MCP tool endpoints
├── lib/
│   ├── components/            # App components (DocSidebar, Search, Markdown, etc.)
│   │   └── ui/                # shadcn-svelte primitives
│   ├── server/                # Server-side utilities
│   └── utils/                 # Client utilities
└── app.css                    # Tailwind styles
```

## Key Dependencies

- **bits-ui** / **shadcn-svelte** - UI components
- **flexsearch** - Full-text search
- **unified/remark/rehype** - Markdown processing
- **lovely-docs** - Doc database access (local package)
