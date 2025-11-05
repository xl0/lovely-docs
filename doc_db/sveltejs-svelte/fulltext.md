
## Directories

### Introduction
Getting started with Svelte project setup, component file structure, and reactive logic patterns.

## Project Setup

Create a new project with SvelteKit:
```bash
npx sv create myapp
npm install
npm run dev
```

Alternative with Vite:
```bash
npm create vite@latest  # select svelte
npm run build
```

Vite is recommended over Rollup/Webpack. VS Code extension available.

## Component Files

Svelte components use `.svelte` files with optional `<script>`, `<style>`, and markup sections:
- `<script>` runs per component instance
- `<script module>` runs once at module load
- `<style>` CSS is automatically scoped to the component

```svelte
<script module>
	let total = 0;
</script>

<script>
	total += 1;
</script>

<style>
	p { color: burlywood; }
</style>
```

## Reactive Logic Files

`.svelte.js` and `.svelte.ts` files are regular JS/TS modules that support Svelte runes for creating reusable reactive logic and sharing reactive state across your app.

### Runes
Runes are $-prefixed compiler keywords that manage reactive state, derived values, side effects, and component communication in Svelte.

## Runes

Runes are `$`-prefixed compiler keywords that control Svelte's reactivity. Unlike functions, they cannot be imported, assigned, or passed as arguments.

### $state
Creates reactive variables. Arrays and objects become deeply reactive proxies:
```js
let count = $state(0);
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers update
```
Use `$state.raw` for non-reactive state. Use `$state.snapshot()` to get a plain object from a proxy.

### $derived
Declares computed state that automatically updates when dependencies change:
```svelte
let count = $state(0);
let doubled = $derived(count * 2);
```
For complex logic, use `$derived.by(() => { ... })`. Expressions must be side-effect free. Uses push-pull reactivity—dependents are notified immediately, but derived values only re-evaluate when read.

### $effect
Runs side-effect functions that automatically track reactive dependencies and re-run when they change:
```svelte
$effect(() => {
	const context = canvas.getContext('2d');
	context.fillStyle = color;
	context.fillRect(0, 0, size, size);
});
```
Supports teardown functions: `$effect(() => { const interval = setInterval(...); return () => clearInterval(interval); })`. Use `$effect.pre` to run before DOM updates. Use `$effect.root()` for manually-controlled effects.

### $props
Receives component inputs with destructuring and fallback values:
```svelte
let { adjective = 'happy', super: trouper, ...others } = $props();
```
Generate unique instance IDs with `$props.id()`.

### $bindable
Marks props as bindable to enable two-way data binding:
```svelte
// Child
let { value = $bindable() } = $props();
// Parent
<Child bind:value={message} />
```

### $inspect
Development-only rune for reactive logging:
```svelte
$inspect(count, message); // logs on change
$inspect(count).with((type, value) => { /* custom handler */ });
$inspect.trace(); // traces which reactive state caused re-run
```

### $host
Accesses the host element in custom element components:
```svelte
$host().dispatchEvent(new CustomEvent(type));
```

### Template Syntax
Svelte's template syntax for markup, expressions, conditionals, loops, snippets, and reactive directives for binding, styling, transitions, and animations.

# Template Syntax

## Markup & Attributes
Lowercase tags are HTML elements; capitalized/dot-notation tags are components. Attributes support JavaScript expressions and shorthand: `<button disabled={!clickable}>` or `<button {disabled}>`. Spread attributes: `<Widget {...things} />`. Boolean attributes included if truthy.

## Text & HTML
Include expressions with braces: `<h1>Hello {name}!</h1>`. Use `{@html}` for raw HTML (sanitize to prevent XSS). Null/undefined omitted, others stringified.

## Events
Listen with `on` prefix: `<button onclick={handler}>`. Event attributes are case-sensitive and delegated to root for performance.

## Conditional Rendering
`{#if expression}...{:else if}...{:else}...{/if}` for conditional blocks.

## Iteration
`{#each items as item (item.id)}` iterates with optional keying for efficient updates. Supports destructuring and `{:else}` for empty lists.

## Key Block
`{#key expression}...{/key}` destroys and recreates contents when expression changes, useful for reinitializing components or replaying transitions.

## Async Handling
`{#await promise}...{:then value}...{:catch error}...{/await}` branches on Promise states. SSR only renders pending state.

## Snippets
Reusable markup declared with `{#snippet name(params)}...{/snippet}` and rendered with `{@render name()}`. Pass to components explicitly or implicitly:
```svelte
<Table {header} {row} />
<!-- or -->
<Table>
  {#snippet header()}...{/snippet}
  {#snippet row(d)}...{/snippet}
</Table>
```
Type with `Snippet<[ParamType]>`. Use optional chaining for optional snippets: `{@render children?.()}`.

