## Core Syntax
- Tags: lowercase = HTML, capitalized = components
- Attributes: `{name}` shorthand, spread with `{...things}`, boolean/nullish coercion
- Events: `on:eventname` (delegated for performance)
- Text: `{expression}` coerces to string, `{@html}` for raw HTML

## Control Flow
- `{#if}...{:else if}...{:else}`
- `{#each items as item, i (key)}...{:else}`
- `{#key expression}` destroys/recreates
- `{#await promise}...{:then}...{:catch}`

## Snippets
`{#snippet name(params)}...{/snippet}` reusable blocks, render with `{@render snippet()}`

## Directives
- `bind:property` two-way binding (inputs, selects, media, dimensions, `$bindable()` props)
- `use:action` lifecycle management
- `transition:name` enter/leave animations (`|local`/`|global`)
- `in:`/`out:` non-bidirectional transitions
- `animate:name` on keyed each reordering
- `style:property` inline styles
- `class:name` or `class={}` for classes

## Special Tags
- `{@const}` block constants
- `{@debug}` logging
- `{@attach}` mount/update functions
- `{@html}` raw HTML injection