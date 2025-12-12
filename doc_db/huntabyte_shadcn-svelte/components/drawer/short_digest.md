## Drawer

Slide-out panel component built on Vaul Svelte.

## Installation

```bash
npx shadcn-svelte@latest add drawer -y -o
```

## Basic Usage

```svelte
<script lang="ts">
  import * as Drawer from "$lib/components/ui/drawer/index.js";
</script>

<Drawer.Root>
  <Drawer.Trigger>Open</Drawer.Trigger>
  <Drawer.Content>
    <Drawer.Header>
      <Drawer.Title>Title</Drawer.Title>
      <Drawer.Description>Description</Drawer.Description>
    </Drawer.Header>
    <Drawer.Footer>
      <Button>Submit</Button>
      <Drawer.Close>Cancel</Drawer.Close>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
```

## Responsive Dialog

Use MediaQuery to render Dialog on desktop (≥768px) and Drawer on mobile, sharing the same form content between both branches.