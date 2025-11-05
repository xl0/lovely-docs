## Event Handlers

Use `on:` directive: `<button on:click={handleClick}>`. Inline handlers have no penalty.

### Modifiers

Chain with `|`: `on:click|once|capture={...}`

Available: `preventDefault`, `stopPropagation`, `stopImmediatePropagation`, `passive`, `nonpassive`, `capture`, `once`, `self`, `trusted`

### Event Forwarding

`<button on:click>` forwards the event to parent.

### Multiple Listeners

```svelte
<button on:click={increment} on:click={log}>clicks: {count}</button>
```

## Component Events

```svelte
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<button on:click={() => dispatch('decrement')}>decrement</button>
```

Listen: `<Stepper on:decrement={() => n -= 1} on:increment={() => n += 1} />`

Events don't bubble. For Svelte 5, use callback props instead of `createEventDispatcher`.