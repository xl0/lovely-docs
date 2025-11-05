## Core Modules

**svelte**: Main framework entry point with core APIs.

**svelte/action**: Custom actions for DOM element behavior.

**svelte/animate**: Animation utilities for state changes.

**svelte/compiler**: Programmatic component compilation to JavaScript for build tools.

**svelte/easing**: Easing functions (linear, quadratic, cubic, sine, exponential, elastic, bounce) with In/Out/InOut variants. Example: `import { quintOut } from 'svelte/easing'; transition:fade={{ duration: 400, easing: quintOut }}`

**svelte/events**: Event handling utilities.

**svelte/motion**: Smooth animations and value transitions with easing.

**svelte/reactivity**: Reactive versions of Map, Set, URL and built-ins that integrate with Svelte's reactivity system.

**svelte/reactivity/window**: Reactive window properties accessible via `.current`. Example: `import { innerWidth, innerHeight } from 'svelte/reactivity/window'; <p>{innerWidth.current}x{innerHeight.current}</p>`

**svelte/server**: Server-side rendering utilities for Node.js.

**svelte/store**: Reactive state management with store creation and subscriptions.

**svelte/transition**: Transition directives (fade, fly, slide, scale, draw, crossfade) with duration, delay, and easing options. Example: `<div transition:fade={{ duration: 300 }}>Content</div>`

**svelte/legacy**: Deprecated functions for migration from older versions.

## Error & Warning Reference

**Compile Errors**: Animation, attributes, bindings, blocks, CSS, each blocks, props/exports, runes, slots, snippets, state, Svelte meta tags, parsing errors.

**Compile Warnings**: Accessibility, attributes, code quality, deprecated syntax, hydration issues, unused CSS.

**Runtime Errors (Client)**: Binding, component API, state mutations, effects, keyed blocks, hydration, snippets.

**Runtime Warnings (Client)**: Stale assignment values, non-reactive bindings, state proxy logging, event handlers, hydration mismatches, lifecycle issues, invalid mutations, transition display requirements.

**Common Errors**: Invalid default snippets, lifecycle outside components, missing render tags, invalid snippet arguments, store shape validation, element value types, server-only methods.

**Common Warnings**: Void element content, uncloneable state snapshots.

Suppress warnings with `<!-- svelte-ignore <code> -->` comments supporting multiple comma-separated codes.