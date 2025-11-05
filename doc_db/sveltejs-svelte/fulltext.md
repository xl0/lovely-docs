
## Directories

### introduction
Foundational concepts of Svelte: what it is, how to set up projects, and the structure of Svelte components and modules.

## Overview

Svelte is a compiler-based UI framework that transforms HTML, CSS, and JavaScript components into optimized code. Supports everything from components to full-stack apps with SvelteKit.

## Getting Started

Create a new project with `npx sv create myapp` (SvelteKit recommended) or `npm create vite@latest` with Svelte option. Use VS Code extension for editor support or `sv check` from command line.

## Svelte Files

`.svelte` files contain optional `<script>`, markup, and `<style>` sections.

**Instance-level scripts** (`<script>`) run per component creation and use runes for props and reactivity.

**Module-level scripts** (`<script module>`) run once on module load and can export bindings.

CSS in `<style>` blocks is scoped to the component.

```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
</script>

<button onclick={() => alert('Welcome!')}>click me</button>

<style>
	button { font-size: 2em; }
</style>
```

## Svelte Modules

`.svelte.js` and `.svelte.ts` files support runes for creating reusable reactive logic and sharing reactive state.

### runes
Svelte 5 runes are $ -prefixed compiler keywords for managing reactive state, derived values, side effects, component props, and debugging.

## Runes

`$`-prefixed compiler keywords that control Svelte behavior. Not importable, not assignable, only valid in specific positions.

### $state
Creates reactive state with automatic UI updates. Supports deep reactivity for objects/arrays via proxies.

```js
let count = $state(0);
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers updates
```

Variants: `$state.raw` (no deep reactivity), `$state.snapshot(value)` (static snapshot), `$state.eager(value)` (immediate updates). Cannot directly export and reassign; mutate properties or use getter functions instead.

### $derived
Reactive derived state that automatically updates when dependencies change.

```js
let count = $state(0);
let doubled = $derived(count * 2);
```

Use `$derived.by` for complex derivations. Derived values can be temporarily reassigned for optimistic UI. Uses push-pull reactivity: changes notify dependents immediately but derived values only re-evaluate when read.

### $effect
Runs side-effect functions when tracked state changes with automatic dependency tracking.

```js
$effect(() => {
	context.fillStyle = color;
	context.fillRect(0, 0, size, size);
});

$effect(() => {
	const interval = setInterval(() => count += 1, ms);
	return () => clearInterval(interval);
});
```

Only synchronously read values are tracked. Asynchronously read values (after await/setTimeout) are not tracked. Variants: `$effect.pre()` (before DOM updates), `$effect.tracking()` (returns true if in tracking context), `$effect.pending()` (count of pending promises), `$effect.root()` (manually controlled non-tracked scope). Don't use for state synchronization—use `$derived` instead.

### $props
Receives component inputs with destructuring and fallback values.

```svelte
<script lang="ts">
	let { adjective = 'happy' }: { adjective: string } = $props();
</script>
```

Supports renaming (`{ super: trouper }`), rest properties (`...others`), and type annotations. `$props.id()` generates unique per-instance IDs for linking elements.

### $bindable
Enables bidirectional prop binding between parent and child components.

```svelte
// Child
let { value = $bindable(), ...props } = $props();

// Parent
<FancyInput bind:value={message} />
```

Allows state mutation in children and supports fallback values.

### $inspect
Development-only rune that reactively logs value changes.

```js
$inspect(value);
$inspect(value).with(callback); // callback receives "init" or "update" type
$inspect.trace(); // traces which reactive state caused re-run (v5.14+)
```

### $host
Accesses the host element in custom element components for dispatching custom events.

```js
$host().dispatchEvent(new CustomEvent(type))
```

### template-syntax
Complete reference for Svelte's template syntax including markup, control flow, bindings, directives, and special tags.

## Markup & Attributes
Lowercase tags are HTML elements; capitalized/dot-notation tags are components. Attributes support JavaScript expressions with shorthand `{name}` for `name={name}`. Boolean attributes include if truthy, exclude if falsy. Spread attributes with `{...things}` where later values override earlier ones.

