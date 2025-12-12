# Range Calendar

A calendar component that allows users to select a range of dates.

[Docs](https://bits-ui.com/docs/components/range-calendar)

[API Reference](https://bits-ui.com/docs/components/range-calendar#api-reference)

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

## About

The `<RangeCalendar />` component is built on top of the [Bits Range Calendar](https://www.bits-ui.com/docs/components/range-calendar) component, which uses the [@internationalized/date](https://react-spectrum.adobe.com/internationalized/date/index.html) package to handle dates.

## Blocks

You can see the `RangeCalendar` component in action in the 30+ [Calendar Blocks](https://shadcn-svelte.com/blocks/calendar) we've built.

## Installation

```bash
pnpm dlx shadcn-svelte@latest add range-calendar
```

```bash
npx shadcn-svelte@latest add range-calendar
```

```bash
bun x shadcn-svelte@latest add range-calendar
```