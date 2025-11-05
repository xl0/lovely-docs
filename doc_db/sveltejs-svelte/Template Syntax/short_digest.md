# Template Syntax

**Markup:** Lowercase = HTML, capitalized = components. Attributes support expressions: `<button {disabled}>`. Spread: `<Widget {...things} />`.

**Text:** `<h1>Hello {name}!</h1>`. Use `{@html}` for raw HTML (sanitize).

**Conditionals:** `{#if}...{:else if}...{:else}...{/if}`

**Loops:** `{#each items as item (item.id)}...{:else}...{/each}`

**Key block:** `{#key expr}` destroys/recreates on change.

**Async:** `{#await promise}...{:then}...{:catch}...{/await}`

**Snippets:** `{#snippet name(params)}...{/snippet}` rendered with `{@render name()}`. Pass to components or use `{@render children?.()}`.

**Directives:**
- `bind:value`, `bind:checked`, `bind:group`, `bind:files`, `bind:currentTime`, `bind:paused`, `bind:clientWidth`
- `use:action={data}` with `$effect` for setup/teardown
- `style:color="red" style:width={w}`
- `class={condition ? 'large' : 'small'}` or `class={{ cool }}`
- `transition:fade={{ duration: 2000 }}` or `transition:fade|global`
- `in:fly={{ y: 200 }} out:fade`
- `animate:flip={{ delay: 500 }}` in keyed each blocks
- `{@attach myAttachment}`, `{@const area = w * h}`, `{@debug var}`