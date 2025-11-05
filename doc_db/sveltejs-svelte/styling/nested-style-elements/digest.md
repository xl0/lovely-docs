Only one top-level `<style>` tag is allowed per component. However, you can nest `<style>` tags inside other elements or logic blocks. Nested style tags are inserted as-is into the DOM without any scoping or processing applied.

```svelte
<div>
	<style>
		div {
			color: red;
		}
	</style>
</div>
```

This means nested styles will apply globally to all matching elements in the DOM, not just within the component.