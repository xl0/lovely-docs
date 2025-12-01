A utility class that reactively tracks whether any descendant element has focus within a specified container element. Updates automatically when focus changes.

**Constructor**: Takes a getter function that returns an HTMLElement, undefined, or null.

**Property**: `current` - a readonly boolean indicating whether focus is currently within the container.

**Usage example**:
```svelte
<script lang="ts">
	import { IsFocusWithin } from "runed";

	let formElement = $state<HTMLFormElement>();
	const focusWithinForm = new IsFocusWithin(() => formElement);
</script>

<p>Focus within form: {focusWithinForm.current}</p>
<form bind:this={formElement}>
	<input type="text" />
	<button type="submit">Submit</button>
</form>
```

The utility accepts a MaybeGetter (either a direct value or a getter function) for the target element, making it flexible for reactive element references.