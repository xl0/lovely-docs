

## Pages

### what-are-runes
Runes are `$`-prefixed compiler keywords (not functions) that control Svelte compilation in `.svelte` and `.svelte.js`/`.svelte.ts` files; introduced in Svelte 5.

Runes are compiler-controlled symbols with `$` prefix that form part of Svelte's syntax, functioning as keywords. They control the Svelte compiler in `.svelte` and `.svelte.js`/`.svelte.ts` files.

Key characteristics:
- Look like functions: `let message = $state('hello');`
- Don't require imports — built into the language
- Not values — cannot be assigned to variables or passed as function arguments
- Only valid in specific positions (compiler validates placement)
- Introduced in Svelte 5

### $state
$state rune creates reactive state; objects/arrays become deep proxies; $state.raw for non-mutating state; $state.snapshot for static snapshots; pass-by-value semantics; can't export directly reassigned state across modules.

## Creating Reactive State

The `$state` rune creates reactive state that updates the UI when changed. Unlike other frameworks, state is just a regular value:

```svelte
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>
	clicks: {count}
</button>
```

## Deep Reactivity with Objects and Arrays

When `$state` is used with arrays or plain objects, it creates a deeply reactive proxy. Svelte recursively proxifies until it encounters non-plain objects (classes, `Object.create` results):

```js
let todos = $state([
	{ done: false, text: 'add more todos' }
]);

todos[0].done = !todos[0].done; // triggers updates
todos.push({ done: false, text: 'eat lunch' }); // new objects are also proxified
```

Destructuring breaks reactivity since values are evaluated at destructuring time:

```js
let { done, text } = todos[0];
todos[0].done = !todos[0].done; // doesn't update `done`
```

## Classes

Class instances are not proxied. Use `$state` in class fields or as first assignment in constructor:

```js
class Todo {
	done = $state(false);

	constructor(text) {
		this.text = $state(text);
	}

	reset = () => {
		this.text = '';
		this.done = false;
	}
}
```

Note: `this` binding matters. Use arrow functions or inline functions in event handlers to preserve context.

## `$state.raw`

For non-mutating state, use `$state.raw`. It cannot be mutated via property assignment or array methods—only reassigned:

```js
let person = $state.raw({ name: 'Heraclitus', age: 49 });

person.age += 1; // no effect
person = { name: 'Heraclitus', age: 50 }; // works
```

Improves performance with large arrays/objects you don't plan to mutate. Raw state can contain reactive state.

## `$state.snapshot`

Take a static snapshot of a reactive proxy:

```js
let counter = $state({ count: 0 });
console.log($state.snapshot(counter)); // { count: ... } not Proxy
```

Useful for passing state to external libraries that don't expect proxies.

## Passing State into Functions

JavaScript is pass-by-value. When you pass a `$state` value to a function, the function receives the current value, not a reference that updates:

```js
let a = $state(1);
let b = $state(2);
let total = add(a, b); // passes values 1, 2
a = 3;
console.log(total); // still 3, not updated
```

To get reactive updates, pass functions or use proxy properties/getters:

```js
let input = $state({ a: 1, b: 2 });
let total = add(input);
console.log(total.value); // 3
input.a = 3;
console.log(total.value); // 7 (updated via proxy)
```

## Exporting State Across Modules

State can be declared in `.svelte.js`/`.svelte.ts` files. The Svelte compiler transforms `$state` references into getter/setter calls, so exporting directly reassigned state doesn't work:

```js
// ❌ Won't work - count is transformed, imports see an object not a number
export let count = $state(0);
export function increment() { count += 1; }
```

Two solutions:

1. Export an object and mutate its properties (no reassignment):
```js
export const counter = $state({ count: 0 });
export function increment() { counter.count += 1; }
```

2. Don't export state directly, export functions that access it:
```js
let count = $state(0);
export function getCount() { return count; }
export function increment() { count += 1; }
```

### $derived
$derived creates reactive computed values from dependencies; $derived.by for complex logic; supports temporary overrides; uses push-pull reactivity with deferred re-evaluation and referential equality optimization.

## $derived

Declares derived state that automatically updates when dependencies change. The expression must be side-effect free.

```svelte
let count = $state(0);
let doubled = $derived(count * 2);
```

Can be used on class fields. Without `$derived`, values don't reactively update when dependencies change.

### $derived.by

For complex derivations, use `$derived.by` with a function body:

```svelte
let numbers = $state([1, 2, 3]);
let total = $derived.by(() => {
	let total = 0;
	for (const n of numbers) total += n;
	return total;
});
```

`$derived(expr)` is equivalent to `$derived.by(() => expr)`.

### Dependencies

Anything read synchronously inside the expression is a dependency. When dependencies change, the derived is marked dirty and recalculated on next read. Use `untrack` to exempt state from being a dependency.

### Overriding derived values

Can temporarily reassign derived values (unless declared with `const`) for optimistic UI:

