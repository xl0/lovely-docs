## Accordion

Vertically stacked interactive headings that reveal content sections.

### Installation

```bash
npx shadcn-svelte@latest add accordion -y -o
```

### Usage

```svelte
<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion/index.js";
</script>

<Accordion.Root type="single" value="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Title</Accordion.Trigger>
    <Accordion.Content>Content here</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

Key props: `type="single"` (one open at a time), `value` (initial open item), `class` (styling).