## Runes

Runes are `$`-prefixed compiler keywords that control Svelte's reactivity. Unlike functions, they cannot be imported, assigned, or passed as arguments.

### $state
Creates reactive variables. Arrays and objects become deeply reactive proxies:
```js
let count = $state(0);
let todos = $state([{ done: false, text: 'add more todos' }]);
todos[0].done = !todos[0].done; // triggers update
```
Use `$state.raw` for non-reactive state. Use `$state.snapshot()` to get a plain object from a proxy.

### $derived
Declares computed state that automatically updates when dependencies change:
```svelte
let count = $state(0);
let doubled = $derived(count * 2);
```
For complex logic, use `$derived.by(() => { ... })`. Expressions must be side-effect free. Uses push-pull reactivity—dependents are notified immediately, but derived values only re-evaluate when read.

### $effect
Runs side-effect functions that automatically track reactive dependencies and re-run when they change:
```svelte
$effect(() => {
	const context = canvas.getContext('2d');
	context.fillStyle = color;
	context.fillRect(0, 0, size, size);
});
```
Supports teardown functions: `$effect(() => { const interval = setInterval(...); return () => clearInterval(interval); })`. Use `$effect.pre` to run before DOM updates. Use `$effect.root()` for manually-controlled effects.

### $props
Receives component inputs with destructuring and fallback values:
```svelte
let { adjective = 'happy', super: trouper, ...others } = $props();
```
Generate unique instance IDs with `$props.id()`.

### $bindable
Marks props as bindable to enable two-way data binding:
```svelte
// Child
let { value = $bindable() } = $props();
// Parent
<Child bind:value={message} />
```

### $inspect
Development-only rune for reactive logging:
```svelte
$inspect(count, message); // logs on change
$inspect(count).with((type, value) => { /* custom handler */ });
$inspect.trace(); // traces which reactive state caused re-run
```

### $host
Accesses the host element in custom element components:
```svelte
$host().dispatchEvent(new CustomEvent(type));
```