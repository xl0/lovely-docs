## Props in Legacy Mode

Declare props with `export` keyword, optionally with defaults:

```svelte
export let foo;
export let bar = 'default value';
```

## Component Exports

Export functions/classes as public API (not props):

```svelte
export function greet(name) { ... }
```

## Renaming Props

```svelte
let className;
export { className as class };
```