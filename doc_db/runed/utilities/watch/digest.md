## watch

Manually specify which reactive values should trigger a callback, unlike `$effect` which automatically tracks all dependencies.

**Basic usage:**
```ts
import { watch } from "runed";
let count = $state(0);
watch(() => count, () => {
	console.log(count);
});
```

**Deep watching objects:**
```ts
let user = $state({ name: 'bob', age: 20 });
watch(() => $state.snapshot(user), () => {
	console.log(`${user.name} is ${user.age} years old`);
});
```

**Watching specific nested values:**
```ts
let user = $state({ name: 'bob', age: 20 });
watch(() => user.age, () => {
	console.log(`User is now ${user.age} years old`);
});
```

**Multiple sources as array:**
```ts
let age = $state(20);
let name = $state("bob");
watch([() => age, () => name], ([age, name], [prevAge, prevName]) => {
	// callback receives current and previous values
});
```

**Callback receives current and previous values:**
```ts
let count = $state(0);
watch(() => count, (curr, prev) => {
	console.log(`count is ${curr}, was ${prev}`);
});
```

**Options:**
- `lazy: true` - First run only happens after sources change (default: false)

**Variants:**
- `watch.pre` - Uses `$effect.pre` under the hood for pre-effect timing
- `watchOnce` / `watchOnce.pre` - Runs callback only once, no options object accepted