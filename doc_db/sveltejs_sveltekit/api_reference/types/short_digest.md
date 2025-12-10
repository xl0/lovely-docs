## Generated types

SvelteKit auto-generates `$types.d.ts` files for routes, eliminating manual param typing:

```js
// Auto-generated: .svelte-kit/types/src/routes/[foo]/[bar]/[baz]/$types.d.ts
export type RequestHandler = Kit.RequestHandler<{ foo: string; bar: string; baz: string }>;
export type PageLoad = Kit.Load<{ foo: string; bar: string; baz: string }>;

// Use in +server.js and +page.js
/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {}
```

Return types (`PageData`, `LayoutData`, `ActionData`) available via `$types`. Helper types `PageProps` (v2.16.0+) include `data` and `form`:

```svelte
<script>
	/** @type {import('./$types').PageProps} */
	let { data, form } = $props();
</script>
```

Extend `tsconfig.json` from `.svelte-kit/tsconfig.json`.

## $lib and $lib/server

`$lib` aliases `src/lib`. `$lib/server` modules cannot be imported client-side.

## app.d.ts

Ambient types in `App` namespace:
- **Error**: `{ message: string }` - shape of errors from `error()` function and `handleError` hooks
- **Locals**: `event.locals` in server hooks and `+server.js`
- **PageData**: `page.data` and `$page.data` store shape (shared across pages)
- **PageState**: `page.state` object shape (manipulated via `pushState`/`replaceState`)
- **Platform**: adapter-provided `event.platform` context