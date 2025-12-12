## Sheet

A dialog-based component that displays complementary content sliding in from the screen edge.

### Installation

```bash
npx shadcn-svelte@latest add sheet -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet/index.js";
</script>

<Sheet.Root>
  <Sheet.Trigger>Open</Sheet.Trigger>
  <Sheet.Content>
    <Sheet.Header>
      <Sheet.Title>Title</Sheet.Title>
      <Sheet.Description>Description text</Sheet.Description>
    </Sheet.Header>
  </Sheet.Content>
</Sheet.Root>
```

### Side Positioning

Pass the `side` property to `<Sheet.Content />` to control where the sheet slides in from: `top`, `right`, `bottom`, or `left`.

```svelte
<Sheet.Content side="right">
  <!-- content -->
</Sheet.Content>
```

### Size Customization

Adjust sheet width using CSS classes on `<Sheet.Content />`:

```svelte
<Sheet.Content class="w-[400px] sm:w-[540px]">
  <!-- content -->
</Sheet.Content>
```

### Complete Example

```svelte
<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<Sheet.Root>
  <Sheet.Trigger class={buttonVariants({ variant: "outline" })}>
    Open
  </Sheet.Trigger>
  <Sheet.Content side="right" class="w-[400px] sm:w-[540px]">
    <Sheet.Header>
      <Sheet.Title>Edit profile</Sheet.Title>
      <Sheet.Description>
        Make changes to your profile here. Click save when you're done.
      </Sheet.Description>
    </Sheet.Header>
    <div class="grid flex-1 auto-rows-min gap-6 px-4">
      <div class="grid gap-3">
        <Label for="name" class="text-end">Name</Label>
        <Input id="name" value="Pedro Duarte" />
      </div>
      <div class="grid gap-3">
        <Label for="username" class="text-end">Username</Label>
        <Input id="username" value="@peduarte" />
      </div>
    </div>
    <Sheet.Footer>
      <Sheet.Close class={buttonVariants({ variant: "outline" })}>
        Save changes
      </Sheet.Close>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
```

### Components

- `Sheet.Root` - Container
- `Sheet.Trigger` - Opens the sheet
- `Sheet.Content` - Main content area (accepts `side` prop and CSS classes)
- `Sheet.Header` - Header section
- `Sheet.Title` - Title text
- `Sheet.Description` - Description text
- `Sheet.Footer` - Footer section
- `Sheet.Close` - Closes the sheet

Extends the Dialog component. See Dialog API reference for additional details.