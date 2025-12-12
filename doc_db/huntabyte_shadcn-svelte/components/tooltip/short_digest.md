## Tooltip

Popup displaying information on hover or focus.

### Installation

```bash
npx shadcn-svelte@latest add tooltip -y -o
```

### Setup & Usage

Place `Tooltip.Provider` in root layout. Use `Tooltip.Root`, `Tooltip.Trigger`, and `Tooltip.Content`:

```svelte
<script lang="ts">
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
</script>
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>Hover</Tooltip.Trigger>
    <Tooltip.Content><p>Add to library</p></Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
```

Nest providers with different `delayDuration` settings for group-specific behavior.