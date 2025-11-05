## $bindable Rune

The `$bindable` rune marks a prop as bindable, allowing data to flow bidirectionally between parent and child components. This enables a parent to use the `bind:` directive to bind to a child's prop.

### Basic Usage

Mark a prop as bindable in the child component:

```svelte
<script>
	let { value = $bindable(), ...props } = $props();
</script>

<input bind:value={value} {...props} />
```

The parent can then bind to this prop:

```svelte
<script>
	import FancyInput from './FancyInput.svelte';
	let message = $state('hello');
</script>

<FancyInput bind:value={message} />
<p>{message}</p>
```

### Key Points

- Bindable props allow state to flow from child to parent, making bidirectional data binding possible
- A state proxy can be mutated in the child when using bindable props
- Normal prop mutation is discouraged and triggers warnings
- Parents are not required to use `bind:` — they can pass a normal prop instead
- Specify a fallback value: `let { value = $bindable('fallback'), ...props } = $props();`

Use bindable props sparingly and carefully to maintain clear data flow.