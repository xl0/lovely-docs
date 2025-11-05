

## Pages

### routing
SvelteKit uses filesystem-based routing with special `+` prefixed files for pages, layouts, error handling, and API endpoints, with automatic type generation for type safety.

## Filesystem routing

Routes defined by `src/routes` directory structure. Files with `+` prefix are route files.

## Page files

- `+page.svelte`: page component
- `+page.js` / `+page.server.js`: `load` function for data fetching
- `+page.server.js`: server-only operations, can export `actions` for forms

## Layout files

- `+layout.svelte`: wraps pages with shared markup, must include `{@render children()}`
- `+layout.js` / `+layout.server.js`: `load` function, data available to child pages

## Error handling

- `+error.svelte`: customizes error pages, SvelteKit walks up tree to find closest boundary
- Falls back to `src/error.html` for root-level errors

## API routes

- `+server.js`: export HTTP verb handlers (`GET`, `POST`, etc.)
- Can coexist with `+page` in same directory (content negotiation via `accept` header)
- Export `fallback` for unhandled methods

```js
export function GET({ url }) {
	return new Response(String(Math.random()));
}

export async function POST({ request }) {
	const { a, b } = await request.json();
	return json(a + b);
}
```

## Type safety

Use auto-generated `$types` module: annotate with `PageProps`, `LayoutProps`, `PageLoad`, `PageServerLoad`, etc. IDEs can infer types automatically.

### loading-data
Define load functions in +page.js/+page.server.js or +layout.js/+layout.server.js to fetch data before rendering, with automatic dependency tracking and rerunning on relevant changes.

## Load Functions

Define in `+page.js`/`+page.server.js` or `+layout.js`/`+layout.server.js`. Return values available via `data` prop.

**Universal** (`+page.js`): Run on server and browser, can return non-serializable data.
**Server** (`+page.server.js`): Run only on server, must return serializable data.

```js
// +page.server.js
export async function load({ params }) {
	return { post: await db.getPost(params.slug) };
}
```

## Data Flow

Layout data available to children. Access parent data with `await parent()`. Access page data from root layout via `page.data`.

## URL Data

Load receives `url`, `route`, `params`:

```js
export function load({ url, route, params }) {
	console.log(params.slug); // from /blog/[slug]
}
```

## Fetch

Use provided `fetch` (not native). Inherits cookies, allows relative URLs on server, inlines responses during SSR:

```js
export async function load({ fetch, params }) {
	return { item: await fetch(`/api/items/${params.id}`).then(r => r.json()) };
}
```

## Errors & Redirects

```js
import { error, redirect } from '@sveltejs/kit';

export function load({ locals }) {
	if (!locals.user) error(401, 'not logged in');
	if (!locals.user.isAdmin) redirect(307, '/login');
}
```

## Streaming Promises

Return unresolved promises for non-essential data:

```js
export async function load({ params }) {
	return {
		post: await loadPost(params.slug),
		comments: loadComments(params.slug)
	};
}
```

## Rerunning

Load reruns when `params`, `url`, or dependencies change. Manually trigger with `invalidate(url)` or `invalidateAll()`.

```js
export async function load({ depends }) {
	depends('app:random');
}
```

```svelte
<button onclick={() => invalidate('app:random')}>Refresh</button>
```

### form-actions
Export actions from +page.server.js to handle POST form submissions with optional progressive enhancement via use:enhance directive.

## Default Actions

```js
export const actions = {
	default: async (event) => {}
};
```

Invoke with `<form method="POST">`.

## Named Actions

```js
export const actions = {
	login: async (event) => {},
	register: async (event) => {}
};
```

Invoke with `<form method="POST" action="?/register">` or `<button formaction="?/register">`.

## Processing Data

```js
export const actions = {
	login: async ({ request }) => {
		const data = await request.formData();
		return { success: true };
	}
};
```

Return value available as `form` prop.

## Validation Errors

```js
import { fail } from '@sveltejs/kit';
return fail(400, { email, missing: true });
```

## Redirects

```js
import { redirect } from '@sveltejs/kit';
redirect(303, '/path');
```

## Progressive Enhancement

```svelte
<script>
	import { enhance } from '$app/forms';
</script>
<form method="POST" use:enhance>
```

Customize with `use:enhance={({ formData }) => async ({ result }) => {}}`.

## Custom Submission

```js
const result = deserialize(await response.text());
applyAction(result);
```

Add header `'x-sveltekit-action': 'true'` to POST to actions from custom fetch.

### page-options
Control per-page rendering behavior (prerendering, SSR, CSR, trailing slashes) and adapter configuration in SvelteKit.

## prerender
`export const prerender = true/false/'auto'` — render pages at build time as static HTML. Prerenderer crawls links to discover pages; use `entries()` function for dynamic routes not discoverable through crawling. Pages must return identical content for all users.

## entries
```js
export function entries() {
	return [{ slug: 'hello-world' }, { slug: 'another-blog-post' }];
}
export const prerender = true;
```

## ssr
`export const ssr = false` — render only on client, skip server rendering. Useful for browser-only code.

## csr
`export const csr = false` — no JavaScript shipped, static HTML only. Disables scripts, form enhancement, and HMR.

## trailingSlash
`export const trailingSlash = 'never'/'always'/'ignore'` — control trailing slash behavior.

## config
Adapter-specific configuration. Merges at top level only:
```js
export const config = { runtime: 'edge', regions: ['us1', 'us2'] }
```

Export from `+page.js`, `+page.server.js`, `+layout.js`, or `+layout.server.js`.

### state-management
Best practices for managing state in server-client applications: avoid shared server state, keep load functions pure, use context API instead of globals, leverage component reuse with reactivity, and store persistent state in URLs or snapshots.

**Avoid shared state on server**: Don't store data in shared variables—authenticate with cookies and use databases instead.

**No side-effects in load**: Load functions must be pure; return data instead of writing to stores.

**Use context API**: Attach state to component tree with `setContext`/`getContext` instead of global state. Pass functions to maintain reactivity.

**Component state is preserved**: Components reuse on navigation; use `$derived` for reactive values or `{#key}` to force remounting.

**URL for persistent state**: Store filters/sorting in URL search parameters.

**Snapshots for ephemeral state**: Use snapshots for temporary UI state like accordion toggles.

### remote-functions
Type-safe client-server communication via remote functions that execute on the server and support queries, forms, commands, and prerendering with validation.

Remote functions enable type-safe client-server communication via `.remote.js` files. Four types: **query** (read data, cached, refreshable), **query.batch** (batch multiple queries), **form** (write data with validation and field management), **command** (write data callable from anywhere), **prerender** (build-time static data).

```js
// query
export const getPost = query(v.string(), async (slug) => {
  return await db.sql`SELECT * FROM post WHERE slug = ${slug}`;
});

// form with fields
export const createPost = form(v.object({title: v.string(), content: v.string()}), async (data) => {
  await db.sql`INSERT INTO post VALUES (...)`;
});

// command
export const addLike = command(v.string(), async (id) => {
  await db.sql`UPDATE item SET likes = likes + 1 WHERE id = ${id}`;
  getLikes(id).refresh();
});
```

Enable with `kit.experimental.remoteFunctions: true` in config.

