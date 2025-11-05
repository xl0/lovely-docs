Svelte components can include a `<style>` element with CSS that is scoped to the component by default. Scoped styles are implemented by adding a hash-based class (e.g., `svelte-123xyz`) to affected elements, preventing styles from leaking outside the component.

Each scoped selector receives a specificity increase of 0-1-0 from the scoping class. This means a `p` selector in a component will override a `p` selector in a global stylesheet, even if the global stylesheet loads later. When the scoping class must be added multiple times to a selector, subsequent occurrences use `:where(.svelte-xyz123)` to avoid further specificity increases.

Component-defined `@keyframes` are also scoped using the same hashing approach, and any `animation` rules in the component are automatically adjusted to reference the scoped keyframe names:

```svelte
<style>
	.bouncy {
		animation: bounce 10s;
	}

	@keyframes bounce {
		/* keyframes only accessible inside this component */
	}
</style>
```