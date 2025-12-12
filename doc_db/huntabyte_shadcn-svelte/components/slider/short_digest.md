## Slider

Range input component with single or multiple thumbs.

```bash
npx shadcn-svelte@latest add slider -y -o
```

```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state(33);
</script>

<Slider type="single" bind:value max={100} step={1} />
<Slider type="multiple" bind:value={[25, 75]} max={100} step={1} />
<Slider type="single" orientation="vertical" bind:value max={100} step={1} />
```

Key props: `type` ("single"/"multiple"), `bind:value`, `max`, `step`, `orientation` ("horizontal"/"vertical"), `class`