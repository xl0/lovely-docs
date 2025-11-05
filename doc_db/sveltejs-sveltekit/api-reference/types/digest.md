## Generated types

SvelteKit automatically generates `.d.ts` files for each endpoint and page, providing typed `RequestHandler` and `Load` functions based on route parameters.

Instead of manually typing params:
```js
/** @type {import('@sveltejs/kit').RequestHandler<{
    foo: string;
    bar: string;
    baz: string
  }>} */
export async function GET({ params }) {}
```

Import from the generated `$types` module:
```js
/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {}
```

The generated `.svelte-kit/tsconfig.json` uses `rootDirs` to make `$types` available as a sibling import.

Return types from load functions are available as `PageData` and `LayoutData`. The union of all `Actions` return types is `ActionData`.

Helper types `PageProps` (v2.16.0+) and `LayoutProps` combine data with form/children:
```svelte
<script>
	/** @type {import('./$types').PageProps} */
	let { data, form } = $props();
</script>
```

Your `tsconfig.json` or `jsconfig.json` must extend `./.svelte-kit/tsconfig.json`.

## $lib alias

`$lib` is an alias to `src/lib` (or configured `config.kit.files.lib`). `$lib/server` is a subdirectory where SvelteKit prevents client-side imports.

## app.d.ts

Contains ambient types in the `App` namespace:
- `Error`: shape of expected/unexpected errors with `message: string`
- `Locals`: interface for `event.locals` in hooks and server-only code
- `PageData`: shape of `page.data` state and store
- `PageState`: shape of `page.state` for `pushState`/`replaceState`
- `Platform`: adapter-specific context via `event.platform`