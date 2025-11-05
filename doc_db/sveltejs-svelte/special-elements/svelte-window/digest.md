The `<svelte:window>` element attaches event listeners to the window object and automatically cleans them up when the component is destroyed. It handles server-side rendering safely without manual window existence checks.

**Event listeners:**
```svelte
<script>
	function handleKeydown(event) {
		alert(`pressed the ${event.key} key`);
	}
</script>

<svelte:window onkeydown={handleKeydown} />
```

**Bindable properties** (readonly except scrollX/scrollY):
- `innerWidth`, `innerHeight`, `outerWidth`, `outerHeight`
- `scrollX`, `scrollY` (writable)
- `online` (alias for `window.navigator.onLine`)
- `devicePixelRatio`

```svelte
<svelte:window bind:scrollY={y} />
```

**Constraints:**
- Must appear at the top level of the component only
- scrollX/scrollY binding won't scroll to initial value; use `scrollTo()` in `$effect` if needed