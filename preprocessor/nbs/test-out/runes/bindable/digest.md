## $bindable Rune

Marks a component prop as bindable, allowing data to flow bidirectionally between parent and child components. By default, props flow one-way (parent to child), but bindable props enable child-to-parent data flow and allow state proxies to be mutated in the child.

**Usage:**

Mark a prop with `$bindable()`:

```svelte
// FancyInput.svelte
<script>
	let { value = $bindable(), ...props } = $props();
</script>

<input bind:value={value} {...props} />
```

Parent components can then use the `bind:` directive to establish two-way binding:

```svelte
// App.svelte
<script>
	import FancyInput from './FancyInput.svelte';
	let message = $state('hello');
</script>

<FancyInput bind:value={message} />
<p>{message}</p>
```

**Key Points:**

- Bindable props enable bidirectional data flow, simplifying code when used sparingly and carefully
- State proxies can be mutated in child components when marked as bindable
- Mutation of normal (non-bindable) props is possible but strongly discouraged; Svelte warns when detected
- Parent components don't have to use `bind:` — they can pass a normal prop instead
- Fallback values can be specified for when no prop is passed: `let { value = $bindable('fallback') } = $props()`