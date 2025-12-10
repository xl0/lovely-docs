## Generated types

SvelteKit automatically generates `.d.ts` files for each endpoint and page, allowing you to type the `params` object without manual boilerplate.

Instead of manually typing `RequestHandler` and `Load` with params:
```js
/** @type {import('@sveltejs/kit').RequestHandler<{
    foo: string;
    bar: string;
    baz: string
  }>} */
export async function GET({ params }) {}
```

SvelteKit generates `$types.d.ts` files that can be imported as siblings:
```ts
// .svelte-kit/types/src/routes/[foo]/[bar]/[baz]/$types.d.ts
import type * as Kit from '@sveltejs/kit';

type RouteParams = {
	foo: string;
	bar: string;
	baz: string;
};

export type RequestHandler = Kit.RequestHandler<RouteParams>;
export type PageLoad = Kit.Load<RouteParams>;
```

Use in endpoints and pages:
```js
// src/routes/[foo]/[bar]/[baz]/+server.js
/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {}
```

```js
// src/routes/[foo]/[bar]/[baz]/+page.js
/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {}
```

Return types of load functions are available as `PageData` and `LayoutData` through `$types`, while the union of all `Actions` return values is available as `ActionData`.

Starting with version 2.16.0, helper types `PageProps` and `LayoutProps` are provided:
```svelte
<script>
	/** @type {import('./$types').PageProps} */
	let { data, form } = $props();
</script>
```

For versions before 2.16.0 or Svelte 4:
```svelte
<script>
	/** @type {{ data: import('./$types').PageData, form: import('./$types').ActionData }} */
	let { data, form } = $props();
</script>
```

Your `tsconfig.json` or `jsconfig.json` must extend from the generated `.svelte-kit/tsconfig.json`:
```json
{ "extends": "./.svelte-kit/tsconfig.json" }
```

## Default tsconfig.json

The generated `.svelte-kit/tsconfig.json` contains:

**Programmatically generated options** (can be overridden with caution):
```json
{
	"compilerOptions": {
		"paths": {
			"$lib": ["../src/lib"],
			"$lib/*": ["../src/lib/*"]
		},
		"rootDirs": ["..", "./types"]
	},
	"include": [
		"ambient.d.ts",
		"non-ambient.d.ts",
		"./types/**/$types.d.ts",
		"../vite.config.js",
		"../vite.config.ts",
		"../src/**/*.js",
		"../src/**/*.ts",
		"../src/**/*.svelte",
		"../tests/**/*.js",
		"../tests/**/*.ts",
		"../tests/**/*.svelte"
	],
	"exclude": [
		"../node_modules/**",
		"../src/service-worker.js",
		"../src/service-worker/**/*.js",
		"../src/service-worker.ts",
		"../src/service-worker/**/*.ts",
		"../src/service-worker.d.ts",
		"../src/service-worker/**/*.d.ts"
	]
}
```

**Required options** (should not be modified):
```json
{
	"compilerOptions": {
		"verbatimModuleSyntax": true,  // Ensures types imported with `import type`
		"isolatedModules": true,        // Vite compiles one module at a time
		"noEmit": true,                 // Type-checking only
		"lib": ["esnext", "DOM", "DOM.Iterable"],
		"moduleResolution": "bundler",
		"module": "esnext",
		"target": "esnext"
	}
}
```

Extend or modify using the `typescript.config` setting in `svelte.config.js`.

## $lib

Alias to `src/lib` (or configured `config.kit.files.lib`). Allows importing common components and utilities without relative path traversal.

### $lib/server

Subdirectory of `$lib`. SvelteKit prevents importing modules from `$lib/server` into client-side code (see server-only modules).

## app.d.ts

Home to ambient types available without explicit imports. Contains the `App` namespace with types influencing SvelteKit features.

### App.Error

Defines the shape of expected and unexpected errors. Expected errors are thrown using the `error` function; unexpected errors are handled by `handleError` hooks.

```dts
interface Error {
	message: string;
}
```

### App.Locals

Interface defining `event.locals`, accessible in server hooks (`handle`, `handleError`), server-only `load` functions, and `+server.js` files.

```dts
interface Locals {}
```

### App.PageData

Defines the shape of `page.data` state and `$page.data` store (data shared between all pages). The `Load` and `ServerLoad` functions in `./$types` are narrowed accordingly. Use optional properties for page-specific data; do not add index signatures.

```dts
interface PageData {}
```

### App.PageState

Shape of the `page.state` object, manipulated using `pushState` and `replaceState` from `$app/navigation`.

```dts
interface PageState {}
```

### App.Platform

For adapters providing platform-specific context via `event.platform`.

```dts
interface Platform {}
```