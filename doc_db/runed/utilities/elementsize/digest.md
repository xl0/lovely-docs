## ElementSize

Provides reactive access to an element's width and height, automatically updating when the element's dimensions change. Similar to ElementRect but focused only on size measurements.

### Usage

```svelte
<script lang="ts">
	import { ElementSize } from "runed";

	let el = $state() as HTMLElement;
	const size = new ElementSize(() => el);
</script>

<textarea bind:this={el}></textarea>

<p>Width: {size.width} Height: {size.height}</p>
```

Pass a function that returns the target element to the constructor. Access the reactive `width` and `height` properties to get current dimensions.

### Type Definition

```ts
interface ElementSize {
	readonly width: number;
	readonly height: number;
}
```

The interface exposes two readonly properties: `width` and `height`, both numbers representing the element's current dimensions in pixels.