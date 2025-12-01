## IsInViewport

Detects if an element is visible in the viewport using Intersection Observer.

```svelte
const inViewport = new IsInViewport(() => targetNode);
// inViewport.current returns boolean
```

Accepts element or getter function and optional observer options.