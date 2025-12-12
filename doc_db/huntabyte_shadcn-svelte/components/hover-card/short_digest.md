## Hover Card

Preview content on hover.

### Installation

```bash
npx shadcn-svelte@latest add hover-card -y -o
```

### Usage

```svelte
<script lang="ts">
  import * as HoverCard from "$lib/components/ui/hover-card/index.js";
</script>

<HoverCard.Root>
  <HoverCard.Trigger href="...">Link text</HoverCard.Trigger>
  <HoverCard.Content>Preview content</HoverCard.Content>
</HoverCard.Root>
```

Components: `Root`, `Trigger` (link-like), `Content`.