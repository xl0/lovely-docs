## Reactive Variables

Top-level variables are automatically reactive. Mutations require reassignment to trigger updates:
```svelte
let numbers = [1, 2, 3];
numbers.push(4); // no update
numbers = numbers; // triggers update
```

## Reactive Statements

Prefix statements with `$:` to make them reactive—they re-run when dependencies change and are topologically ordered:
```svelte
let a = 1, b = 2;
$: sum = a + b;
$: console.log(`${a} + ${b} = ${sum}`);
```

Dependencies are determined at compile time. Wrap browser-only code: `$: if (browser) { ... }`

## Props

Declare props with `export let`:
```svelte
export let foo;
export let bar = 'default value';
```

Rename props: `export { className as class };`

Access all props with `$$props` or undeclared props with `$$restProps`:
```svelte
<button {...$$restProps} class="variant-{$$props.class ?? ''}">click me</button>
```

## Event Handlers

Attach handlers with `on:` directive and chain modifiers with `|`:
```svelte
<button on:click={handleClick}>click me</button>
<form on:submit|preventDefault|once={handle}></form>
```

Available modifiers: `preventDefault`, `stopPropagation`, `stopImmediatePropagation`, `passive`, `nonpassive`, `capture`, `once`, `self`, `trusted`

Forward events: `<button on:click>forward event</button>`

Dispatch component events:
```svelte
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
dispatch('increment');
```

Only `once` modifier works on component events.

## Slots

Render slotted content with `<slot>`. Named slots use `slot="name"` attribute. Provide fallback content inside `<slot>` tags. Pass data to slots with props and expose to parent using `let:` directive.

Check if a named slot was provided with `$$slots`:
```svelte
{#if $$slots.description}
	<slot name="description" />
{/if}
```

Use `<svelte:fragment slot="name">` to place content in named slots without a wrapping DOM element.

## Dynamic Components

Use `<svelte:component this={MyComponent} />` to dynamically render components that change at runtime.

## Imperative API

Create components with:
```ts
const app = new App({
	target: document.body,
	props: { answer: 42 },
	hydrate: false,
	intro: false
});
```

Instance methods: `$set(props)`, `$on(event, callback)`, `$destroy()`

With `accessors: true`, props are synchronously settable: `component.count += 1;`

Server-side rendering: `const { head, html, css } = App.render({ answer: 42 });`