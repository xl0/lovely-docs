

## Pages

### legacy-overview
Overview of deprecated Svelte 3/4 features in Svelte 5 and how legacy mode works alongside runes mode.

Svelte 5 deprecated Svelte 3/4 features in favor of runes and snippets. Legacy mode features work in Svelte 5 until a component opts into runes mode with `runes: true` or by using runes.

### reactive-let-var-declarations
Legacy mode makes top-level variables reactive via assignments; mutations alone don't trigger updates without reassignment.

## Reactive let/var in legacy mode

Top-level variables are automatically reactive. Reactivity is assignment-based, so mutations like `.push()` require a reassignment to trigger updates:

```svelte
let numbers = [1, 2, 3, 4];
numbers.push(5); // no update
numbers = numbers; // triggers update
```

### reactive-assignments-with-$:-statements
Legacy Svelte reactive statements using $: prefix run when dependencies change and are topologically ordered by their references.

## Reactive $: Statements (Legacy)

Prefix top-level statements with `$:` to make them reactive—they re-run when dependencies change and are topologically ordered.

```svelte
<script>
	let a = 1, b = 2;
	$: sum = a + b;
	$: console.log(`${a} + ${b} = ${sum}`);
</script>
```

**Key points:**
- Dependencies determined at compile time by variable references
- Indirect dependencies won't trigger re-runs
- Statements run during SSR; wrap browser-only code: `$: if (browser) { ... }`

### export-let
Legacy mode component props are declared with export let, with optional defaults and renaming support.

## Props in Legacy Mode

Declare props with `export let`:

```svelte
<script>
	export let foo;
	export let bar = 'default value';
</script>
```

Props without defaults are required. Set `undefined` as default to suppress warnings.

## Component Exports

Export functions/classes as public API:

```svelte
<script>
	export function greet(name) {
		alert(`hello ${name}!`);
	}
</script>
```

## Renaming Props

```svelte
<script>
	let className;
	export { className as class };
</script>
```

### $$props-and-$$restprops
Legacy mode variables for accessing all component props or all undeclared props.

## $$props and $$restProps

- **`$$props`**: All props passed to component
- **`$$restProps`**: All props except those declared with `export`

```svelte
<script>
	export let variant;
</script>

<button {...$$restProps} class="variant-{variant} {$$props.class ?? ''}">
	click me
</button>
```

Note: Modest performance penalty in Svelte 3/4, use only when needed.

### legacy-event-handlers
Legacy mode event handling with the on: directive, modifiers, event forwarding, and component event dispatching.

## Event Handlers

Attach handlers with `on:` directive:
```svelte
<button on:click={handleClick}>click me</button>
<button on:click={() => count++}>inline</button>
```

## Modifiers

Chain modifiers with `|`:
```svelte
<form on:submit|preventDefault|once={handle}></form>
```

Available: `preventDefault`, `stopPropagation`, `stopImmediatePropagation`, `passive`, `nonpassive`, `capture`, `once`, `self`, `trusted`

## Event Forwarding

```svelte
<button on:click>forward event</button>
```

## Component Events

```svelte
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>
<button on:click={() => dispatch('increment')}>+</button>
```

Listen on component: `<Stepper on:increment={() => n++} />`

Only `once` modifier works on component events. For Svelte 5, use callback props instead.

### legacy-slots
Legacy mode component content passing and rendering using slots with support for named slots, fallback content, and bidirectional data binding.

## Legacy Slots

Render slotted content with `<slot>`. Named slots use `slot="name"` attribute. Provide fallback content inside `<slot>` tags. Pass data to slots with props and expose to parent using `let:` directive on both default and named slots.

### $$slots
$$slots is a legacy mode object that indicates which named slots were provided to a component by its parent.

Use `$$slots` object in legacy mode to check if a named slot was provided. Keys are slot names passed by parent.

```svelte
{#if $$slots.description}
	<slot name="description" />
{/if}
```

### svelte:fragment
Legacy element for placing content in named slots without a wrapping DOM element.

`<svelte:fragment>` places content in named slots without a wrapping DOM element. Use it to preserve flow layout when filling multiple slots.

```svelte
<svelte:fragment slot="footer">
	<p>All rights reserved.</p>
	<p>Copyright (c) 2019 Svelte Industries</p>
</svelte:fragment>
```

**Legacy:** Obsolete in Svelte 5+ (snippets don't wrap).

### svelte:component
Legacy mode requires <svelte:component> to dynamically render components that change at runtime.

In legacy mode, use `<svelte:component this={MyComponent} />` to re-render when the component value changes. If `this` is falsy, nothing renders.

### imperative-component-api
Svelte 3/4 imperative API for instantiating components, updating props, listening to events, and server-side rendering.

## Creating Components

```ts
const app = new App({
	target: document.body,
	props: { answer: 42 },
	hydrate: false,
	intro: false
});
```

## Instance Methods

- `$set(props)` - update props (async)
- `$on(event, callback)` - listen to events
- `$destroy()` - cleanup

## Props with Accessors

With `accessors: true`, props are synchronously settable:
```ts
component.count += 1;
```

## Server-side Rendering

```ts
const { head, html, css } = App.render({ answer: 42 });
```

**Note:** Svelte 5+ uses different APIs (`mount`, `unmount`, `$state`).

### legacy-apis
Overview of deprecated and legacy APIs in Svelte with guidance on modern replacements.

Documentation of legacy APIs maintained for backward compatibility in Svelte. Check here for deprecated features and their modern alternatives.

