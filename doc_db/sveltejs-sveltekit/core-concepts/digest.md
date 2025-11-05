## Routing

Filesystem-based routing via `src/routes` directory. Files prefixed with `+` are route files.

**Page files**: `+page.svelte` (component), `+page.js`/`+page.server.js` (load functions), `+page.server.js` (server-only operations, form actions)

**Layout files**: `+layout.svelte` (wraps pages with `{@render children()}`), `+layout.js`/`+layout.server.js` (load functions, data available to children)

**Error handling**: `+error.svelte` (customizes error pages, walks tree to find closest boundary), falls back to `src/error.html`

**API routes**: `+server.js` exports HTTP handlers (`GET`, `POST`, etc.), can coexist with `+page` via content negotiation

**Type safety**: Use auto-generated `$types` module with `PageProps`, `LayoutProps`, `PageLoad`, `PageServerLoad`

## Loading Data

Define load functions in `+page.js`/`+page.server.js` or `+layout.js`/`+layout.server.js`. Return values available via `data` prop.

**Universal** (`+page.js`): Runs on server and browser, can return non-serializable data.
**Server** (`+page.server.js`): Runs only on server, must return serializable data.

Layout data available to children. Access parent data with `await parent()`. Load receives `url`, `route`, `params`.

Use provided `fetch` (not native)—inherits cookies, allows relative URLs on server, inlines responses during SSR.

Return unresolved promises for non-essential data to enable streaming.

Load reruns when `params`, `url`, or dependencies change. Manually trigger with `invalidate(url)` or `invalidateAll()`.

```js
export async function load({ params, fetch, depends }) {
	depends('app:random');
	return {
		post: await fetch(`/api/posts/${params.slug}`).then(r => r.json()),
		comments: loadComments(params.slug)
	};
}
```

Throw errors with `error(401, 'not logged in')` or redirect with `redirect(307, '/login')`.

## Form Actions

Export `actions` from `+page.server.js` to handle POST submissions.

```js
export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		return { success: true };
	},
	login: async (event) => {},
	register: async (event) => {}
};
```

Invoke default with `<form method="POST">`, named actions with `<form method="POST" action="?/register">`.

Return `fail(400, { email, missing: true })` for validation errors. Return values available as `form` prop.

Progressive enhancement via `use:enhance` directive:
```svelte
<script>
	import { enhance } from '$app/forms';
</script>
<form method="POST" use:enhance>
```

## Page Options

Control per-page rendering behavior via exports in `+page.js`, `+page.server.js`, `+layout.js`, or `+layout.server.js`:

- `prerender = true/'auto'`: Render pages at build time as static HTML. Use `entries()` function for dynamic routes.
- `ssr = false`: Render only on client, skip server rendering.
- `csr = false`: No JavaScript shipped, static HTML only.
- `trailingSlash = 'never'/'always'/'ignore'`: Control trailing slash behavior.
- `config`: Adapter-specific configuration.

## State Management

**Avoid shared state on server**: Authenticate with cookies, use databases instead of shared variables.

**Load functions must be pure**: Return data instead of writing to stores.

**Use context API**: Attach state to component tree with `setContext`/`getContext` instead of globals.

**Component state is preserved**: Components reuse on navigation; use `$derived` for reactivity or `{#key}` to force remounting.

**URL for persistent state**: Store filters/sorting in URL search parameters.

**Snapshots for ephemeral state**: Use snapshots for temporary UI state.

## Remote Functions

Type-safe client-server communication via `.remote.js` files. Four types: **query** (read data, cached, refreshable), **form** (write data with validation), **command** (write data callable from anywhere), **prerender** (build-time static data).

```js
export const getPost = query(v.string(), async (slug) => {
	return await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
});

export const createPost = form(v.object({title: v.string(), content: v.string()}), async (data) => {
	await db.sql`INSERT INTO post VALUES (...)`;
});

export const addLike = command(v.string(), async (id) => {
	await db.sql`UPDATE item SET likes = likes + 1 WHERE id = ${id}`;
	getLikes(id).refresh();
});
```

Enable with `kit.experimental.remoteFunctions: true` in config.