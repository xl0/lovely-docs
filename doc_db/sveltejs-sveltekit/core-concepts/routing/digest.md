## Filesystem-based routing

Routes are defined by directory structure in `src/routes`:
- `src/routes` → root route
- `src/routes/about` → `/about` route
- `src/routes/blog/[slug]` → `/blog/:slug` with dynamic parameter

## Route files (identified by `+` prefix)

**Execution rules:**
- All files run on server
- All files run on client except `+server` files
- `+layout` and `+error` files apply to subdirectories and their own directory

## +page.svelte

Defines a page component. Receives data from `load` functions via `data` prop:

```svelte
<script>
	let { data } = $props();
</script>
<h1>{data.title}</h1>
```

## +page.js / +page.server.js

Export `load` function to fetch data before rendering:

```js
export function load({ params }) {
	return { title: 'Hello world!' };
}
```

Use `+page.server.js` for server-only operations (database access, private env vars). Data must be serializable.

Both can export page options: `prerender`, `ssr`, `csr`.

`+page.server.js` can also export `actions` for form submissions.

## +error.svelte

Customizes error pages. SvelteKit walks up the tree to find the closest error boundary:

```svelte
<script>
	import { page } from '$app/state';
</script>
<h1>{page.status}: {page.error.message}</h1>
```

Falls back to `src/error.html` if error occurs in root layout's `load` or in `handle` hook.

## +layout.svelte

Wraps pages with shared markup (nav, footer). Must include `{@render children()}`:

```svelte
<script>
	let { children } = $props();
</script>
<nav>...</nav>
{@render children()}
```

Layouts nest - child layouts inherit parent layouts.

## +layout.js / +layout.server.js

Load function for layouts. Data available to all child pages:

```js
export function load() {
	return { sections: [...] };
}
```

Can export page options that become defaults for child pages.

## +server.js

API routes. Export HTTP verb handlers (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`, `HEAD`):

```js
export function GET({ url }) {
	const min = Number(url.searchParams.get('min') ?? '0');
	return new Response(String(Math.random() * (max - min) + min));
}
```

```js
export async function POST({ request }) {
	const { a, b } = await request.json();
	return json(a + b);
}
```

Export `fallback` handler to match unhandled methods.

**Content negotiation:** `GET`/`POST`/`HEAD` treated as page requests if `accept` header prioritizes `text/html`, else handled by `+server.js`. Can coexist with `+page` in same directory.

## $types

Auto-generated type definitions for type safety. Annotate components with `PageProps`/`LayoutProps` and load functions with `PageLoad`/`PageServerLoad`/`LayoutLoad`/`LayoutServerLoad`. IDEs with TypeScript support can omit these annotations.