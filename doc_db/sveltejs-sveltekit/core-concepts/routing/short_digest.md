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