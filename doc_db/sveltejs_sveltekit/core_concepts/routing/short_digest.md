# Routing

Filesystem-based router: `src/routes` is root, `src/routes/about` creates `/about`, `src/routes/blog/[slug]` creates parameterized routes.

**Route files** (with `+` prefix):
- All run on server; all run on client except `+server`
- `+layout` and `+error` apply to subdirectories

**+page.svelte/+page.js**: Page component with optional server/client load function returning data to component.

**+page.server.js**: Server-only load (database, private env vars). Data serialized for client navigation. Can export `actions` for form submissions.

**+error.svelte**: Custom error page. SvelteKit walks tree for closest boundary; falls back to `src/error.html`.

**+layout.svelte/+layout.js**: Shared layout for directory and subdirectories. Load function provides data to layout and child pages. Nested layouts inherit parents.

**+layout.server.js**: Server-only layout load.

**+server.js**: API routes. Export HTTP handlers (`GET`, `POST`, etc.) returning `Response`. Can stream data. Errors return JSON/fallback page, not `+error.svelte`. Supports `fallback` handler for unhandled methods. Content negotiation: `PUT`/`PATCH`/`DELETE`/`OPTIONS` always use `+server.js`; `GET`/`POST`/`HEAD` use page if `accept: text/html`, else `+server.js`.

**$types**: Auto-generated type definitions. Annotate with `PageProps`/`LayoutProps` for components, `PageLoad`/`PageServerLoad`/`LayoutLoad`/`LayoutServerLoad` for load functions. IDE tooling can omit annotations.