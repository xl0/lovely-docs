

## Pages

### what-are-runes
Runes are $ -prefixed keywords in Svelte that control the compiler and differ from regular functions in that they cannot be imported, assigned, or passed as arguments.

Runes are `$`-prefixed compiler keywords in Svelte (e.g., `$state('hello')`) that control the compiler. Unlike functions, they cannot be imported, assigned, or passed as arguments, and are only valid in specific positions.

### $state
The $state rune creates reactive variables; arrays and objects become deeply reactive proxies, with variants for raw non-reactive state and snapshots.

## $state Rune

Create reactive state with `$state(value)`. Arrays and plain objects become deeply reactive proxies:

```js
let count = $state(0);
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers update
```

Use `$state.raw` for non-reactive state that can only be reassigned. Use `$state.snapshot` to get a plain object from a proxy.

For class fields, use `$state` on individual fields. Destructuring breaks reactivity.

When exporting state across modules, either export an object and mutate its properties, or export functions that access the state instead of exporting the state directly.

### $derived
Derived state automatically updates when its dependencies change, with support for complex expressions via $derived.by and temporary value overrides for optimistic UI.

## $derived

Declare derived state that automatically updates when dependencies change:

```svelte
let count = $state(0);
let doubled = $derived(count * 2);
```

For complex logic, use `$derived.by(() => { ... })`. Expressions must be side-effect free.

Can temporarily override derived values for optimistic UI. Unlike `$state`, derived values aren't deeply reactive proxies, but mutations to objects/arrays from reactive state still affect the source.

Uses push-pull reactivity: dependents are notified immediately, but derived values only re-evaluate when read. Skips downstream updates if the new value is referentially identical to the previous one.

### $effect
Effects are side-effect functions that automatically track reactive dependencies and re-run when they change, with support for teardown functions and various execution modes.

## $effect

Effects run when state updates for side effects like API calls or canvas drawing. They automatically track reactive values ($state, $derived, $props) read synchronously and re-run when dependencies change.

**Basic example:**
```svelte
$effect(() => {
	const context = canvas.getContext('2d');
	context.fillStyle = color;
	context.fillRect(0, 0, size, size);
});
```

**Teardown function** (runs before re-run or on destroy):
```svelte
$effect(() => {
	const interval = setInterval(() => count += 1, ms);
	return () => clearInterval(interval);
});
```

**Key points:**
- Only reruns when objects change, not properties inside them
- Asynchronously read values are not tracked
- Conditionally read values only create dependencies when the condition is true
- Use $derived for state synchronization, not $effect
- $effect.pre runs before DOM updates
- $effect.tracking() checks if in tracking context
- $effect.root() creates manually-controlled effects

### $props
The $props rune receives component inputs with destructuring, fallback values, renaming, and type safety support.

## $props rune

Receive component props with destructuring:
```svelte
let { adjective = 'happy' } = $props();
```

Rename props: `let { super: trouper } = $props();`

Rest props: `let { a, b, ...others } = $props();`

Props update reactively but shouldn't be mutated unless bindable. Add type safety with TypeScript or JSDoc.

Generate unique instance IDs with `$props.id()` for linking elements.

### $bindable
The $bindable rune marks component props as bindable, enabling bidirectional data flow and allowing child components to mutate state that flows back to parents.

## $bindable Rune

Enables two-way data binding between parent and child components. Mark props with `$bindable()` to allow children to mutate and communicate changes back to parents.

```svelte
// Child
let { value = $bindable(), ...props } = $props();

// Parent
<Child bind:value={message} />
```

Use sparingly; parents can still pass normal props without binding.

### $inspect
Development-only rune for reactive logging and tracing state changes and their origins.

## $inspect

Development-only rune that logs values whenever they change, tracking deep reactivity in objects and arrays.

```svelte
$inspect(count, message); // logs on change
$inspect(count).with((type, value) => { /* custom handler */ });
$inspect(stuff).with(console.trace); // find origin of changes
```

### $inspect.trace()

Traces which reactive state caused an effect/derived to re-run. Must be first statement in function body.

```svelte
$effect(() => {
	$inspect.trace();
	doSomeWork();
});
```

### $host
$host rune provides access to the host element for dispatching custom events in custom element components.

The `$host` rune accesses the host element in custom element components, enabling custom event dispatch:

```svelte
$host().dispatchEvent(new CustomEvent(type));
```

### runes
Runes are Svelte's core reactive primitives for managing state, derived values, and side effects in components.

Runes are Svelte's reactive primitives for state management. Key runes: `$state` for reactive variables, `$derived` for computed values, `$effect` for side effects, `$watch` for observing changes.

