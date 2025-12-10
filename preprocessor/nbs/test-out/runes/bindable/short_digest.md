## $bindable

Marks a prop as bindable to enable two-way data flow between parent and child. Parent uses `bind:` directive:

```svelte
// Child
let { value = $bindable() } = $props();

// Parent
let message = $state('hello');
<Child bind:value={message} />
```

Allows child to mutate state and parent to listen. Fallback: `$bindable('default')`