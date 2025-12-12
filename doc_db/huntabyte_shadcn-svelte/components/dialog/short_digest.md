## Dialog

Overlay window that renders content underneath inert.

### Installation

```bash
npx shadcn-svelte@latest add dialog -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
</script>

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description text</Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>
```

Components: `Root`, `Trigger`, `Content`, `Header`, `Title`, `Description`, `Footer`