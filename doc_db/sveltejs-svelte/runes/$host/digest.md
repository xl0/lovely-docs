The `$host` rune provides access to the host element when compiling a component as a custom element. This allows you to dispatch custom events from within the component.

Example: In a custom element component, use `$host().dispatchEvent(new CustomEvent(type))` to dispatch events that can be listened to by the parent application:

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

The parent can then listen to these events:

```svelte
<my-stepper
	ondecrement={() => count -= 1}
	onincrement={() => count += 1}
></my-stepper>
```