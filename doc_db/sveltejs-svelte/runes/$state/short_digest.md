## Creating Reactive State

```svelte
<script>
	let count = $state(0);
</script>

<button onclick={() => count++}>clicks: {count}</button>
```

## Deep Reactivity

Arrays and objects become proxies with granular reactivity:

```js
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers updates
```

## Class Fields

```js
class Todo {
	done = $state(false);
	constructor(text) { this.text = $state(text); }
}
```

## Variants

- `$state.raw` — no deep reactivity, only reassignment allowed
- `$state.snapshot(value)` — get static snapshot of proxy
- `$state.eager(value)` — force immediate UI updates

## Exporting State

Cannot directly export and reassign. Either mutate object properties or use getter functions:

```js
export const counter = $state({ count: 0 });
export function increment() { counter.count += 1; }
```