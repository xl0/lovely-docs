## Overview

SvelteKit provides three read-only state objects via the `$app/state` module: `page`, `navigating`, and `updated`. Available since SvelteKit 2.12 (use `$app/stores` for earlier versions).

```js
import { navigating, page, updated } from '$app/state';
```

## navigating

Represents an in-progress navigation with properties: `from`, `to`, `type`, and `delta` (if `type === 'popstate'`). All values are `null` when no navigation is occurring or during server rendering.

```ts
const navigating:
	| import('@sveltejs/kit').Navigation
	| {
			from: null;
			to: null;
			type: null;
			willUnload: null;
			delta: null;
			complete: null;
	  };
```

## page

A read-only reactive object containing current page information:
- Combined `data` from all pages/layouts
- Current `form` prop value
- Page state set via `goto`, `pushState`, or `replaceState`
- Metadata: URL, route, parameters, error status

```svelte
<script>
	import { page } from '$app/state';
	const id = $derived(page.params.id); // Reactive with runes
</script>

<p>Currently at {page.url.pathname}</p>
{#if page.error}
	<span class="red">Problem detected</span>
{/if}
```

**Important:** Changes to `page` only work with runes (`$derived`). Legacy reactivity syntax (`$:`) will not reflect updates after initial load.

On the server, values can only be read during rendering (not in `load` functions). In the browser, values can be read at any time.

```ts
const page: import('@sveltejs/kit').Page;
```

## updated

A read-only reactive value initially `false`. When `version.pollInterval` is non-zero, SvelteKit polls for new app versions and sets `updated.current` to `true` when detected. Call `updated.check()` to force an immediate check.

```ts
const updated: {
	get current(): boolean;
	check(): Promise<boolean>;
};
```