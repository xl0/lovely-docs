
## Directories

### error-&-warning-reference
Complete reference of Svelte runtime, compile-time, and server-side errors and warnings with explanations and fixes.

## Client Errors

**Reactivity**: `async_derived_orphan` (await outside effect), `derived_references_self`, `state_unsafe_mutation` (update in derived/template)

**Effects**: `effect_orphan` (outside effect context), `effect_update_depth_exceeded` (infinite loop—use `untrack()`), `effect_in_teardown`, `effect_in_unowned_derived`

**Binding**: `bind_invalid_checkbox_value` (use `bind:checked`), `bind_invalid_export` (use `bind:this`), `bind_not_bindable` (mark with `$bindable()`)

**Components**: `component_api_invalid_new` (no `new` in Svelte 5), `set_context_after_init` (call during init)

**Other**: `each_key_duplicate`, `invalid_snippet` (null/undefined), `svelte_boundary_reset_onerror`, `hydration_failed`

## Client Warnings

**State & Reactivity**: `console_log_state` (use `$inspect()` or `$state.snapshot()`), `await_reactivity_loss` (pass values as parameters), `await_waterfall` (create promises first, then await), `state_proxy_equality_mismatch` (proxies have different identity), `state_proxy_unmount` (use `$state.raw()`)

**Binding & Props**: `binding_property_non_reactive`, `ownership_invalid_binding` (use `bind:` in all intermediate components), `ownership_invalid_mutation` (use `bind:` or `$bindable()`)

**Hydration**: `hydration_attribute_changed`, `hydration_html_changed`, `hydration_mismatch` (server/client values must match)

**UI Elements**: `select_multiple_invalid_value` (must be array), `transition_slide_display` (requires `display: block/flex/grid`)

**Other**: `event_handler_invalid`, `invalid_raw_snippet_render`, `svelte_boundary_reset_noop`

## Compile Errors

**Animation**: `animate:` must be unique, only child of keyed `{#each}`, requires key

**Bindings**: `bind:group` and `bind:` only work with Identifier/MemberExpression/`{get,set}` pairs; cannot bind to constants

**Blocks**: `{#if}`, `{#each}`, `{#await}`, `{#key}`, `{#snippet}` must be properly opened/closed; use `else if` not `elseif`

**CSS**: `:global()` for scoping; cannot mix global/scoped selectors

**Props/State**: `$props()` and `$state()` only at top-level; cannot export reassigned state; no `$$` prefix

**Runes**: Invalid usage in non-runes mode, missing parentheses, invalid arguments

**Slots**: Cannot mix `<slot>` and `{@render}` tags; slot names must be static; `default` is reserved

**Snippets**: Cannot export snippets referencing component-level variables; no rest parameters

**Svelte Meta**: `<svelte:component>`, `<svelte:element>`, `<svelte:fragment>`, `<svelte:boundary>` attribute/placement rules

**HTML Structure**: Browser HTML repair breaks Svelte assumptions (e.g., `<div>` inside `<p>` auto-closes `<p>`)

## Compile Warnings

**Accessibility**: Avoid `accesskey`, `autofocus`; non-interactive elements with `onclick` need keyboard handlers and `tabindex`; `aria-activedescendant` needs `tabindex`; alt text shouldn't say "image"; `<video>` needs `<track kind="captions">`; labels need associated controls; headings/anchors need text; `onmouseover` needs `onfocus`, `onmouseout` needs `onblur`; no positive `tabindex` values

**Code Quality**: Components start with capital letter; use `$state()` for reactive variables; declare classes at top level; use `<script module>` not `<script context="module">`; use `{@render}` not `<slot>`; use `mount()`/`hydrate()` not component classes; avoid `<div>` in `<p>`, `<div>` in `<option>`, missing `<tbody>` in `<table>`; self-closing tags on non-void elements are ambiguous

## Shared Errors

**Context**: `missing_context` (context not set in parent), `set_context_after_init` (must call during init)

**Lifecycle**: `lifecycle_outside_component` (must call at top level of component script)

