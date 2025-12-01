## activeElement

Provides reactive access to the currently focused DOM element, similar to `document.activeElement` but with automatic reactive updates whenever focus changes.

### Key Features
- Synchronous updates with DOM focus changes
- Returns `null` when no element is focused
- SSR-safe
- Searches through Shadow DOM boundaries to find the true active element
- Lightweight alternative to manual focus tracking

### Basic Usage

```svelte
<script lang="ts">
	import { activeElement } from "runed";
</script>

<p>
	Currently active element:
	{activeElement.current?.localName ?? "No active element found"}
</p>
```

### Custom Document/Shadow Root

To scope focus tracking within a custom document or shadow root, pass a `DocumentOrShadowRoot` to the `ActiveElement` constructor:

```svelte
<script lang="ts">
	import { ActiveElement } from "runed";

	const activeElement = new ActiveElement({
		document: shadowRoot
	});
</script>
```

### Type Definition

```ts
interface ActiveElement {
	readonly current: Element | null;
}
```

The `current` property holds the currently focused element or `null` if no element has focus.