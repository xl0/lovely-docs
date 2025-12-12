# Breadcrumb

Displays hierarchical navigation path using links and separators.

## Installation

```bash
npx shadcn-svelte@latest add breadcrumb -y -o
```

## Basic Usage

```svelte
<script lang="ts">
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
</script>

<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Page>Current Page</Breadcrumb.Page>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>
```

## Key Components

- `<Breadcrumb.Link>` - Clickable link; supports `asChild` for custom routing
- `<Breadcrumb.Page>` - Current page (non-clickable)
- `<Breadcrumb.Separator>` - Accepts slot for custom separators
- `<Breadcrumb.Ellipsis>` - Collapsed state for long breadcrumbs

## Examples

**Custom separator:**
```svelte
<Breadcrumb.Separator><SlashIcon /></Breadcrumb.Separator>
```

**With dropdown:**
```svelte
<Breadcrumb.Item>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>Components <ChevronDownIcon class="size-4" /></DropdownMenu.Trigger>
    <DropdownMenu.Content align="start">
      <DropdownMenu.Item>Documentation</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</Breadcrumb.Item>
```

**Responsive (dropdown on desktop, drawer on mobile):** Uses `MediaQuery` to conditionally render `<DropdownMenu />` or `<Drawer />` with `<Breadcrumb.Ellipsis />` for collapsed items.
