## Menubar

Desktop application menu bar with multiple menus, submenus, separators, shortcuts, checkboxes, and radio buttons.

### Installation

```bash
npx shadcn-svelte@latest add menubar -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import * as Menubar from "$lib/components/ui/menubar/index.js";
  let checked = $state(false);
  let selected = $state("option1");
</script>

<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item>New <Menubar.Shortcut>Ctrl+N</Menubar.Shortcut></Menubar.Item>
      <Menubar.Separator />
      <Menubar.Sub>
        <Menubar.SubTrigger>Share</Menubar.SubTrigger>
        <Menubar.SubContent>
          <Menubar.Item>Email</Menubar.Item>
        </Menubar.SubContent>
      </Menubar.Sub>
    </Menubar.Content>
  </Menubar.Menu>

  <Menubar.Menu>
    <Menubar.Trigger>View</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.CheckboxItem bind:checked={checked}>Show Sidebar</Menubar.CheckboxItem>
      <Menubar.Item inset>Reload</Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>

  <Menubar.Menu>
    <Menubar.Trigger>Profiles</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.RadioGroup bind:value={selected}>
        <Menubar.RadioItem value="option1">Option 1</Menubar.RadioItem>
        <Menubar.RadioItem value="option2">Option 2</Menubar.RadioItem>
      </Menubar.RadioGroup>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
```

### Key Features

- **Submenus**: Nest `Menubar.Sub` with `SubTrigger` and `SubContent`
- **Shortcuts**: Display keyboard shortcuts with `Menubar.Shortcut`
- **Separators**: Use `Menubar.Separator` for visual dividers
- **Checkboxes**: `Menubar.CheckboxItem` with `bind:checked` for toggling
- **Radio Groups**: `Menubar.RadioGroup` with `Menubar.RadioItem` for single selection
- **Inset Items**: Add `inset` prop to `Menubar.Item` for alignment with checkboxes/radios