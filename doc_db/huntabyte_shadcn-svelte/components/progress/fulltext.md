# Progress

Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.

[Docs](https://bits-ui.com/docs/components/progress)

[API Reference](https://bits-ui.com/docs/components/progress#api-reference)

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

## Installation

```bash
pnpm dlx shadcn-svelte@latest add progress
```

```bash
npx shadcn-svelte@latest add progress
```

```bash
bun x shadcn-svelte@latest add progress
```

## Usage

```svelte
<script lang="ts">
  import { Progress } from "$lib/components/ui/progress/index.js";
</script>
<Progress value={33} />
```