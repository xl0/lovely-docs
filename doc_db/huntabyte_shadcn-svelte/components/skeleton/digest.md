## Skeleton

Placeholder component for displaying while content loads.

### Installation

```bash
npx shadcn-svelte@latest add skeleton -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton/index.js";
</script>

<!-- Circular skeleton (e.g., avatar) -->
<Skeleton class="size-12 rounded-full" />

<!-- Text skeleton lines -->
<Skeleton class="h-4 w-[250px]" />
<Skeleton class="h-4 w-[200px]" />

<!-- Custom dimensions -->
<Skeleton class="h-[20px] w-[100px] rounded-full" />
```

Use Tailwind classes to customize dimensions and shape. Common patterns: `size-12 rounded-full` for avatars, `h-4 w-[250px]` for text lines.