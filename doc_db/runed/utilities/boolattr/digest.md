## boolAttr

Transforms any value into `""` (empty string) or `undefined` for use with HTML boolean attributes where presence indicates truth.

### Problem
Boolean values rendered directly in Svelte attributes become string values, causing both truthy and falsy states to render the attribute as present:
```svelte
<div data-active={true}>Content</div>  <!-- renders as: <div data-active="true"> -->
<div data-active={false}>Content</div> <!-- renders as: <div data-active="false"> -->
```

### Solution
`boolAttr` ensures proper boolean attribute behavior by returning an empty string for truthy values (attribute present) or undefined for falsy values (attribute absent):
```svelte
<script lang="ts">
	import { boolAttr } from "runed";
	let isActive = $state(true);
	let isLoading = $state(false);
</script>

<div data-active={boolAttr(isActive)}>Active content</div>    <!-- renders as: <div data-active> -->
<div data-loading={boolAttr(isLoading)}>Loading content</div>  <!-- renders as: <div> -->
```

### Type Definition
```ts
function boolAttr(value: unknown): "" | undefined;
```

**Parameters:**
- `value` (`unknown`) - Any value to be converted to a boolean attribute

**Returns:**
- `""` (empty string) - When `value` is truthy
- `undefined` - When `value` is falsy