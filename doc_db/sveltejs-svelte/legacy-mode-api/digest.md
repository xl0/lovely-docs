## Reactivity

Top-level variables are automatically reactive in legacy mode. Reactivity is assignment-based—array mutations require reassignment to trigger updates:

```svelte
let numbers = [1, 2, 3];
numbers.push(4); // no update
numbers = numbers; // triggers update
```

Reactive statements use `$:` prefix and re-run when dependencies change:

```svelte
$: sum = a + b;
$: console.log(sum);
```

Dependencies are determined by compile-time static analysis only.

## Component API

Props are declared with `export` keyword:

```svelte
export let foo;
export let bar = 'default value';
export { className as class }; // renaming
```

Access all props with `$$props` or all non-declared props with `$$restProps`:

```svelte
<button {...$$restProps} class="variant-{variant}">click me</button>
```

Check which named slots were provided using `$$slots`:

```svelte
{#if $$slots.description}
  <slot name="description" />
{/if}
```

## Slots

Default and named slots with fallback content:

```svelte
<slot></slot>
<slot name="buttons">Default button</slot>
```

Pass data to slots:

```svelte
<!-- Component -->
<slot item={process(data)} />

<!-- Parent -->
<FancyList let:item={processed}>
  <div>{processed.text}</div>
</FancyList>
```

Use `<svelte:fragment slot="name">` to fill named slots without a wrapper element.

## Events

Event handlers use `on:` directive with optional modifiers:

```svelte
<button on:click|once|preventDefault={handleClick}>click</button>
```

Available modifiers: `preventDefault`, `stopPropagation`, `stopImmediatePropagation`, `passive`, `nonpassive`, `capture`, `once`, `self`, `trusted`

Forward events with `<button on:click>`.

Dispatch component events:

```svelte
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
dispatch('decrement');
```

## Dynamic Components

Render components dynamically with `<svelte:component this={MyComponent} />`, which recreates the instance when `this` changes.

Use `<svelte:self>` for recursive component inclusion.

## Imperative API

Create and control components programmatically:

```ts
const app = new App({
  target: document.body,
  props: { answer: 42 },
  hydrate: false
});

app.$set({ answer: 43 });
app.$on('event', callback);
app.$destroy();
```

With `accessors: true`, props are synchronous getters/setters:

```ts
component.count += 1;
```

Server-side rendering:

```ts
const { head, html, css } = App.render({ answer: 42 });
```

**Note:** Svelte 5 uses `mount()`, `unmount()`, and `$state` instead.