## Reactivity

Assignment-based reactivity with `$:` reactive statements:

```svelte
let numbers = [1, 2, 3];
numbers = numbers; // triggers update

$: sum = a + b;
```

## Component API

Props with `export`, access all props via `$$props`/`$$restProps`, check slots with `$$slots`:

```svelte
export let foo = 'default';
<button {...$$restProps}></button>
{#if $$slots.description}<slot name="description" />{/if}
```

## Slots & Events

Named slots with data passing, event handlers with modifiers, component event dispatching:

```svelte
<slot name="buttons" item={data} />
<button on:click|once={handler}>click</button>
dispatch('event');
```

## Dynamic & Imperative

`<svelte:component this={Comp} />` for dynamic rendering, imperative API with `$set()`, `$on()`, `$destroy()`:

```ts
const app = new App({ target, props });
app.$set({ prop: value });
```