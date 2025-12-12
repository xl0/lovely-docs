## Item

Flex container for displaying content with title, description, and actions.

## Installation

```bash
npx shadcn-svelte@latest add item -y -o
```

## Basic Usage

```svelte
<Item.Root variant="outline">
  <Item.Media variant="icon">
    <IconComponent />
  </Item.Media>
  <Item.Content>
    <Item.Title>Title</Item.Title>
    <Item.Description>Description</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Button>Action</Button>
  </Item.Actions>
</Item.Root>
```

## Variants

- Default: subtle background and borders
- `outline`: clear borders, transparent background
- `muted`: subdued appearance for secondary content

## Sizes

- Default: standard size
- `sm`: compact size

## Media Types

- `variant="icon"`: for icons
- `variant="image"`: for images
- Default: for avatars or custom content

## Grouping

```svelte
<Item.Group>
  {#each items as item}
    <Item.Root>...</Item.Root>
    {#if !isLast}<Item.Separator />{/if}
  {/each}
</Item.Group>
```

Can use as grid with `class="grid grid-cols-3 gap-4"`.

## Links

Use `child` snippet to render as anchor:

```svelte
<Item.Root>
  {#snippet child({ props })}
    <a href="/" {...props}>
      <Item.Content>...</Item.Content>
    </a>
  {/snippet}
</Item.Root>
```

## Dropdown Integration

Nest `Item.Root` inside `DropdownMenu.Item` with `size="sm"` and `class="w-full p-2"`.

## Components

`Item.Root`, `Item.Header`, `Item.Media`, `Item.Content`, `Item.Title`, `Item.Description`, `Item.Actions`, `Item.Footer`, `Item.Group`, `Item.Separator`