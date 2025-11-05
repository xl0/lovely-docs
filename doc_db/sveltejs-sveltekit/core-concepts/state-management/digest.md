## Avoid shared state on the server

Servers are long-lived and shared by multiple users. Don't store data in shared variables—this exposes one user's data to others and causes data loss on restart. Authenticate users with cookies and persist data to a database instead.

## No side-effects in load functions

Load functions must be pure. Don't write to stores or global state inside load functions, as this creates shared state across all users. Return data instead and pass it to components or access via `page.data`.

## Using state and stores with context

Use Svelte's context API to avoid global state. Attach state to the component tree with `setContext` and retrieve it with `getContext`:

```svelte
// +layout.svelte
import { setContext } from 'svelte';
let { data } = $props();
setContext('user', () => data.user);

// +page.svelte
import { getContext } from 'svelte';
const user = getContext('user');
```

Pass functions into context to maintain reactivity. On the server, state updates in child components won't affect parent components (already rendered), but on the client they will. Pass state down rather than up to avoid flashing during hydration.

## Component and page state is preserved

When navigating between routes, SvelteKit reuses components instead of destroying and recreating them. This means `onMount` and `onDestroy` won't rerun and reactive values won't recalculate. Use `$derived` to make values reactive:

```svelte
let { data } = $props();
let wordCount = $derived(data.content.split(' ').length);
let estimatedReadingTime = $derived(wordCount / 250);
```

Use `{#key page.url.pathname}` to force component remounting on navigation if needed.

## Storing state in the URL

For state that should survive reloads or affect SSR (filters, sorting), use URL search parameters like `?sort=price&order=ascending`. Access them in load functions via the `url` parameter and in components via `page.url.searchParams`.

## Storing ephemeral state in snapshots

For disposable UI state like 'is accordion open?', use snapshots to associate component state with history entries.