## Events & Text
Event attributes use `on:` prefix (case-sensitive). Svelte delegates certain events (click, input, keydown, etc.) to root for performance. Text expressions coerce to strings; use `{@html}` for raw HTML (sanitize to prevent XSS).

## Control Flow
- `{#if}...{:else if}...{:else}` for conditional rendering
- `{#each items as item, i (key)}` for iteration with optional destructuring and `{:else}` for empty lists
- `{#key expression}` destroys/recreates contents when expression changes
- `{#await promise}...{:then value}...{:catch error}` for Promise handling

## Snippets & Rendering
Snippets are reusable markup blocks: `{#snippet name(params)}...{/snippet}`. Pass as props or use implicit `children` snippet. Render with `{@render snippet()}` supporting optional chaining. Type with `Snippet<[ParamTypes]>`.

## Directives
- `bind:` creates two-way bindings (inputs, selects, media, dimensions, component props marked with `$bindable()`)
- `use:` attaches action functions on element mount
- `transition:` animates enter/leave with `|local` (default) or `|global` scope
- `in:` and `out:` apply non-bidirectional transitions
- `animate:` triggers on keyed each block reordering
- `style:` sets inline styles with `|important` modifier
- `class:` sets classes (prefer `class={}` attribute with objects/arrays)

## Special Tags
- `{@const name = value}` defines block-scoped constants
- `{@debug var1, var2}` logs on change and pauses with devtools
- `{@attach function}` runs functions on mount/state updates with optional cleanup
- `{@html content}` injects raw HTML (use `:global` for styling injected content)

## Advanced
Await expressions (Svelte 5.36+, experimental): Use `await` in scripts and markup with `<svelte:boundary pending>` for loading states and `$effect.pending()` for subsequent updates.

### styling
Svelte provides scoped component styles by default, with mechanisms to apply global styles and use CSS custom properties for dynamic styling.

## Scoped Styles

Svelte scopes component styles by default using hash-based classes (e.g., `svelte-123xyz`). Scoped selectors receive a 0-1-0 specificity boost to override global styles. Subsequent scoping uses `:where()` to prevent further specificity increases. `@keyframes` are automatically scoped.

## Global Styles

Use `:global(...)` modifier for single selectors or `:global` block for multiple selectors:

```svelte
<style>
	:global(body) { margin: 0; }
	:global {
		div { color: red; }
		p { font-size: 14px; }
	}
</style>
```

For keyframes, prepend `-global-`:

```svelte
@keyframes -global-my-animation { /* code */ }
```

## CSS Custom Properties

Pass CSS custom properties to components using `--property-name` syntax and consume them with `var(--property-name, fallback)`. Properties inherit from parent elements and can be defined globally on `:root`.

## Nested Style Elements

Only one top-level `<style>` tag per component is allowed. Nested `<style>` tags inside elements or logic blocks are inserted without scoping and apply globally to the DOM.


### special-elements
Special Svelte elements for error boundaries, browser API access, document manipulation, and component configuration.

## Special Elements

Svelte provides special elements for handling errors, accessing browser APIs, and rendering dynamic content.

### Error Handling
`<svelte:boundary>` catches rendering and effect errors, handles pending async states, and provides error recovery:
```svelte
<svelte:boundary onerror={(e, r) => { error = e; reset = r; }}>
	<p>{await delayed('hello!')}</p>
	{#snippet pending()}<p>loading...</p>{/snippet}
	{#snippet failed(error, reset)}<button onclick={reset}>try again</button>{/snippet}
</svelte:boundary>
```
Note: Does not catch errors in event handlers or setTimeout.

### Window & Document Access
`<svelte:window>` attaches event listeners and binds to window properties (innerWidth, innerHeight, scrollX, scrollY, online, devicePixelRatio):
```svelte
<svelte:window onkeydown={handleKeydown} bind:scrollY={y} />
```

`<svelte:document>` attaches listeners and actions to document, with readonly bindings for activeElement, fullscreenElement, pointerLockElement, visibilityState:
```svelte
<svelte:document onvisibilitychange={handleVisibilityChange} use:someAction />
```

`<svelte:body>` attaches listeners to document.body for events like mouseenter/mouseleave.

