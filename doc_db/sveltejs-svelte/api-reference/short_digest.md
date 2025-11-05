## Runtime API

**Mounting**: `mount()`, `hydrate()`, `unmount()`, `onMount()`, `onDestroy()`

**State**: `$state()`, `$derived()`, `$effect()`, `$inspect()`, `$bindable()`, `$props()`

**Stores**: `writable()`, `readable()`, `derived()`, `get()`, `readonly()`

**Transitions**: `blur`, `fade`, `fly`, `scale`, `slide`, `draw`, `crossfade` with `delay`, `duration`, `easing`

**Motion**: `Spring`, `Tween` classes; `prefersReducedMotion.current`

**Easing**: 33 functions with `In`/`Out`/`InOut` variants

**Context**: `setContext()`, `getContext()`, `createContext()`

**Events**: `createEventDispatcher()`, `on(element, event, handler)`

**Reactive Built-ins**: `SvelteMap`, `SvelteSet`, `SvelteDate`, `SvelteURL`, `SvelteURLSearchParams`, `MediaQuery`

**Window** (5.11.0+): `innerWidth`, `innerHeight`, `scrollX`, `scrollY`, etc. from `svelte/reactivity/window`

**Actions**: `Action<Element, Parameter, Attributes>` with `{update?, destroy?}` return

**Server**: `render(Component, {props, context, idPrefix})`

## Compiler API

`compile()`, `compileModule()`, `parse()`, `preprocess()`, `migrate()` with options for generation, CSS handling, runes mode

## Errors & Warnings

Complete reference of runtime errors, compile errors, and warnings with codes, descriptions, and solutions. Suppress with `<!-- svelte-ignore rule -->`