## Using TypeScript in Svelte

Add `lang="ts"` to script tags to enable TypeScript. Only type-only features are supported by default (type annotations, interfaces, generics). Features requiring code generation (enums, constructor modifiers with initializers, non-standard ECMAScript features) need a preprocessor.

## Preprocessor Setup

For full TypeScript support, configure `vitePreprocess` in `svelte.config.js`:

```ts
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
const config = { preprocess: vitePreprocess({ script: true }) };
export default config;
```

SvelteKit and Vite projects include this automatically. For Rollup/Webpack, use `rollup-plugin-svelte` or `svelte-loader` with `svelte-preprocess`.

## tsconfig.json Requirements

- Set `target` to at least `ES2015`
- Set `verbatimModuleSyntax` to `true`
- Set `isolatedModules` to `true`

## Typing Props

Type `$props()` as a regular object:

```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	interface Props {
		requiredProperty: number;
		optionalProperty?: boolean;
		snippetWithStringArgument: Snippet<[string]>;
		eventHandler: (arg: string) => void;
	}
	let { requiredProperty, optionalProperty, snippetWithStringArgument, eventHandler }: Props = $props();
</script>
```

## Generic Props

Use the `generics` attribute on script tags to declare generic relationships:

```svelte
<script lang="ts" generics="Item extends { text: string }">
	interface Props {
		items: Item[];
		select(item: Item): void;
	}
	let { items, select }: Props = $props();
</script>
```

## Typing Wrapper Components

Use `HTMLButtonAttributes` from `svelte/elements` for native element wrappers, or `SvelteHTMLElements['div']` for elements without dedicated types.

## Typing State

Type `$state` like regular variables. Use `as` casting when initial value is undefined but will be set before use:

```ts
let count: number = $state(0);
class Counter {
	count = $state() as number;
}
```

## Component Types

The `Component` type constrains what components can be passed:

```ts
import type { Component, ComponentProps } from 'svelte';
interface Props {
	DynamicComponent: Component<{ prop: string }>;
}
```

Extract component props with `ComponentProps<TComponent>`. Access component constructors with `typeof MyComponent` and instances with `MyComponent` type.

## Enhancing DOM Types

Extend built-in types for custom/experimental attributes and events by declaring in a `.d.ts` file:

```ts
declare namespace svelteHTML {
	interface IntrinsicElements {
		'my-custom-element': { someattribute: string; 'on:event': (e: CustomEvent) => void };
	}
	interface HTMLAttributes<T> {
		onbeforeinstallprompt?: (event: any) => any;
	}
}
```

Or augment the `svelte/elements` module directly.