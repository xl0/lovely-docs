## Navigation API

**Lifecycle hooks:**
- `afterNavigate(callback)` - Runs on mount and every navigation
- `beforeNavigate(callback)` - Intercepts navigation, call `cancel()` to prevent
- `onNavigate(callback)` - Runs before navigation (except full-page), can return Promise or cleanup function

**Programmatic navigation:**
- `goto(url, opts)` - Navigate with options: `replaceState`, `noScroll`, `keepFocus`, `invalidateAll`, `invalidate`, `state`
- `pushState(url, state)` / `replaceState(url, state)` - Shallow routing with history manipulation

**Data loading:**
- `preloadCode(pathname)` - Import route code without running load functions
- `preloadData(href)` - Preload route code and run load functions
- `invalidate(resource)` - Re-run load functions depending on URL/custom identifier or matching predicate
- `invalidateAll()` - Re-run all load functions
- `refreshAll(opts)` - Re-run all remote functions and load functions

**Utilities:**
- `disableScrollHandling()` - Disable automatic scroll handling (discouraged)