## Separator

Visually or semantically separates content.

### Installation

```bash
npx shadcn-svelte@latest add separator -y -o
```

### Usage

```svelte
<script lang="ts">
  import { Separator } from "$lib/components/ui/separator/index.js";
</script>

<Separator />
<Separator orientation="vertical" />
```

Supports `orientation` prop for vertical separators and standard class styling.