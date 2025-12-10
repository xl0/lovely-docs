## Navigation Functions

### afterNavigate
Lifecycle function that runs a callback when component mounts and on every navigation. Must be called during component initialization and remains active while mounted.

```js
import { afterNavigate } from '$app/navigation';

afterNavigate((navigation) => {
  console.log('Navigated to:', navigation);
});
```

### beforeNavigate
Navigation interceptor that triggers before navigation (link clicks, `goto()`, browser back/forward). Call `cancel()` to prevent navigation. For 'leave' type navigations (user leaving app), `cancel()` triggers browser unload dialog. When navigating to non-SvelteKit routes, `navigation.to.route.id` is `null`. Property `navigation.willUnload` is `true` for document-unloading navigations. Must be called during component initialization.

```js
import { beforeNavigate } from '$app/navigation';

beforeNavigate((navigation) => {
  if (unsavedChanges) {
    navigation.cancel();
  }
});
```

### disableScrollHandling
Disables SvelteKit's built-in scroll handling when called during page updates (in `onMount`, `afterNavigate`, or actions). Generally discouraged as it breaks user expectations.

```js
import { disableScrollHandling } from '$app/navigation';

onMount(() => {
  disableScrollHandling();
  // Custom scroll logic here
});
```

### goto
Programmatically navigate to a route. Returns Promise that resolves when navigation completes or rejects on failure. For external URLs, use `window.location = url` instead.

Options:
- `replaceState`: Replace history entry instead of pushing
- `noScroll`: Prevent automatic scroll to top
- `keepFocus`: Keep current element focused
- `invalidateAll`: Re-run all load functions
- `invalidate`: Array of specific resources to invalidate
- `state`: Custom page state

```js
import { goto } from '$app/navigation';

await goto('/about', { 
  replaceState: true, 
  noScroll: true,
  invalidate: ['custom:data']
});
```

### invalidate
Re-run `load` functions that depend on a specific URL via `fetch` or `depends`. Accepts string/URL (must match exactly, including query params) or function predicate. Custom identifiers use format `[a-z]+:` (e.g., `custom:state`). Returns Promise resolving when page updates.

```js
import { invalidate } from '$app/navigation';

// Exact match
invalidate('/api/data');

// Pattern match
invalidate((url) => url.pathname === '/path');

// Custom identifier
invalidate('custom:state');
```

### invalidateAll
Re-run all `load` and `query` functions for currently active page. Returns Promise resolving when page updates.

```js
import { invalidateAll } from '$app/navigation';

await invalidateAll();
```

### onNavigate
Lifecycle function that runs callback immediately before navigation to new URL (except full-page navigations). If callback returns Promise, SvelteKit waits for resolution before completing navigation (useful for `document.startViewTransition`). If callback returns function, it's called after DOM updates. Must be called during component initialization.

```js
import { onNavigate } from '$app/navigation';

onNavigate(async (navigation) => {
  if (!document.startViewTransition) return;
  
  return new Promise((resolve) => {
    document.startViewTransition(resolve);
  });
});
```

### preloadCode
Programmatically import code for routes not yet fetched. Specify routes by pathname like `/about` or `/blog/*`. Unlike `preloadData`, doesn't call load functions. Returns Promise resolving when modules imported.

```js
import { preloadCode } from '$app/navigation';

await preloadCode('/about');
await preloadCode('/blog/*');
```

### preloadData
Programmatically preload page: ensures code is loaded and calls page's load function. Same behavior as `<a data-sveltekit-preload-data>`. If next navigation is to preloaded `href`, load values are used for instant navigation. Returns Promise with result object containing either `{type: 'loaded', status, data}` or `{type: 'redirect', location}`.

```js
import { preloadData } from '$app/navigation';

const result = await preloadData('/about');
if (result.type === 'loaded') {
  console.log(result.data);
}
```

### pushState
Programmatically create new history entry with given `page.state`. Pass `''` as first argument to use current URL. Used for shallow routing.

```js
import { pushState } from '$app/navigation';

pushState('', { count: 1 });
pushState('/new-url', { count: 2 });
```

### replaceState
Programmatically replace current history entry with given `page.state`. Pass `''` as first argument to use current URL. Used for shallow routing.

```js
import { replaceState } from '$app/navigation';

replaceState('', { count: 1 });
replaceState('/new-url', { count: 2 });
```

### refreshAll
Re-run all currently active remote functions and all `load` functions for active page (unless disabled via `includeLoadFunctions: false` option). Returns Promise resolving when page updates.

```js
import { refreshAll } from '$app/navigation';

await refreshAll();
await refreshAll({ includeLoadFunctions: false });
```