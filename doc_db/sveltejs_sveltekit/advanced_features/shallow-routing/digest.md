## Shallow Routing

Create history entries without navigating using `pushState` and `replaceState` functions. Useful for modals and other UI patterns where you want back/forward navigation to dismiss overlays without changing the page.

### Basic Usage

```svelte
<script>
	import { pushState } from '$app/navigation';
	import { page } from '$app/state';
	import Modal from './Modal.svelte';

	function showModal() {
		pushState('', { showModal: true });
	}
</script>

{#if page.state.showModal}
	<Modal close={() => history.back()} />
{/if}
```

The first argument to `pushState` is a relative URL (use `''` to stay on current URL). The second argument is the new page state, accessible via `page.state`. Make page state type-safe by declaring an `App.PageState` interface in `src/app.d.ts`.

Use `replaceState` instead of `pushState` to set page state without creating a new history entry.

### Loading Data for Routes

When rendering another `+page.svelte` inside the current page (e.g., photo detail in a modal), use `preloadData` to load the required data:

```svelte
<script>
	import { preloadData, pushState, goto } from '$app/navigation';
	import { page } from '$app/state';
	import Modal from './Modal.svelte';
	import PhotoPage from './[id]/+page.svelte';

	let { data } = $props();
</script>

{#each data.thumbnails as thumbnail}
	<a
		href="/photos/{thumbnail.id}"
		onclick={async (e) => {
			if (innerWidth < 640 || e.shiftKey || e.metaKey || e.ctrlKey) return;
			e.preventDefault();

			const result = await preloadData(e.currentTarget.href);
			if (result.type === 'loaded' && result.status === 200) {
				pushState(e.currentTarget.href, { selected: result.data });
			} else {
				goto(e.currentTarget.href);
			}
		}}
	>
		<img alt={thumbnail.alt} src={thumbnail.src} />
	</a>
{/each}

{#if page.state.selected}
	<Modal onclose={() => history.back()}>
		<PhotoPage data={page.state.selected} />
	</Modal>
{/if}
```

If the element uses `data-sveltekit-preload-data`, the data will already be requested and `preloadData` will reuse that request.

### Caveats

- During server-side rendering, `page.state` is always an empty object
- On the first page the user lands on, state is not applied until they navigate (reload or return from another document won't restore state)
- Shallow routing requires JavaScript; provide fallback behavior for when JavaScript is unavailable

### Legacy

`page.state` from `$app/state` was added in SvelteKit 2.12. For earlier versions or Svelte 4, use `$page.state` from `$app/stores` instead.