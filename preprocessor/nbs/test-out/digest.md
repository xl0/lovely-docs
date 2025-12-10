## Project Setup

**SvelteKit** (recommended): `npx sv create myapp && npm run dev`

**Vite**: `npm create vite@latest` with svelte option, generates to `dist/`, requires separate routing.

**Other tools**: Rollup/Webpack plugins available but Vite preferred. Both support standalone SPA mode.

**Editor support**: VS Code extension by Svelte team, command-line checking via `sv check`.

## .svelte File Structure

Components use HTML superset with optional sections:

```svelte
<script module>
	// runs once at module evaluation
	let total = 0;
</script>

<script>
	// runs per component instance
	total += 1;
</script>

<!-- markup -->

<style>
	/* scoped CSS only */
	p { color: burlywood; }
</style>
```

**`<script>`**: JS/TS (add `lang="ts"`), runs on instance creation. Top-level variables accessible in markup. Use runes for props/reactivity.

**`<script module>`**: Runs once, not per instance. Variables accessible in component. Can export bindings (not `export default`). Legacy Svelte 4 used `context="module"`.

**`<style>`**: Component-scoped CSS only.

## .svelte.js/.svelte.ts Files

Module files supporting runes for reusable reactive logic and shared state. Function like standard modules with Svelte reactivity. Restriction: reassigned state cannot be exported across modules. Introduced in Svelte 5.

## Runes Overview

`$`-prefixed compiler keywords (not functions) controlling reactivity in `.svelte` and `.svelte.js`/`.svelte.ts` files. Cannot be imported, assigned, or passed as arguments.

### $state - Reactive State

```js
let count = $state(0);
let todos = $state([{ done: false, text: 'add todos' }]);
todos[0].done = !todos[0].done; // triggers updates
```

Objects/arrays become deeply reactive proxies. Destructuring breaks reactivity. Class instances not proxied; use `$state` in class fields.

`$state.raw`: non-mutating state, only reassignable (better performance for large objects):
```js
let person = $state.raw({ name: 'Heraclitus', age: 49 });
person = { name: 'Heraclitus', age: 50 }; // works
person.age += 1; // no effect
```

`$state.snapshot`: static snapshot of reactive proxy for external libraries.

Pass-by-value: passing `$state` values passes current values, not reactive references. Pass objects and mutate properties, or pass functions for reactive updates. State in `.svelte.js`/`.svelte.ts` cannot be exported if reassigned; export objects with mutable properties or functions accessing state instead.

### $derived - Computed Reactive Values

```js
let count = $state(0);
let doubled = $derived(count * 2);

let numbers = $state([1, 2, 3]);
let total = $derived.by(() => {
	let sum = 0;
	for (const n of numbers) sum += n;
	return sum;
});
```

Automatically updates when dependencies change. Expression must be side-effect free. Anything read synchronously is a dependency. Marked dirty on dependency change, recalculated on next read. Use `untrack` to exempt state from being a dependency.

Can be temporarily reassigned (unless `const`) for optimistic UI. Unlike `$state`, not deeply reactive proxies, but if returning object/array from reactive source, mutating properties affects underlying source.

Push-pull reactivity: state changes immediately notify dependents (push), derived values only re-evaluate when read (pull). If new value referentially identical to previous, downstream updates skipped.

### $effect - Side Effects

```js
let size = $state(50);
let color = $state('#ff3e00');
let canvas;

$effect(() => {
	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = color;
	context.fillRect(0, 0, size, size);
});
```

Runs when reactive state changes, automatically tracking synchronously-read values. Browser-only, not during SSR. Generally avoid updating state inside effects (infinite loops).

Run after component mount and in microtask after state changes. Reruns batched. Can return teardown function running before reruns, on destruction, or when parent effect reruns.

Automatically picks up reactive values read synchronously. Values read asynchronously (after await, setTimeout) NOT tracked. Only reruns when object itself changes, not properties inside. Dependencies conditional based on code paths in last run.

`$effect.pre`: runs before DOM updates.

`$effect.tracking()`: returns true if running in tracking context (effect or template), false otherwise.

`$effect.root`: creates non-tracked scope with manual cleanup for nested effects outside component initialization.

Don't use effects to synchronize state—use `$derived`. Don't use effects to link values—use `$derived` with function bindings.

### $props - Component Input

```js
let { adjective = 'happy', super: trouper = 'lights', ...others } = $props();
```

Supports fallback values, renaming (for keywords), rest capture. Props update reactively. Child can temporarily reassign but shouldn't mutate regular object props. Use callback props or `$bindable` for two-way communication.

Type annotations for IDE support:
```ts
let { adjective }: { adjective: string } = $props();
```

`$props.id()`: generates unique ID per instance (consistent during hydration), useful for element linking.

### $bindable - Bidirectional Props

```svelte
// Child
let { value = $bindable() } = $props();
<input bind:value={value} />

// Parent
let message = $state('hello');
<FancyInput bind:value={message} />
```

Marks prop as bindable for bidirectional data flow. Allows state proxies to be mutated in child. Parent doesn't require `bind:`—can pass normal prop. Fallback values supported.

### $inspect - Development Logging

```js
let count = $state(0);
$inspect(count).with((type, count) => {
	if (type === 'update') debugger;
});
```

Development-only, logs values on change, tracking reactive state deeply. Re-fires on nested object/array property updates. `$inspect(...).with()` accepts callback receiving `type` ("init" or "update"). Pass `console.trace` to find change origin.

`$inspect.trace()` (5.14+): traces surrounding function in development, printing which reactive state caused effect/derived to re-run. Must be first statement in function body.

### $host - Custom Element Host

```svelte
<svelte:options customElement="my-stepper" />

<script>
	function dispatch(type) {
		$host().dispatchEvent(new CustomEvent(type));
	}
</script>

<button onclick={() => dispatch('increment')}>increment</button>
```

Provides access to host element when compiling as custom element, allowing custom event dispatch.