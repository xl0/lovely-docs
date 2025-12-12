# Aspect Ratio

Displays content within a desired ratio.

[Docs](https://bits-ui.com/docs/components/aspect-ratio)

[API Reference](https://bits-ui.com/docs/components/aspect-ratio#api-reference)

```svelte
<script lang="ts">
  import { AspectRatio } from "$lib/components/ui/aspect-ratio/index.js";
</script>
<AspectRatio ratio={16 / 9} class="bg-muted">
  <img
    src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
    alt="Gray by Drew Beamer"
    class="h-full w-full rounded-md object-cover"
  />
</AspectRatio>
```

## Installation

```bash
pnpm dlx shadcn-svelte@latest add aspect-ratio
```

```bash
npx shadcn-svelte@latest add aspect-ratio
```

```bash
bun x shadcn-svelte@latest add aspect-ratio
```

## Usage

```svelte
<script lang="ts">
  import { AspectRatio } from "$lib/components/ui/aspect-ratio/index.js";
</script>
<div class="w-[450px]">
  <AspectRatio ratio={16 / 9} class="bg-muted">
    <img src="..." alt="..." class="rounded-md object-cover" />
  </AspectRatio>
</div>
```