## Markup & Attributes
Lowercase tags are HTML elements; capitalized/dot-notation tags are components. Attributes support JavaScript expressions with shorthand `{name}` for `name={name}`. Boolean attributes include if truthy, exclude if falsy. Spread attributes with `{...things}` where later values override earlier ones.

## Events & Text
Event attributes use `on:` prefix (case-sensitive). Svelte delegates certain events (click, input, keydown, etc.) to root for performance. Text expressions coerce to strings; use `{@html}` for raw HTML (sanitize to prevent XSS).

## Control Flow
- `{#if}...{:else if}...{:else}` for conditional rendering
- `{#each items as item, i (key)}` for iteration with optional destructuring and `{:else}` for empty lists
- `{#key expression}` destroys/recreates contents when expression changes
- `{#await promise}...{:then value}...{:catch error}` for Promise handling

## Snippets & Rendering
Snippets are reusable markup blocks: `{#snippet name(params)}...{/snippet}`. Pass as props or use implicit `children` snippet. Render with `{@render snippet()}` supporting optional chaining. Type with `Snippet<[ParamTypes]>`.

## Directives
- `bind:` creates two-way bindings (inputs, selects, media, dimensions, component props marked with `$bindable()`)
- `use:` attaches action functions on element mount
- `transition:` animates enter/leave with `|local` (default) or `|global` scope
- `in:` and `out:` apply non-bidirectional transitions
- `animate:` triggers on keyed each block reordering
- `style:` sets inline styles with `|important` modifier
- `class:` sets classes (prefer `class={}` attribute with objects/arrays)

## Special Tags
- `{@const name = value}` defines block-scoped constants
- `{@debug var1, var2}` logs on change and pauses with devtools
- `{@attach function}` runs functions on mount/state updates with optional cleanup
- `{@html content}` injects raw HTML (use `:global` for styling injected content)

## Advanced
Await expressions (Svelte 5.36+, experimental): Use `await` in scripts and markup with `<svelte:boundary pending>` for loading states and `$effect.pending()` for subsequent updates.