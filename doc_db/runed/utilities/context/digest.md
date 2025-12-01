## Purpose
Type-safe wrapper around Svelte's Context API for sharing data between components without prop drilling. Useful for themes, authentication state, localization preferences, and other shared data.

## Creating Context
Define a Context instance with a type parameter:
```ts
import { Context } from "runed";
export const myTheme = new Context<"light" | "dark">("theme");
```
The constructor parameter is just an identifier for debugging. Creating a Context only defines the container—it doesn't set a value yet.

## Setting Context Values
Set the context value in a parent component during initialization (like lifecycle functions):
```svelte
<script lang="ts">
	import { myTheme } from "./context";
	let { data, children } = $props();
	myTheme.set(data.theme);
</script>
{@render children?.()}
```
Context must be set during component initialization, not in event handlers or callbacks.

## Reading Context Values
Child components access context using `get()` or `getOr()`:
```svelte
<script lang="ts">
	import { myTheme } from "./context";
	const theme = myTheme.get(); // throws if not set
	const theme = myTheme.getOr("light"); // fallback value
</script>
```

## API
- `constructor(name: string)` - Creates context with identifier for debugging
- `key: symbol` - Internal key (use methods instead of accessing directly)
- `exists(): boolean` - Check if context is set in parent
- `get(): TContext` - Retrieve context, throws if not set
- `getOr<TFallback>(fallback: TFallback): TContext | TFallback` - Retrieve with fallback
- `set(context: TContext): TContext` - Set context value and return it

All methods must be called during component initialization.