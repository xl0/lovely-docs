# Calendar

Date selection component built on Bits UI Calendar.

## Installation

```bash
npx shadcn-svelte@latest add calendar -y -o
```

## Basic Usage

```svelte
<script lang="ts">
  import { getLocalTimeZone, today } from "@internationalized/date";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  let value = today(getLocalTimeZone());
</script>

<Calendar type="single" bind:value captionLayout="dropdown" />
```

## Common Examples

**Date Picker with Popover:**
```svelte
<Popover.Root bind:open>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button {...props}>{value?.toDate(getLocalTimeZone()).toLocaleDateString() ?? "Select"}</Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar type="single" bind:value onValueChange={() => { open = false; }} />
  </Popover.Content>
</Popover.Root>
```

**Date + Time Picker:**
Combine Calendar with `<Input type="time" />` in separate columns.

**Natural Language Input:**
Use chrono-node's `parseDate()` to convert text like "In 2 days" to CalendarDate, bind to input and calendar.

## Key Props

- `type="single"` - Single date selection
- `bind:value` - Selected date (CalendarDate)
- `captionLayout` - "dropdown" | "dropdown-months" | "dropdown-years"
- `numberOfMonths` - Show multiple months
- `maxValue` / `minValue` - Date constraints
- `onValueChange` - Change callback

## Related

Range Calendar for date ranges, Date Picker component, 30+ calendar blocks available.