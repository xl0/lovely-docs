## Minimum Requirements
- Node 16+, SvelteKit 1.20.4+, vite-plugin-svelte 2.4.1+, webpack 5+ with svelte-loader 3.1.8+, rollup-plugin-svelte 7.1.5+, TypeScript 5+

## Bundler Configuration
Bundlers must specify the `browser` condition for frontend bundles. For Rollup, set `browser: true` in `@rollup/plugin-node-resolve`. For webpack, add `"browser"` to `conditionNames` array.

## CommonJS Removal
CJS output format, `svelte/register` hook, and CJS runtime are removed. Use a bundler to convert ESM to CJS if needed.

## Stricter Types
- `createEventDispatcher` now enforces payload requirements (optional, required, or non-existent)
- `Action` and `ActionReturn` default to `undefined` parameter type; specify generic if needed: `Action<HTMLElement, string>`
- `onMount` errors if you return a function asynchronously (only sync returns work as destroy callbacks)

## Custom Elements
Replace `<svelte:options tag="my-component" />` with `<svelte:options customElement="my-component" />`

## SvelteComponentTyped Deprecated
Replace `SvelteComponentTyped` with `SvelteComponent`. When using as type: `typeof SvelteComponent<any>`

## Transitions Local by Default
Transitions no longer play when nested control flow blocks are created/destroyed unless the direct parent is affected. Use `|global` modifier to restore old behavior.

## Slot Bindings
Default slot bindings are no longer exposed to named slots and vice versa.

## Preprocessor Order
Preprocessors now execute in order with markup, script, style processed per preprocessor. MDsveX must come before other script/style preprocessors. Each preprocessor must have a name.

## ESLint
`eslint-plugin-svelte3` is deprecated; migrate to `eslint-plugin-svelte`.

## Other Changes
- `inert` attribute applied to outroing elements
- Runtime uses `classList.toggle(name, boolean)` and `CustomEvent` constructor (may need polyfills for old browsers)
- `StartStopNotifier` interface now requires update function in addition to set function
- `derived` throws on falsy values instead of stores
- `svelte/internal` type definitions removed
- DOM node removal is now batched
- `svelte.JSX` namespace replaced with `svelteHTML` namespace; use `svelte/elements` for types