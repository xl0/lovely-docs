# Date Picker

A date picker component combining Popover and Calendar (or RangeCalendar) components.

## Installation

Install dependencies: Popover, Calendar, and RangeCalendar components.

```bash
npx shadcn-svelte@latest add popover calendar range-calendar -y -o
```

## Basic Usage

```svelte
<script lang="ts">
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import { DateFormatter, type DateValue, getLocalTimeZone } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";

  const df = new DateFormatter("en-US", { dateStyle: "long" });
  let value = $state<DateValue>();
</script>

<Popover.Root>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class={cn("w-[280px] justify-start text-start font-normal", !value && "text-muted-foreground")}
        {...props}
      >
        <CalendarIcon class="me-2 size-4" />
        {value ? df.format(value.toDate(getLocalTimeZone())) : "Select a date"}
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar bind:value type="single" initialFocus captionLayout="dropdown" />
  </Popover.Content>
</Popover.Root>
```

## Date Range Picker

```svelte
<script lang="ts">
  import type { DateRange } from "bits-ui";
  import { CalendarDate, DateFormatter, type DateValue, getLocalTimeZone } from "@internationalized/date";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
  
  const df = new DateFormatter("en-US", { dateStyle: "medium" });
  let value: DateRange = $state({
    start: new CalendarDate(2022, 1, 20),
    end: new CalendarDate(2022, 1, 20).add({ days: 20 })
  });
  let startValue: DateValue | undefined = $state(undefined);
</script>

<Popover.Root>
  <Popover.Trigger class={cn(buttonVariants({ variant: "outline" }), !value && "text-muted-foreground")}>
    <CalendarIcon class="me-2 size-4" />
    {#if value?.start}
      {df.format(value.start.toDate(getLocalTimeZone()))}
      {#if value.end}
        - {df.format(value.end.toDate(getLocalTimeZone()))}
      {/if}
    {:else if startValue}
      {df.format(startValue.toDate(getLocalTimeZone()))}
    {:else}
      Pick a date
    {/if}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0" align="start">
    <RangeCalendar
      bind:value
      onStartValueChange={(v) => { startValue = v; }}
      numberOfMonths={2}
    />
  </Popover.Content>
</Popover.Root>
```

## With Presets

Combine a Select component with Calendar for quick date selection:

```svelte
<script lang="ts">
  import { today } from "@internationalized/date";
  import * as Select from "$lib/components/ui/select/index.js";

  let value: DateValue | undefined = $state();
  const valueString = $derived(value ? df.format(value.toDate(getLocalTimeZone())) : "");
  const items = [
    { value: 0, label: "Today" },
    { value: 1, label: "Tomorrow" },
    { value: 3, label: "In 3 days" },
    { value: 7, label: "In a week" }
  ];
</script>

<Popover.Root>
  <Popover.Trigger class={cn(buttonVariants({ variant: "outline", class: "w-[280px] justify-start text-start font-normal" }), !value && "text-muted-foreground")}>
    <CalendarIcon class="me-2 size-4" />
    {value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date"}
  </Popover.Trigger>
  <Popover.Content class="flex w-auto flex-col space-y-2 p-2">
    <Select.Root
      type="single"
      bind:value={() => valueString, (v) => {
        if (!v) return;
        value = today(getLocalTimeZone()).add({ days: Number.parseInt(v) });
      }}
    >
      <Select.Trigger>{valueString}</Select.Trigger>
      <Select.Content>
        {#each items as item (item.value)}
          <Select.Item value={`${item.value}`}>{item.label}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
    <div class="rounded-md border">
      <Calendar type="single" bind:value />
    </div>
  </Popover.Content>
</Popover.Root>
```

## Form Integration

Use with sveltekit-superforms for validation:

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    dob: z.string().refine((v) => v, { message: "A date of birth is required." })
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";

  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  const { form: formData, enhance } = form;

  let value = $derived($formData.dob ? parseDate($formData.dob) : undefined);
  let placeholder = $state<DateValue>(today(getLocalTimeZone()));
</script>

<form method="POST" class="space-y-8" use:enhance>
  <Form.Field {form} name="dob" class="flex flex-col">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Date of birth</Form.Label>
        <Popover.Root>
          <Popover.Trigger
            {...props}
            class={cn(buttonVariants({ variant: "outline" }), "w-[280px] justify-start ps-4 text-start font-normal", !value && "text-muted-foreground")}
          >
            {value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date"}
            <CalendarIcon class="ms-auto size-4 opacity-50" />
          </Popover.Trigger>
          <Popover.Content class="w-auto p-0" side="top">
            <Calendar
              type="single"
              value={value as DateValue}
              bind:placeholder
              captionLayout="dropdown"
              minValue={new CalendarDate(1900, 1, 1)}
              maxValue={today(getLocalTimeZone())}
              calendarLabel="Date of birth"
              onValueChange={(v) => {
                $formData.dob = v ? v.toString() : "";
              }}
            />
          </Popover.Content>
        </Popover.Root>
        <Form.Description>Your date of birth is used to calculate your age</Form.Description>
        <Form.FieldErrors />
        <input hidden value={$formData.dob} name={props.name} />
      {/snippet}
    </Form.Control>
  </Form.Field>
  <Button type="submit">Submit</Button>
</form>
```

## Key Features

- **Single date selection**: Use `type="single"` with Calendar
- **Date range selection**: Use RangeCalendar with `numberOfMonths` for multi-month display
- **Presets**: Combine with Select for quick date options
- **Dropdown captions**: Use `captionLayout="dropdown"` for month/year navigation
- **Date constraints**: Set `minValue` and `maxValue` on Calendar
- **Form validation**: Integrate with sveltekit-superforms for schema validation
- **Internationalization**: Use DateFormatter for locale-specific formatting
- **Initial focus**: Use `initialFocus` prop to focus calendar on open