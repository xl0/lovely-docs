## Reactive Variables & Statements

Top-level variables are reactive; mutations require reassignment. Prefix statements with `$:` to make them reactive:
```svelte
let count = 0;
count++; // no update
count = count; // triggers update
$: doubled = count * 2;
```

## Props & Events

Declare props with `export let`. Dispatch events with `createEventDispatcher()`. Use `on:` directive with modifiers:
```svelte
export let foo = 'default';
<button on:click|preventDefault={handler}>click</button>
```

## Slots & Dynamic Components

Use `<slot>` for content, `$$slots` to check if provided, `<svelte:fragment>` for wrapper-free slots, and `<svelte:component this={Comp} />` for dynamic rendering.

## Imperative API

Create components with `new App({ target, props })`. Instance methods: `$set()`, `$on()`, `$destroy()`. Server-side render with `App.render()`.