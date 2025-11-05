## Runes

`$`-prefixed compiler keywords that control Svelte behavior. Not importable, not assignable, only valid in specific positions.

### $state
Creates reactive state with automatic UI updates. Supports deep reactivity for objects/arrays via proxies.

```js
let count = $state(0);
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers updates
```

Variants: `$state.raw` (no deep reactivity), `$state.snapshot(value)` (static snapshot), `$state.eager(value)` (immediate updates). Cannot directly export and reassign; mutate properties or use getter functions instead.

### $derived
Reactive derived state that automatically updates when dependencies change.

```js
let count = $state(0);
let doubled = $derived(count * 2);
```

Use `$derived.by` for complex derivations. Derived values can be temporarily reassigned for optimistic UI. Uses push-pull reactivity: changes notify dependents immediately but derived values only re-evaluate when read.

### $effect
Runs side-effect functions when tracked state changes with automatic dependency tracking.

```js
$effect(() => {
	context.fillStyle = color;
	context.fillRect(0, 0, size, size);
});

$effect(() => {
	const interval = setInterval(() => count += 1, ms);
	return () => clearInterval(interval);
});
```

Only synchronously read values are tracked. Asynchronously read values (after await/setTimeout) are not tracked. Variants: `$effect.pre()` (before DOM updates), `$effect.tracking()` (returns true if in tracking context), `$effect.pending()` (count of pending promises), `$effect.root()` (manually controlled non-tracked scope). Don't use for state synchronization—use `$derived` instead.

### $props
Receives component inputs with destructuring and fallback values.

```svelte
<script lang="ts">
	let { adjective = 'happy' }: { adjective: string } = $props();
</script>
```

Supports renaming (`{ super: trouper }`), rest properties (`...others`), and type annotations. `$props.id()` generates unique per-instance IDs for linking elements.

### $bindable
Enables bidirectional prop binding between parent and child components.

```svelte
// Child
let { value = $bindable(), ...props } = $props();

// Parent
<FancyInput bind:value={message} />
```

Allows state mutation in children and supports fallback values.

### $inspect
Development-only rune that reactively logs value changes.

```js
$inspect(value);
$inspect(value).with(callback); // callback receives "init" or "update" type
$inspect.trace(); // traces which reactive state caused re-run (v5.14+)
```

### $host
Accesses the host element in custom element components for dispatching custom events.

```js
$host().dispatchEvent(new CustomEvent(type))
```