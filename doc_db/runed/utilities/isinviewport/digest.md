## IsInViewport

Tracks whether an element is visible within the current viewport using the Intersection Observer API.

### Purpose
Provides a reactive way to detect if a DOM element is currently visible in the viewport, useful for lazy loading, analytics, or triggering animations when elements come into view.

### How It Works
- Built on top of the `useIntersectionObserver` utility
- Accepts an element or a getter function that returns an element
- Supports optional configuration options that align with `useIntersectionObserver` options

### Usage
```svelte
<script lang="ts">
	import { IsInViewport } from "runed";

	let targetNode = $state<HTMLElement>()!;
	const inViewport = new IsInViewport(() => targetNode);
</script>

<p bind:this={targetNode}>Target node</p>

<p>Target node in viewport: {inViewport.current}</p>
```

### API
- **Constructor**: `new IsInViewport(node, options?)`
  - `node`: HTMLElement or getter function returning HTMLElement | null | undefined
  - `options`: Optional IsInViewportOptions (same as UseIntersectionObserverOptions)
- **Property**: `current` - boolean getter that returns true if element is in viewport