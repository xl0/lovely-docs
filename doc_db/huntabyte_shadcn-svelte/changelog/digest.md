# Changelog

## June 2025

### Calendar Components Overhaul
`Calendar` and `RangeCalendar` components completely redesigned with dropdown month/year selectors and 30+ Calendar blocks for building custom calendar components.

## May 2025

### Tailwind v4 Support
Official Tailwind v4 support released. Full migration guide available. Projects using Svelte v5 with Tailwind v3 continue to work until upgrade.

### Charts (Preview)
Charts added as preview component. Available via CLI for Svelte v5 + Tailwind v4 projects.

### Custom Registry Support
Custom/remote registries now supported, allowing publishing and sharing components via the CLI.

## March 2024

### Blocks
Ready-made, fully responsive, accessible, composable components built using same principles as core components.

### New Components
- **Breadcrumb**: Navigation component
- **Scroll Area**: Built on Bits UI, supports vertical and horizontal scrolling with consistent cross-browser experience

## February 2024

### Resizable Component
Built on PaneForge (early stage library). Allows creating resizable pane layouts.

### Icon Import Changes
Moved from unmaintained `radix-icons-svelte` to `svelte-radix` for new-york style. Changed from barrel imports to deep imports for better dev server performance:

```ts
// Before
import { Check } from "@lucide/svelte";

// After
import Check from "@lucide/svelte/icons/check";
```

Deep imports prevent Vite from optimizing entire icon collections, only optimizing used icons.

### Forms Major Update
Formsnap completely rewritten for flexibility and power. No direct migration path from old version.

**Form.Label Changes**: `ids` from `getFormField()` is now a store, prefix with `$`:
```svelte
<Label for={$ids.input} class={cn($errors && "text-destructive", className)}>
  <slot />
</Label>
```

**Form.Control**: New component wraps non-traditional form elements for accessibility:
```ts
// src/lib/ui/form/index.ts
const Control = FormPrimitive.Control;
export { Control, Control as FormControl };
```

## January 2024

### New Components
- **Carousel**: Image/content carousel with previous/next navigation
  ```svelte
  <Carousel.Root class="w-full max-w-xs">
    <Carousel.Content>
      {#each Array(5), i}
        <Carousel.Item>
          <div class="p-1">
            <Card.Root>
              <Card.Content class="flex aspect-square items-center justify-center p-6">
                <span class="text-4xl font-semibold">{i + 1}</span>
              </Card.Content>
            </Card.Root>
          </div>
        </Carousel.Item>
      {/each}
    </Carousel.Content>
    <Carousel.Previous />
    <Carousel.Next />
  </Carousel.Root>
  ```

- **Drawer**: Built on vaul-svelte (Svelte port of vaul by Emil Kowalski). Slide-out panel with header, content, and footer:
  ```svelte
  <Drawer.Root>
    <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>
      Open Drawer
    </Drawer.Trigger>
    <Drawer.Content>
      <div class="mx-auto w-full max-w-sm">
        <Drawer.Header>
          <Drawer.Title>Move Goal</Drawer.Title>
          <Drawer.Description>Set your daily activity goal.</Drawer.Description>
        </Drawer.Header>
        <div class="p-4 pb-0">
          <div class="flex items-center justify-center space-x-2">
            <Button variant="outline" size="icon" class="size-8 shrink-0 rounded-full"
              onclick={() => handleClick(-10)} disabled={goal <= 200}>
              <MinusIcon />
            </Button>
            <div class="flex-1 text-center">
              <div class="text-7xl font-bold tracking-tighter">{goal}</div>
              <div class="text-muted-foreground text-[0.70rem] uppercase">Calories/day</div>
            </div>
            <Button variant="outline" size="icon" class="size-8 shrink-0 rounded-full"
              onclick={() => handleClick(10)} disabled={goal >= 400}>
              <PlusIcon />
            </Button>
          </div>
          <div class="mt-3 h-[120px]">
            <BarChart data={data.map((d, i) => ({ goal: d.goal, index: i }))} 
              y="goal" x="index" xScale={scaleBand().padding(0.25)} 
              axis={false} tooltip={false} />
          </div>
        </div>
        <Drawer.Footer>
          <Button>Submit</Button>
          <Drawer.Close class={buttonVariants({ variant: "outline" })}>Cancel</Drawer.Close>
        </Drawer.Footer>
      </div>
    </Drawer.Content>
  </Drawer.Root>
  ```

- **Sonner**: Toast notifications via svelte-sonner (Svelte port of Sonner by Emil Kowalski)
  ```svelte
  <Button variant="outline" onclick={() =>
    toast.success("Event has been created", {
      description: "Sunday, December 03, 2023 at 9:00 AM",
      action: { label: "Undo", onClick: () => console.info("Undo") }
    })}>
    Show Toast
  </Button>
  ```

- **Pagination**: Built on Bits UI pagination component

## December 2023

New components: Calendar, Range Calendar, Date Picker

## November 2023

New component: Toggle Group

## October 2023

### Command Component
Command palette component built on cmdk-sv (Svelte port of cmdk). Allows creating searchable command interfaces.

### Combobox Component
Combination of Command and Popover components. Creates searchable dropdown menu.

### Form Updates
See February 2024 Forms section above for Form.Label and Form.Control changes.