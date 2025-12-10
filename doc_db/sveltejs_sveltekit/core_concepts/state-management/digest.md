## Avoid shared state on the server

Servers are stateless and shared by multiple users. Never store data in shared variables that persist across requests, as one user's data will be visible to others.

```js
// ❌ WRONG - shared across all users
let user;
export function load() {
	return { user };
}
export const actions = {
	default: async ({ request }) => {
		user = { name: data.get('name'), secret: data.get('secret') };
	}
}
```

Instead, authenticate users with cookies and persist data to a database.

## No side-effects in load functions

Load functions must be pure. Don't write to stores or global state inside load functions, as this creates shared state across all users.

```js
// ❌ WRONG - modifies shared store
import { user } from '$lib/user';
export async function load({ fetch }) {
	const response = await fetch('/api/user');
	user.set(await response.json()); // shared across all users!
}

// ✅ CORRECT - return data
export async function load({ fetch }) {
	const response = await fetch('/api/user');
	return { user: await response.json() };
}
```

Pass data to components that need it or use `page.data`.

## Using state and stores with context

Use Svelte's context API to safely share state without creating shared variables. State attached to the component tree via `setContext` is isolated per user/request.

```svelte
<!-- src/routes/+layout.svelte -->
<script>
	import { setContext } from 'svelte';
	let { data } = $props();
	setContext('user', () => data.user);
</script>

<!-- src/routes/user/+page.svelte -->
<script>
	import { getContext } from 'svelte';
	const user = getContext('user');
</script>
<p>Welcome {user().name}</p>
```

Pass functions into `setContext` to maintain reactivity across boundaries. With SSR, state updates in child components during rendering won't affect parent components (already rendered), but on the client (CSR) values propagate up. Pass state down rather than up to avoid flashing during hydration.

If not using SSR, you can safely keep state in a shared module without the context API.

## Component and page state is preserved

When navigating between routes, SvelteKit reuses layout and page components instead of destroying/recreating them. This means `data` props update but lifecycle methods (`onMount`, `onDestroy`) don't rerun and non-reactive values don't recalculate.

```svelte
<!-- ❌ WRONG - estimatedReadingTime won't update on navigation -->
<script>
	let { data } = $props();
	const wordCount = data.content.split(' ').length;
	const estimatedReadingTime = wordCount / 250;
</script>

<!-- ✅ CORRECT - use $derived for reactivity -->
<script>
	let { data } = $props();
	let wordCount = $derived(data.content.split(' ').length);
	let estimatedReadingTime = $derived(wordCount / 250);
</script>
```

Use `afterNavigate` and `beforeNavigate` if code in lifecycle methods must run again after navigation. To destroy and remount a component on navigation, use `{#key page.url.pathname}`.

## Storing state in the URL

For state that should survive reloads and affect SSR (filters, sorting), use URL search parameters like `?sort=price&order=ascending`. Set them in `<a href>` or `<form action>` attributes, or programmatically via `goto('?key=value')`. Access them in load functions via the `url` parameter and in components via `page.url.searchParams`.

## Storing ephemeral state in snapshots

For disposable UI state (accordion open/closed) that should persist across navigation but not survive page refresh, use snapshots to associate component state with history entries.