## Progress

Progress bar component for displaying task completion.

```svelte
<script lang="ts">
  import { Progress } from "$lib/components/ui/progress/index.js";
  let value = $state(13);
</script>

<Progress {value} max={100} class="w-[60%]" />
```

Install: `npx shadcn-svelte@latest add progress -y -o`