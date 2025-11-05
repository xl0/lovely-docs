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