Reactive wrapper that tracks the previous value of a getter function via the `current` property.

```ts
const previous = new Previous(() => count);
console.log(previous.current); // Previous value
```