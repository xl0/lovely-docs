## Toggle Group

A set of two-state buttons that can be toggled on or off.

### Installation

```bash
npx shadcn-svelte@latest add toggle-group -y -o
```

Use `-y` to skip confirmation prompt and `-o` to overwrite existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
</script>

<ToggleGroup.Root type="single">
  <ToggleGroup.Item value="a">A</ToggleGroup.Item>
  <ToggleGroup.Item value="b">B</ToggleGroup.Item>
  <ToggleGroup.Item value="c">C</ToggleGroup.Item>
</ToggleGroup.Root>
```

### Examples

#### Default (Multiple Selection with Outline Variant)

```svelte
<ToggleGroup.Root variant="outline" type="multiple">
  <ToggleGroup.Item value="bold" aria-label="Toggle bold">
    <BoldIcon class="h-4 w-4" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="italic" aria-label="Toggle italic">
    <ItalicIcon class="h-4 w-4" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="strikethrough" aria-label="Toggle strikethrough">
    <UnderlineIcon class="h-4 w-4" />
  </ToggleGroup.Item>
</ToggleGroup.Root>
```

#### Single Selection

```svelte
<ToggleGroup.Root type="single">
  <ToggleGroup.Item value="bold" aria-label="Toggle bold">
    <BoldIcon class="size-4" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="italic" aria-label="Toggle italic">
    <ItalicIcon class="size-4" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="strikethrough" aria-label="Toggle strikethrough">
    <UnderlineIcon class="size-4" />
  </ToggleGroup.Item>
</ToggleGroup.Root>
```

#### Size Variants (Small and Large)

```svelte
<!-- Small -->
<ToggleGroup.Root size="sm" type="multiple">
  <ToggleGroup.Item value="bold"><BoldIcon class="size-4" /></ToggleGroup.Item>
  <ToggleGroup.Item value="italic"><ItalicIcon class="size-4" /></ToggleGroup.Item>
  <ToggleGroup.Item value="strikethrough"><UnderlineIcon class="size-4" /></ToggleGroup.Item>
</ToggleGroup.Root>

<!-- Large -->
<ToggleGroup.Root size="lg" type="multiple">
  <ToggleGroup.Item value="bold"><BoldIcon class="size-4" /></ToggleGroup.Item>
  <ToggleGroup.Item value="italic"><ItalicIcon class="size-4" /></ToggleGroup.Item>
  <ToggleGroup.Item value="strikethrough"><UnderlineIcon class="size-4" /></ToggleGroup.Item>
</ToggleGroup.Root>
```

#### Disabled State

```svelte
<ToggleGroup.Root disabled type="single">
  <ToggleGroup.Item value="bold"><BoldIcon class="size-4" /></ToggleGroup.Item>
  <ToggleGroup.Item value="italic"><ItalicIcon class="size-4" /></ToggleGroup.Item>
  <ToggleGroup.Item value="strikethrough"><UnderlineIcon class="size-4" /></ToggleGroup.Item>
</ToggleGroup.Root>
```

### Props

- `type`: "single" (only one item can be selected) or "multiple" (multiple items can be selected)
- `variant`: "outline" (default styling)
- `size`: "sm" (small), default, or "lg" (large)
- `disabled`: boolean to disable all items in the group