```svelte
let { post, like } = $props();
let likes = $derived(post.likes);

async function onclick() {
	likes += 1;  // immediate feedback
	try {
		await like();
	} catch {
		likes -= 1;  // rollback
	}
}
```

Prior to Svelte 5.25, deriveds were read-only.

### Reactivity behavior

Unlike `$state`, `$derived` values are not converted to deeply reactive proxies. However, if a derived returns an object/array from a reactive source, mutating its properties affects the underlying source:

```svelte
let items = $state([...]);
let index = $state(0);
let selected = $derived(items[index]);
// mutating selected affects items
```

### Update propagation

Uses push-pull reactivity: state changes immediately notify dependents (push), but derived values only re-evaluate when read (pull). If a derived's new value is referentially identical to the previous value, downstream updates are skipped:

```svelte
let count = $state(0);
let large = $derived(count > 10);
// button only updates when large changes, not when count changes
```

### $effect
$effect runs side effects when reactive state changes, auto-tracking synchronously-read values; supports teardown functions, $effect.pre (pre-DOM), $effect.tracking (context check), $effect.root (manual scope); avoid for state sync ($derived) or linking values (function bindings).

## Purpose
Effects run when state updates and are used for side effects like calling third-party libraries, drawing on canvas, or making network requests. They only run in the browser, not during SSR. Generally avoid updating state inside effects as it leads to convoluted code and infinite loops.

## Basic Usage
```svelte
<script>
	let size = $state(50);
	let color = $state('#ff3e00');
	let canvas;

	$effect(() => {
		const context = canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.fillStyle = color;
		context.fillRect(0, 0, size, size);
	});
</script>

<canvas bind:this={canvas} width="100" height="100"></canvas>
```

Svelte automatically tracks which state/derived values are accessed and reruns the effect when they change.

## Lifecycle
- Effects run after component mounts and in a microtask after state changes
- Reruns are batched (multiple state changes in same moment = one rerun)
- Happen after DOM updates are applied
- Can be used anywhere, not just top-level, as long as called while parent effect is running

## Teardown Functions
Effects can return a teardown function that runs:
- Immediately before the effect reruns
- When the component is destroyed
- When the parent effect reruns

```svelte
<script>
	let count = $state(0);
	let milliseconds = $state(1000);

	$effect(() => {
		const interval = setInterval(() => {
			count += 1;
		}, milliseconds);

		return () => clearInterval(interval);
	});
</script>

<h1>{count}</h1>
<button onclick={() => (milliseconds *= 2)}>slower</button>
<button onclick={() => (milliseconds /= 2)}>faster</button>
```

## Dependency Tracking
- Automatically picks up reactive values ($state, $derived, $props) read synchronously in the function body
- Values read asynchronously (after await, inside setTimeout) are NOT tracked
- Only reruns when the object itself changes, not when properties inside it change
- Only depends on values read in the last run (conditional code affects dependencies)

```svelte
<script>
	let state = $state({ value: 0 });
	let derived = $derived({ value: state.value * 2 });

	// runs once - state never reassigned
	$effect(() => { state; });

	// reruns when state.value changes
	$effect(() => { state.value; });

	// reruns when derived changes (new object each time)
	$effect(() => { derived; });
</script>

<button onclick={() => (state.value += 1)}>{state.value}</button>
<p>{state.value} doubled is {derived.value}</p>
```

Async example - canvas repaints on color change but not size change:
```ts
$effect(() => {
	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = color;
	
	setTimeout(() => {
		context.fillRect(0, 0, size, size); // size not tracked
	}, 0);
});
```

Conditional dependencies - if condition is true, color is a dependency; if false, only condition is:
```ts
let condition = $state(true);
let color = $state('#ff3e00');

$effect(() => {
	if (condition) {
		confetti({ colors: [color] });
	} else {
		confetti();
	}
});
```

## $effect.pre
Runs code before DOM updates. Works exactly like $effect otherwise.

```svelte
<script>
	import { tick } from 'svelte';
	let div = $state();
	let messages = $state([]);

	$effect.pre(() => {
		if (!div) return;
		messages.length; // rerun when length changes
		
		if (div.offsetHeight + div.scrollTop > div.scrollHeight - 20) {
			tick().then(() => {
				div.scrollTo(0, div.scrollHeight);
			});
		}
	});
</script>

<div bind:this={div}>
	{#each messages as message}
		<p>{message}</p>
	{/each}
</div>
```

## $effect.tracking
Advanced rune that returns true if code is running inside a tracking context (effect or template), false otherwise. Used to implement abstractions like createSubscriber that only create listeners if values are being tracked.

```svelte
<script>
	console.log('setup:', $effect.tracking()); // false
	$effect(() => {
		console.log('in effect:', $effect.tracking()); // true
	});
</script>

<p>in template: {$effect.tracking()}</p> <!-- true -->
```

## $effect.root
Advanced rune that creates a non-tracked scope without auto-cleanup. Useful for nested effects you want to manually control, and allows creating effects outside component initialization.

