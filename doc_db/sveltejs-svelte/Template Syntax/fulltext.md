

## Pages

### basic-markup
Svelte template syntax for markup: tags, attributes with expressions, event listeners, text interpolation, and comments.

## Tags
Lowercase tags are HTML elements, capitalized/dot-notation tags are components.

## Attributes & Props
Attributes support JavaScript expressions and shorthand: `<button disabled={!clickable}>` or `<button {disabled}>`. Boolean attributes are included if truthy. Spread multiple at once: `<Widget a="b" {...things} c="d" />`.

## Events
Listen with `on` prefix: `<button onclick={handler}>`. Event attributes are case-sensitive and delegated to root for performance. Use `svelte/events` `on` function to avoid `stopPropagation` issues.

## Text expressions
Include expressions with braces: `<h1>Hello {name}!</h1>`. Null/undefined omitted, others stringified. Use `{@html}` for HTML (with XSS precautions).

## Comments
HTML comments work. `svelte-ignore` disables warnings. `@component` shows documentation on hover.

### if-blocks
Conditional rendering using if blocks with else if and else clauses.

Conditionally render content with `{#if expression}...{/if}`. Chain conditions with `{:else if expression}` and `{:else}`:

```svelte
{#if porridge.temperature > 100}
	<p>too hot!</p>
{:else if 80 > porridge.temperature}
	<p>too cold!</p>
{:else}
	<p>just right!</p>
{/if}
```

### each-block
The each block iterates over arrays and iterables, with optional keying for efficient updates, destructuring support, and else fallback.

# Each Block

Iterate over arrays and iterables:

```svelte
{#each items as item}
  <li>{item.name}</li>
{/each}
```

With index: `{#each items as item, i}`

**Keyed blocks** for intelligent list updates:

```svelte
{#each items as item (item.id)}
  <li>{item.name}</li>
{/each}
```

Supports destructuring, rendering n times without items, and else blocks for empty lists.

### key
The key block destroys and recreates its contents when an expression value changes, enabling component reinitialization and transition replay.

The `{#key expression}...{/key}` block destroys and recreates its contents when the expression changes. Useful for reinitializing components or replaying transitions:

```svelte
{#key value}
	<Component />
{/key}
```

### await-blocks
Await blocks handle Promise states with optional pending, then, and catch branches.

