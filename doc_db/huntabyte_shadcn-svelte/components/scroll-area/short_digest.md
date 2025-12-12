## Scroll Area

Custom-styled scrollable container with cross-browser support.

## Installation

```bash
npx shadcn-svelte@latest add scroll-area -y -o
```

## Usage

```svelte
<script lang="ts">
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
</script>

<ScrollArea class="h-[200px] w-[350px] rounded-md border p-4">
  Scrollable content
</ScrollArea>
```

## Orientation

Use `orientation` prop: `"vertical"` (default), `"horizontal"`, or `"both"` for scrolling direction.

```svelte
<ScrollArea orientation="horizontal" class="w-96">
  <div class="flex w-max space-x-4 p-4">
    {#each items as item}
      <div>{item}</div>
    {/each}
  </div>
</ScrollArea>
```