## Lifecycle Hooks

Svelte 5 has two lifecycle phases: creation and destruction. Use `onMount` for initialization (runs client-side only), `onDestroy` for cleanup (runs server-side), and `tick()` for post-update logic.

Deprecated `beforeUpdate`/`afterUpdate` are replaced by `$effect.pre` and `$effect` for more granular control:

```svelte
import { onMount, onDestroy, tick } from 'svelte';

onMount(() => {
  return () => { /* cleanup */ };
});

onDestroy(() => { /* cleanup */ });

$effect.pre(() => {
  messages; // runs before DOM update when messages change
  tick().then(() => { /* after update */ });
});
```