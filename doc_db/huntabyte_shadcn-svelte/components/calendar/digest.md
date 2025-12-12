# Calendar

Date selection component built on Bits UI Calendar, using @internationalized/date for date handling.

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

<Calendar
  type="single"
  bind:value
  class="rounded-md border shadow-sm"
  captionLayout="dropdown"
/>
```

## Examples

### Multiple Months with Caption Dropdown

```svelte
<script lang="ts">
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import { CalendarDate } from "@internationalized/date";
  let value = $state<CalendarDate | undefined>(new CalendarDate(2025, 6, 12));
  let captionLayout = $state("dropdown"); // "dropdown" | "dropdown-months" | "dropdown-years"
</script>

<Calendar
  type="single"
  bind:value
  numberOfMonths={2}
  captionLayout={captionLayout}
  class="rounded-lg border shadow-sm"
/>
```

### Date of Birth Picker (with Popover)

```svelte
<script lang="ts">
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import { getLocalTimeZone, today, type CalendarDate } from "@internationalized/date";
  
  let open = $state(false);
  let value = $state<CalendarDate | undefined>();
</script>

<div class="flex flex-col gap-3">
  <Label>Date of birth</Label>
  <Popover.Root bind:open>
    <Popover.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline" class="w-48 justify-between">
          {value ? value.toDate(getLocalTimeZone()).toLocaleDateString() : "Select date"}
          <ChevronDownIcon />
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-auto p-0" align="start">
      <Calendar
        type="single"
        bind:value
        captionLayout="dropdown"
        maxValue={today(getLocalTimeZone())}
        onValueChange={() => { open = false; }}
      />
    </Popover.Content>
  </Popover.Root>
</div>
```

### Date and Time Picker

```svelte
<script lang="ts">
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import { getLocalTimeZone, type CalendarDate } from "@internationalized/date";
  
  let open = $state(false);
  let value = $state<CalendarDate | undefined>();
</script>

<div class="flex gap-4">
  <div class="flex flex-col gap-3">
    <Label>Date</Label>
    <Popover.Root bind:open>
      <Popover.Trigger>
        {#snippet child({ props })}
          <Button {...props} variant="outline" class="w-32 justify-between">
            {value ? value.toDate(getLocalTimeZone()).toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        {/snippet}
      </Popover.Trigger>
      <Popover.Content class="w-auto p-0" align="start">
        <Calendar
          type="single"
          bind:value
          captionLayout="dropdown"
          onValueChange={() => { open = false; }}
        />
      </Popover.Content>
    </Popover.Root>
  </div>
  <div class="flex flex-col gap-3">
    <Label>Time</Label>
    <Input type="time" step="1" value="10:30:00" />
  </div>
</div>
```

### Natural Language Date Input

Uses chrono-node to parse natural language dates like "In 2 days" or "next week":

```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import { parseDate } from "chrono-node";
  import { CalendarDate, getLocalTimeZone, type DateValue } from "@internationalized/date";
  import { untrack } from "svelte";
  
  function formatDate(date: DateValue | undefined) {
    if (!date) return "";
    return date.toDate(getLocalTimeZone()).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  }
  
  let open = $state(false);
  let inputValue = $state("In 2 days");
  let value = $state<DateValue | undefined>(
    untrack(() => {
      const date = parseDate(inputValue);
      return date ? new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate()) : undefined;
    })
  );
</script>

<div class="flex flex-col gap-3">
  <Label>Schedule Date</Label>
  <div class="relative flex gap-2">
    <Input
      bind:value={() => inputValue, (v) => {
        inputValue = v;
        const date = parseDate(v);
        if (date) {
          value = new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
        }
      }}
      placeholder="Tomorrow or next week"
      onkeydown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); open = true; } }}
    />
    <Popover.Root bind:open>
      <Popover.Trigger>
        {#snippet child({ props })}
          <Button {...props} variant="ghost" class="absolute end-2 top-1/2 size-6 -translate-y-1/2">
            <CalendarIcon class="size-3.5" />
          </Button>
        {/snippet}
      </Popover.Trigger>
      <Popover.Content class="w-auto p-0" align="end">
        <Calendar
          type="single"
          bind:value
          captionLayout="dropdown"
          onValueChange={(v) => { inputValue = formatDate(v); open = false; }}
        />
      </Popover.Content>
    </Popover.Root>
  </div>
  <div class="text-sm text-muted-foreground">
    Your post will be published on <span class="font-medium">{formatDate(value)}</span>.
  </div>
</div>
```

## Key Props

- `type="single"` - Single date selection
- `bind:value` - Bind selected date
- `captionLayout` - "dropdown" (month/year), "dropdown-months" (month only), "dropdown-years" (year only)
- `numberOfMonths` - Display multiple months
- `maxValue` / `minValue` - Constrain selectable dates
- `onValueChange` - Callback when date changes
- `class` - Styling

## Related Components

- Range Calendar - for date ranges
- Date Picker - wrapper component
- 30+ calendar blocks available in Blocks Library

## Upgrade

```bash
npx shadcn-svelte@latest add calendar -y -o
```

When prompted, select Yes to overwrite. Merge any custom changes with the new version.