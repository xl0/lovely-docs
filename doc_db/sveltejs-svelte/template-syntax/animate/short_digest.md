## animate: Directive

Triggers animations when keyed each block contents are reordered. Use built-in functions or custom ones:

```svelte
{#each list as item (item)}
	<li animate:flip={{ delay: 500 }}>{item}</li>
{/each}
```

Custom animation functions receive `(node, { from: DOMRect, to: DOMRect }, params)` and return `{ delay?, duration?, easing?, css?, tick? }`. The `css(t, u)` method runs as a web animation; `tick(t, u)` runs on main thread.