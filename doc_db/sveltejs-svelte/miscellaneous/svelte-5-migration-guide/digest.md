## Reactivity Syntax Changes

**let → $state**: Reactive variables now use the `$state` rune instead of implicit reactivity on top-level `let` declarations.
```svelte
let count = $state(0);
```

**$: → $derived/$effect**: Reactive computations split into two runes:
- `$derived` for derived state: `const double = $derived(count * 2);`
- `$effect` for side effects: `$effect(() => { if (count > 5) alert('too high'); })`

**export let → $props**: Component properties use destructuring with `$props()`:
```svelte
let { optional = 'unset', required, class: klass, ...rest } = $props();
```

## Event System Changes

**on: directive → event attributes**: Event handlers are now properties without the colon:
```svelte
<button onclick={() => count++}>clicks: {count}</button>
```

**createEventDispatcher → callback props**: Components accept callback functions as props instead of emitting events:
```svelte
// Parent
<Pump inflate={(power) => { size += power; }} />

// Child
let { inflate } = $props();
<button onclick={() => inflate(power)}>inflate</button>
```

**Event modifiers removed**: Use explicit code instead. For `capture`, use `onclickcapture`. For `passive`/`nonpassive`, use actions.

**Multiple handlers**: Combine into a single handler: `onclick={(e) => { one(e); two(e); }}`

## Snippets Replace Slots

**Default content**: Use `children` prop with `{@render children?.()}` instead of `<slot />`.

**Named slots**: Use named snippet props:
```svelte
// Child
let { header, main, footer } = $props();
<header>{@render header()}</header>

// Parent
<Component {#snippet header()}...{/snippet} />
```

**Passing data**: Snippets receive parameters directly:
```svelte
// Child
{@render item(entry)}

// Parent
{#snippet item(text)}<span>{text}</span>{/snippet}
```

## Component Instantiation

Components are now functions, not classes. Use `mount()` or `hydrate()` from `svelte`:
```svelte
import { mount } from 'svelte';
const app = mount(App, { target: document.getElementById("app") });
```

Replace class component methods:
- `$on` → pass `events` option: `mount(App, { events: { event: callback } })`
- `$set` → use `$state` on props object and mutate it
- `$destroy` → use `unmount(app)`

For server-side rendering, use `render()` from `svelte/server`:
```js
import { render } from 'svelte/server';
const { html, head } = render(App, { props: { message: 'hello' }});
```

## Other Changes

**Dynamic components**: `<Thing />` now works directly without `<svelte:component>`. Dot notation indicates components: `<item.component />`.

**Whitespace handling**: Simplified rules - whitespace between nodes collapses to one, whitespace at tag boundaries removed, except in `pre` tags.

**Modern browsers required**: Svelte 5 uses Proxies, ResizeObserver, and other modern APIs. IE not supported.

**Stricter HTML**: Invalid HTML structure (like `<tr>` without `<tbody>`) now causes compiler errors.

**Scoped CSS**: Uses `:where()` selector modifier for better specificity control.

**Bindings**: In runes mode, properties must be marked `$bindable()` to allow binding. Bindings to component exports not allowed.

**Migration script**: Run `npx sv migrate svelte-5` to automatically convert most syntax. Manual cleanup needed for `createEventDispatcher`, `beforeUpdate/afterUpdate`, and some edge cases.