## Sheet

Dialog-based component for complementary content sliding from screen edges.

### Installation

```bash
npx shadcn-svelte@latest add sheet -y -o
```

### Usage

```svelte
<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet/index.js";
</script>

<Sheet.Root>
  <Sheet.Trigger>Open</Sheet.Trigger>
  <Sheet.Content side="right" class="w-[400px] sm:w-[540px]">
    <Sheet.Header>
      <Sheet.Title>Title</Sheet.Title>
      <Sheet.Description>Description</Sheet.Description>
    </Sheet.Header>
    <!-- content -->
    <Sheet.Footer>
      <Sheet.Close>Close</Sheet.Close>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
```

**Side positioning**: `top`, `right`, `bottom`, `left`

**Size**: Use CSS classes on `Sheet.Content` (e.g., `w-[400px] sm:w-[540px]`)

**Components**: `Root`, `Trigger`, `Content`, `Header`, `Title`, `Description`, `Footer`, `Close`