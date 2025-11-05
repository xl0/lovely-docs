## Minimum Version Requirements
- Node 16+, SvelteKit 1.20.4+, vite-plugin-svelte 2.4.1+, webpack 5+ with svelte-loader 3.1.8+, rollup-plugin-svelte 7.1.5+, TypeScript 5+

## Browser Conditions for Bundlers
Bundlers must specify the `browser` condition. SvelteKit and Vite handle this automatically. For Rollup, set `browser: true` in `@rollup/plugin-node-resolve`. For webpack, add `"browser"` to `conditionNames` array.

## Removal of CJS Output
CommonJS format, `svelte/register` hook, and CJS runtime are removed. Use a bundler to convert ESM to CJS if needed.

## Stricter Types
- `createEventDispatcher` now enforces payload requirements (optional, required, or non-existent)
- `Action` and `ActionReturn` default to `undefined` parameter type; must specify generic if parameters are used
- `onMount` shows error if returning function asynchronously (only sync returns are called on destroy)

## Custom Elements
Replace `<svelte:options tag="my-component" />` with `<svelte:options customElement="my-component" />` for more configurability.

## SvelteComponentTyped Deprecated
Replace `SvelteComponentTyped` with `SvelteComponent`. When using `SvelteComponent` as instance type, use `typeof SvelteComponent<any>`.

## Transitions Local by Default
Transitions no longer play when nested control flow blocks are created/destroyed unless the direct parent is affected. Add `|global` modifier to restore old behavior.

## Default Slot Bindings
Default slot bindings are no longer exposed to named slots and vice versa.

## Preprocessor Order Changed
Preprocessors now execute in order with markup, script, style processed per preprocessor. Previously all markup ran first, then all scripts, then all styles. Each preprocessor must have a name.

## ESLint Package
`eslint-plugin-svelte3` is deprecated. Switch to `eslint-plugin-svelte`.

## Other Breaking Changes
- `inert` attribute applied to outroing elements
- Runtime uses `classList.toggle(name, boolean)` and `CustomEvent` constructor (may need polyfills for old browsers)
- `StartStopNotifier` interface now requires update function in addition to set function
- `derived` throws error on falsy values instead of stores
- Type definitions for `svelte/internal` removed
- DOM node removal now batched, affecting event order with `MutationObserver`
- `svelte.JSX` namespace replaced with `svelteHTML` namespace; use `svelte/elements` for types