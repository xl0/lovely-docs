`<svelte:window>` attaches event listeners and binds to window properties with automatic cleanup.

**Usage:**
```svelte
<svelte:window onkeydown={handleKeydown} bind:scrollY={y} />
```

**Bindable properties:** innerWidth, innerHeight, outerWidth, outerHeight, scrollX, scrollY, online, devicePixelRatio (only scrollX/scrollY are writable)