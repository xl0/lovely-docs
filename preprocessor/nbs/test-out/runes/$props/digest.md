## Overview
Props are component inputs, passed like element attributes. Receive them using the `$props()` rune.

## Basic Usage
```svelte
// Parent
<MyComponent adjective="cool" />

// Child - receive all props
let props = $props();

// Child - destructure props (common pattern)
let { adjective } = $props();
```

## Fallback Values
Provide defaults for props not set by parent or when undefined:
```js
let { adjective = 'happy' } = $props();
```
Fallback values are not reactive state proxies.

## Renaming Props
Rename props using destructuring (useful for invalid identifiers or keywords):
```js
let { super: trouper = 'lights are gonna find me' } = $props();
```

## Rest Props
Capture remaining props:
```js
let { a, b, c, ...others } = $props();
```

## Updating Props
Props update reactively when parent changes them. Child can temporarily reassign but should not mutate:
```svelte
// Parent
let count = $state(0);
<Child {count} />

// Child - reassignment works
let { count } = $props();
<button onclick={() => (count += 1)}>clicks: {count}</button>
```

Mutation behavior:
- Regular object props: mutations have no effect
- Reactive state proxy props: mutations work but trigger `ownership_invalid_mutation` warning (don't do this)
- Fallback value props: mutations have no effect

Use callback props or `$bindable` rune for proper two-way communication.

## Type Safety
Add type annotations for better IDE support and documentation:

TypeScript:
```svelte
<script lang="ts">
	let { adjective }: { adjective: string } = $props();
	
	interface Props {
		adjective: string;
	}
	let { adjective }: Props = $props();
</script>
```

JSDoc:
```svelte
<script>
	/** @type {{ adjective: string }} */
	let { adjective } = $props();
</script>
```

## `$props.id()`
Generates unique ID per component instance (consistent during hydration). Useful for linking elements:
```svelte
const uid = $props.id();
<label for="{uid}-firstname">First Name:</label>
<input id="{uid}-firstname" type="text" />
```