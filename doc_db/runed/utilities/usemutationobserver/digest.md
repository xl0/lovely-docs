## useMutationObserver

Hook to observe changes in a DOM element using the MutationObserver API.

### Basic Usage

Pass an element reference, a callback function to handle mutations, and configuration options:

```ts
import { useMutationObserver } from "runed";

let el = $state<HTMLElement | null>(null);
const messages = $state<string[]>([]);

useMutationObserver(
	() => el,
	(mutations) => {
		const mutation = mutations[0];
		if (!mutation) return;
		messages.push(mutation.attributeName!);
	},
	{ attributes: true }
);
```

The callback receives an array of mutations. In this example, the `attributes: true` option enables observation of attribute changes. When the element's class or style attributes change, the mutation's `attributeName` is captured.

### Stopping the Observer

Call the `stop` method to halt observation:

```ts
const { stop } = useMutationObserver(/* ... */);
stop();
```