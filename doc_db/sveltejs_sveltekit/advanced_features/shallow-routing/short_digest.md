## Shallow Routing

Create history entries without navigating using `pushState` and `replaceState`. Useful for modals where back/forward dismisses the overlay.

```svelte
<script>
	import { pushState, preloadData, goto } from '$app/navigation';
	import { page } from '$app/state';

	function showModal() {
		pushState('', { showModal: true });
	}

	async function handlePhotoClick(e) {
		if (shouldNavigateNormally(e)) return;
		e.preventDefault();
		const result = await preloadData(e.currentTarget.href);
		if (result.type === 'loaded' && result.status === 200) {
			pushState(e.currentTarget.href, { selected: result.data });
		} else {
			goto(e.currentTarget.href);
		}
	}
</script>

{#if page.state.showModal}
	<Modal close={() => history.back()} />
{/if}
```

First argument to `pushState` is relative URL (`''` for current). Second is page state accessible via `page.state`. Use `replaceState` to avoid creating history entry. Requires JavaScript; `page.state` is empty during SSR and on initial page load.