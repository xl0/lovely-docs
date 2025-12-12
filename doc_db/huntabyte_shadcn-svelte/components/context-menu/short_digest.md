## Context Menu

Right-click triggered menu for actions.

```bash
npx shadcn-svelte@latest add context-menu -y -o
```

```svelte
<script lang="ts">
  import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
  let checked = $state(false);
  let selected = $state("option1");
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger>Right click</ContextMenu.Trigger>
  <ContextMenu.Content>
    <ContextMenu.Item>Profile</ContextMenu.Item>
    <ContextMenu.Item disabled>Billing</ContextMenu.Item>
    <ContextMenu.Item>
      Save
      <ContextMenu.Shortcut>Ctrl+S</ContextMenu.Shortcut>
    </ContextMenu.Item>
    
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger>More</ContextMenu.SubTrigger>
      <ContextMenu.SubContent>
        <ContextMenu.Item>Settings</ContextMenu.Item>
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
    
    <ContextMenu.Separator />
    
    <ContextMenu.CheckboxItem bind:checked>
      Show Details
    </ContextMenu.CheckboxItem>
    
    <ContextMenu.RadioGroup bind:value={selected}>
      <ContextMenu.RadioItem value="option1">Option 1</ContextMenu.RadioItem>
      <ContextMenu.RadioItem value="option2">Option 2</ContextMenu.RadioItem>
    </ContextMenu.RadioGroup>
  </ContextMenu.Content>
</ContextMenu.Root>
```

Supports: items with shortcuts, disabled state, submenus, separators, checkboxes, radio groups, and grouping.