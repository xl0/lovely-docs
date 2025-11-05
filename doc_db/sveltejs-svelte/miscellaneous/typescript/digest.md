## Using TypeScript in Svelte

Add `lang="ts"` to script tags to enable TypeScript. This supports type-only features (type annotations, interfaces) that disappear during transpilation. Features requiring compiler output (enums, constructor modifiers with initializers, non-standard ECMAScript features) need a preprocessor.

## Preprocessor Setup

For full TypeScript support, configure `vitePreprocess` in `svelte.config.js`:

```ts
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
const config = { preprocess: vitePreprocess({ script: true }) };
export default config;
```

SvelteKit and Vite projects include this automatically. For Rollup/Webpack, install `typescript` and `svelte-preprocess`, then configure the respective plugins.

## tsconfig.json Requirements

- Set `target` to at least `ES2015` (prevents class compilation to functions)
- Set `verbatimModuleSyntax` to `true` (preserves import syntax)
- Set `isolatedModules` to `true` (required for Svelte compiler compatibility)

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

## Wrapper Components

Use `HTMLButtonAttributes` or `SvelteHTMLElements` from `svelte/elements` to type wrapper components:

```svelte
<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	let { children, ...rest }: HTMLButtonAttributes = $props();
</script>
<button {...rest}>{@render children?.()}</button>
```

## Typing State

Type `$state` like regular variables. Use `as` casting when initial value is undefined:

```ts
let count: number = $state(0);
class Counter {
	count = $state() as number;
	constructor(initial: number) { this.count = initial; }
}
```

## Component Types

Use `Component` type to constrain dynamic components and `ComponentProps` to extract properties:

```ts
import type { Component, ComponentProps } from 'svelte';
function withProps<T extends Component<any>>(component: T, props: ComponentProps<T>) {}
```

Declare component constructor/instance types:

```svelte
<script lang="ts">
	import MyComponent from './MyComponent.svelte';
	let componentConstructor: typeof MyComponent = MyComponent;
	let componentInstance: MyComponent;
</script>
<MyComponent bind:this={componentInstance} />
```

## Augmenting DOM Types

Extend `svelte/elements` module to add custom attributes or experimental features:

```ts
declare module 'svelte/elements' {
	export interface SvelteHTMLElements {
		'custom-button': HTMLButtonAttributes;
	}
	export interface HTMLAttributes<T> {
		globalattribute?: string;
	}
}
```

Reference the `.d.ts` file in `tsconfig.json`.