# Spinner

Loading state indicator component.

## Installation

```bash
npx shadcn-svelte@latest add spinner -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

## Usage

```svelte
<script lang="ts">
  import { Spinner } from "$lib/components/ui/spinner/index.js";
</script>

<Spinner />
```

## Customization

Replace the default spinner icon by editing the component:

```svelte
<script lang="ts">
  import { cn } from "$lib/utils.js";
  import LoaderIcon from "@lucide/svelte/icons/loader";
  import type { ComponentProps } from "svelte";
  
  type Props = ComponentProps<typeof LoaderIcon>;
  let { class: className, ...restProps }: Props = $props();
</script>

<LoaderIcon
  role="status"
  aria-label="Loading"
  class={cn("size-4 animate-spin", className)}
  {...restProps}
/>
```

## Examples

### Size and Color

Use `size-*` and `text-*` utility classes:

```svelte
<div class="flex items-center gap-6">
  <Spinner class="size-3" />
  <Spinner class="size-4" />
  <Spinner class="size-6 text-red-500" />
  <Spinner class="size-8 text-blue-500" />
</div>
```

### Button

```svelte
<Button disabled size="sm">
  <Spinner />
  Loading...
</Button>
```

Button component handles spacing between spinner and text.

### Badge

```svelte
<Badge>
  <Spinner />
  Syncing
</Badge>
```

### Input Group

```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Send a message..." disabled />
  <InputGroup.Addon align="inline-end">
    <Spinner />
  </InputGroup.Addon>
</InputGroup.Root>
```

Spinners work inside `<InputGroup.Addon>`.

### Empty State

```svelte
<Empty.Root class="w-full">
  <Empty.Header>
    <Empty.Media variant="icon">
      <Spinner />
    </Empty.Media>
    <Empty.Title>Processing your request</Empty.Title>
    <Empty.Description>
      Please wait while we process your request. Do not refresh the page.
    </Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button variant="outline" size="sm">Cancel</Button>
  </Empty.Content>
</Empty.Root>
```

### Item

```svelte
<Item.Root variant="outline">
  <Item.Media variant="icon">
    <Spinner />
  </Item.Media>
  <Item.Content>
    <Item.Title>Downloading...</Item.Title>
    <Item.Description>129 MB / 1000 MB</Item.Description>
  </Item.Content>
  <Item.Actions class="hidden sm:flex">
    <Button variant="outline" size="sm">Cancel</Button>
  </Item.Actions>
  <Item.Footer>
    <Progress value={75} />
  </Item.Footer>
</Item.Root>
```

Use spinner inside `<Item.Media>` to indicate loading state.