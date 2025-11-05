## Reactive $: Statements (Legacy Mode)

In legacy Svelte, top-level statements can be made reactive by prefixing with `$:`. These run after other script code and before markup renders, then re-run whenever their dependencies change.

**Basic Usage:**
```svelte
<script>
	let a = 1;
	let b = 2;
	$: console.log(`${a} + ${b} = ${sum}`);
	$: sum = a + b;
</script>
```

**Key Behaviors:**
- Statements are ordered topologically by dependencies, not source order
- Multiple statements can be grouped in a block
- Left-hand side can be an identifier or destructuring assignment: `$: ({ x, y } = obj)`

**Dependency Tracking:**
- Dependencies are determined at compile time based on referenced variables
- Indirect dependencies don't work: `$: doubled = double()` won't re-run when `count` changes if `double` is a function that reads `count`
- Topological ordering fails with indirect references; reorder statements to fix

**Browser-Only Code:**
Wrap in an `if` block since reactive statements run during SSR:
```js
$: if (browser) {
	document.title = title;
}
```