### Head & Dynamic Elements
`<svelte:head>` inserts elements into document.head:
```svelte
<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="SEO description" />
</svelte:head>
```

`<svelte:element>` renders a DOM element with runtime-determined tag name via the `this` prop. Only `bind:this` binding is supported. Use `xmlns` attribute for SVG.

### Configuration
`<svelte:options>` sets per-component compiler options: `runes`, `namespace`, `customElement`, `css="injected"`.

### runtime-apis
Core runtime APIs for state management (stores, context), component lifecycle, and imperative component creation/rendering.

## Stores

Reactive objects accessed via `$` prefix in components with automatic subscription/unsubscription.

```svelte
import { writable } from 'svelte/store';
const count = writable(0);
$count = 2; // calls .set()
```

**API:**
- `writable(initial, onSubscribe?)` - `.set()` and `.update()` methods
- `readable(initial, onSubscribe)` - Read-only store
- `derived(store(s), callback, initial?)` - Computed store
- `readonly(store)` - Wrap as read-only
- `get(store)` - Synchronous value retrieval

Store contract: Must have `.subscribe(fn)` returning unsubscribe function. Optionally `.set(value)` for writable stores.

## Context

Parent-to-child value passing without prop-drilling. Use `setContext(key, value)` in parent and `getContext(key)` in child. For reactive state, mutate objects rather than reassigning. Use `createContext<T>()` for type safety. Context is isolated per request.

## Lifecycle Hooks

Two phases: creation and destruction.

- `onMount()` - Client-side initialization, returns cleanup function
- `onDestroy()` - Cleanup, runs server-side
- `tick()` - Post-update logic
- `$effect.pre()` - Runs before DOM update
- `$effect()` - Runs after DOM update

```svelte
onMount(() => {
  return () => { /* cleanup */ };
});

$effect.pre(() => {
  messages; // runs before DOM update
  tick().then(() => { /* after update */ });
});
```

## Imperative Component API

- `mount(App, { target, props })` - Instantiate and mount component
- `unmount(app, { outro: true })` - Remove component with optional transitions
- `render(App, { props })` - Server-only, returns `{ body, head }` for SSR
- `hydrate(App, { target, props })` - Reuse SSR HTML and make interactive

### miscellaneous
Advanced topics covering testing strategies, TypeScript integration, web components, and migration guides for Svelte 4 and 5.

## Testing

**Vitest**: Configure `vite.config.js` with `resolve: { conditions: ['browser'] }` when `VITEST` env var is set. Name test files `.svelte.test.js` to use runes. Use `$effect.root()` and `flushSync()` for effect testing. Mount components with `mount(Component, { target, props })`. Use `@testing-library/svelte` for less brittle tests.

**Storybook**: Create stories with `defineMeta()` and test interactions via the `play` function.

**Playwright**: Configure `playwright.config.js` with `webServer` to start your app. Write tests using page locators and assertions.

## TypeScript

Add `lang="ts"` to script tags. For full support, configure `vitePreprocess` in `svelte.config.js`. Set `tsconfig.json`: `target: ES2015`, `verbatimModuleSyntax: true`, `isolatedModules: true`. Type `$props()` with interfaces, use `generics` attribute for generic components, and `Component`/`ComponentProps` types for component typing. Augment `svelte/elements` module for custom attributes.

## Custom Elements

Compile to web components with `customElement: true` in config. Specify tag name: `<svelte:options customElement="my-element" />`. Props exposed as DOM properties and attributes. Register with `customElements.define('my-element', MyElement.element)`.

Advanced options via object syntax: `tag` (auto-register), `shadow: "none"` (disable shadow DOM), `props` (per-property config), `extend` (customize class).

Limitations: styles encapsulated, not SSR-friendly, slotted content renders eagerly, context doesn't cross boundaries, avoid property names starting with `on`.

## Svelte 4 Migration

