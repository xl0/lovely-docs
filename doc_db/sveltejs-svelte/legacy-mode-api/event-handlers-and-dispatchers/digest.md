## Event Handlers

Attach handlers to elements using the `on:` directive:

```svelte
<button on:click={handleClick}>count: {count}</button>
```

Handlers can be inline with no performance penalty:

```svelte
<button on:click={() => (count += 1)}>count: {count}</button>
```

### Modifiers

Add modifiers with the `|` character. Available modifiers:
- `preventDefault` — calls `event.preventDefault()`
- `stopPropagation` — prevents event reaching next element
- `stopImmediatePropagation` — prevents other listeners of same event
- `passive` — improves scrolling performance (auto-added where safe)
- `nonpassive` — explicitly set `passive: false`
- `capture` — fires during capture phase instead of bubbling
- `once` — remove handler after first run
- `self` — only trigger if `event.target` is the element itself
- `trusted` — only trigger if `event.isTrusted` is `true`

Modifiers chain: `on:click|once|capture={...}`

### Event Forwarding

Use `on:` without a value to forward the event:

```svelte
<button on:click>
	The component itself will emit the click event
</button>
```

### Multiple Listeners

Multiple handlers for the same event are supported:

```svelte
<button on:click={increment} on:click={log}>
	clicks: {count}
</button>
```

## Component Events

Create a dispatcher in components:

```svelte
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<button on:click={() => dispatch('decrement')}>decrement</button>
<button on:click={() => dispatch('increment')}>increment</button>
```

Listen for dispatched events:

```svelte
<Stepper
	on:decrement={() => n -= 1}
	on:increment={() => n += 1}
/>
```

Component events do not bubble. Only `once` modifier is valid on component event handlers.

**Migration note**: For Svelte 5, use callback props instead of `createEventDispatcher` (which is deprecated):

```svelte
<script>
	export let decrement;
	export let increment;
</script>

<button on:click={decrement}>decrement</button>
```