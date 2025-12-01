Reactive element dimension tracker. Pass a function returning the element to constructor, access `width` and `height` properties:

```svelte
const size = new ElementSize(() => el);
<p>Width: {size.width} Height: {size.height}</p>
```