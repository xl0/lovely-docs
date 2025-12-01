Reactively tracks focus state within a container element via the `current` boolean property. Constructor accepts a getter function returning the target HTMLElement.

**Example**:
```svelte
const focusWithinForm = new IsFocusWithin(() => formElement);
<p>Focus within form: {focusWithinForm.current}</p>
```