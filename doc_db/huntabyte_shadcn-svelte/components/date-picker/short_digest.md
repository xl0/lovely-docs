# Date Picker

Popover-based date picker with single/range selection, presets, and form integration.

## Installation

```bash
npx shadcn-svelte@latest add popover calendar range-calendar -y -o
```

## Basic Single Date Picker

```svelte
<script lang="ts">
  import { DateFormatter, type DateValue, getLocalTimeZone } from "@internationalized/date";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";

  const df = new DateFormatter("en-US", { dateStyle: "long" });
  let value = $state<DateValue>();
</script>

<Popover.Root>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button {...props}>
        {value ? df.format(value.toDate(getLocalTimeZone())) : "Select a date"}
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar bind:value type="single" captionLayout="dropdown" />
  </Popover.Content>
</Popover.Root>
```

## Date Range Picker

```svelte
<script lang="ts">
  import type { DateRange } from "bits-ui";
  import { CalendarDate } from "@internationalized/date";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";

  let value: DateRange = $state({
    start: new CalendarDate(2022, 1, 20),
    end: new CalendarDate(2022, 1, 20).add({ days: 20 })
  });
</script>

<Popover.Root>
  <Popover.Trigger>Range: {value.start} - {value.end}</Popover.Trigger>
  <Popover.Content class="w-auto p-0" align="start">
    <RangeCalendar bind:value numberOfMonths={2} />
  </Popover.Content>
</Popover.Root>
```

## With Presets and Form Integration

Combine Select for quick options, or use with sveltekit-superforms for validation with `minValue`/`maxValue` constraints and form field binding.