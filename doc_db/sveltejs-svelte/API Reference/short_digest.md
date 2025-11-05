## Core Modules

**svelte**: Main framework entry point.

**svelte/action, svelte/animate, svelte/motion**: DOM behavior, animations, and transitions.

**svelte/compiler**: Programmatic compilation for build tools.

**svelte/easing**: Timing curves (linear, quadratic, cubic, sine, exponential, elastic, bounce). Example: `import { quintOut } from 'svelte/easing'; transition:fade={{ easing: quintOut }}`

**svelte/reactivity**: Reactive Map, Set, URL, and window properties. Example: `import { innerWidth } from 'svelte/reactivity/window'; {innerWidth.current}`

**svelte/server**: Server-side rendering.

**svelte/store**: Reactive state management.

**svelte/transition**: Directives (fade, fly, slide, scale, draw, crossfade). Example: `<div transition:fade={{ duration: 300 }}>Content</div>`

## Errors & Warnings

Compile errors: animation, attributes, bindings, blocks, CSS, runes, slots, snippets, state, parsing.

Runtime errors: binding, state mutations, effects, hydration, component API.

Suppress with `<!-- svelte-ignore <code> -->`.