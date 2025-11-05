## Reactivity Syntax Changes

**`let` → `$state`**: Reactive variables now use the `$state` rune instead of implicit reactivity.
```svelte
let count = $state(0);
```

**`$:` → `$derived`/`$effect`**: Reactive statements split into two runes:
- `$derived` for computed values: `const double = $derived(count * 2);`
- `$effect` for side effects: `$effect(() => { if (count > 5) alert('too high'); });`

**`export let` → `$props`**: Component properties use destructuring with `$props()`:
```svelte
let { optional = 'unset', required, class: klass, ...rest } = $props();
```

## Event Changes

**`on:` directive → event attributes**: Event handlers are now properties without the colon:
```svelte
<button onclick={() => count++}>clicks: {count}</button>
```

**`createEventDispatcher` → callback props**: Components accept functions as props instead of emitting events:
```svelte
// Parent
<Pump inflate={(power) => { size += power; }} />

// Child
let { inflate } = $props();
<button onclick={() => inflate(power)}>inflate</button>
```

**Event modifiers removed**: Use explicit code instead. For `capture`, `passive`, `nonpassive` that can't be wrapped, use actions or event name modifiers (`onclickcapture`).

**Multiple handlers**: Combine into one handler instead of duplicating attributes.

## Snippets Replace Slots

**Default content**: Use `children` prop with `{@render children?.()}` instead of `<slot />`.

**Named slots**: Use props with `{@render header()}` instead of `<slot name="header" />`.

**Passing data back**: Snippets replace `let:` syntax:
```svelte
// Parent
{#snippet item(text)}
  <span>{text}</span>
{/snippet}

// Child
let { item } = $props();
{@render item(entry)}
```

## Component Instantiation

Components are now functions, not classes. Use `mount()` or `hydrate()` from `svelte`:
```svelte
import { mount } from 'svelte';
const app = mount(App, { target: document.getElementById("app") });
```

Replace `$set`, `$on`, `$destroy` with:
- `$set`: Use `$state` objects and mutate them
- `$on`: Pass callbacks via `events` option (discouraged; use callback props instead)
- `$destroy`: Use `unmount(app)`

For server-side rendering, use `render()` from `svelte/server` instead of `App.render()`.

## Dynamic Components

`<svelte:component>` is no longer necessary. Components can be dynamic directly:
```svelte
let Thing = $state();
<Thing />
```

Dot notation now indicates components: `<item.component />` instead of creating an element.

## Breaking Changes in Runes Mode

- **Bindings to exports forbidden**: Use `bind:this` instead
- **Bindable props require `$bindable()`**: `let { foo = $bindable('bar') } = $props();`
- **`accessors` option ignored**: Use component exports instead
- **`immutable` option ignored**: Replaced by `$state` behavior
- **Classes not auto-reactive**: Define `$state` fields on class instances
- **Touch/wheel events are passive**: Use actions if you need `preventDefault()`
- **Stricter attribute syntax**: Complex values must be quoted: `prop="this{is}valid"`
- **Stricter HTML structure**: Browser auto-repair no longer allowed

## Other Changes

- **Whitespace handling simplified**: Collapsed between nodes, removed at tag boundaries
- **Modern browser required**: No IE support; uses Proxies, ResizeObserver
- **CSS scoping uses `:where()`**: Affects specificity
- **`null`/`undefined` render as empty string**: Instead of literal strings
- **`bind:files` stricter**: Only accepts `null`, `undefined`, or `FileList`
- **Form resets trigger bindings**: Values stay in sync
- **Hydration uses comments**: Don't strip comments from server-rendered HTML

## Migration Script

Run `npx sv migrate svelte-5` to automatically handle most migrations. Manual cleanup needed for `createEventDispatcher`, `beforeUpdate`/`afterUpdate`, and some edge cases.