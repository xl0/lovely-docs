
## Directories

### introduction
Getting started with Svelte: project setup options, .svelte component file structure with script/style sections, and reactive module files.

## Project Setup

**SvelteKit (Recommended)**: Official way to start new projects.
```bash
npx sv create myapp
cd myapp
npm install
npm run dev
```

**Vite**: Use `npm create vite@latest` and select svelte option. Generates HTML, JS, CSS in `dist` directory via vite-plugin-svelte. Requires separate routing library.

**Other tools**: Rollup and Webpack plugins exist but Vite is recommended. Both Vite and SvelteKit support standalone SPA mode.

**Editor Support**: VS Code extension maintained by Svelte team, integrations for other editors, command-line checking via `sv check`.

**Getting Help**: Discord chatroom, Stack Overflow (tag: svelte).

## .svelte File Structure

Components are written in `.svelte` files using HTML superset. All sections optional:

```svelte
<script module>
	// module-level logic (runs once when module evaluates)
	let total = 0;
</script>

<script>
	// instance-level logic (runs per component instance)
	total += 1;
	console.log(`instantiated ${total} times`);
</script>

<!-- markup -->

<style>
	/* scoped CSS - only affects this component */
	p { color: burlywood; }
</style>
```

**`<script>`**: Contains JS/TS (add `lang="ts"`). Runs when component instance created. Top-level variables referenced in markup. Use runes for props and reactivity.

**`<script module>`**: Runs once at module evaluation, not per instance. Variables accessible in component but not vice versa. Can export bindings (not `export default` - that's the component). TypeScript: VS Code extension and IntelliJ plugin recognize module exports; other editors may need TypeScript plugin. Legacy Svelte 4 used `<script context="module">`.

**`<style>`**: CSS scoped to component only.

## .svelte.js/.svelte.ts Files

Module files supporting runes for reusable reactive logic and shared reactive state. Function like standard .js/.ts modules with Svelte reactive features. Restriction: reassigned state cannot be exported across modules. Introduced in Svelte 5.

### runes
Compiler keywords controlling reactivity: state creation ($state), computed values ($derived), side effects ($effect), component inputs ($props, $bindable), debugging ($inspect), and custom elements ($host).

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



## Pages

### effect
$effect runs functions when state updates with automatic dependency tracking; use for side effects like DOM manipulation, not state synchronization (use $derived instead).

## $effect

Effects are functions that run when state updates. They only run in the browser, not during server-side rendering. Generally avoid updating state inside effects as it leads to convoluted code and infinite loops.

### Basic Usage

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

Svelte tracks which state is accessed in the effect and re-runs it when that state changes.

### Lifecycle

Effects run after component mount and in a microtask after state changes. Re-runs are batched. Effects can return a teardown function that runs before re-runs and on component destruction:

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

### Understanding Dependencies

Effects automatically track reactive values ($state, $derived, $props) read synchronously. Asynchronously read values (after await or setTimeout) are not tracked:

```ts
$effect(() => {
    context.fillStyle = color; // tracked
    setTimeout(() => {
        context.fillRect(0, 0, size, size); // size not tracked
    }, 0);
});
```

Effects only re-run when the object itself changes, not when properties inside it change:

```svelte
<script>
    let state = $state({ value: 0 });
    let derived = $derived({ value: state.value * 2 });

    $effect(() => {
        state; // runs once, state never reassigned
    });

    $effect(() => {
        state.value; // runs when state.value changes
    });

    $effect(() => {
        derived; // runs each time (new object)
    });
</script>

<button onclick={() => (state.value += 1)}>{state.value}</button>
<p>{state.value} doubled is {derived.value}</p>
```

Effects only depend on values read in the last run. Conditional code affects dependencies:

```ts
let condition = $state(true);
let color = $state('#ff3e00');

$effect(() => {
    if (condition) {
        confetti({ colors: [color] }); // color is dependency
    } else {
        confetti(); // color not a dependency here
    }
});
```

### $effect.pre

Runs code before DOM updates:

```svelte
<script>
    import { tick } from 'svelte';
    let div = $state();
    let messages = $state([]);

    $effect.pre(() => {
        if (!div) return;
        messages.length; // reference to re-run on changes
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

### $effect.tracking

Returns whether code is running in a tracking context (effect or template):

```svelte
<script>
    console.log('setup:', $effect.tracking()); // false
    $effect(() => {
        console.log('in effect:', $effect.tracking()); // true
    });
</script>

<p>in template: {$effect.tracking()}</p> <!-- true -->
```

Used to implement abstractions that only track when values are being tracked.

### $effect.root

Creates a non-tracked scope with manual cleanup, useful for nested effects outside component initialization:

```js
const destroy = $effect.root(() => {
    $effect(() => {
        // setup
    });
    return () => {
        // cleanup
    };
});

destroy();
```

### When Not to Use $effect

Don't use effects to synchronize state. Instead of:

```svelte
<script>
    let count = $state(0);
    let doubled = $state();
    $effect(() => {
        doubled = count * 2;
    });
</script>
```

Use $derived:

```svelte
<script>
    let count = $state(0);
    let doubled = $derived(count * 2);
</script>
```

For complex expressions, use $derived.by. Deriveds can be directly overridden as of Svelte 5.25.

Don't use effects to link values. Instead of effects, use oninput callbacks or function bindings:

```svelte
<script>
    const total = 100;
    let spent = $state(0);
    let left = $derived(total - spent);

    function updateLeft(value) {
        spent = total - value;
    }
</script>

<label>
    <input type="range" bind:value={spent} max={total} />
    {spent}/{total} spent
</label>

<label>
    <input type="range" bind:value={() => left, updateLeft} max={total} />
    {left}/{total} left
</label>
```

If you must update $state in an effect and hit infinite loops, use untrack.

