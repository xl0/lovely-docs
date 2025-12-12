## Slider

An input component where users select a value from a given range.

## Installation

```bash
npx shadcn-svelte@latest add slider -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

## Usage

### Single Value

```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state(33);
</script>

<Slider type="single" bind:value max={100} step={1} />
```

### Multiple Thumbs

```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state([25, 75]);
</script>

<Slider type="multiple" bind:value max={100} step={1} />
```

### Vertical Orientation

```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state(50);
</script>

<Slider type="single" orientation="vertical" bind:value max={100} step={1} />
```

### Styling

Use the `class` prop to apply custom styles:

```svelte
<Slider type="single" bind:value max={100} step={1} class="max-w-[70%]" />
```

## API

- `type`: "single" or "multiple" - determines if one or multiple values can be selected
- `bind:value`: reactive binding to the selected value(s)
- `max`: maximum value of the range
- `step`: increment between selectable values
- `orientation`: "horizontal" (default) or "vertical"
- `class`: custom CSS classes

For full API reference, see the Bits UI Slider documentation.