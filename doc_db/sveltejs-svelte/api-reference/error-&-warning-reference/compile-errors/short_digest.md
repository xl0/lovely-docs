## Compile Error Reference

Complete list of Svelte compiler errors organized by category:

**Animation**: `animate:` directive must be unique, only child of keyed `{#each}`, and requires key

**Attributes**: Validation for contenteditable, multiple, type, event handlers, sequences, and quoting

**Bindings**: `bind:group` and `bind:` only work with Identifier/MemberExpression/`{get,set}` pairs; cannot bind to constants

**Blocks**: `{#if}`, `{#each}`, `{#await}`, `{#key}`, `{#snippet}` must be properly opened/closed; use `else if` not `elseif`

**CSS**: `:global()` rules for scoping; cannot mix global/scoped selectors; nesting selectors placement

**Const Tags**: `{@const}` must be single declaration in specific block locations; scope limited to declaring block

**Each Blocks**: In runes mode, cannot reassign each argument; use `array[i]` instead of `entry`

**Props/State**: `$props()` and `$state()` only at top-level; cannot export reassigned state; no `$$` prefix

**Runes**: Invalid usage in non-runes mode, missing parentheses, invalid arguments, removed/renamed runes

**Slots**: Cannot mix `<slot>` and `{@render}` tags; slot names must be static; `default` is reserved

**Snippets**: Cannot export snippets referencing component-level variables; no rest parameters; cannot shadow props

**Svelte Meta**: `<svelte:component>`, `<svelte:element>`, `<svelte:fragment>`, `<svelte:boundary>` attribute/placement rules

**HTML Structure**: Browser HTML repair breaks Svelte assumptions (e.g., `<div>` inside `<p>` auto-closes `<p>`)