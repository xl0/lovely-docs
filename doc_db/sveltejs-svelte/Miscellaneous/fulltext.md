

## Pages

### testing
Guide to testing Svelte applications using Vitest for unit/integration tests, component testing with mount API or testing-library, and Playwright for E2E tests.

## Unit/Integration Testing with Vitest

Configure `vite.config.js` to use browser entry points. Test files with `.svelte` in the name can use runes. Wrap effect tests in `$effect.root()` and use `flushSync()` for synchronous execution.

```js
test('Multiplier', () => {
	let double = multiplier(0, 2);
	expect(double.value).toEqual(0);
});
```

## Component Testing

Use `mount()` API or `@testing-library/svelte` for higher-level testing:

```js
const component = mount(Component, { target: document.body, props: { initial: 0 } });
```

## E2E Testing with Playwright

Configure `playwright.config.js` with webServer settings and write tests that interact with the DOM:

```js
test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});
```

### typescript
Using TypeScript in Svelte components with type annotations, preprocessor setup, prop/state typing, generics, and DOM type augmentation.

## TypeScript in Svelte

Add `lang="ts"` to script tags for type-only features. For full TypeScript support, configure `vitePreprocess` in `svelte.config.js`.

Set `tsconfig.json`: `target: ES2015`, `verbatimModuleSyntax: true`, `isolatedModules: true`.

## Typing Props and State

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

## Component Types

```ts
import type { Component, ComponentProps } from 'svelte';
interface Props {
	DynamicComponent: Component<{ prop: string }>;
}
```

## Enhancing DOM Types

Extend custom attributes/events in a `.d.ts` file:

```ts
declare namespace svelteHTML {
	interface IntrinsicElements {
		'my-custom-element': { someattribute: string; 'on:event': (e: CustomEvent) => void };
	}
}
```

### custom-elements
How to compile Svelte components to web components and configure their behavior, properties, and lifecycle.

## Custom Elements

Compile Svelte components to web components with `customElement: true` and `<svelte:options customElement="tag-name" />`. Props are exposed as DOM properties and attributes.

Advanced configuration via object in `<svelte:options>`:
- `tag` - Auto-register with this tag name
- `shadow: "none"` - Disable shadow DOM
- `props` - Configure per-property: `attribute`, `reflect`, `type`
- `extend` - Function to extend the custom element class

```svelte
<svelte:options customElement={{ tag: 'my-element', props: { name: { reflect: true } } }} />
```

Key limitations: styles are encapsulated, not SSR-friendly, slotted content renders eagerly, context doesn't cross custom element boundaries, avoid property names starting with `on`.

### svelte-4-migration-guide
Breaking changes and migration steps for upgrading from Svelte 3 to Svelte 4, including version requirements, type strictness improvements, and API changes.

## Key Changes
- **Minimum versions**: Node 16+, TypeScript 5+, SvelteKit 1.20.4+, webpack 5+
- **Browser condition**: Bundlers must specify `browser` condition (automatic in SvelteKit/Vite)
- **No CJS**: CommonJS output and `svelte/register` removed
- **Stricter types**: `createEventDispatcher`, `Action`, `ActionReturn`, `onMount` have stricter typing
- **Custom elements**: `tag` option → `customElement` option
- **SvelteComponentTyped**: Deprecated, use `SvelteComponent` instead
- **Transitions**: Local by default; use `|global` modifier for old behavior
- **Slot bindings**: Default slot bindings no longer exposed to named slots
- **Preprocessors**: Execute in order (markup, script, style per preprocessor); each must have a name
- **ESLint**: Switch from `eslint-plugin-svelte3` to `eslint-plugin-svelte`
- **Other**: `inert` on outroing elements, `classList.toggle()` and `CustomEvent` used (may need polyfills), `svelte.JSX` → `svelteHTML`

### svelte-5-migration-guide
Svelte 5 replaces implicit reactivity with explicit runes ($state, $derived, $effect), changes event handling from directives to properties with callback props, replaces slots with snippets, converts components from classes to functions, and enforces stricter syntax and HTML structure.

## Key Changes

**Reactivity**: `let` → `$state`, `$:` → `$derived`/`$effect`, `export let` → `$props()`

**Events**: `on:click` → `onclick`, `createEventDispatcher` → callback props, event modifiers removed

**Slots**: `<slot />` → `children` prop with `{@render}`, named slots → props, `let:` → snippets

**Components**: Functions not classes; use `mount(App, {target})` instead of `new App({target})`

**Runes mode breaking changes**: No export bindings, `$bindable()` required for two-way binding, `accessors`/`immutable` ignored, stricter HTML/attributes

**Other**: Modern browsers only, whitespace simplified, `null`/`undefined` → empty string, form resets trigger bindings

### frequently-asked-questions
Common questions about getting started with Svelte, finding support, tooling, testing, routing, mobile development, and styling practices.

**Getting Started**: Interactive tutorial takes 5-10 minutes to run, 1.5 hours complete

**Support**: Reference docs, Stack Overflow (tag: svelte), Discord, Reddit

**Tooling**: Official VS Code extension, prettier-plugin-svelte for formatting

**Component Docs**: Use `@component` tag in HTML comments for Language Server support

**Testing**: Unit (Vitest), Component (jsdom/Playwright/Cypress), E2E (Playwright)

**Routing**: Official SvelteKit or alternatives like page.js, navaid, svelte-spa-router, Routify

**Mobile**: SvelteKit SPA → Tauri or Capacitor; Svelte Native for Svelte 4 only

**Styling**: Svelte removes unused styles; use `:global(...)` for global styles

**HMR**: Use SvelteKit (built on Vite) or community plugins for rollup/webpack

