## Reactive Built-ins

Svelte provides reactive versions of standard JavaScript objects that trigger re-evaluation in effects and derived values when their contents change:

- **SvelteMap**: Reactive Map. Reading via iteration, `size`, `get()`, or `has()` triggers reactivity. Values are not deeply reactive.
- **SvelteSet**: Reactive Set. Reading via iteration, `size`, or `has()` triggers reactivity. Values are not deeply reactive.
- **SvelteDate**: Reactive Date. Reading via methods like `getTime()`, `toString()`, or through `Intl.DateTimeFormat` triggers reactivity.
- **SvelteURL**: Reactive URL. Reading properties like `href`, `pathname`, `protocol`, `hostname` triggers reactivity. Has a `searchParams` property that is a SvelteURLSearchParams instance.
- **SvelteURLSearchParams**: Reactive URLSearchParams. Reading via iteration, `get()`, or `getAll()` triggers reactivity.
- **MediaQuery** (5.7.0+): Creates a media query with a `current` property reflecting match status. Use CSS media queries when possible to avoid hydration mismatches.

## createSubscriber

Returns a `subscribe` function that integrates external event-based systems with Svelte's reactivity. When called inside an effect, the `start` callback receives an `update` function that re-runs the effect when called. If `start` returns a cleanup function, it's called when the effect is destroyed. Multiple effects share a single `start` call; cleanup only runs when all effects are destroyed.

Example - MediaQuery implementation:
```js
import { createSubscriber } from 'svelte/reactivity';
import { on } from 'svelte/events';

export class MediaQuery {
	#query;
	#subscribe;

	constructor(query) {
		this.#query = window.matchMedia(`(${query})`);
		this.#subscribe = createSubscriber((update) => {
			const off = on(this.#query, 'change', update);
			return () => off();
		});
	}

	get current() {
		this.#subscribe();
		return this.#query.matches;
	}
}
```