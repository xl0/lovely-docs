## Aspect Ratio

Maintains content within a specified aspect ratio.

### Installation

```bash
npx shadcn-svelte@latest add aspect-ratio -y -o
```

### Usage

```svelte
<script lang="ts">
  import { AspectRatio } from "$lib/components/ui/aspect-ratio/index.js";
</script>

<AspectRatio ratio={16 / 9} class="bg-muted">
  <img src="..." alt="..." class="h-full w-full rounded-md object-cover" />
</AspectRatio>
```

Pass a numeric `ratio` value (e.g., `16 / 9`) to enforce the aspect ratio on child content.