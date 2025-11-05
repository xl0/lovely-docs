In legacy mode, top-level variables are automatically reactive. Reassigning or mutating them triggers UI updates.

```svelte
<script>
	let count = 0;
</script>

<button on:click={() => count += 1}>
	clicks: {count}
</button>
```

Reactivity is assignment-based, so array mutations like `.push()` won't trigger updates without a subsequent assignment:

```svelte
<script>
	let numbers = [1, 2, 3, 4];

	function addNumber() {
		numbers.push(numbers.length + 1); // doesn't trigger update
		numbers = numbers; // assignment triggers update
	}
</script>
```