## Toggle Group

Two-state button group component.

### Installation

```bash
npx shadcn-svelte@latest add toggle-group -y -o
```

### Usage

```svelte
<script lang="ts">
  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
</script>

<!-- Single selection -->
<ToggleGroup.Root type="single">
  <ToggleGroup.Item value="a">A</ToggleGroup.Item>
  <ToggleGroup.Item value="b">B</ToggleGroup.Item>
</ToggleGroup.Root>

<!-- Multiple selection with outline variant -->
<ToggleGroup.Root variant="outline" type="multiple">
  <ToggleGroup.Item value="bold"><BoldIcon class="h-4 w-4" /></ToggleGroup.Item>
  <ToggleGroup.Item value="italic"><ItalicIcon class="h-4 w-4" /></ToggleGroup.Item>
</ToggleGroup.Root>

<!-- Size variants -->
<ToggleGroup.Root size="sm" type="multiple">...</ToggleGroup.Root>
<ToggleGroup.Root size="lg" type="multiple">...</ToggleGroup.Root>

<!-- Disabled -->
<ToggleGroup.Root disabled type="single">...</ToggleGroup.Root>
```

### Props

- `type`: "single" or "multiple"
- `variant`: "outline"
- `size`: "sm", default, or "lg"
- `disabled`: boolean