## Creating Reactive State

The `$state` rune creates reactive state that updates the UI when changed. Unlike other frameworks, state is just a regular value:

```svelte
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>
	clicks: {count}
</button>
```

## Deep Reactivity with Objects and Arrays

When `$state` is used with arrays or plain objects, it creates a deeply reactive proxy. Svelte recursively proxifies until it encounters non-plain objects (classes, `Object.create` results):

```js
let todos = $state([
	{ done: false, text: 'add more todos' }
]);

todos[0].done = !todos[0].done; // triggers updates
todos.push({ done: false, text: 'eat lunch' }); // new objects are also proxified
```

Destructuring breaks reactivity since values are evaluated at destructuring time:

```js
let { done, text } = todos[0];
todos[0].done = !todos[0].done; // doesn't update `done`
```

## Classes

Class instances are not proxied. Use `$state` in class fields or as first assignment in constructor:

```js
class Todo {
	done = $state(false);

	constructor(text) {
		this.text = $state(text);
	}

	reset = () => {
		this.text = '';
		this.done = false;
	}
}
```

Note: `this` binding matters. Use arrow functions or inline functions in event handlers to preserve context.

## `$state.raw`

For non-mutating state, use `$state.raw`. It cannot be mutated via property assignment or array methods—only reassigned:

```js
let person = $state.raw({ name: 'Heraclitus', age: 49 });

person.age += 1; // no effect
person = { name: 'Heraclitus', age: 50 }; // works
```

Improves performance with large arrays/objects you don't plan to mutate. Raw state can contain reactive state.

## `$state.snapshot`

Take a static snapshot of a reactive proxy:

```js
let counter = $state({ count: 0 });
console.log($state.snapshot(counter)); // { count: ... } not Proxy
```

Useful for passing state to external libraries that don't expect proxies.

## Passing State into Functions

JavaScript is pass-by-value. When you pass a `$state` value to a function, the function receives the current value, not a reference that updates:

```js
let a = $state(1);
let b = $state(2);
let total = add(a, b); // passes values 1, 2
a = 3;
console.log(total); // still 3, not updated
```

To get reactive updates, pass functions or use proxy properties/getters:

```js
let input = $state({ a: 1, b: 2 });
let total = add(input);
console.log(total.value); // 3
input.a = 3;
console.log(total.value); // 7 (updated via proxy)
```

## Exporting State Across Modules

State can be declared in `.svelte.js`/`.svelte.ts` files. The Svelte compiler transforms `$state` references into getter/setter calls, so exporting directly reassigned state doesn't work:

```js
// ❌ Won't work - count is transformed, imports see an object not a number
export let count = $state(0);
export function increment() { count += 1; }
```

Two solutions:

1. Export an object and mutate its properties (no reassignment):
```js
export const counter = $state({ count: 0 });
export function increment() { counter.count += 1; }
```

2. Don't export state directly, export functions that access it:
```js
let count = $state(0);
export function getCount() { return count; }
export function increment() { count += 1; }
```