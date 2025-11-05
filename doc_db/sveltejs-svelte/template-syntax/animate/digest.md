## Animations in Keyed Each Blocks

Animations are triggered when contents of a keyed each block are reordered. They only run when the index of an existing item changes, not when items are added or removed. Animate directives must be on immediate children of keyed each blocks.

Use built-in animation functions or create custom ones:

```svelte
{#each list as item, index (item)}
	<li animate:flip={{ delay: 500 }}>{item}</li>
{/each}
```

### Custom Animation Functions

A custom animation function receives the node, an animation object with `from` and `to` DOMRect properties, and parameters. It returns an object with optional `delay`, `duration`, `easing`, `css`, and `tick` properties.

The `css` method receives `t` (0 to 1 after easing) and `u` (1 - t), and should return a CSS string. This runs as a web animation off the main thread.

```js
function whizz(node, { from, to }, params) {
	const dx = from.left - to.left;
	const dy = from.top - to.top;
	const d = Math.sqrt(dx * dx + dy * dy);
	
	return {
		delay: 0,
		duration: Math.sqrt(d) * 120,
		easing: cubicOut,
		css: (t, u) => `transform: translate(${u * dx}px, ${u * dy}px) rotate(${t * 360}deg);`
	};
}
```

Alternatively, return a `tick` function called during animation for imperative updates, though `css` is preferred for performance.