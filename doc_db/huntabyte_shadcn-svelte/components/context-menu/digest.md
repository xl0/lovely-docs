## Context Menu

Right-click triggered menu displaying actions or functions.

## Installation

```bash
npx shadcn-svelte@latest add context-menu -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

## Usage

```svelte
<script lang="ts">
  import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
  let showBookmarks = $state(false);
  let showFullURLs = $state(true);
  let value = $state("pedro");
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
    Right click here
  </ContextMenu.Trigger>
  <ContextMenu.Content class="w-52">
    <ContextMenu.Item inset>
      Back
      <ContextMenu.Shortcut>[</ContextMenu.Shortcut>
    </ContextMenu.Item>
    <ContextMenu.Item inset disabled>
      Forward
      <ContextMenu.Shortcut>]</ContextMenu.Shortcut>
    </ContextMenu.Item>
    <ContextMenu.Item inset>
      Reload
      <ContextMenu.Shortcut>R</ContextMenu.Shortcut>
    </ContextMenu.Item>
    
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger inset>More Tools</ContextMenu.SubTrigger>
      <ContextMenu.SubContent class="w-48">
        <ContextMenu.Item>
          Save Page As...
          <ContextMenu.Shortcut>S</ContextMenu.Shortcut>
        </ContextMenu.Item>
        <ContextMenu.Item>Create Shortcut...</ContextMenu.Item>
        <ContextMenu.Item>Name Window...</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item>Developer Tools</ContextMenu.Item>
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
    
    <ContextMenu.Separator />
    
    <ContextMenu.CheckboxItem bind:checked={showBookmarks}>
      Show Bookmarks
    </ContextMenu.CheckboxItem>
    <ContextMenu.CheckboxItem bind:checked={showFullURLs}>
      Show Full URLs
    </ContextMenu.CheckboxItem>
    
    <ContextMenu.Separator />
    
    <ContextMenu.RadioGroup bind:value>
      <ContextMenu.Group>
        <ContextMenu.GroupHeading inset>People</ContextMenu.GroupHeading>
        <ContextMenu.RadioItem value="pedro">Pedro Duarte</ContextMenu.RadioItem>
        <ContextMenu.RadioItem value="colm">Colm Tuite</ContextMenu.RadioItem>
      </ContextMenu.Group>
    </ContextMenu.RadioGroup>
  </ContextMenu.Content>
</ContextMenu.Root>
```

## Components

- `ContextMenu.Root`: Container
- `ContextMenu.Trigger`: Right-click target element
- `ContextMenu.Content`: Menu container with `class` prop for sizing
- `ContextMenu.Item`: Menu item with optional `inset` and `disabled` props; supports `ContextMenu.Shortcut` child
- `ContextMenu.Sub` / `ContextMenu.SubTrigger` / `ContextMenu.SubContent`: Nested submenu
- `ContextMenu.Separator`: Visual divider
- `ContextMenu.CheckboxItem`: Checkbox item with `bind:checked` for state binding
- `ContextMenu.RadioGroup` / `ContextMenu.RadioItem`: Radio selection group with `bind:value`
- `ContextMenu.Group` / `ContextMenu.GroupHeading`: Item grouping with optional `inset` heading