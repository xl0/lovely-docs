## Aspect Ratio

Displays content within a desired ratio.

### Installation

```bash
npx shadcn-svelte@latest add aspect-ratio -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

Import the component:

```svelte
<script lang="ts">
  import { AspectRatio } from "$lib/components/ui/aspect-ratio/index.js";
</script>
```

Basic example with 16:9 ratio:

```svelte
<div class="w-[450px]">
  <AspectRatio ratio={16 / 9} class="bg-muted">
    <img 
      src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
      alt="Gray by Drew Beamer"
      class="h-full w-full rounded-md object-cover"
    />
  </AspectRatio>
</div>
```

The `ratio` prop accepts a numeric value (e.g., `16 / 9` for widescreen). Content inside maintains the specified aspect ratio. Use `class` prop to add custom styling like background color or rounded corners.