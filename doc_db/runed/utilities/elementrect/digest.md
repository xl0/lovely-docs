## ElementRect

Provides reactive access to an element's dimensions and position information, automatically updating when the element's size or position changes.

### Usage

```svelte
<script lang="ts">
	import { ElementRect } from "runed";

	let el = $state<HTMLElement>();
	const rect = new ElementRect(() => el);
</script>

<textarea bind:this={el}></textarea>

<p>Width: {rect.width} Height: {rect.height}</p>
<pre>{JSON.stringify(rect.current, null, 2)}</pre>
```

Pass a getter function that returns an HTMLElement (or undefined/null). Access dimensions via individual properties (`width`, `height`, `top`, `left`, `right`, `bottom`, `x`, `y`) or the complete `current` object containing all DOMRect properties except `toJSON`.

### Type Definition

```ts
type Rect = Omit<DOMRect, "toJSON">;

interface ElementRectOptions {
	initialRect?: DOMRect;
}

class ElementRect {
	constructor(node: MaybeGetter<HTMLElement | undefined | null>, options?: ElementRectOptions);
	readonly current: Rect;
	readonly width: number;
	readonly height: number;
	readonly top: number;
	readonly left: number;
	readonly right: number;
	readonly bottom: number;
	readonly x: number;
	readonly y: number;
}
```

Constructor accepts an optional `initialRect` option to set initial dimensions before the element is measured.