## Command

Fast, composable command menu component for Svelte.

### Installation

```bash
npx shadcn-svelte@latest add command -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import * as Command from "$lib/components/ui/command/index.js";
</script>

<Command.Root>
  <Command.Input placeholder="Type a command or search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Suggestions">
      <Command.Item disabled>Disabled Item</Command.Item>
      <Command.Item>
        <span>Profile</span>
        <Command.Shortcut>P</Command.Shortcut>
      </Command.Item>
    </Command.Group>
    <Command.Separator />
  </Command.List>
</Command.Root>
```

### Dialog Variant

Use `<Command.Dialog bind:open>` to show the command menu in a modal. Trigger with keyboard shortcut (e.g., Cmd+K):

```svelte
<script lang="ts">
  let open = $state(false);
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      open = !open;
    }
  }
</script>

<svelte:document onkeydown={handleKeydown} />
<Command.Dialog bind:open>
  <!-- same content as Command.Root -->
</Command.Dialog>
```

### Key Components

- `Root` / `Dialog` - Container
- `Input` - Search field
- `List`, `Group`, `Item`, `Empty`, `Separator`, `Shortcut` - Content structure
- Icons in items are auto-styled (size-4, pointer-events-none, shrink-0)