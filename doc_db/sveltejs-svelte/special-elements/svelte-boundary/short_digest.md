## svelte:boundary

Error boundary for catching rendering/effect errors and handling pending async states (added in 5.3.0).

**pending** - Show UI while `await` expressions resolve:
```svelte
<svelte:boundary>
	<p>{await delayed('hello!')}</p>
	{#snippet pending()}<p>loading...</p>{/snippet}
</svelte:boundary>
```

**failed** - Handle errors with `error` and `reset`:
```svelte
<svelte:boundary>
	<FlakyComponent />
	{#snippet failed(error, reset)}
		<button onclick={reset}>try again</button>
	{/snippet}
</svelte:boundary>
```

**onerror** - Function for error tracking or external state:
```svelte
<svelte:boundary onerror={(e, r) => { error = e; reset = r; }}>
	<FlakyComponent />
</svelte:boundary>
```

Note: Errors outside rendering (event handlers, setTimeout) are not caught.