Reactive wrappers for window properties via `svelte/reactivity/window`. Each export has a `.current` property: `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`, `scrollX`, `scrollY`, `screenLeft`, `screenTop`, `devicePixelRatio`, `online`. All are `undefined` on server.

```svelte
<script>
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
</script>
<p>{innerWidth.current}x{innerHeight.current}</p>
```