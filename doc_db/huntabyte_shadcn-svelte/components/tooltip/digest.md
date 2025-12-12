## Tooltip

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

### Installation

```bash
npx shadcn-svelte@latest add tooltip -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Setup

Place `Tooltip.Provider` once in your root layout to ensure only one tooltip within the provider can be open at a time:

```svelte
<script lang="ts">
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  let { children } = $props();
</script>
<Tooltip.Provider>
  {@render children()}
</Tooltip.Provider>
```

### Usage

```svelte
<script lang="ts">
  import { buttonVariants } from "../ui/button/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
</script>
<Tooltip.Root>
  <Tooltip.Trigger class={buttonVariants({ variant: "outline" })}>
    Hover
  </Tooltip.Trigger>
  <Tooltip.Content>
    <p>Add to library</p>
  </Tooltip.Content>
</Tooltip.Root>
```

### Nested Providers

You can nest providers to create groups with different settings. Tooltips use the closest ancestor provider. This is useful for instant tooltips in specific areas:

```svelte
<Tooltip.Provider delayDuration={0}>
  <!-- tooltips here have no delay -->
</Tooltip.Provider>
```

See the Bits UI documentation for full API reference.