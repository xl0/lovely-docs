Install via `npm install runed`. Import utilities into `.svelte` or `.svelte.js|ts` files. Example with `activeElement`:

```svelte
<script lang="ts">
	import { activeElement } from "runed";
	let inputElement = $state<HTMLInputElement | undefined>();
</script>

<input bind:this={inputElement} />
{#if activeElement.current === inputElement}
	The input element is active!
{/if}
```

Or use reactively in modules with `$effect`.