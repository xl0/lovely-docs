The `<svelte:body>` element attaches event listeners to `document.body` for events like `mouseenter` and `mouseleave`, and supports actions:

```svelte
<svelte:body onmouseenter={handleMouseenter} onmouseleave={handleMouseleave} use:someAction />
```

Must be at the top level of your component.