## Directives

**bind:** Two-way binding between components/DOM. `bind:value`, `bind:checked`, `bind:group` (radio/checkbox), `bind:files`. Media: `bind:currentTime`, `bind:paused`, `bind:volume`. Dimensions: `bind:clientWidth`, `bind:clientHeight`. Components: mark props with `$bindable()`. Function bindings for validation: `bind:property={get, set}`.

**use:** Actions attached on mount via `use:myaction={data}`. Define with `$effect` for setup/teardown.

**style:** Inline styles with shorthand: `style:color="red" style:width={w} style:background-color|important={bg}`.

**class:** Set classes via attribute (preferred): `class={condition ? 'large' : 'small'}` or `class={{ cool, lame: !cool }}`. Legacy directive: `class:cool={cool}`.

**transition:** Bidirectional animations on enter/leave: `transition:fade={{ duration: 2000 }}` or `transition:fade|global`. Custom transitions return `{ duration, css(t, u) }` or `{ tick(t, u) }`. Events: `introstart`, `introend`, `outrostart`, `outroend`.

**in:/out:** Non-bidirectional transitions. `in` plays alongside `out` rather than reversing: `in:fly={{ y: 200 }} out:fade`.

**animate:** Reordering animations in keyed each blocks: `animate:flip={{ delay: 500 }}`. Custom functions receive `{ from, to }` DOMRect and return `{ duration, easing, css(t, u) }`.

**@attach:** Reactive functions on mount/update: `{@attach myAttachment}`. Return cleanup function. Factories for reusable patterns: `{@attach tooltip(content)}`.

**@const:** Local constants in block scope: `{@const area = box.width * box.height}`.

**@debug:** Log variables on change: `{@debug variable}` or `{@debug}` for any state change.

## Comments
HTML comments work. `svelte-ignore` disables warnings. `@component` shows documentation on hover.

### Styling
Component styling with automatic scoping, global style overrides, CSS custom properties, and nested style behavior.

## Scoped Styles

Svelte automatically scopes component styles by adding hash-based classes (e.g., `svelte-123xyz`) to elements. Scoped selectors receive a 0-1-0 specificity boost, taking precedence over global styles. Keyframes are also scoped automatically.

## Global Styles

Use `:global(selector)` to apply styles globally. Use `-global-` prefix for keyframes. Use `:global { ... }` block for multiple global selectors:

```svelte
<style>
	:global(body) { margin: 0; }
	@keyframes -global-my-animation { }
	:global { div { } p { } }
</style>
```

## CSS Custom Properties

Pass CSS custom properties to components with `--property-name` syntax and read them using `var(--property-name, fallback)`. Properties are inherited from parent elements and can be defined globally on `:root`.

## Nested Style Elements

Only one top-level `<style>` tag per component is allowed. Nested `<style>` tags inside elements or logic blocks bypass scoping and apply globally to the DOM:

```svelte
<div>
	<style>
		div { color: red; }
	</style>
</div>
```

### Special Elements
Built-in components for accessing browser APIs, error handling, and controlling component compilation.

## Special Elements

Built-in components for accessing browser APIs and controlling rendering behavior.

### Error Handling
**`<svelte:boundary>`** — Catches rendering, update, and effect errors in children. Requires either a `failed` snippet or `onerror` callback. The `failed` snippet receives `error` and `reset` parameters for recovery UI. Does not catch event handler or async errors.

```svelte
<svelte:boundary>
	<Component />
	{#snippet failed(error, reset)}
		<button onclick={reset}>Retry</button>
	{/snippet}
</svelte:boundary>
```

### Window & Document
**`<svelte:window>`** — Attaches event listeners to `window` with automatic cleanup. Bindable properties: `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`, `scrollX`, `scrollY`, `online`, `devicePixelRatio`.

**`<svelte:document>`** — Attaches event listeners and actions to `document`. Bindable readonly properties: `activeElement`, `fullscreenElement`, `pointerLockElement`, `visibilityState`.

**`<svelte:body>`** — Attaches event listeners and actions to `document.body`. Use for events like `mouseenter` and `mouseleave` that don't fire on `window`.

All three must be at component top level only.

```svelte
<svelte:window bind:scrollY={y} onkeydown={handleKeydown} />
<svelte:document bind:activeElement={el} onvisibilitychange={handler} />
<svelte:body onmouseenter={handleMouseenter} use:someAction />
```

