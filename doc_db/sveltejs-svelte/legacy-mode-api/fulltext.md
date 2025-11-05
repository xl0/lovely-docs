

## Pages

### reactive-let∕var-declarations
Legacy mode automatically makes top-level variables reactive through assignment-based tracking, requiring explicit reassignment for mutations to trigger updates.

In legacy mode, top-level variables are automatically reactive. Reactivity is assignment-based, so array mutations need a subsequent assignment to trigger updates:

```svelte
let numbers = [1, 2, 3, 4];
numbers.push(5); // no update
numbers = numbers; // triggers update
```

### reactive-statements
Legacy Svelte reactive statements using $: prefix run when dependencies change, with compile-time dependency tracking and topological ordering.

## Reactive $: Statements (Legacy)

Prefix top-level statements with `$:` to make them reactive. They re-run when dependencies change, ordered topologically.

```svelte
$: sum = a + b;
$: console.log(sum);
```

Dependencies are compile-time static analysis only—indirect references don't work. For browser-only code, wrap in `if (browser)` since these run during SSR.

### export-let
Legacy mode component props are declared with the export keyword, with optional defaults and the ability to rename them.

## Props in Legacy Mode

Declare props with `export` keyword, optionally with defaults:

```svelte
export let foo;
export let bar = 'default value';
```

## Component Exports

Export functions/classes as public API (not props):

```svelte
export function greet(name) { ... }
```

## Renaming Props

```svelte
let className;
export { className as class };
```

### $$props-and-$$restprops
Legacy mode utilities for accessing all component props or filtering out declared ones.

## $$props and $$restProps (Legacy)

- **`$$props`**: All props passed to component
- **`$$restProps`**: All props except declared exports

```svelte
<script>
	export let variant;
</script>
<button {...$$restProps} class="variant-{variant}">click me</button>
```

Use only when needed due to performance penalty.

### event-handlers-and-dispatchers
Legacy mode event handling with the on: directive, modifiers, event forwarding, and component event dispatching.

## Event Handlers

Use `on:` directive: `<button on:click={handleClick}>`. Inline handlers have no penalty.

### Modifiers

Chain with `|`: `on:click|once|capture={...}`

Available: `preventDefault`, `stopPropagation`, `stopImmediatePropagation`, `passive`, `nonpassive`, `capture`, `once`, `self`, `trusted`

### Event Forwarding

`<button on:click>` forwards the event to parent.

### Multiple Listeners

```svelte
<button on:click={increment} on:click={log}>clicks: {count}</button>
```

## Component Events

```svelte
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

<button on:click={() => dispatch('decrement')}>decrement</button>
```

Listen: `<Stepper on:decrement={() => n -= 1} on:increment={() => n += 1} />`

Events don't bubble. For Svelte 5, use callback props instead of `createEventDispatcher`.

### legacy-slots
Legacy mode slot syntax for passing and rendering content in Svelte components, including default/named slots, fallback content, and bidirectional data passing.

## Default Slots

```svelte
<Modal>This is slotted content</Modal>
<!-- renders with -->
<slot></slot>
```

## Named Slots

```svelte
<Modal>
  <div slot="buttons"><button>close</button></div>
</Modal>
<!-- renders with -->
<slot name="buttons"></slot>
```

## Fallback Content

```svelte
<slot>Default content if nothing provided</slot>
```

## Passing Data to Slots

```svelte
<!-- Component -->
<slot item={process(data)} />

<!-- Parent -->
<FancyList let:item={processed}>
  <div>{processed.text}</div>
</FancyList>
```

For named slots, use `let:` on the element with `slot` attribute.


### $$slots
$$slots is a legacy mode object that indicates which named slots were provided to a component, enabling conditional rendering.

Use `$$slots` object in legacy mode to check which named slots were provided. Keys are slot names. Enables conditional rendering of optional slots:

```svelte
{#if $$slots.description}
	<slot name="description" />
{/if}
```

### svelte:fragment
Use <svelte:fragment> to fill named slots without adding a wrapper DOM element.

`<svelte:fragment>` places content in named slots without a wrapping DOM element. Use it to preserve flow layout when filling multiple slot elements.

```svelte
<svelte:fragment slot="footer">
	<p>All rights reserved.</p>
	<p>Copyright (c) 2019 Svelte Industries</p>
</svelte:fragment>
```

(Obsolete in Svelte 5+)

### svelte:component
Legacy mode syntax for dynamically rendering components with instance recreation on value changes.

`<svelte:component this={MyComponent} />` dynamically renders components in legacy mode, destroying and recreating the instance when `this` changes. In runes mode, use `<MyComponent>` directly instead.

### svelte:self
Legacy element for recursive component self-reference, now superseded by direct self-imports.

`<svelte:self>` allows recursive component inclusion within conditional blocks to prevent infinite loops. This is a legacy feature; components can now import themselves directly.

### imperative-component-api
Svelte 3/4 imperative component API for instantiation, prop updates, event handling, and server-side rendering.

## Creating Components

```ts
const app = new App({
	target: document.body,
	props: { answer: 42 },
	hydrate: false,
	intro: false
});
```

## Methods

- `$set(props)` - Update props asynchronously
- `$on(event, callback)` - Listen to events
- `$destroy()` - Remove component

## Props Access

With `accessors: true`, props are synchronous getters/setters:
```ts
component.count += 1;
```

## Server-side Rendering

```ts
const { head, html, css } = App.render({ answer: 42 });
```

**Svelte 3/4 API** — Svelte 5 uses `mount()`, `unmount()`, and `$state`.

