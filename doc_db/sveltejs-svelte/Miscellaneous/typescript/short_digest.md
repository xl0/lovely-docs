## TypeScript in Svelte

Add `lang="ts"` to script tags for type-only features. For full TypeScript support, configure `vitePreprocess` in `svelte.config.js`.

Set `tsconfig.json`: `target: ES2015`, `verbatimModuleSyntax: true`, `isolatedModules: true`.

## Typing Props and State

```svelte
<script lang="ts" generics="Item extends { text: string }">
	interface Props {
		items: Item[];
		select(item: Item): void;
	}
	let { items, select }: Props = $props();
	let count: number = $state(0);
</script>
```

## Component Types

```ts
import type { Component, ComponentProps } from 'svelte';
interface Props {
	DynamicComponent: Component<{ prop: string }>;
}
```

## Enhancing DOM Types

Extend custom attributes/events in a `.d.ts` file:

```ts
declare namespace svelteHTML {
	interface IntrinsicElements {
		'my-custom-element': { someattribute: string; 'on:event': (e: CustomEvent) => void };
	}
}
```