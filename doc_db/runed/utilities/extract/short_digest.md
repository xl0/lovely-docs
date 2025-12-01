## Purpose
Resolves either a getter or static value to a plain value, eliminating verbose conditional logic in utilities accepting both reactive and static inputs.

## Usage
```ts
import { extract } from "runed";

function throwConfetti(intervalProp?: MaybeGetter<number | undefined>) {
	const interval = $derived(extract(intervalProp, 100));
}
```

## Behavior
- Static value → returns it
- `undefined` → returns fallback
- Function → returns its result (or fallback if `undefined`)
- Fallback is optional

## Types
```ts
function extract<T>(input: MaybeGetter<T | undefined>, fallback: T): T;
function extract<T>(input: MaybeGetter<T | undefined>): T | undefined;
```