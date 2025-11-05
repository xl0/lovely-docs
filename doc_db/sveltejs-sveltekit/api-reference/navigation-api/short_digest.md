## Navigation API

**afterNavigate(callback)** - Runs on mount and every navigation.

**beforeNavigate(callback)** - Intercept navigation, call `cancel()` to prevent. `navigation.willUnload` indicates if document will unload.

**goto(url, opts)** - Programmatic navigation with options like `replaceState`, `noScroll`, `keepFocus`, `invalidateAll`, `invalidate`.

**invalidate(resource)** - Re-run load functions for resource. Example: `invalidate((url) => url.pathname === '/path')`.

**invalidateAll()** - Re-run all load functions.

**onNavigate(callback)** - Run before navigation (except full-page). Can return Promise to delay, or function to run after DOM update.

**preloadCode(pathname)** - Import code for routes (patterns: `/about`, `/blog/*`).

**preloadData(href)** - Preload page code and load functions. Returns `{type: 'loaded', status, data}` or `{type: 'redirect', location}`.

**pushState/replaceState(url, state)** - Manage history for shallow routing.