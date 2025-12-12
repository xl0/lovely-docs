## Kbd

Display textual user input from keyboard.

## Installation

```bash
npx shadcn-svelte@latest add kbd -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

## Usage

```svelte
<script lang="ts">
  import * as Kbd from "$lib/components/ui/kbd/index.js";
</script>

<!-- Single key -->
<Kbd.Root>B</Kbd.Root>

<!-- Grouped keys -->
<Kbd.Group>
  <Kbd.Root>Ctrl</Kbd.Root>
  <span>+</span>
  <Kbd.Root>B</Kbd.Root>
</Kbd.Group>
```

## Examples

### In Button
```svelte
<Button variant="outline" size="sm" class="pe-2">
  Accept <Kbd.Root>Enter</Kbd.Root>
</Button>
<Button variant="outline" size="sm" class="pe-2">
  Cancel <Kbd.Root>Esc</Kbd.Root>
</Button>
```

### In Tooltip
```svelte
<Tooltip.Root>
  <Tooltip.Trigger>
    {#snippet child({ props })}
      <Button size="sm" variant="outline" {...props}>Save</Button>
    {/snippet}
  </Tooltip.Trigger>
  <Tooltip.Content>
    <div class="flex items-center gap-2">
      Save Changes <Kbd.Root>S</Kbd.Root>
    </div>
  </Tooltip.Content>
</Tooltip.Root>

<Tooltip.Root>
  <Tooltip.Trigger>
    {#snippet child({ props })}
      <Button size="sm" variant="outline" {...props}>Print</Button>
    {/snippet}
  </Tooltip.Trigger>
  <Tooltip.Content>
    <div class="flex items-center gap-2">
      Print Document
      <Kbd.Group>
        <Kbd.Root>Ctrl</Kbd.Root>
        <Kbd.Root>P</Kbd.Root>
      </Kbd.Group>
    </div>
  </Tooltip.Content>
</Tooltip.Root>
```

### In Input Group
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Search..." />
  <InputGroup.Addon>
    <SearchIcon />
  </InputGroup.Addon>
  <InputGroup.Addon align="inline-end">
    <Kbd.Root>Ctrl</Kbd.Root>
    <Kbd.Root>K</Kbd.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```

## Components

- `Kbd.Root`: Individual keyboard key display
- `Kbd.Group`: Container for grouping multiple keys together