**Snippets**: `invalid_default_snippet` (can't use `{@render children()}` with parent `let:` directives), `snippet_without_render_tag` (use `{@render snippet()}`)

**Other**: `store_invalid_shape` (missing `subscribe` method), `svelte_element_invalid_this_value` (requires string)

## Shared Warnings

**Void Elements**: Cannot have content; children ignored

**State Snapshots**: `$state.snapshot` returns original values for uncloneable objects (DOM elements, window)

## Server Errors

**await_invalid**: Don't use `await` in components passed to `render()`; either await `render()` itself or wrap with `<svelte:boundary pending>`

**lifecycle_function_unavailable**: Methods like `mount` unavailable on server—don't call during render

**html_deprecated**: Use `body` instead of `html` property in server render results



## Pages

### svelte
Complete reference of Svelte 5 runtime API for component mounting, lifecycle, state management, context, and type definitions.

## Core API

**Mounting**: `mount(component, options)`, `hydrate()`, `unmount(component, {outro: true})`

**Lifecycle**: `onMount(fn)`, `onDestroy(fn)` (only SSR-safe hook)

**State**: `tick()`, `settled()`, `flushSync(fn)`, `untrack(fn)`

**Context**: `setContext(key, ctx)`, `getContext(key)`, `createContext()` (type-safe)

**Events**: `createEventDispatcher()` (deprecated, use callback props)

**Advanced**: `fork()` for preloading, `getAbortSignal()` for async cleanup, `createRawSnippet(fn)`

**Types**: `Component<Props, Exports>`, `ComponentProps<Comp>`, `Snippet<Params>`, `MountOptions<Props>`

### svelte∕action
Type definitions for Svelte actions: functions called when elements are created, with optional lifecycle methods and custom attributes/events.

## Action

Type actions with `Action<Element, Parameter, Attributes>`:

```ts
export const myAction: Action<HTMLDivElement, { someProperty: boolean } | undefined> = (node, param = { someProperty: true }) => {}
```

## ActionReturn

Return an object with optional `update` and `destroy` methods:

```ts
export function myAction(node: HTMLElement, parameter: Parameter): ActionReturn<Parameter, Attributes> {
	return {
		update: (updatedParameter) => {...},
		destroy: () => {...}
	};
}
```

### svelte∕animate
The flip animation function from svelte/animate calculates and animates element position changes between two DOMRect states.

## flip

Animates element position changes using the FLIP technique (First, Last, Invert, Play).

```js
import { flip } from 'svelte/animate';

flip(node, { from: DOMRect, to: DOMRect }, params?: FlipParams): AnimationConfig
```

Configure with `delay`, `duration` (number or function), and `easing`.

### svelte∕attachments
API for creating and converting attachments - functions that run when elements mount to the DOM.

## createAttachmentKey
Creates a symbol key for programmatic attachments spread onto elements.

```js
const props = {
  [createAttachmentKey()]: (node) => { node.textContent = 'attached!'; }
};
```

## fromAction
Converts actions to attachments. Second argument must return the action's argument.

```js
<div {@attach fromAction(foo, () => bar)}>...</div>
```

## Attachment
Function running on element mount, optionally returning cleanup function for unmount.

### svelte∕compiler-api-reference
Complete API reference for the Svelte compiler with functions to compile components, parse AST, preprocess code, and migrate to runes, plus comprehensive type definitions for all AST node types.

## Core Functions

- **compile(source, options)** - Converts `.svelte` to JavaScript module
- **compileModule(source, options)** - Compiles JavaScript with runes
- **parse(source, options)** - Returns component AST
- **preprocess(source, preprocessor)** - Transforms source before compilation
- **migrate(source, options)** - Auto-migrates code to runes
- **VERSION** - Current version string

## Key Options

`compile()` accepts: `name`, `customElement`, `generate` ('client'|'server'|false), `dev`, `runes` (true|false|undefined), `css` ('injected'|'external'), `namespace`, `preserveComments`, `preserveWhitespace`, `fragments` ('html'|'tree'), `hmr`, `modernAst`

## AST Types

Complete type definitions for template nodes: Elements (RegularElement, Component, SvelteComponent, SlotElement), Blocks (EachBlock, IfBlock, AwaitBlock, KeyBlock, SnippetBlock), Directives (Bind, On, Class, Style, Transition, Use, Animate, Let), Tags (Expression, Html, Const, Debug, Render, Attach)

## Preprocessors

Transform code via `PreprocessorGroup` with optional `markup`, `script`, `style` functions. Each receives content, attributes, markup, filename and returns Processed object with code, map, dependencies.

### easing
Collection of 33 easing functions for animations with In/Out/InOut variants.

The `svelte/easing` module exports 33 easing functions for animations: `linear`, polynomial curves (`quad`, `cubic`, `quart`, `quint`), trigonometric (`sine`, `expo`, `circ`), and specialized (`back`, `elastic`, `bounce`). Each has `In`, `Out`, and `InOut` variants. Functions accept normalized time `t` and return eased values.

```js
import { cubicInOut, bounceOut } from 'svelte/easing';
```

### svelte∕events
Event handler attachment utility that maintains correct execution order with declarative handlers.

## on()

Attaches event handlers to DOM elements and returns a removal function. Preserves correct handler order relative to declarative handlers (unlike `addEventListener`).

```js
import { on } from 'svelte/events';
const unsubscribe = on(window, 'resize', (event) => {});
unsubscribe();
```

### svelte∕legacy
Deprecated migration utilities for converting Svelte 4 code patterns to Svelte 5, including component class conversion and event handler/modifier replacements.

Deprecated utilities for Svelte 4 to 5 migration:

**Component conversion:** `asClassComponent()`, `createClassComponent()`

**Event handlers:** `handlers()`, `once()`, `preventDefault()`, `stopPropagation()`, `stopImmediatePropagation()`, `self()`, `trusted()`

**Event modifiers as actions:** `passive()`, `nonpassive()`

**Other:** `createBubbler()`, `run()`

### motion
Animation utilities: Spring and Tween classes for physics-based and time-based value animation, plus accessibility-aware motion preference detection.

## Spring & Tween Classes

Animate values with spring physics or tweening:

```js
import { Spring, Tween } from 'svelte/motion';
const spring = new Spring(0);
const tween = new Tween(0);
spring.target = 100; // animates current to target
```

Both have `set(value, options)` methods returning promises and `Spring.of()`/`Tween.of()` for reactive binding.

## prefersReducedMotion

Media query for accessibility:
```js
transition:fly={{ y: prefersReducedMotion.current ? 0 : 200 }}
```

Deprecated: `spring()` and `tweened()` functions replaced by classes.

### reactivity-window-module
Reactive window property bindings available since Svelte 5.11.0 that automatically track changes without manual event listeners.

Reactive wrappers for window properties via `svelte/reactivity/window`. Each export has a `.current` property: `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`, `scrollX`, `scrollY`, `screenLeft`, `screenTop`, `devicePixelRatio`, `online`. All are `undefined` on server.

```svelte
<script>
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
</script>
<p>{innerWidth.current}x{innerHeight.current}</p>
```

### svelte-reactivity
Reactive wrappers for built-in objects (Map, Set, Date, URL, URLSearchParams, MediaQuery) and createSubscriber utility for integrating external event systems with Svelte's reactivity.

## Reactive Built-ins

- **SvelteMap, SvelteSet, SvelteDate, SvelteURL, SvelteURLSearchParams**: Reactive versions of standard objects. Reading their contents in effects/derived triggers re-evaluation. Values are not deeply reactive.
- **MediaQuery** (5.7.0+): Reactive media query with `current` property. Prefer CSS media queries to avoid hydration issues.

## createSubscriber

Integrates external event systems with Svelte reactivity. Pass a `start` callback that receives an `update` function; calling `update` re-runs the effect. Return a cleanup function from `start` to clean up when effects are destroyed.

```js
const subscribe = createSubscriber((update) => {
	const off = on(element, 'event', update);
	return () => off();
});
```

### svelte∕server
Server-side rendering function that converts Svelte components to HTML strings with body and head output.

## render

Server-side function for rendering Svelte components to HTML strings.

```js
import { render } from 'svelte/server';

const { body, head } = render(Component, {
  props: { /* ... */ },
  context: new Map(),
  idPrefix: 'prefix-'
});
```

Returns object with `body` (component HTML) and `head` (svelte:head content).

### svelte∕store
API reference for Svelte's reactive store system with creation, access, and interop utilities.

## Core Stores

**writable(initial)** - Read/write store with `set()` and `update()` methods.

**readable(initial, start)** - Read-only store with optional start/stop callback.

**derived(sources, fn)** - Computed store from one or more source stores, supports async via `set` callback.

## Utilities

**get(store)** - Get current value synchronously.

**readonly(store)** - Make a writable store read-only.

**toStore(getter, setter?)** - Convert functions to a store.

**fromStore(store)** - Convert store to reactive `{ current }` object.

### svelte∕transition
Built-in transition functions for animating element entry and exit with customizable timing, easing, and animation parameters.

Seven transition functions: **blur**, **fade**, **fly**, **scale**, **slide**, **draw** (SVG), **crossfade** (paired send/receive). All accept `delay`, `duration`, `easing`. Specific parameters: blur has `amount`/`opacity`; fly has `x`/`y`/`opacity`; scale has `start`/`opacity`; slide has `axis`; draw has `speed`; crossfade has `fallback`.

### compiler-errors
Reference of all Svelte compiler error codes with descriptions, organized by category.

## Compiler Errors Reference

Complete list of Svelte compiler error codes organized by category:

**Animation**: `animation_duplicate`, `animation_invalid_placement`, `animation_missing_key`

**Attributes**: `attribute_contenteditable_dynamic`, `attribute_duplicate`, `attribute_invalid_event_handler`, `attribute_invalid_type`, `attribute_unquoted_sequence`, etc.

**Bindings**: `bind_group_invalid_expression`, `bind_invalid_expression`, `bind_invalid_target`, `bind_invalid_value`

**Blocks**: `block_duplicate_clause`, `block_invalid_placement`, `block_unclosed`, `block_unexpected_close`

**Components**: `component_invalid_directive`, `svelte_component_missing_this`

**Const Tags**: `const_tag_cycle`, `const_tag_invalid_placement`, `const_tag_invalid_reference`

Invalid const reference example:
```svelte
<svelte:boundary>
    {@const foo = 'bar'}
    {#snippet failed()}
        {foo}  <!-- error: not available -->
    {/snippet}
</svelte:boundary>
```

**CSS**: `css_empty_declaration`, `css_global_block_invalid_list`, `css_global_invalid_placement`, etc.

Invalid CSS:
```css
:global, x { y { color: red; } }  <!-- error: mixing global/scoped -->
```

**Each Blocks**: `each_item_invalid_assignment`, `each_key_without_as`

Runes mode requires array/index instead of reassigning entry:
```svelte
{#each array as entry, i}
    <button onclick={() => array[i] = 4}>change</button>
{/each}
```

**Props/Runes**: `props_duplicate`, `props_invalid_placement`, `rune_invalid_usage`, `rune_missing_parentheses`, `rune_renamed`

**Snippets**: `snippet_invalid_export`, `snippet_parameter_assignment`, `snippet_shadowing_prop`

Invalid exported snippet:
```svelte
<script module>
    export { greeting };
</script>
<script>
    let message = 'hello';
</script>
{#snippet greeting(name)}
    <p>{message} {name}!</p>  <!-- error: references non-module script -->
{/snippet}
```

**Slots**: `slot_attribute_invalid`, `slot_default_duplicate`, `slot_element_invalid_name_default`

**Stores**: `store_invalid_subscription`, `store_invalid_subscription_module`

**Svelte Meta**: `svelte_boundary_invalid_attribute`, `svelte_element_missing_this`, `svelte_options_invalid_customelement`, `svelte_self_invalid_placement`

**Transitions**: `transition_conflict`, `transition_duplicate`

**Other**: `dollar_binding_invalid`, `expected_identifier`, `experimental_async`, `legacy_await_invalid`, `legacy_export_invalid`, `legacy_reactive_statement_invalid`, `node_invalid_placement`, `typescript_invalid_feature`, `unexpected_eof`

### compiler-warnings
Reference of all Svelte compiler warnings with codes, descriptions, and how to suppress them using `<!-- svelte-ignore -->` comments.

## Disabling Warnings

```svelte
<!-- svelte-ignore a11y_autofocus -->
<input autofocus />

<!-- Multiple rules with explanation -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (reason) -->
<div onclick>...</div>
```

## Key Accessibility Warnings

- **a11y_click_events_have_key_events**: Non-interactive elements with `onclick` need `onkeyup`/`onkeydown` and `tabindex`
- **a11y_missing_attribute**: `<a>` needs `href`, `<img>` needs `alt`, `<html>` needs `lang`, `<iframe>` needs `title`
- **a11y_no_noninteractive_element_interactions**: Non-interactive elements (`<main>`, `<h1>`, `<p>`, `<img>`, `<li>`) shouldn't have event listeners
- **a11y_no_noninteractive_element_to_interactive_role**: Can't use interactive roles on non-interactive elements
- **a11y_no_static_element_interactions**: `<div>` with click handler needs ARIA role
- **a11y_positive_tabindex**: Avoid `tabindex > 0`
- **a11y_img_redundant_alt**: Alt text shouldn't contain "image", "picture", "photo"
- **a11y_media_has_caption**: `<video>` needs `<track kind="captions">`

## Other Important Warnings

- **non_reactive_update**: Variable reassigned without `$state()` won't trigger updates
- **state_referenced_locally**: State reference captures initial value; wrap in function for reactivity
- **element_invalid_self_closing_tag**: Non-void elements need explicit closing tags
- **css_unused_selector**: Use `:global` to preserve selectors targeting dynamic content
- **legacy_component_creation**: Use `mount` or `hydrate` instead of component classes
- **slot_element_deprecated**: Use `{@render ...}` instead of `<slot>`

### runtime-errors
Reference documentation for all runtime errors in Svelte with explanations and solutions.

## Client Errors
- **async_derived_orphan**: Async deriveds must be created inside effects
- **bind_invalid_checkbox_value**: Use `bind:checked` not `bind:value` for checkboxes
- **bind_invalid_export**: Use `bind:this` then access property, not `bind:key`
- **bind_not_bindable**: Mark properties bindable with `let { key = $bindable() } = $props()`
- **component_api_changed/invalid_new**: Components are no longer classes in Svelte 5
- **derived_references_self**: Deriveds cannot reference themselves
- **each_key_duplicate**: Keyed each blocks need unique keys
- **effect_update_depth_exceeded**: Effect reads and writes same state. Solution: don't use `$state` for the value, or use `untrack()`. Example: `$effect(() => { count += 1; })` loops infinitely
- **flush_sync_in_effect**: Cannot use `flushSync()` inside effects
- **invalid_snippet**: Cannot render null/undefined snippets, use `{@render snippet?.()}`
- **props_invalid_value**: Cannot bind `undefined` to props with fallback values
- **rune_outside_svelte**: Runes only work in `.svelte` and `.svelte.js/ts` files
- **set_context_after_init**: `setContext` must be called during initialization, not in effects
- **state_unsafe_mutation**: Cannot update state in `$derived(...)` or templates. Solution: make everything derived: `let even = $derived(count % 2 === 0); let odd = $derived(!even);`
- **svelte_boundary_reset_onerror**: Don't call reset synchronously in onerror, use `await tick()` first

## Server Errors
- **await_invalid**: Async work in sync render. Await `render()` or wrap in `<svelte:boundary>`
- **html_deprecated**: Use `body` instead of `html` property

## Shared Errors
- **invalid_default_snippet**: Cannot use `{@render children(...)}` with `let:` directives
- **lifecycle_outside_component**: Lifecycle methods only work at top level of instance script
- **missing_context**: Context not set in parent with `set()`
- **snippet_without_render_tag**: Use `{@render snippet()}` not `{snippet}`
- **store_invalid_shape**: Value must have `subscribe` method

### runtime-warnings
Reference documentation for Svelte runtime warnings covering reactivity, hydration, state proxies, bindings, and transitions.

## Client Warnings

- **assignment_value_stale**: `??=` evaluates to RHS, not assigned property. Separate into two statements.
- **await_reactivity_loss**: State after `await` in async functions not tracked. Pass as parameters.
- **await_waterfall**: Multiple `$derived(await)` create unnecessary waterfalls. Create promises first, await separately.
- **binding_property_non_reactive**: Binding to non-reactive properties.
- **console_log_state**: Use `$inspect()` or `$state.snapshot()` instead of logging `$state` proxies.
- **event_handler_invalid**: Handler must be a function.
- **hydration_attribute_changed**: Server/client attribute mismatch. Use `svelte-ignore` or ensure values match.
- **hydration_html_changed**: `{@html}` value differs server/client. Use `svelte-ignore` or match values.
- **hydration_mismatch**: UI structure doesn't match server render.
- **invalid_raw_snippet_render**: `createRawSnippet` must return single element HTML.
- **legacy_recursive_reactive_block**: Migrated `$:` accessing/updating same value may recurse as `$effect`.
- **lifecycle_double_unmount**: Unmounting unmounted component.
- **ownership_invalid_binding**: Use `bind:` when forwarding bindings between components.
- **ownership_invalid_mutation**: Don't mutate unbound props. Use `bind:`, callbacks, or `$bindable`.
- **select_multiple_invalid_value**: `<select multiple>` value must be array, null, or undefined.
- **state_proxy_equality_mismatch**: `$state()` proxies have different identity. `===` comparisons fail.
- **state_proxy_unmount**: Don't pass `$state` proxies to `unmount()`. Use `$state.raw()` if needed.
- **svelte_boundary_reset_noop**: `<svelte:boundary>` reset only works once.
- **transition_slide_display**: `slide` transition requires `display: block/flex/grid`.

## Shared Warnings

- **dynamic_void_element_content**: Void elements cannot have content.
- **state_snapshot_uncloneable**: `$state.snapshot()` can't clone some objects; returns original.

