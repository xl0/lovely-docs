## Range Calendar

A calendar component for selecting a range of dates.

### Basic Usage

```svelte
<script lang="ts">
  import { getLocalTimeZone, today } from "@internationalized/date";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
  
  const start = today(getLocalTimeZone());
  const end = start.add({ days: 7 });
  let value = $state({
    start,
    end
  });
</script>

<RangeCalendar bind:value class="rounded-md border" />
```

### About

Built on top of Bits Range Calendar component. Uses the `@internationalized/date` package for date handling.

### Installation

```bash
npx shadcn-svelte@latest add range-calendar -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

### Blocks

30+ Calendar Blocks available demonstrating the component in action.