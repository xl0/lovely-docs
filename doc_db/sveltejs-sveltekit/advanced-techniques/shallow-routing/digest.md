Shallow routing allows you to create history entries without navigating, useful for modals and overlays that users can dismiss by navigating back.

**Core Functions:**
- `pushState(url, state)` - Creates a new history entry with associated state
- `replaceState(url, state)` - Sets state without creating a new history entry
- `preloadData(href)` - Loads data for a route before navigating

**Basic Modal Example:**
```svelte
<script>
  import { pushState } from '$app/navigation';
  import { page } from '$app/state';
  
  function showModal() {
    pushState('', { showModal: true });
  }
</script>

{#if page.state.showModal}
  <Modal close={() => history.back()} />
{/if}
```

**Loading Data for Shallow Routes:**
When rendering another page component without navigating, use `preloadData` to fetch its data:
```svelte
<a href="/photos/{id}" onclick={async (e) => {
  e.preventDefault();
  const result = await preloadData(e.currentTarget.href);
  if (result.type === 'loaded' && result.status === 200) {
    pushState(href, { selected: result.data });
  } else {
    goto(href);
  }
}}>
```

**Important Notes:**
- First argument to `pushState` is relative URL; use `''` to stay on current URL
- Access state via `page.state` (requires SvelteKit 2.12+; use `$page.state` from stores in earlier versions)
- Make state type-safe by declaring `App.PageState` interface in `src/app.d.ts`
- During SSR and on initial page load, `page.state` is always empty
- Shallow routing requires JavaScript; provide fallback behavior