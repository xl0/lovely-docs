## Installation

Install Runed via npm:
```bash
npm install runed
```

## Usage

Import utilities into `.svelte` or `.svelte.js|ts` files.

**In Svelte components:**
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

**In JavaScript/TypeScript modules:**
```ts
import { activeElement } from "runed";

function logActiveElement() {
	$effect(() => {
		console.log("Active element is ", activeElement.current);
	});
}

logActiveElement();
```

Utilities can be used reactively with `$effect` to track state changes.