{#await} blocks branch on Promise states (pending, fulfilled, rejected):

```svelte
{#await promise}
  <p>loading...</p>
{:then value}
  <p>{value}</p>
{:catch error}
  <p>{error.message}</p>
{/await}
```

Branches can be omitted. SSR only renders pending state. Works with dynamic imports for lazy loading.

### snippets
Snippets are reusable markup components that can be passed as props to other components, with optional typing and support for parameters.

## Snippets

Reusable markup chunks declared with `{#snippet name(params)}...{/snippet}` and rendered with `{@render name()}`.

**Passing to components:**
```svelte
<!-- Explicit -->
<Table {header} {row} />

<!-- Implicit - snippets inside component become props -->
<Table>
	{#snippet header()}...{/snippet}
	{#snippet row(d)}...{/snippet}
</Table>

<!-- Content becomes children snippet -->
<Button>click me</Button>
```

**Typing:**
```svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	let { row }: { row: Snippet<[any]> } = $props();
</script>
```

**Optional snippets:** Use `{@render children?.()}` or `{#if children}` for fallback content.

**Exporting:** Export from `<script module>` if not referencing non-module declarations.

### @render
The {@render ...} tag executes a snippet, supporting conditional expressions and optional chaining for undefined snippets.

## {@render ...} tag

Renders a snippet. Expression can be an identifier or JavaScript expression:

```svelte
{@render sum(1, 2)}
{@render (cool ? coolSnippet : lameSnippet)()}
```

For optional snippets, use optional chaining or if/else:

```svelte
{@render children?.()}
{#if children}
	{@render children()}
{:else}
	<p>fallback</p>
{/if}
```

### @html-tag
Inject raw HTML with {@html ...} tag, sanitize input to prevent XSS, and use :global for styling.

The `{@html ...}` tag injects raw HTML. Always sanitize input to prevent XSS. The expression must be valid standalone HTML and won't receive scoped styles—use `:global` modifier for styling injected content.

### @attach-directive
Attachments are reactive functions that run when elements mount or state updates, with optional cleanup, and can be passed through components.

## @attach directive

Functions that run in an effect when an element mounts or state updates. Return a cleanup function if needed.

```svelte
function myAttachment(element) {
	return () => console.log('cleaning up');
}
<div {@attach myAttachment}>...</div>
```

**Attachment factories** - return attachments from functions for reusable patterns:
```svelte
function tooltip(content) {
	return (element) => {
		const tooltip = tippy(element, { content });
		return tooltip.destroy;
	};
}
<button {@attach tooltip(content)}>Hover me</button>
```

**Inline attachments** - define directly on elements with nested effects for fine-grained reactivity.

**Component props** - attachments passed to components are spread as Symbol-keyed props.

**Controlling re-runs** - use nested effects to prevent expensive setup work from re-running on every state change.

### @const
Define local constants within block scope using {@const ...} tag.

The `{@const ...}` tag defines a local constant within block scope.

```svelte
{#each boxes as box}
	{@const area = box.width * box.height}
	{area}
{/each}
```

Only allowed as immediate child of blocks (`{#if}`, `{#each}`, `{#snippet}`), components, or `<svelte:boundary>`.

### @debug-tag
Debug tag for logging variable changes and pausing execution in Svelte templates.

`{@debug ...}` logs variable values on change and pauses execution with devtools open. Accepts comma-separated variable names only (not expressions). `{@debug}` without arguments triggers on any state change.

### bind
The `bind:` directive enables two-way data binding between parent and child components or between components and DOM elements, with support for various input types, media controls, dimensions, and custom validation through function bindings.

## Two-way Data Binding with `bind:`

Syntax: `bind:property={expression}` or `bind:property` when identifier matches property name.

**Input bindings:** `bind:value` (coerces to number for type="number"), `bind:checked`, `bind:indeterminate`, `bind:group` (radio/checkbox groups), `bind:files`

**Select:** `bind:value` binds to selected option value (any type); `<select multiple>` binds to array

**Media:** `<audio>`/`<video>` two-way: `currentTime`, `playbackRate`, `paused`, `volume`, `muted`; readonly: `duration`, `buffered`, `seekable`, `seeking`, `ended`, `readyState`, `played`

**Other:** `<img>` readonly `naturalWidth`/`naturalHeight`; `<details bind:open>`; contenteditable `innerHTML`/`innerText`/`textContent`; dimension bindings `clientWidth`, `clientHeight`, `offsetWidth`, `offsetHeight`, `contentRect`, `contentBoxSize`, `borderBoxSize`, `devicePixelContentBoxSize`; `bind:this` for DOM references

**Components:** Mark props bindable with `$bindable()` rune to allow parent-to-child-to-parent flow

**Function bindings:** `bind:property={get, set}` for validation; use `{null, set}` for readonly bindings

### use:-directive
The use: directive attaches action functions to elements on mount, with setup/teardown via $effect and optional typing.

## use: directive for actions

Actions are functions called on element mount via `use:` directive with `$effect` for setup/teardown:

```svelte
function myaction(node, data) {
	$effect(() => {
		// setup
		return () => { /* teardown */ };
	});
}

<div use:myaction={data}>...</div>
```

Type actions with `Action<NodeType, ParamType, EventHandlers>` interface. Actions run once on mount, not during SSR, and don't re-run if arguments change.

### transition
Transitions animate elements entering/leaving the DOM with built-in or custom functions, supporting local/global scope, parameters, and lifecycle events.

## Transitions

Use `transition:` directive for bidirectional animations when elements enter/leave DOM:

```svelte
<div transition:fade>fades in and out</div>
<div transition:fade|global>plays on parent changes too</div>
<div transition:fade={{ duration: 2000 }}>custom duration</div>
```

Custom transitions return object with `css` or `tick` function:

```js
function whoosh(node, params) {
  return {
    duration: 400,
    css: (t, u) => `transform: scale(${t})`
  };
}
```

Events: `introstart`, `introend`, `outrostart`, `outroend`

### in-and-out-directives
in: and out: directives apply separate, non-bidirectional transitions to elements, with in transitions continuing to play alongside out transitions rather than reversing.

`in:` and `out:` directives apply non-bidirectional transitions. The `in` transition plays alongside `out` rather than reversing if the block is outroed during the transition. Aborted `out` transitions restart from scratch.

```svelte
{#if visible}
  <div in:fly={{ y: 200 }} out:fade>flies in, fades out</div>
{/if}
```

### animate
Animations in keyed each blocks trigger on reordering; custom animation functions receive node and from/to DOMRect positions, returning css or tick-based animations.

## Animations in Keyed Each Blocks

Animations trigger when elements in a keyed each block are reordered (not on add/remove). Use the `animate:` directive on immediate children:

```svelte
{#each list as item, index (item)}
	<li animate:flip={{ delay: 500 }}>{item}</li>
{/each}
```

### Custom Animation Functions

Return an object with `delay`, `duration`, `easing`, and either `css` or `tick`:

```js
function whizz(node, { from, to }, params) {
	const dx = from.left - to.left;
	const dy = from.top - to.top;
	const d = Math.sqrt(dx * dx + dy * dy);
	
	return {
		duration: Math.sqrt(d) * 120,
		easing: cubicOut,
		css: (t, u) => `transform: translate(${u * dx}px, ${u * dy}px) rotate(${t * 360}deg);`
	};
}
```

Prefer `css` over `tick` for better performance (runs off main thread).

### style-directive
Shorthand directive for setting inline styles on elements with support for dynamic values and important modifier.

The `style:` directive sets inline styles with shorthand syntax. Supports dynamic values, multiple styles, and `|important` modifier. Takes precedence over `style` attributes and `!important`.

```svelte
<div style:color="red" style:width={w} style:background-color|important={bg}>...</div>
```

### class
Two ways to set classes: the class attribute (supporting strings, objects, and arrays) and the class: directive, with the attribute being more powerful and composable.

## Setting Classes

**Attribute approach (preferred in Svelte 5.16+):**
- Strings: `class={condition ? 'large' : 'small'}`
- Objects: `class={{ cool, lame: !cool }}`
- Arrays: `class={[faded && 'saturate-0', large && 'scale-200']}`
- Nested arrays/objects flatten automatically

**Directive approach (legacy):**
```svelte
<div class:cool={cool} class:lame={!cool}>...</div>
<!-- shorthand: -->
<div class:cool class:lame={!cool}>...</div>
```

Use `ClassValue` type for type-safe component props.

### template-syntax
<UNKNOWN>

<UNKNOWN>

