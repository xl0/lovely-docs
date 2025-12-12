## Toggle

Two-state button component.

### Installation

```bash
npx shadcn-svelte@latest add toggle -y -o
```

### Usage

```svelte
<script lang="ts">
  import { Toggle } from "$lib/components/ui/toggle/index.js";
  import BoldIcon from "@lucide/svelte/icons/bold";
</script>

<!-- Default -->
<Toggle aria-label="toggle bold">
  <BoldIcon class="size-4" />
</Toggle>

<!-- Outline variant -->
<Toggle variant="outline" aria-label="Toggle italic">
  <ItalicIcon class="size-4" />
</Toggle>

<!-- With text -->
<Toggle aria-label="Toggle italic">
  <ItalicIcon class="me-2 size-4" />
  Italic
</Toggle>

<!-- Size variants: sm, lg -->
<Toggle size="sm" aria-label="Toggle italic">
  <ItalicIcon class="size-4" />
</Toggle>

<!-- Disabled -->
<Toggle aria-label="Toggle underline" disabled>
  <UnderlineIcon class="size-4" />
</Toggle>
```

### Props

- `variant`: "default" | "outline"
- `size`: "default" | "sm" | "lg"
- `disabled`: boolean
- `aria-label`: string (recommended)