## Progress

Displays a progress bar indicator showing task completion progress.

### Installation

```bash
npx shadcn-svelte@latest add progress -y -o
```

Use `-y` to skip confirmation prompt and `-o` to overwrite existing files.

### Usage

```svelte
<script lang="ts">
  import { onMount } from "svelte";
  import { Progress } from "$lib/components/ui/progress/index.js";
  
  let value = $state(13);
  
  onMount(() => {
    const timer = setTimeout(() => (value = 66), 500);
    return () => clearTimeout(timer);
  });
</script>

<Progress {value} max={100} class="w-[60%]" />
```

### Props

- `value`: Current progress value (number)
- `max`: Maximum value (default: 100)
- `class`: CSS classes for styling

The component uses reactive state (`$state`) to update progress dynamically.