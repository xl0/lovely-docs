## Reactive $: Statements (Legacy)

Prefix top-level statements with `$:` to make them reactive. They re-run when dependencies change, ordered topologically.

```svelte
$: sum = a + b;
$: console.log(sum);
```

Dependencies are compile-time static analysis only—indirect references don't work. For browser-only code, wrap in `if (browser)` since these run during SSR.