### Head & DOM
**`<svelte:head>`** — Inserts elements into `document.head`. Must appear only at component top level.

```svelte
<svelte:head>
	<title>Hello world!</title>
	<meta name="description" content="SEO description" />
</svelte:head>
```

**`<svelte:element>`** — Renders a DOM element with runtime-determined tag name via the `this` prop. If `this` is nullish, nothing renders. Only `bind:this` binding works.

```svelte
<svelte:element this={tag} />
```

### Configuration
**`<svelte:options>`** — Specifies per-component compiler options:
- `runes={true|false}` — Forces runes or legacy mode
- `namespace="html|svg|mathml"` — Sets component namespace
- `customElement={...}` — Configures custom element compilation
- `css="injected"` — Injects styles inline

### Runtime APIs
Core runtime APIs for state management, component lifecycle, context passing, and imperative component control in Svelte.

## Stores

Reactive values accessed via `$` prefix. Svelte 5 runes reduce necessity, but stores remain useful for async data and manual control.

- `writable(initial, startFn?)` - Mutable store with `.set()` and `.update()`
- `readable(initial, startFn)` - Immutable store
- `derived(store(s), callback, initial?)` - Computed store
- `readonly(store)` - Read-only wrapper
- `get(store)` - Get value without subscribing

Store contract: `.subscribe(fn)` returning unsubscribe function, optionally `.set()` for writable stores.

```js
const count = writable(0);
count.subscribe(v => console.log(v));
count.set(1);
```

## Context API

Pass values parent-to-child without prop-drilling using `setContext(key, value)` and `getContext(key)`. Store reactive state by mutating objects. Wrap in helpers for type safety. Context is request-isolated (safe for SSR).

```svelte
// Parent
setContext('my-context', 'value');
// Child
const value = getContext('my-context');
```

## Lifecycle Hooks

- `onMount` - Runs when component mounts to DOM, can return cleanup function, doesn't run on server
- `onDestroy` - Runs before unmount, only hook that runs on server
- `tick()` - Returns promise resolving after pending state changes apply
- Use `$effect.pre` and `$effect` runes instead of deprecated `beforeUpdate`/`afterUpdate`

```svelte
$effect.pre(() => {
	messages;
	const autoscroll = viewport?.offsetHeight + viewport?.scrollTop > viewport?.scrollHeight - 50;
	if (autoscroll) tick().then(() => viewport.scrollTo(0, viewport.scrollHeight));
});
```

## Imperative Component API

- `mount(Component, options)` - Instantiate and mount component to DOM element
- `unmount(component)` - Remove mounted component, returns Promise if `outro: true`
- `render(Component, options)` - Server-only, returns `{ body, head }`
- `hydrate(Component, options)` - Like mount but reuses server-rendered HTML

### Miscellaneous
Testing, TypeScript integration, custom elements, and migration guides for Svelte 4 and 5 with common questions answered.

## Testing

**Vitest**: Configure `vite.config.js` for browser entry points. Wrap effect tests in `$effect.root()` and use `flushSync()` for synchronous execution.

```js
test('Multiplier', () => {
	let double = multiplier(0, 2);
	expect(double.value).toEqual(0);
});
```

**Component Testing**: Use `mount()` API or `@testing-library/svelte`.

```js
const component = mount(Component, { target: document.body, props: { initial: 0 } });
```

**Playwright E2E**: Configure `playwright.config.js` with webServer settings.

```js
test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});
```

## TypeScript

Add `lang="ts"` to script tags. Configure `vitePreprocess` in `svelte.config.js`. Set `tsconfig.json`: `target: ES2015`, `verbatimModuleSyntax: true`, `isolatedModules: true`.

```svelte
<script lang="ts" generics="Item extends { text: string }">
	interface Props {
		items: Item[];
		select(item: Item): void;
	}
	let { items, select }: Props = $props();
	let count: number = $state(0);
</script>
```

Extend DOM types in `.d.ts`:

```ts
declare namespace svelteHTML {
	interface IntrinsicElements {
		'my-custom-element': { someattribute: string; 'on:event': (e: CustomEvent) => void };
	}
}
```

## Custom Elements

Compile to web components with `customElement: true` and `<svelte:options customElement="tag-name" />`. Props exposed as DOM properties and attributes.

```svelte
<svelte:options customElement={{ tag: 'my-element', props: { name: { reflect: true } } }} />
```

Configuration: `tag`, `shadow: "none"`, `props` (per-property: `attribute`, `reflect`, `type`), `extend` (function to extend class).