```js
const destroy = $effect.root(() => {
	$effect(() => {
		// setup
	});

	return () => {
		// cleanup
	};
});

destroy(); // later
```

## When NOT to Use $effect
Don't use effects to synchronize state. Instead of:
```svelte
<script>
	let count = $state(0);
	let doubled = $state();
	$effect(() => { doubled = count * 2; }); // bad
</script>
```

Use $derived:
```svelte
<script>
	let count = $state(0);
	let doubled = $derived(count * 2); // good
</script>
```

For complex expressions, use $derived.by. Deriveds can be directly overridden as of Svelte 5.25.

Don't use effects to link values together. Instead of two effects updating each other:
```svelte
<script>
	const total = 100;
	let spent = $state(0);
	let left = $state(total);

	$effect(() => { left = total - spent; }); // bad
	$effect(() => { spent = total - left; }); // bad
</script>
```

Use $derived with function bindings:
```svelte
<script>
	const total = 100;
	let spent = $state(0);
	let left = $derived(total - spent);

	function updateLeft(newLeft) {
		spent = total - newLeft;
	}
</script>

<input bind:value={() => left, updateLeft} max={total} />
```

If you must update $state in an effect and hit infinite loops from reading/writing the same state, use untrack.

### $props
Component input mechanism using `$props()` rune with destructuring, defaults, renaming, rest capture, reactivity, type annotations, and instance ID generation.

## Overview
Props are component inputs, passed like element attributes. Receive them using the `$props()` rune.

## Basic Usage
```svelte
// Parent
<MyComponent adjective="cool" />

// Child - receive all props
let props = $props();

// Child - destructure props (common pattern)
let { adjective } = $props();
```

## Fallback Values
Provide defaults for props not set by parent or when undefined:
```js
let { adjective = 'happy' } = $props();
```
Fallback values are not reactive state proxies.

## Renaming Props
Rename props using destructuring (useful for invalid identifiers or keywords):
```js
let { super: trouper = 'lights are gonna find me' } = $props();
```

## Rest Props
Capture remaining props:
```js
let { a, b, c, ...others } = $props();
```

## Updating Props
Props update reactively when parent changes them. Child can temporarily reassign but should not mutate:
```svelte
// Parent
let count = $state(0);
<Child {count} />

// Child - reassignment works
let { count } = $props();
<button onclick={() => (count += 1)}>clicks: {count}</button>
```

Mutation behavior:
- Regular object props: mutations have no effect
- Reactive state proxy props: mutations work but trigger `ownership_invalid_mutation` warning (don't do this)
- Fallback value props: mutations have no effect

Use callback props or `$bindable` rune for proper two-way communication.

## Type Safety
Add type annotations for better IDE support and documentation:

TypeScript:
```svelte
<script lang="ts">
	let { adjective }: { adjective: string } = $props();
	
	interface Props {
		adjective: string;
	}
	let { adjective }: Props = $props();
</script>
```

JSDoc:
```svelte
<script>
	/** @type {{ adjective: string }} */
	let { adjective } = $props();
</script>
```

## `$props.id()`
Generates unique ID per component instance (consistent during hydration). Useful for linking elements:
```svelte
const uid = $props.id();
<label for="{uid}-firstname">First Name:</label>
<input id="{uid}-firstname" type="text" />
```

### bindable
$bindable rune enables bidirectional prop binding; child marks prop with $bindable(), parent uses bind: directive to establish two-way data flow; allows child mutation of state proxies; supports fallback values.

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

### $inspect
$inspect logs on reactive changes (dev-only); .with() customizes logging; .trace() shows what state triggered effects.

## $inspect

Development-only rune that logs values whenever they change, tracking reactive state deeply. Re-fires when nested object/array properties update via fine-grained reactivity.

```svelte
<script>
	let count = $state(0);
	let message = $state('hello');
	$inspect(count, message); // logs when either changes
</script>
<button onclick={() => count++}>Increment</button>
<input bind:value={message} />
```

### $inspect(...).with

Returns a `with` property accepting a callback invoked instead of `console.log`. Callback receives `type` ("init" or "update") as first argument, then the inspected values:

```svelte
<script>
	let count = $state(0);
	$inspect(count).with((type, count) => {
		if (type === 'update') debugger;
	});
</script>
<button onclick={() => count++}>Increment</button>
```

Pass `console.trace` to find the origin of changes:
```js
$inspect(stuff).with(console.trace);
```

### $inspect.trace()

Added in 5.14. Traces the surrounding function in development, printing to console which reactive state caused an effect or derived to re-run. Must be the first statement in a function body:

```svelte
<script>
	import { doSomeWork } from './elsewhere';
	$effect(() => {
		$inspect.trace();
		doSomeWork();
	});
</script>
```

Takes optional first argument as label.

### $host
$host rune returns the host element in custom element components for dispatching custom events

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

