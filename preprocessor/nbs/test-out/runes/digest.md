## Runes Overview

Runes are `$`-prefixed compiler keywords (not functions) that control Svelte compilation in `.svelte` and `.svelte.js`/`.svelte.ts` files. Introduced in Svelte 5, they look like function calls but are built-in language constructs that cannot be imported, assigned to variables, or passed as arguments.

## $state - Reactive State

Creates reactive state that updates the UI when changed. Objects and arrays become deeply reactive proxies:

```js
let count = $state(0);
let todos = $state([{ done: false, text: 'add todos' }]);
todos[0].done = !todos[0].done; // triggers updates
todos.push({ done: false, text: 'eat lunch' }); // new objects proxified
```

Destructuring breaks reactivity since values are evaluated at destructuring time. Class instances are not proxied; use `$state` in class fields instead.

`$state.raw` creates non-mutating state that can only be reassigned, not mutated via property assignment. Improves performance with large objects you don't plan to mutate:

```js
let person = $state.raw({ name: 'Heraclitus', age: 49 });
person.age += 1; // no effect
person = { name: 'Heraclitus', age: 50 }; // works
```

`$state.snapshot` takes a static snapshot of a reactive proxy for passing to external libraries that don't expect proxies.

JavaScript is pass-by-value: passing `$state` values to functions passes current values, not reactive references. To get reactive updates, pass objects and mutate properties, or pass functions. State declared in `.svelte.js`/`.svelte.ts` files cannot be exported directly if reassigned; instead export objects with mutable properties or export functions that access the state.

## $derived - Computed Reactive Values

Declares derived state that automatically updates when dependencies change. The expression must be side-effect free:

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

Anything read synchronously in the expression is a dependency. When dependencies change, the derived is marked dirty and recalculated on next read. Use `untrack` to exempt state from being a dependency.

Derived values can be temporarily reassigned (unless declared with `const`) for optimistic UI updates. Unlike `$state`, deriveds are not converted to deeply reactive proxies, but if a derived returns an object/array from a reactive source, mutating its properties affects the underlying source.

Uses push-pull reactivity: state changes immediately notify dependents (push), but derived values only re-evaluate when read (pull). If a derived's new value is referentially identical to the previous value, downstream updates are skipped.

## $effect - Side Effects

Runs side effects when reactive state changes, automatically tracking synchronously-read values. Only runs in the browser, not during SSR. Generally avoid updating state inside effects as it leads to infinite loops:

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

Effects run after component mounts and in a microtask after state changes. Reruns are batched (multiple state changes = one rerun). Effects can return a teardown function that runs before the effect reruns, when the component is destroyed, or when the parent effect reruns.

Automatically picks up reactive values read synchronously in the function body. Values read asynchronously (after await, inside setTimeout) are NOT tracked. Only reruns when the object itself changes, not when properties inside it change. Dependencies are conditional based on code paths taken in the last run.

`$effect.pre` runs code before DOM updates. `$effect.tracking()` returns true if code is running inside a tracking context (effect or template), false otherwise. `$effect.root` creates a non-tracked scope without auto-cleanup, useful for nested effects you want to manually control.

Don't use effects to synchronize state—use `$derived` instead. Don't use effects to link values together—use `$derived` with function bindings.

## $props - Component Input

Receive component inputs using the `$props()` rune:

```js
let { adjective = 'happy', super: trouper = 'lights', ...others } = $props();
```

Supports fallback values, renaming props (useful for keywords), and rest capture. Props update reactively when parent changes them. Child can temporarily reassign but should not mutate regular object props (mutations have no effect). Use callback props or `$bindable` rune for proper two-way communication.

Add type annotations for IDE support:

```ts
let { adjective }: { adjective: string } = $props();
```

`$props.id()` generates a unique ID per component instance (consistent during hydration), useful for linking elements.

## $bindable - Bidirectional Props

Marks a component prop as bindable, enabling bidirectional data flow between parent and child:

```svelte
// Child
let { value = $bindable() } = $props();
<input bind:value={value} />

// Parent
let message = $state('hello');
<FancyInput bind:value={message} />
```

Allows state proxies to be mutated in the child component. Parent components don't have to use `bind:`—they can pass a normal prop instead. Fallback values can be specified for when no prop is passed.

## $inspect - Development Logging

Development-only rune that logs values whenever they change, tracking reactive state deeply:

```js
let count = $state(0);
$inspect(count).with((type, count) => {
	if (type === 'update') debugger;
});
```

Re-fires when nested object/array properties update via fine-grained reactivity. `$inspect(...).with()` accepts a callback invoked instead of `console.log`, receiving `type` ("init" or "update") as first argument. Pass `console.trace` to find the origin of changes.

`$inspect.trace()` (added in 5.14) traces the surrounding function in development, printing which reactive state caused an effect or derived to re-run. Must be the first statement in a function body.

## $host - Custom Element Host

Provides access to the host element when compiling a component as a custom element, allowing dispatch of custom events:

```svelte
<svelte:options customElement="my-stepper" />

<script>
	function dispatch(type) {
		$host().dispatchEvent(new CustomEvent(type));
	}
</script>

<button onclick={() => dispatch('increment')}>increment</button>
```