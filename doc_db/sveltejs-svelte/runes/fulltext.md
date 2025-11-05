

## Pages

### what-are-runes
Runes are $ -prefixed keywords in Svelte that control the compiler, introduced in Svelte 5.

Runes are `$`-prefixed compiler keywords in Svelte that control behavior. Example: `let message = $state('hello');`. They're not importable, not assignable, and only valid in specific positions.

### $state
The $state rune creates reactive state that automatically updates the UI; it supports deep reactivity for objects/arrays via proxies, class fields, and has variants for raw state, snapshots, and eager updates.

## Creating Reactive State

```svelte
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>clicks: {count}</button>
```

## Deep Reactivity

Arrays and objects become proxies with granular reactivity:

```js
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers updates
```

## Class Fields

```js
class Todo {
	done = $state(false);
	constructor(text) { this.text = $state(text); }
}
```

## Variants

- `$state.raw` — no deep reactivity, only reassignment allowed
- `$state.snapshot(value)` — get static snapshot of proxy
- `$state.eager(value)` — force immediate UI updates

## Exporting State

Cannot directly export and reassign. Either mutate object properties or use getter functions:

```js
export const counter = $state({ count: 0 });
export function increment() { counter.count += 1; }
```

### $derived
The $derived rune creates reactive derived state that automatically updates when its dependencies change, with support for complex derivations via $derived.by and temporary value overrides.

## $derived

Declares derived state that automatically updates when dependencies change:

```svelte
let count = $state(0);
let doubled = $derived(count * 2);
```

Use `$derived.by` for complex derivations with function bodies. Derived values can be temporarily reassigned for optimistic UI. Unlike `$state`, derived values are not deeply reactive proxies. Svelte uses push-pull reactivity: changes notify dependents immediately but derived values only re-evaluate when read.

### $effect
The $effect rune runs side-effect functions when tracked state changes, with automatic dependency tracking and optional teardown functions.

## $effect

Effects run when state updates (browser-only). Automatically track synchronously-read reactive values and re-run on changes. Use for side effects like canvas drawing or network requests.

**Basic example:**
```svelte
$effect(() => {
	context.fillStyle = color;
	context.fillRect(0, 0, size, size);
});
```

**Teardown function** (runs before re-run and on destroy):
```svelte
$effect(() => {
	const interval = setInterval(() => count += 1, ms);
	return () => clearInterval(interval);
});
```

**Key rules:**
- Only synchronously read values are tracked
- Re-runs when object reference changes, not property mutations
- Asynchronously read values (after await/setTimeout) are not tracked
- Conditional code only tracks dependencies in executed branches

**Variants:**
- `$effect.pre()` - runs before DOM updates
- `$effect.tracking()` - returns true if in tracking context
- `$effect.pending()` - count of pending promises
- `$effect.root()` - manually controlled non-tracked scope

**Don't use $effect for state synchronization** — use `$derived` instead.

### $props
The $props rune receives component inputs with destructuring, fallback values, type safety, and includes $props.id() for generating unique element identifiers.

## $props Rune

Receive component props with destructuring:

```svelte
<script>
	let { adjective = 'happy' } = $props();
</script>
```

Supports fallback values, renaming (`{ super: trouper }`), and rest properties (`...others`). Don't mutate props unless bindable; use callbacks or `$bindable` instead.

Add type annotations for safety:

```svelte
<script lang="ts">
	let { adjective }: { adjective: string } = $props();
</script>
```

`$props.id()` generates unique per-instance IDs for linking elements.

### $bindable
The $bindable rune enables bidirectional prop binding, allowing child components to pass data back to parents using the bind: directive.

## $bindable Rune

Mark a prop as bindable to enable bidirectional data flow between parent and child:

```svelte
// Child
let { value = $bindable(), ...props } = $props();

// Parent
<FancyInput bind:value={message} />
```

Bindable props allow state mutation in children and can have fallback values: `$bindable('fallback')`

### $inspect
Development debugging rune that reactively logs value changes with optional custom callbacks and function tracing.

## $inspect

Development-only rune that logs values whenever they change, tracking deep reactivity. Use `$inspect(value)` to log, or `$inspect(value).with(callback)` to use a custom callback receiving `"init"` or `"update"` type.

`$inspect.trace()` (v5.14+) traces which reactive state caused an effect/derived to re-run; must be first statement in function body.

### $host
$host rune provides access to the host element for dispatching custom events in custom element components.

The `$host` rune accesses the host element in custom element components, enabling custom event dispatch:

```svelte
$host().dispatchEvent(new CustomEvent(type))
```

