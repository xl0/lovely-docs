## Core API Reference

### Component Lifecycle & Mounting
- `mount(component, options)` - Mount a component to a target element, returns exports. Plays transitions by default unless `intro: false`.
- `hydrate(component, options)` - Hydrate a component on a target, returns exports and props.
- `unmount(component, options)` - Unmount a component. With `options.outro: true`, plays exit transitions before removal.

### Lifecycle Hooks
- `onMount(fn)` - Runs once after component mounts to DOM. Synchronously returned function runs on unmount. Does not run during SSR.
- `onDestroy(fn)` - Runs before component unmounts. Only lifecycle hook that runs during SSR.
- `beforeUpdate(fn)` - Deprecated, use `$effect.pre` instead. Runs before component updates.
- `afterUpdate(fn)` - Deprecated, use `$effect` instead. Runs after component updates.

### State & Effects
- `tick()` - Returns promise that resolves once pending state changes are applied.
- `settled()` - Returns promise that resolves once state changes and async work complete and DOM updates.
- `flushSync(fn?)` - Synchronously flush pending updates. Returns void or callback result.
- `untrack(fn)` - Prevents state read inside `fn` from being treated as a dependency in `$derived` or `$effect`.

### Context
- `setContext(key, context)` - Associate context with current component, available to children via `getContext`.
- `getContext(key)` - Retrieve context from closest parent component. Must be called during initialization.
- `hasContext(key)` - Check if key exists in parent context.
- `getAllContexts()` - Get entire context map from closest parent.
- `createContext()` - Type-safe alternative returning `[get, set]` pair. `get` throws if parent didn't call `set`.

### Events
- `createEventDispatcher()` - Deprecated, use callback props instead. Creates typed event dispatcher for component events.

### Advanced
- `fork()` - Create off-screen fork where state changes are evaluated but not applied to DOM. Useful for preloading. Returns `Fork` with `commit()` and `discard()` methods.
- `getAbortSignal()` - Get `AbortSignal` that aborts when current derived/effect re-runs or is destroyed. Use in async operations.
- `createRawSnippet(fn)` - Create snippet programmatically. Function receives getters for params and returns `{render, setup?}`.

### Types
- `Component<Props, Exports, Bindings>` - Type for strongly-typed Svelte components. Replaces deprecated `SvelteComponent`.
- `ComponentProps<Comp>` - Extract props type from component.
- `Snippet<Parameters>` - Type for snippet blocks. Called via `{@render ...}` tag.
- `MountOptions<Props>` - Options for `mount()`: target, anchor, events, context, intro.
- `Fork` - Interface with `commit()` and `discard()` methods.

### Deprecated (Svelte 4 → 5 Migration)
- `SvelteComponent` - Old base class, use `Component` type instead.
- `SvelteComponentTyped` - Use `Component` instead.
- `ComponentConstructorOptions` - Use `mount()` instead.
- `ComponentType` - Obsolete with new `Component` type.
- `ComponentEvents` - Use `ComponentProps` instead.