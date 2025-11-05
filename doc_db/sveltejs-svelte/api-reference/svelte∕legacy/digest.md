## Deprecated Migration Functions

The `svelte/legacy` module provides temporary utilities for migrating from Svelte 4 to Svelte 5. All exports are deprecated and should be replaced over time.

### Component Migration
- `asClassComponent(component)` - Converts a Svelte 5 component function to a Svelte 4 compatible class component
- `createClassComponent(options)` - Creates a Svelte 4 compatible component from options and a component function

### Event Handling
- `handlers(...handlers)` - Combines multiple event listeners into one
- `once(fn)` - Wraps a handler to execute only once
- `preventDefault(fn)` - Wraps a handler to call `preventDefault()` automatically
- `stopPropagation(fn)` - Wraps a handler to call `stopPropagation()` automatically
- `stopImmediatePropagation(fn)` - Wraps a handler to call `stopImmediatePropagation()` automatically
- `self(fn)` - Wraps a handler to only execute when the event target is the element itself
- `trusted(fn)` - Wraps a handler to only execute for trusted events

### Event Modifiers as Actions
- `passive(node, [event, handler])` - Action implementing the `passive` event modifier
- `nonpassive(node, [event, handler])` - Action implementing the `nonpassive` event modifier

### Other
- `createBubbler()` - Returns a function that creates bubble handlers mimicking Svelte 4's automatic event delegation
- `run(fn)` - Executes a function immediately on server, works like `$effect.pre` on client