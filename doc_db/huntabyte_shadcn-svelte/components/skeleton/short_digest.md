## Skeleton

Loading placeholder component using Tailwind classes for styling.

```svelte
<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton/index.js";
</script>

<Skeleton class="size-12 rounded-full" />
<Skeleton class="h-4 w-[250px]" />
```

Install: `npx shadcn-svelte@latest add skeleton -y -o`