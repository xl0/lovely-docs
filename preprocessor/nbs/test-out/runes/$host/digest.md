## $host Rune

The `$host` rune provides access to the host element when compiling a component as a custom element. This allows you to dispatch custom events and interact with the host DOM element directly.

### Usage

```svelte
<svelte:options customElement="my-stepper" />

<script>
	function dispatch(type) {
		$host().dispatchEvent(new CustomEvent(type));
	}
</script>

<button onclick={() => dispatch('decrement')}>decrement</button>
<button onclick={() => dispatch('increment')}>increment</button>
```

The host element can then be used in parent components to listen to custom events:

```svelte
<script>
	let count = $state(0);
</script>

<my-stepper
	ondecrement={() => count -= 1}
	onincrement={() => count += 1}
></my-stepper>

<p>count: {count}</p>
```

The `$host()` call returns the custom element's host element, enabling you to dispatch custom events that parent components can listen to via event handlers.