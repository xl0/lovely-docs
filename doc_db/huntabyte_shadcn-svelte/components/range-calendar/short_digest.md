## Range Calendar

Calendar component for date range selection using `@internationalized/date` for date handling.

```svelte
<script lang="ts">
  import { getLocalTimeZone, today } from "@internationalized/date";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
  
  const start = today(getLocalTimeZone());
  let value = $state({ start, end: start.add({ days: 7 }) });
</script>

<RangeCalendar bind:value class="rounded-md border" />
```

Install: `npx shadcn-svelte@latest add range-calendar -y -o`