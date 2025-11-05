## $bindable Rune

Mark a prop as bindable to enable bidirectional data flow between parent and child:

```svelte
// Child
let { value = $bindable(), ...props } = $props();

// Parent
<FancyInput bind:value={message} />
```

Bindable props allow state mutation in children and can have fallback values: `$bindable('fallback')`