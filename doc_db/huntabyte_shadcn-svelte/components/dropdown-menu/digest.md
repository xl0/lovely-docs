# Dropdown Menu

Menu component triggered by a button, displaying a set of actions or functions.

## Installation

```bash
npx shadcn-svelte@latest add dropdown-menu -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

## Basic Usage

```svelte
<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Open</Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56" align="start">
    <DropdownMenu.Label>My Account</DropdownMenu.Label>
    <DropdownMenu.Group>
      <DropdownMenu.Item>
        Profile
        <DropdownMenu.Shortcut>P</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
      <DropdownMenu.Item>Billing</DropdownMenu.Item>
      <DropdownMenu.Item>Settings</DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item disabled>API</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

## Components

- `Root`: Container for the dropdown menu
- `Trigger`: Button that opens the menu (accepts snippet with `props`)
- `Content`: Menu container (supports `class` and `align` props)
- `Label`: Section label
- `Group`: Groups related items
- `Item`: Menu item (supports `disabled` state)
- `Shortcut`: Keyboard shortcut display
- `Separator`: Visual divider
- `Sub` / `SubTrigger` / `SubContent`: Nested submenu

## Checkboxes

```svelte
<script lang="ts">
  let showStatusBar = $state(true);
  let showActivityBar = $state(false);
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Open</Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56">
    <DropdownMenu.Group>
      <DropdownMenu.Label>Appearance</DropdownMenu.Label>
      <DropdownMenu.Separator />
      <DropdownMenu.CheckboxItem bind:checked={showStatusBar}>
        Status Bar
      </DropdownMenu.CheckboxItem>
      <DropdownMenu.CheckboxItem bind:checked={showActivityBar} disabled>
        Activity Bar
      </DropdownMenu.CheckboxItem>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

## Radio Group

```svelte
<script lang="ts">
  let position = $state("bottom");
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Open</Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56">
    <DropdownMenu.Group>
      <DropdownMenu.Label>Panel Position</DropdownMenu.Label>
      <DropdownMenu.Separator />
      <DropdownMenu.RadioGroup bind:value={position}>
        <DropdownMenu.RadioItem value="top">Top</DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="bottom">Bottom</DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="right">Right</DropdownMenu.RadioItem>
      </DropdownMenu.RadioGroup>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

## Changelog

### 2024-10-30

Added automatic styling for `SubTrigger`: `gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0` classes now automatically style icons inside dropdown menu sub triggers. Removed manual `size-4` from icon examples.