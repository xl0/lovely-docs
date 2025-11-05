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