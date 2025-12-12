# Dropdown Menu

Menu component triggered by a button with support for items, groups, separators, checkboxes, radio groups, and nested submenus.

## Installation

```bash
npx shadcn-svelte@latest add dropdown-menu -y -o
```

## Usage

```svelte
<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  let position = $state("bottom");
  let showStatusBar = $state(true);
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Open</Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56">
    <DropdownMenu.Label>My Account</DropdownMenu.Label>
    <DropdownMenu.Group>
      <DropdownMenu.Item>Profile <DropdownMenu.Shortcut>P</DropdownMenu.Shortcut></DropdownMenu.Item>
      <DropdownMenu.Item>Settings</DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.CheckboxItem bind:checked={showStatusBar}>Status Bar</DropdownMenu.CheckboxItem>
    <DropdownMenu.RadioGroup bind:value={position}>
      <DropdownMenu.RadioItem value="top">Top</DropdownMenu.RadioItem>
      <DropdownMenu.RadioItem value="bottom">Bottom</DropdownMenu.RadioItem>
    </DropdownMenu.RadioGroup>
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
      <DropdownMenu.SubContent>
        <DropdownMenu.Item>Nested Item</DropdownMenu.Item>
      </DropdownMenu.SubContent>
    </DropdownMenu.Sub>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

Supports items, groups, separators, checkboxes, radio groups, nested submenus, keyboard shortcuts, and disabled states.