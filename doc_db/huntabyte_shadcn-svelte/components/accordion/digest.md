## Accordion

A vertically stacked set of interactive headings that each reveal a section of content.

## Installation

```bash
npx shadcn-svelte@latest add accordion -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

## Usage

```svelte
<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion/index.js";
</script>

<Accordion.Root type="single" class="w-full sm:max-w-[70%]" value="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
    <Accordion.Content>
      Yes. It adheres to the WAI-ARIA design pattern.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Another item</Accordion.Trigger>
    <Accordion.Content>
      Content for the second item.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### Key Props

- `type`: Set to `"single"` for single-open behavior (only one item open at a time)
- `value`: Controls which item is initially open (e.g., `"item-1"`)
- `class`: Apply Tailwind classes for styling (e.g., `w-full sm:max-w-[70%]`)

### Components

- `Accordion.Root`: Container component
- `Accordion.Item`: Individual accordion item with a `value` prop
- `Accordion.Trigger`: Clickable heading that toggles content visibility
- `Accordion.Content`: Content section revealed when trigger is clicked

Content can include multiple paragraphs and flex layouts with gap utilities.