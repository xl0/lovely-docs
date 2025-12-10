## Basic Usage
```svelte
// Parent: <MyComponent adjective="cool" />
// Child: let { adjective = 'happy' } = $props();
```

## Key Features
- **Destructuring**: Extract props with defaults and renaming
- **Rest props**: `let { a, b, ...others } = $props();`
- **Reactivity**: Props update when parent changes; child can reassign but shouldn't mutate
- **Type safety**: Add TypeScript or JSDoc annotations
- **`$props.id()`**: Generate unique instance IDs for element linking