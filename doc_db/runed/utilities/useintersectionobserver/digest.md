## useIntersectionObserver

Watch for intersection changes of a target element using the Intersection Observer API.

### Basic Usage

Pass a function returning the target element, a callback to handle intersection entries, and optional configuration:

```ts
import { useIntersectionObserver } from "runed";

let target = $state<HTMLElement | null>(null);
let isIntersecting = $state(false);

useIntersectionObserver(
	() => target,
	(entries) => {
		const entry = entries[0];
		if (!entry) return;
		isIntersecting = entry.isIntersecting;
	},
	{ root: () => root }
);
```

The callback receives an array of IntersectionObserverEntry objects. You can access properties like `isIntersecting` to determine if the target element is currently visible in the viewport or within a specified root element.

### Control Methods

The observer returns an object with control methods:

- `pause()` - Temporarily pause observation without stopping it
- `resume()` - Resume a paused observer
- `stop()` - Completely stop the observer

```ts
const observer = useIntersectionObserver(/* ... */);
observer.pause();
observer.resume();
observer.stop();
```

### isActive Property

Check if the observer is currently active via the `isActive` getter property. This cannot be destructured and must be accessed directly:

```ts
const observer = useIntersectionObserver(/* ... */);
if (observer.isActive) {
	// observer is running
}
```