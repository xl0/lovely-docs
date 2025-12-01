## ScrollState

A reactive utility for tracking and controlling scroll behavior on DOM elements, window, or document.

### Core Capabilities

- **Position Tracking**: Access current scroll positions via `scroll.x` and `scroll.y` (reactive, get/set)
- **Direction Detection**: `scroll.directions` identifies active scroll directions (left, right, top, bottom)
- **Edge Detection**: `scroll.arrived` object indicates whether scroll has reached each edge
- **Progress Tracking**: `scroll.progress` provides percentage scrolled on x/y axes
- **Programmatic Scrolling**: `scroll.scrollTo(x, y)`, `scroll.scrollToTop()`, `scroll.scrollToBottom()`
- **Event Handling**: Listen to scroll and scroll-end events via callbacks
- **Layout Support**: Respects flex, RTL, and reverse layout modes

### Configuration Options

| Option | Type | Default | Purpose |
|--------|------|---------|---------|
| `element` | `MaybeGetter<HTMLElement \| Window \| Document \| null>` | Required | The scroll container |
| `idle` | `MaybeGetter<number \| undefined>` | 200ms | Debounce time after scroll ends |
| `offset` | `{ top?, bottom?, left?, right? }` | 0 | Pixel thresholds for edge detection |
| `onScroll` | `(e: Event) => void` | — | Scroll event callback |
| `onStop` | `(e: Event) => void` | — | Callback after scrolling stops |
| `eventListenerOptions` | `AddEventListenerOptions` | `{ passive: true, capture: false }` | Scroll listener configuration |
| `behavior` | `ScrollBehavior` | "auto" | Scroll animation: "auto", "smooth", etc. |
| `onError` | `(error: unknown) => void` | `console.error` | Error handler |

### Usage Example

```svelte
<script lang="ts">
	import { ScrollState } from "runed";

	let el = $state<HTMLElement>();

	const scroll = new ScrollState({
		element: () => el,
		idle: 300,
		offset: { top: 50, bottom: 50 }
	});
</script>

<div bind:this={el} style="overflow: auto; height: 200px;">
	{#if scroll.arrived.top}
		<p>At top</p>
	{/if}
	{#if scroll.directions.down}
		<p>Scrolling down</p>
	{/if}
	<button onclick={() => scroll.scrollToBottom()}>Go to bottom</button>
</div>
```

### Key Behaviors

- Both position (`x`, `y`) and edge arrival state (`arrived`) are reactive and can be set programmatically to trigger scrolling
- `onStop` is debounced and fires after scrolling ends and idle time elapses
- Layout direction and reverse flex settings are automatically considered in edge state calculations