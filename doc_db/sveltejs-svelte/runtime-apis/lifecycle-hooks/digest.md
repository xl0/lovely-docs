## Lifecycle Hooks

Svelte 5 simplifies the component lifecycle to two phases: creation and destruction. State updates don't trigger component-level hooks; instead, individual render effects react to changes.

### `onMount`

Schedules a callback when the component mounts to the DOM. Must be called during component initialization. Does not run on the server.

```svelte
import { onMount } from 'svelte';

onMount(() => {
  console.log('mounted');
  
  return () => {
    // cleanup when unmounted
  };
});
```

Note: Only synchronous functions work for cleanup; async functions always return a Promise.

### `onDestroy`

Schedules a callback immediately before component unmount. This is the only lifecycle hook that runs in server-side components.

```svelte
import { onDestroy } from 'svelte';

onDestroy(() => {
  console.log('destroying');
});
```

### `tick`

Returns a promise that resolves after pending state changes are applied. Use this instead of "after update" hooks.

```svelte
import { tick } from 'svelte';

$effect.pre(() => {
  console.log('about to update');
  tick().then(() => {
    console.log('updated');
  });
});
```

### Deprecated: `beforeUpdate` / `afterUpdate`

Shimmed for backwards compatibility in Svelte 5 but not available in components using runes. Replace with `$effect.pre` (before) and `$effect` (after) for more granular control that only reacts to relevant state changes.

Example: Auto-scrolling chat window using `$effect.pre` instead of `beforeUpdate`:

```svelte
import { tick } from 'svelte';

let theme = $state('dark');
let messages = $state([]);
let viewport;

$effect.pre(() => {
  messages; // explicitly reference to trigger on message changes only
  const autoscroll = viewport && viewport.offsetHeight + viewport.scrollTop > viewport.scrollHeight - 50;
  
  if (autoscroll) {
    tick().then(() => {
      viewport.scrollTo(0, viewport.scrollHeight);
    });
  }
});

function handleKeydown(event) {
  if (event.key === 'Enter') {
    messages = [...messages, event.target.value];
    event.target.value = '';
  }
}
```