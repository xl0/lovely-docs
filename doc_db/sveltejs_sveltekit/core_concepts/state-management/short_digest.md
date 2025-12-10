## Avoid shared state on the server
Never store data in shared variables—one user's data becomes visible to others. Use cookies and databases instead.

## No side-effects in load functions
Load functions must be pure. Don't modify stores or global state; return data instead and pass it to components.

## Using state with context
Use Svelte's context API (`setContext`/`getContext`) to safely share state per user/request without creating shared variables. Pass functions to maintain reactivity.

## Component state is preserved on navigation
SvelteKit reuses components during navigation, so non-reactive values don't recalculate. Use `$derived` for reactive values, or `{#key}` to force remounting.

## Storing state in the URL
Use URL search parameters for state that should survive reloads and affect SSR (filters, sorting). Access via `url` parameter in load or `page.url.searchParams` in components.

## Ephemeral state with snapshots
Use snapshots for disposable UI state (accordion open/closed) that persists across navigation but not page refresh.