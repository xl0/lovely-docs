`<svelte:fragment>` places content in named slots without a wrapping DOM element. Use it to preserve flow layout when filling multiple slot elements.

```svelte
<svelte:fragment slot="footer">
	<p>All rights reserved.</p>
	<p>Copyright (c) 2019 Svelte Industries</p>
</svelte:fragment>
```

(Obsolete in Svelte 5+)