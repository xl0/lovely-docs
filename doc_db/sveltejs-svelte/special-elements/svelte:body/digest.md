The `<svelte:body>` element allows you to attach event listeners to `document.body` for events like `mouseenter` and `mouseleave` that don't fire on `window`. You can also apply actions to the body element.

```svelte
<svelte:body onmouseenter={handleMouseenter} onmouseleave={handleMouseleave} use:someAction />
```

This element must appear at the top level of your component and cannot be nested inside blocks or other elements. It works similarly to `<svelte:window>` and `<svelte:document>`.