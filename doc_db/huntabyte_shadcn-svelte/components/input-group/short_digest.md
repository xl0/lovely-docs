## Input Group

Display additional information or actions to an input or textarea.

## Installation

```bash
npx shadcn-svelte@latest add input-group -y -o
```

## Basic Usage

```svelte
<script lang="ts">
  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import SearchIcon from "@lucide/svelte/icons/search";
</script>

<InputGroup.Root>
  <InputGroup.Input placeholder="Search..." />
  <InputGroup.Addon>
    <SearchIcon />
  </InputGroup.Addon>
  <InputGroup.Addon align="inline-end">
    <InputGroup.Button>Search</InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

## Components

- `InputGroup.Root` - Container
- `InputGroup.Input` - Text input
- `InputGroup.Textarea` - Multi-line input
- `InputGroup.Addon` - Container for additional content
- `InputGroup.Text` - Text content
- `InputGroup.Button` - Button within addon

## Addon Alignment

`align` prop: `inline-end` (right), `block-end` (bottom), `block-start` (top)

## Examples

### Icons, Text, Buttons
```svelte
<!-- Icon -->
<InputGroup.Root>
  <InputGroup.Input placeholder="Search..." />
  <InputGroup.Addon><SearchIcon /></InputGroup.Addon>
</InputGroup.Root>

<!-- Text prefix/suffix -->
<InputGroup.Root>
  <InputGroup.Addon><InputGroup.Text>$</InputGroup.Text></InputGroup.Addon>
  <InputGroup.Input placeholder="0.00" />
  <InputGroup.Addon align="inline-end"><InputGroup.Text>USD</InputGroup.Text></InputGroup.Addon>
</InputGroup.Root>

<!-- Button with clipboard -->
<InputGroup.Root>
  <InputGroup.Input placeholder="https://x.com/shadcn" readonly />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Button onclick={() => clipboard.copy("...")}>
      {#if clipboard.copied}<CheckIcon />{:else}<CopyIcon />{/if}
    </InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Textarea with Top/Bottom Addons
```svelte
<InputGroup.Root>
  <InputGroup.Addon align="block-start" class="border-b">
    <InputGroup.Text>script.js</InputGroup.Text>
    <InputGroup.Button class="ms-auto" size="icon-xs"><RefreshCwIcon /></InputGroup.Button>
  </InputGroup.Addon>
  <InputGroup.Textarea placeholder="..." class="min-h-[200px]" />
  <InputGroup.Addon align="block-end" class="border-t">
    <InputGroup.Text>Line 1, Column 1</InputGroup.Text>
    <InputGroup.Button size="sm" class="ms-auto">Run</InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Loading States
```svelte
<InputGroup.Root data-disabled>
  <InputGroup.Input placeholder="Searching..." disabled />
  <InputGroup.Addon align="inline-end"><Spinner /></InputGroup.Addon>
</InputGroup.Root>
```

Use `data-disabled` on `InputGroup.Root` for disabled styling.

### Tooltips & Dropdowns
```svelte
<!-- Tooltip -->
<InputGroup.Root>
  <InputGroup.Input placeholder="Enter password" type="password" />
  <InputGroup.Addon align="inline-end">
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <InputGroup.Button {...props} variant="ghost" size="icon-xs"><InfoIcon /></InputGroup.Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content>Password must be at least 8 characters</Tooltip.Content>
    </Tooltip.Root>
  </InputGroup.Addon>
</InputGroup.Root>

<!-- Dropdown -->
<InputGroup.Root>
  <InputGroup.Input placeholder="Enter search query" />
  <InputGroup.Addon align="inline-end">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <InputGroup.Button {...props} variant="ghost">Search In... <ChevronDownIcon class="size-3" /></InputGroup.Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item>Documentation</DropdownMenu.Item>
        <DropdownMenu.Item>Blog Posts</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Custom Input
```svelte
<InputGroup.Root>
  <textarea
    data-slot="input-group-control"
    class="field-sizing-content flex min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base outline-none"
    placeholder="Autoresize textarea..."
  ></textarea>
  <InputGroup.Addon align="block-end">
    <InputGroup.Button class="ms-auto" size="sm">Submit</InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

Add `data-slot="input-group-control"` to custom inputs for automatic behavior and focus handling.