Limitations: styles encapsulated, not SSR-friendly, slotted content renders eagerly, context doesn't cross boundaries, avoid property names starting with `on`.

## Svelte 4 Migration

**Minimum versions**: Node 16+, TypeScript 5+, SvelteKit 1.20.4+, webpack 5+

**Breaking changes**:
- Bundlers must specify `browser` condition
- No CommonJS output or `svelte/register`
- Stricter types: `createEventDispatcher`, `Action`, `ActionReturn`, `onMount`
- `tag` option → `customElement` option
- `SvelteComponentTyped` → `SvelteComponent`
- Transitions local by default; use `|global` modifier
- Slot bindings not exposed to named slots
- Preprocessors execute in order with required names
- `svelte.JSX` → `svelteHTML`
- ESLint: `eslint-plugin-svelte3` → `eslint-plugin-svelte`

## Svelte 5 Migration

**Reactivity**: `let` → `$state`, `$:` → `$derived`/`$effect`, `export let` → `$props()`

**Events**: `on:click` → `onclick`, `createEventDispatcher` → callback props

**Slots**: `<slot />` → `children` prop with `{@render}`, named slots → props, `let:` → snippets

**Components**: Functions not classes; use `mount(App, {target})` instead of `new App({target})`

**Runes mode**: No export bindings, `$bindable()` required for two-way binding, `accessors`/`immutable` ignored, stricter HTML/attributes

**Other**: Modern browsers only, whitespace simplified, `null`/`undefined` → empty string, form resets trigger bindings

## FAQ

**Support**: Reference docs, Stack Overflow (tag: svelte), Discord, Reddit

**Tooling**: Official VS Code extension, prettier-plugin-svelte

**Routing**: SvelteKit (official) or page.js, navaid, svelte-spa-router, Routify

**Mobile**: SvelteKit SPA → Tauri or Capacitor; Svelte Native for Svelte 4 only

**Styling**: Svelte removes unused styles; use `:global(...)` for global styles

**HMR**: SvelteKit (built on Vite) or community plugins for rollup/webpack

### API Reference
Complete API reference for Svelte modules, compiler, and comprehensive error/warning documentation with solutions.

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

### Legacy Mode
Svelte 3/4 features deprecated in Svelte 5, including reactive variables, $: statements, export let props, event dispatching, slots, and imperative component APIs.

## Reactive Variables

Top-level variables are automatically reactive. Mutations require reassignment to trigger updates:
```svelte
let numbers = [1, 2, 3];
numbers.push(4); // no update
numbers = numbers; // triggers update
```

## Reactive Statements

Prefix statements with `$:` to make them reactive—they re-run when dependencies change and are topologically ordered:
```svelte
let a = 1, b = 2;
$: sum = a + b;
$: console.log(`${a} + ${b} = ${sum}`);
```

Dependencies are determined at compile time. Wrap browser-only code: `$: if (browser) { ... }`

## Props

Declare props with `export let`:
```svelte
export let foo;
export let bar = 'default value';
```

Rename props: `export { className as class };`

Access all props with `$$props` or undeclared props with `$$restProps`:
```svelte
<button {...$$restProps} class="variant-{$$props.class ?? ''}">click me</button>
```

## Event Handlers

Attach handlers with `on:` directive and chain modifiers with `|`:
```svelte
<button on:click={handleClick}>click me</button>
<form on:submit|preventDefault|once={handle}></form>
```

Available modifiers: `preventDefault`, `stopPropagation`, `stopImmediatePropagation`, `passive`, `nonpassive`, `capture`, `once`, `self`, `trusted`

Forward events: `<button on:click>forward event</button>`

Dispatch component events:
```svelte
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
dispatch('increment');
```

Only `once` modifier works on component events.

## Slots

Render slotted content with `<slot>`. Named slots use `slot="name"` attribute. Provide fallback content inside `<slot>` tags. Pass data to slots with props and expose to parent using `let:` directive.

Check if a named slot was provided with `$$slots`:
```svelte
{#if $$slots.description}
	<slot name="description" />
{/if}
```

Use `<svelte:fragment slot="name">` to place content in named slots without a wrapping DOM element.

## Dynamic Components

Use `<svelte:component this={MyComponent} />` to dynamically render components that change at runtime.

## Imperative API

Create components with:
```ts
const app = new App({
	target: document.body,
	props: { answer: 42 },
	hydrate: false,
	intro: false
});
```

Instance methods: `$set(props)`, `$on(event, callback)`, `$destroy()`

With `accessors: true`, props are synchronously settable: `component.count += 1;`

Server-side rendering: `const { head, html, css } = App.render({ answer: 42 });`


