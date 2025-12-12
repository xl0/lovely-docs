# Toggle

A two-state button that can be either on or off.

[Docs](https://bits-ui.com/docs/components/toggle)

[API Reference](https://bits-ui.com/docs/components/toggle#api-reference)

```svelte
<script lang="ts">
  import BoldIcon from "@lucide/svelte/icons/bold";
  import { Toggle } from "$lib/components/ui/toggle/index.js";
</script>
<Toggle aria-label="toggle bold">
  <BoldIcon class="size-4" />
</Toggle>
```

## Installation

```bash
pnpm dlx shadcn-svelte@latest add toggle
```

```bash
npx shadcn-svelte@latest add toggle
```

```bash
bun x shadcn-svelte@latest add toggle
```

## Usage

```svelte
<script lang="ts">
  import { Toggle } from "$lib/components/ui/toggle/index.js";
</script>
<Toggle>Toggle</Toggle>
```

## Examples

### Default

```svelte
<script lang="ts">
  import BoldIcon from "@lucide/svelte/icons/bold";
  import { Toggle } from "$lib/components/ui/toggle/index.js";
</script>
<Toggle aria-label="toggle bold">
  <BoldIcon class="size-4" />
</Toggle>
```

### Outline

```svelte
<script lang="ts">
  import ItalicIcon from "@lucide/svelte/icons/italic";
  import { Toggle } from "$lib/components/ui/toggle/index.js";
</script>
<Toggle variant="outline" aria-label="Toggle italic">
  <ItalicIcon class="size-4" />
</Toggle>
```

### With Text

```svelte
<script lang="ts">
  import ItalicIcon from "@lucide/svelte/icons/italic";
  import { Toggle } from "$lib/components/ui/toggle/index.js";
</script>
<Toggle aria-label="Toggle italic">
  <ItalicIcon class="me-2 size-4" />
  Italic
</Toggle>
```

### Small

```svelte
<script lang="ts">
  import ItalicIcon from "@lucide/svelte/icons/italic";
  import { Toggle } from "$lib/components/ui/toggle/index.js";
</script>
<Toggle size="sm" aria-label="Toggle italic">
  <ItalicIcon class="size-4" />
</Toggle>
```

### Large

```svelte
<script lang="ts">
  import ItalicIcon from "@lucide/svelte/icons/italic";
  import { Toggle } from "$lib/components/ui/toggle/index.js";
</script>
<Toggle size="lg" aria-label="Toggle italic">
  <ItalicIcon class="size-4" />
</Toggle>
```

### Disabled

```svelte
<script lang="ts">
  import UnderlineIcon from "@lucide/svelte/icons/underline";
  import { Toggle } from "$lib/components/ui/toggle/index.js";
</script>
<Toggle aria-label="Toggle underline" disabled>
  <UnderlineIcon class="size-4" />
</Toggle>
```