## Purpose
`extract` resolves either a getter function or a static value to a plain value, simplifying utility functions that accept both reactive and static inputs.

## Problem It Solves
APIs often accept `MaybeGetter<T>` - either a reactive getter or a static value. Without `extract`, handling both requires verbose conditional logic:
```ts
typeof wait === "function" ? (wait() ?? 250) : (wait ?? 250)
```

## Usage
```ts
import { extract } from "runed";

function throwConfetti(intervalProp?: MaybeGetter<number | undefined>) {
	const interval = $derived(extract(intervalProp, 100));
}
```

## Behavior
`extract(input, fallback)` handles four cases:
- Static value → returns the value
- `undefined` → returns the fallback
- Function returning a value → returns the function result
- Function returning `undefined` → returns the fallback

The fallback is optional; omitting it returns `T | undefined`.

## Type Signatures
```ts
function extract<T>(input: MaybeGetter<T | undefined>, fallback: T): T;
function extract<T>(input: MaybeGetter<T | undefined>): T | undefined;
```