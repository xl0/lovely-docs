The `svelte/reactivity/window` module provides reactive wrappers for window and navigator properties that automatically update when values change. Each export has a `.current` property that can be used in reactive contexts (templates, deriveds, effects) without manual event listeners.

Available exports:
- `innerWidth.current` / `innerHeight.current` - viewport dimensions
- `outerWidth.current` / `outerHeight.current` - window dimensions
- `scrollX.current` / `scrollY.current` - scroll position
- `screenLeft.current` / `screenTop.current` - window position (updated via requestAnimationFrame)
- `devicePixelRatio.current` - pixel ratio (browser zoom behavior varies)
- `online.current` - network status from navigator.onLine

All values are `undefined` on the server.

Usage example:
```svelte
<script>
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';
</script>

<p>{innerWidth.current}x{innerHeight.current}</p>
```