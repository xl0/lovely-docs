## Setting Classes on Elements

Two approaches exist: the `class` attribute and the `class:` directive.

### Class Attribute

**Primitive values:**
```svelte
<div class={large ? 'large' : 'small'}>...</div>
```

**Objects and arrays (Svelte 5.16+):**
Objects add truthy keys as classes:
```svelte
<div class={{ cool, lame: !cool }}>...</div>
```

Arrays combine truthy values:
```svelte
<div class={[faded && 'saturate-0 opacity-50', large && 'scale-200']}>...</div>
```

Arrays and objects can be nested and flattened, useful for combining local classes with component props:
```svelte
<!-- Button.svelte -->
<button class={['cool-button', props.class]}>...</button>

<!-- App.svelte -->
<Button class={{ 'bg-blue-700 sm:w-1/2': useTailwind }}>...</Button>
```

**Type safety (Svelte 5.19+):**
Use the `ClassValue` type for component props:
```svelte
<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	const props: { class: ClassValue } = $props();
</script>
```

### Class Directive

The `class:` directive conditionally applies classes:
```svelte
<div class:cool={cool} class:lame={!cool}>...</div>
```

Shorthand when name matches value:
```svelte
<div class:cool class:lame={!cool}>...</div>
```

Note: The `class` attribute is more powerful and composable; prefer it over `class:` in modern Svelte.