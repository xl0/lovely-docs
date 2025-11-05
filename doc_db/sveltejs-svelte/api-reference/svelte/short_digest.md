## Core API

**Mounting**: `mount(component, options)`, `hydrate()`, `unmount(component, {outro: true})`

**Lifecycle**: `onMount(fn)`, `onDestroy(fn)` (only SSR-safe hook)

**State**: `tick()`, `settled()`, `flushSync(fn)`, `untrack(fn)`

**Context**: `setContext(key, ctx)`, `getContext(key)`, `createContext()` (type-safe)

**Events**: `createEventDispatcher()` (deprecated, use callback props)

**Advanced**: `fork()` for preloading, `getAbortSignal()` for async cleanup, `createRawSnippet(fn)`

**Types**: `Component<Props, Exports>`, `ComponentProps<Comp>`, `Snippet<Params>`, `MountOptions<Props>`