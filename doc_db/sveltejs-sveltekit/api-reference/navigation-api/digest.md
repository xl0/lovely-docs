## Navigation Functions

**afterNavigate(callback)** - Lifecycle function that runs when component mounts and on every navigation. Must be called during component initialization.

**beforeNavigate(callback)** - Navigation interceptor that runs before navigation. Call `cancel()` to prevent navigation. For 'leave' type navigations, `cancel()` triggers browser unload dialog. `navigation.willUnload` is true if navigation will unload the document.

**goto(url, opts)** - Programmatic navigation to a route. Options: `replaceState`, `noScroll`, `keepFocus`, `invalidateAll`, `invalidate` (array or predicate function), `state`. Returns Promise. Use `window.location` for external URLs.

**invalidate(resource)** - Re-run load functions that depend on the given resource. Accepts string/URL (must match exactly) or function predicate. Example: `invalidate((url) => url.pathname === '/path')` to match regardless of query parameters.

**invalidateAll()** - Re-run all load functions for current page.

**onNavigate(callback)** - Lifecycle function running immediately before navigation (except full-page). Can return Promise to delay navigation (e.g., for `document.startViewTransition`). If callback returns a function, it's called after DOM updates.

**preloadCode(pathname)** - Import code for routes without calling load functions. Accepts patterns like `/about` or `/blog/*`.

**preloadData(href)** - Preload page: load code and run load functions. Returns Promise with `{type: 'loaded', status, data}` or `{type: 'redirect', location}`.

**disableScrollHandling()** - Disable SvelteKit's built-in scroll handling during page updates (discouraged).

**pushState(url, state)** - Create new history entry with given page state. Pass `''` for current URL. Used for shallow routing.

**replaceState(url, state)** - Replace current history entry with given page state. Pass `''` for current URL. Used for shallow routing.