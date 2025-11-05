In legacy mode, top-level variables are automatically reactive. Reactivity is assignment-based, so array mutations need a subsequent assignment to trigger updates:

```svelte
let numbers = [1, 2, 3, 4];
numbers.push(5); // no update
numbers = numbers; // triggers update
```