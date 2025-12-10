# Routing

SvelteKit uses a filesystem-based router where routes are defined by directory structure in `src/routes`:
- `src/routes` is the root route
- `src/routes/about` creates `/about`
- `src/routes/blog/[slug]` creates a parameterized route

Route directories contain files with `+` prefix. Key rules:
- All files can run on the server
- All files run on the client except `+server` files
- `+layout` and `+error` files apply to subdirectories and their own directory

## +page.svelte and +page.js

`+page.svelte` defines a page component, rendered on server (SSR) initially and in browser (CSR) for navigation. Pages receive data via `data` prop from `load` functions.

```svelte
<!--- +page.svelte --->
<script>
	let { data } = $props();
</script>
<h1>{data.title}</h1>
```

`+page.js` exports a `load` function that runs on server during SSR and in browser during navigation:

```js
export function load({ params }) {
	if (params.slug === 'hello-world') {
		return { title: 'Hello world!', content: 'Welcome...' };
	}
	error(404, 'Not found');
}
```

`+page.js` can also export page options: `prerender`, `ssr`, `csr`.

## +page.server.js

For server-only load functions (database access, private environment variables), use `+page.server.js` with `PageServerLoad` type. Data is serialized via devalue for client-side navigation.

```js
export async function load({ params }) {
	const post = await getPostFromDatabase(params.slug);
	if (post) return post;
	error(404, 'Not found');
}
```

`+page.server.js` can also export `actions` for form submissions using `<form>` elements.

## +error.svelte

Customize error pages per-route with `+error.svelte`:

```svelte
<script>
	import { page } from '$app/state';
</script>
<h1>{page.status}: {page.error.message}</h1>
```

SvelteKit walks up the tree to find the closest error boundary. If none exists, renders default error page. If error occurs in root `+layout` load, renders static fallback (`src/error.html`). 404s use `src/routes/+error.svelte` or default.

Note: `+error.svelte` is not used for errors in `handle` hook or `+server.js` handlers.

## +layout.svelte and +layout.js

Layouts apply to every page in their directory and subdirectories. Default layout:

```svelte
<script>
	let { children } = $props();
</script>
{@render children()}
```

Custom layout with navigation:

```svelte
<script>
	let { children } = $props();
</script>
<nav>
	<a href="/">Home</a>
	<a href="/about">About</a>
</nav>
{@render children()}
```

Layouts can be nested. Child layouts inherit parent layouts.

`+layout.js` exports a `load` function providing data to the layout and all child pages:

```js
export function load() {
	return {
		sections: [
			{ slug: 'profile', title: 'Profile' },
			{ slug: 'notifications', title: 'Notifications' }
		]
	};
}
```

Child pages access layout data:

```svelte
<script>
	let { data } = $props();
	console.log(data.sections); // from parent layout
</script>
```

`+layout.js` can export page options (`prerender`, `ssr`, `csr`) as defaults for child pages. SvelteKit intelligently reruns load functions only when necessary.

## +layout.server.js

For server-only layout load functions, use `+layout.server.js` with `LayoutServerLoad` type. Can export page options like `+layout.js`.

## +server.js

API routes defined with `+server.js` export HTTP verb handlers (`GET`, `POST`, `PATCH`, `PUT`, `DELETE`, `OPTIONS`, `HEAD`) taking `RequestEvent` and returning `Response`:

```js
export function GET({ url }) {
	const min = Number(url.searchParams.get('min') ?? '0');
	const max = Number(url.searchParams.get('max') ?? '1');
	const d = max - min;
	if (isNaN(d) || d < 0) {
		error(400, 'min and max must be numbers, and min must be less than max');
	}
	return new Response(String(min + Math.random() * d));
}
```

Response first argument can be `ReadableStream` for streaming large data or server-sent events.

Use `error()`, `redirect()`, `json()` from `@sveltejs/kit` for convenience. Errors return JSON or fallback error page (customizable via `src/error.html`) based on `Accept` header. `+error.svelte` is not rendered for `+server.js` errors.

### Receiving data

`+server.js` can handle `POST`/`PUT`/`PATCH`/`DELETE`/`OPTIONS`/`HEAD` for complete APIs:

```svelte
<!--- +page.svelte --->
<script>
	let a = $state(0), b = $state(0), total = $state(0);
	async function add() {
		const response = await fetch('/api/add', {
			method: 'POST',
			body: JSON.stringify({ a, b }),
			headers: { 'content-type': 'application/json' }
		});
		total = await response.json();
	}
</script>
<input type="number" bind:value={a}> +
<input type="number" bind:value={b}> = {total}
<button onclick={add}>Calculate</button>
```

```js
/// +server.js
export async function POST({ request }) {
	const { a, b } = await request.json();
	return json(a + b);
}
```

Form actions are preferred for browser-to-server data submission.

If `GET` handler exists, `HEAD` request returns `content-length` of GET response body.

### Fallback method handler

Export `fallback` handler to match unhandled HTTP methods:

```js
export async function POST({ request }) {
	const { a, b } = await request.json();
	return json(a + b);
}

export async function fallback({ request }) {
	return text(`I caught your ${request.method} request!`);
}
```

For `HEAD` requests, `GET` handler takes precedence over `fallback`.

### Content negotiation

`+server.js` can coexist with `+page` files in same directory:
- `PUT`/`PATCH`/`DELETE`/`OPTIONS` always handled by `+server.js`
- `GET`/`POST`/`HEAD` treated as page requests if `accept` header prioritizes `text/html`, else handled by `+server.js`
- `GET` responses include `Vary: Accept` header for separate caching

## $types

SvelteKit generates `$types.d.ts` for type safety. Annotate components with `PageProps` or `LayoutProps` to type the `data` prop:

```svelte
<script>
	let { data } = $props();
</script>
```

Annotate load functions with `PageLoad`, `PageServerLoad`, `LayoutLoad`, or `LayoutServerLoad` to type `params` and return values.

VS Code and IDEs with TypeScript plugins can omit these types entirely—Svelte's IDE tooling inserts correct types automatically.

## Other files

Files in route directories without `+` prefix are ignored, allowing colocating components and utilities with routes. For multi-route usage, place in `$lib`.