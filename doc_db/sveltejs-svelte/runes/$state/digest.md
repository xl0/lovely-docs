## Creating Reactive State

The `$state` rune creates reactive state that updates the UI when changed:

```svelte
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>
	clicks: {count}
</button>
```

State is just a regular value (number, object, array) — no special API needed to update it.

## Deep Reactivity with Proxies

Arrays and plain objects become deeply reactive proxies. Modifying nested properties triggers granular updates:

```js
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers updates
todos.push({ done: false, text: 'eat lunch' }); // new objects are also proxified
```

Destructuring breaks reactivity — the values are evaluated at destructuring time and don't update afterward.

## Class Fields

Class instances are not proxied. Use `$state` in class field declarations or in the constructor:

```js
class Todo {
	done = $state(false);
	constructor(text) {
		this.text = $state(text);
	}
}
```

When passing methods as event handlers, use arrow functions to preserve `this` context:

```svelte
<button onclick={() => todo.reset()}>reset</button>
```

## `$state.raw`

Disables deep reactivity — state can only be reassigned, not mutated:

```js
let person = $state.raw({ name: 'Heraclitus', age: 49 });
person.age += 1; // no effect
person = { name: 'Heraclitus', age: 50 }; // works
```

Improves performance for large objects/arrays you won't mutate.

## `$state.snapshot`

Takes a static snapshot of a reactive proxy for passing to external libraries:

```js
console.log($state.snapshot(counter)); // { count: ... } not Proxy
```

## `$state.eager`

Forces immediate UI updates instead of waiting for synchronized updates (useful for navigation feedback):

```svelte
<a href="/" aria-current={$state.eager(pathname) === '/' ? 'page' : null}>home</a>
```

## Passing State to Functions

State is pass-by-value. To access current values in functions, use getters/setters or proxy properties:

```js
let input = $state({ a: 1, b: 2 });
function add(input) {
	return { get value() { return input.a + input.b; } };
}
let total = add(input);
console.log(total.value); // 3, updates when input changes
```

## Exporting State Across Modules

Cannot directly export and reassign state because the compiler transforms each reference. Two options:

1. Export an object and mutate its properties (not the object itself):
```js
export const counter = $state({ count: 0 });
export function increment() { counter.count += 1; }
```

2. Don't directly export — use getter functions instead:
```js
let count = $state(0);
export function getCount() { return count; }
export function increment() { count += 1; }
```