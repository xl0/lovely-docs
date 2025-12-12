# Tooltip

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

[Docs](https://bits-ui.com/docs/components/tooltip)

[API Reference](https://bits-ui.com/docs/components/tooltip#api-reference)

```svelte
<script lang="ts">
  import { buttonVariants } from "../ui/button/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
</script>
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger class={buttonVariants({ variant: "outline" })}
      >Hover</Tooltip.Trigger
    >
    <Tooltip.Content>
      <p>Add to library</p>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
```

## Installation

```bash
pnpm dlx shadcn-svelte@latest add tooltip
```

```bash
npx shadcn-svelte@latest add tooltip
```

```bash
bun x shadcn-svelte@latest add tooltip
```

## Usage

The `Tooltip.Provider` component should be placed once in your root layout, wrapping all content that will contain tooltips. This ensures that only one tooltip within the provider can be open at a time.

src/routes/+layout.svelte

```svelte
<script lang="ts">
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  let { children } = $props();
</script>
<Tooltip.Provider>
  {@render children()}
</Tooltip.Provider>
```

Then use tooltips anywhere in your app:

```svelte
<script lang="ts">
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
</script>
<Tooltip.Root>
  <Tooltip.Trigger>Hover</Tooltip.Trigger>
  <Tooltip.Content>
    <p>Add to library</p>
  </Tooltip.Content>
</Tooltip.Root>
```

### Nested Providers

You can nest providers to create groups with different settings. Tooltips use the closest ancestor provider. This is useful when you want instant tooltips in specific areas:

```svelte
<Tooltip.Provider delayDuration={0}>
</Tooltip.Provider>
```