## Runtime API

**Mounting & Lifecycle**: `mount(component, options)`, `hydrate()`, `unmount(component, {outro: true})`, `onMount(fn)`, `onDestroy(fn)`, `tick()`, `settled()`, `flushSync(fn)`, `untrack(fn)`

**State & Reactivity**: `$state()`, `$derived()`, `$effect()`, `$inspect()`, `$state.snapshot()`, `$state.raw()`, `$bindable()`, `$props()`, `$restProps()`

**Context**: `setContext(key, ctx)`, `getContext(key)`, `createContext()` (type-safe)

**Events**: `createEventDispatcher()` (deprecated, use callback props), `on(element, event, handler)` preserves handler order

**Stores**: `writable(initial)`, `readable(initial, start)`, `derived(sources, fn)`, `get(store)`, `readonly(store)`, `toStore(getter, setter?)`, `fromStore(store)`

**Animations & Transitions**: `flip(node, {from, to}, params)` for FLIP animations; `blur`, `fade`, `fly`, `scale`, `slide`, `draw`, `crossfade` transitions with `delay`, `duration`, `easing`

**Motion**: `Spring` and `Tween` classes with `set(value, options)` returning promises; `prefersReducedMotion.current` for accessibility

**Easing**: 33 functions (`linear`, `quad`, `cubic`, `sine`, `expo`, `circ`, `back`, `elastic`, `bounce`) with `In`/`Out`/`InOut` variants

**Reactive Built-ins**: `SvelteMap`, `SvelteSet`, `SvelteDate`, `SvelteURL`, `SvelteURLSearchParams`, `MediaQuery` (5.7.0+), `createSubscriber(start)` for external event integration

**Window Reactivity** (5.11.0+): `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`, `scrollX`, `scrollY`, `screenLeft`, `screenTop`, `devicePixelRatio`, `online` from `svelte/reactivity/window`

**Actions**: Type with `Action<Element, Parameter, Attributes>`, return `{update?, destroy?}` object

**Attachments**: `createAttachmentKey()` for programmatic attachment symbols, `fromAction(action, argFn)` converts actions to attachments

**Server Rendering**: `render(Component, {props, context, idPrefix})` returns `{body, head}`

**Advanced**: `fork()` for preloading, `getAbortSignal()` for async cleanup, `createRawSnippet(fn)`

## Compiler API

**Core**: `compile(source, options)`, `compileModule(source, options)`, `parse(source, options)`, `preprocess(source, preprocessor)`, `migrate(source, options)`, `VERSION`

**Options**: `name`, `customElement`, `generate` ('client'|'server'|false), `dev`, `runes`, `css` ('injected'|'external'), `namespace`, `preserveComments`, `preserveWhitespace`, `fragments`, `hmr`, `modernAst`

**Preprocessors**: `PreprocessorGroup` with optional `markup`, `script`, `style` functions receiving content, attributes, markup, filename; return `Processed` with code, map, dependencies

## Error & Warning Reference

**Client Errors**: `async_derived_orphan`, `derived_references_self`, `state_unsafe_mutation`, `effect_orphan`, `effect_update_depth_exceeded`, `effect_in_teardown`, `bind_invalid_checkbox_value`, `bind_not_bindable`, `component_api_invalid_new`, `each_key_duplicate`, `invalid_snippet`, `hydration_failed`

**Client Warnings**: `console_log_state`, `await_reactivity_loss`, `await_waterfall`, `state_proxy_equality_mismatch`, `state_proxy_unmount`, `binding_property_non_reactive`, `ownership_invalid_binding`, `hydration_attribute_changed`, `hydration_mismatch`, `select_multiple_invalid_value`, `transition_slide_display`

**Compile Errors**: Animation uniqueness, binding expression restrictions, block syntax, CSS scoping, rune placement, slot/snippet rules, Svelte meta tag rules, HTML structure assumptions

**Compile Warnings**: Accessibility (autofocus, click handlers, alt text, video captions, labels, headings, tabindex), code quality (component naming, `$state()` usage, class placement, `<script module>`, `{@render}`, `mount()`/`hydrate()`, HTML structure)

**Shared Errors**: `missing_context`, `set_context_after_init`, `invalid_default_snippet`, `snippet_without_render_tag`, `store_invalid_shape`, `lifecycle_outside_component`

**Server Errors**: `await_invalid`, `lifecycle_function_unavailable`, `html_deprecated`

**Suppressing Warnings**: Use `<!-- svelte-ignore rule1, rule2 (reason) -->` comments

## Type Definitions

`Component<Props, Exports>`, `ComponentProps<Comp>`, `Snippet<Params>`, `MountOptions<Props>`, `Action<Element, Parameter, Attributes>`, `ActionReturn<Parameter, Attributes>`