**Requirements**: Node 16+, TypeScript 5+. **Bundlers**: specify `browser` condition. **ESM only**: CJS removed. **Stricter types**: `createEventDispatcher`, `Action`, `ActionReturn`, `onMount`. **Custom elements**: `tag` → `customElement`. **Deprecated**: `SvelteComponentTyped` → `SvelteComponent`. **Transitions**: local by default, use `|global` for old behavior. **Slot bindings**: default and named slots no longer share bindings. **Preprocessors**: execute in order (markup, script, style per preprocessor); MDsveX must come first. **ESLint**: `eslint-plugin-svelte3` → `eslint-plugin-svelte`. **Other**: `inert` on outroing elements, `classList.toggle`/`CustomEvent` may need polyfills, `svelte.JSX` → `svelteHTML`.

## Svelte 5 Migration

**Reactivity**: `let` → `$state()`, `$:` → `$derived()` or `$effect()`. **Props**: `export let` → `let { prop } = $props()`. **Events**: `on:click` → `onclick`, `createEventDispatcher` → callback props. **Slots**: `<slot />` → `children` prop with `{@render children?.()}`. **Components**: `new Component()` → `mount(Component, { target })`. Run `npx sv migrate svelte-5` for automatic conversion.

## FAQ

**Getting Started**: Interactive tutorial (5-10 min to start, 1.5 hrs full). **Support**: Reference docs for syntax, Stack Overflow for code questions, Discord/Reddit for discussions. **Tooling**: Official VS Code extension, prettier-plugin-svelte, `@component` comments for documentation. **Routing**: SvelteKit is official (filesystem router, SSR, HMR). **Mobile**: Tauri or Capacitor with SvelteKit SPA. **Styling**: Unused styles removed automatically, use `:global(...)` for global styles. **HMR**: SvelteKit supports via Vite and svelte-hmr.

### api-reference
Complete API reference for Svelte 5 runtime, compiler, and error handling with type definitions and examples.

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

### legacy-mode-api
Legacy Svelte 3/4 API for reactive variables, component props, slots, events, and imperative component control.

## Reactivity

Top-level variables are automatically reactive in legacy mode. Reactivity is assignment-based—array mutations require reassignment to trigger updates:

```svelte
let numbers = [1, 2, 3];
numbers.push(4); // no update
numbers = numbers; // triggers update
```

Reactive statements use `$:` prefix and re-run when dependencies change:

```svelte
$: sum = a + b;
$: console.log(sum);
```

Dependencies are determined by compile-time static analysis only.

## Component API

Props are declared with `export` keyword:

```svelte
export let foo;
export let bar = 'default value';
export { className as class }; // renaming
```

Access all props with `$$props` or all non-declared props with `$$restProps`:

```svelte
<button {...$$restProps} class="variant-{variant}">click me</button>
```

Check which named slots were provided using `$$slots`:

```svelte
{#if $$slots.description}
  <slot name="description" />
{/if}
```

## Slots

Default and named slots with fallback content:

```svelte
<slot></slot>
<slot name="buttons">Default button</slot>
```

Pass data to slots:

```svelte
<!-- Component -->
<slot item={process(data)} />

<!-- Parent -->
<FancyList let:item={processed}>
  <div>{processed.text}</div>
</FancyList>
```

Use `<svelte:fragment slot="name">` to fill named slots without a wrapper element.

## Events

Event handlers use `on:` directive with optional modifiers:

```svelte
<button on:click|once|preventDefault={handleClick}>click</button>
```

Available modifiers: `preventDefault`, `stopPropagation`, `stopImmediatePropagation`, `passive`, `nonpassive`, `capture`, `once`, `self`, `trusted`

Forward events with `<button on:click>`.

Dispatch component events:

```svelte
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
dispatch('decrement');
```

## Dynamic Components

Render components dynamically with `<svelte:component this={MyComponent} />`, which recreates the instance when `this` changes.

Use `<svelte:self>` for recursive component inclusion.

## Imperative API

Create and control components programmatically:

```ts
const app = new App({
  target: document.body,
  props: { answer: 42 },
  hydrate: false
});

app.$set({ answer: 43 });
app.$on('event', callback);
app.$destroy();
```

With `accessors: true`, props are synchronous getters/setters:

```ts
component.count += 1;
```

Server-side rendering:

```ts
const { head, html, css } = App.render({ answer: 42 });
```

**Note:** Svelte 5 uses `mount()`, `unmount()`, and `$state` instead.


