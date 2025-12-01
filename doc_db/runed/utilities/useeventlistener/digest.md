## useEventListener

A function that attaches an automatically disposed event listener to DOM elements.

### Purpose
Useful for attaching event listeners to elements you don't directly control, such as the document body, window, or element references received from parent components. Eliminates the need for manual cleanup.

### Key Features
- **Automatic Cleanup:** Event listener is removed automatically when the component is destroyed or when the element reference changes.
- **Lazy Initialization:** Target element can be defined using a function, enabling flexible and dynamic behavior.
- **Convenient for Global Listeners:** Ideal for scenarios where attaching event listeners directly to DOM elements is cumbersome or impractical.

### Example: Tracking Clicks

```ts
import { useEventListener } from "runed";

export class ClickLogger {
	#clicks = $state(0);

	constructor() {
		useEventListener(
			() => document.body,
			"click",
			() => this.#clicks++
		);
	}

	get clicks() {
		return this.#clicks;
	}
}
```

Usage in a Svelte component:
```svelte
<script lang="ts">
	import { ClickLogger } from "./ClickLogger.ts";
	const logger = new ClickLogger();
</script>

<p>
	You've clicked the document {logger.clicks}
	{logger.clicks === 1 ? "time" : "times"}
</p>
```

The function accepts a target element getter function, event name, and callback handler. The listener automatically cleans up when the component unmounts or the element reference changes.