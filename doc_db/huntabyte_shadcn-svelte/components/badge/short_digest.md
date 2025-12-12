## Badge

Displays a badge component with multiple variants (default, secondary, destructive, outline).

### Installation

```bash
npx shadcn-svelte@latest add badge -y -o
```

### Usage

```svelte
<script lang="ts">
  import { Badge, badgeVariants } from "$lib/components/ui/badge/index.js";
</script>

<Badge variant="outline">Badge</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>

<!-- Link styled as badge -->
<a href="/dashboard" class={badgeVariants({ variant: "outline" })}>Badge</a>

<!-- Custom styled: circular with icon/number -->
<Badge class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">8</Badge>
```