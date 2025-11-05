# Template Syntax

## Markup & Attributes
Lowercase tags are HTML elements; capitalized/dot-notation tags are components. Attributes support JavaScript expressions and shorthand: `<button disabled={!clickable}>` or `<button {disabled}>`. Spread attributes: `<Widget {...things} />`. Boolean attributes included if truthy.

## Text & HTML
Include expressions with braces: `<h1>Hello {name}!</h1>`. Use `{@html}` for raw HTML (sanitize to prevent XSS). Null/undefined omitted, others stringified.

## Events
Listen with `on` prefix: `<button onclick={handler}>`. Event attributes are case-sensitive and delegated to root for performance.

## Conditional Rendering
`{#if expression}...{:else if}...{:else}...{/if}` for conditional blocks.

## Iteration
`{#each items as item (item.id)}` iterates with optional keying for efficient updates. Supports destructuring and `{:else}` for empty lists.

## Key Block
`{#key expression}...{/key}` destroys and recreates contents when expression changes, useful for reinitializing components or replaying transitions.

## Async Handling
`{#await promise}...{:then value}...{:catch error}...{/await}` branches on Promise states. SSR only renders pending state.

## Snippets
Reusable markup declared with `{#snippet name(params)}...{/snippet}` and rendered with `{@render name()}`. Pass to components explicitly or implicitly:
```svelte
<Table {header} {row} />
<!-- or -->
<Table>
  {#snippet header()}...{/snippet}
  {#snippet row(d)}...{/snippet}
</Table>
```
Type with `Snippet<[ParamType]>`. Use optional chaining for optional snippets: `{@render children?.()}`.

## Directives

**bind:** Two-way binding between components/DOM. `bind:value`, `bind:checked`, `bind:group` (radio/checkbox), `bind:files`. Media: `bind:currentTime`, `bind:paused`, `bind:volume`. Dimensions: `bind:clientWidth`, `bind:clientHeight`. Components: mark props with `$bindable()`. Function bindings for validation: `bind:property={get, set}`.

**use:** Actions attached on mount via `use:myaction={data}`. Define with `$effect` for setup/teardown.

**style:** Inline styles with shorthand: `style:color="red" style:width={w} style:background-color|important={bg}`.

**class:** Set classes via attribute (preferred): `class={condition ? 'large' : 'small'}` or `class={{ cool, lame: !cool }}`. Legacy directive: `class:cool={cool}`.

**transition:** Bidirectional animations on enter/leave: `transition:fade={{ duration: 2000 }}` or `transition:fade|global`. Custom transitions return `{ duration, css(t, u) }` or `{ tick(t, u) }`. Events: `introstart`, `introend`, `outrostart`, `outroend`.

**in:/out:** Non-bidirectional transitions. `in` plays alongside `out` rather than reversing: `in:fly={{ y: 200 }} out:fade`.

**animate:** Reordering animations in keyed each blocks: `animate:flip={{ delay: 500 }}`. Custom functions receive `{ from, to }` DOMRect and return `{ duration, easing, css(t, u) }`.

**@attach:** Reactive functions on mount/update: `{@attach myAttachment}`. Return cleanup function. Factories for reusable patterns: `{@attach tooltip(content)}`.

**@const:** Local constants in block scope: `{@const area = box.width * box.height}`.

**@debug:** Log variables on change: `{@debug variable}` or `{@debug}` for any state change.

## Comments
HTML comments work. `svelte-ignore` disables warnings. `@component` shows documentation on hover.