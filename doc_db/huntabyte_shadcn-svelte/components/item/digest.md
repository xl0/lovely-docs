## Item

A flex container component for displaying content with title, description, and actions. Simpler alternative to using a `div` with classes when you need this layout pattern repeatedly.

## Installation

```bash
npx shadcn-svelte@latest add item -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

## Usage

```svelte
<script lang="ts">
  import * as Item from "$lib/components/ui/item/index.js";
</script>

<Item.Root>
  <Item.Header>Item Header</Item.Header>
  <Item.Media />
  <Item.Content>
    <Item.Title>Item</Item.Title>
    <Item.Description>Item</Item.Description>
  </Item.Content>
  <Item.Actions />
  <Item.Footer>Item Footer</Item.Footer>
</Item.Root>
```

## Item vs Field

Use **Field** for form inputs (checkbox, input, radio, select).
Use **Item** for displaying content (title, description, actions).

## Variants

Three variants available: default (subtle background/borders), `outline` (clear borders, transparent background), `muted` (subdued appearance for secondary content).

```svelte
<Item.Root>
  <Item.Content>
    <Item.Title>Default Variant</Item.Title>
    <Item.Description>Standard styling with subtle background and borders.</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Button variant="outline" size="sm">Open</Button>
  </Item.Actions>
</Item.Root>

<Item.Root variant="outline">
  <Item.Content>
    <Item.Title>Outline Variant</Item.Title>
    <Item.Description>Outlined style with clear borders and transparent background.</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Button variant="outline" size="sm">Open</Button>
  </Item.Actions>
</Item.Root>

<Item.Root variant="muted">
  <Item.Content>
    <Item.Title>Muted Variant</Item.Title>
    <Item.Description>Subdued appearance with muted colors for secondary content.</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Button variant="outline" size="sm">Open</Button>
  </Item.Actions>
</Item.Root>
```

## Sizes

Use `size="sm"` for compact items or default size for standard items.

## Media Variants

### Icon
```svelte
<Item.Root variant="outline">
  <Item.Media variant="icon">
    <ShieldAlertIcon />
  </Item.Media>
  <Item.Content>
    <Item.Title>Security Alert</Item.Title>
    <Item.Description>New login detected from unknown device.</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Button size="sm" variant="outline">Review</Button>
  </Item.Actions>
</Item.Root>
```

### Avatar
```svelte
<Item.Root variant="outline">
  <Item.Media>
    <Avatar.Root class="size-10">
      <Avatar.Image src="https://github.com/evilrabbit.png" />
      <Avatar.Fallback>ER</Avatar.Fallback>
    </Avatar.Root>
  </Item.Media>
  <Item.Content>
    <Item.Title>Evil Rabbit</Item.Title>
    <Item.Description>Last seen 5 months ago</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Button size="icon" variant="outline" class="rounded-full" aria-label="Invite">
      <Plus />
    </Button>
  </Item.Actions>
</Item.Root>
```

Multiple avatars with negative spacing:
```svelte
<Item.Root variant="outline">
  <Item.Media>
    <div class="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
      <Avatar.Root class="hidden sm:flex">
        <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
        <Avatar.Fallback>CN</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root class="hidden sm:flex">
        <Avatar.Image src="https://github.com/maxleiter.png" alt="@maxleiter" />
        <Avatar.Fallback>LR</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root>
        <Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
        <Avatar.Fallback>ER</Avatar.Fallback>
      </Avatar.Root>
    </div>
  </Item.Media>
  <Item.Content>
    <Item.Title>No Team Members</Item.Title>
    <Item.Description>Invite your team to collaborate on this project.</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Button size="sm" variant="outline">Invite</Button>
  </Item.Actions>
</Item.Root>
```

### Image
```svelte
<Item.Root variant="outline">
  {#snippet child({ props })}
    <a href="#/" {...props}>
      <Item.Media variant="image">
        <img src="..." alt="..." width="32" height="32" class="size-8 rounded object-cover grayscale" />
      </Item.Media>
      <Item.Content>
        <Item.Title>Song Title - <span class="text-muted-foreground">Album</span></Item.Title>
        <Item.Description>Artist Name</Item.Description>
      </Item.Content>
      <Item.Content class="flex-none text-center">
        <Item.Description>3:45</Item.Description>
      </Item.Content>
    </a>
  {/snippet}
</Item.Root>
```

## Grouping

Use `Item.Group` to create a list of items. Add `Item.Separator` between items:

```svelte
<Item.Group>
  {#each people as person, index (person.username)}
    <Item.Root>
      <Item.Media>
        <Avatar.Root>
          <Avatar.Image src={person.avatar} class="grayscale" />
          <Avatar.Fallback>{person.username.charAt(0)}</Avatar.Fallback>
        </Avatar.Root>
      </Item.Media>
      <Item.Content class="gap-1">
        <Item.Title>{person.username}</Item.Title>
        <Item.Description>{person.email}</Item.Description>
      </Item.Content>
      <Item.Actions>
        <Button variant="ghost" size="icon" class="rounded-full">
          <Plus />
        </Button>
      </Item.Actions>
    </Item.Root>
    {#if index !== people.length - 1}
      <Item.Separator />
    {/if}
  {/each}
</Item.Group>
```

Can also be used as a grid:
```svelte
<Item.Group class="grid grid-cols-3 gap-4">
  {#each models as model (model.name)}
    <Item.Root variant="outline">
      <Item.Header>
        <img src={model.image} alt={model.name} width="128" height="128" class="aspect-square w-full rounded-sm object-cover" />
      </Item.Header>
      <Item.Content>
        <Item.Title>{model.name}</Item.Title>
        <Item.Description>{model.description}</Item.Description>
      </Item.Content>
    </Item.Root>
  {/each}
</Item.Group>
```

## Links

Use the `child` snippet to render as a link. Hover and focus states apply to the anchor element:

```svelte
<Item.Root>
  {#snippet child({ props })}
    <a href="#/" {...props}>
      <Item.Content>
        <Item.Title>Visit our documentation</Item.Title>
        <Item.Description>Learn how to get started with our components.</Item.Description>
      </Item.Content>
      <Item.Actions>
        <ChevronRightIcon class="size-4" />
      </Item.Actions>
    </a>
  {/snippet}
</Item.Root>

<Item.Root variant="outline">
  {#snippet child({ props })}
    <a href="#/" target="_blank" rel="noopener noreferrer" {...props}>
      <Item.Content>
        <Item.Title>External resource</Item.Title>
        <Item.Description>Opens in a new tab with security attributes.</Item.Description>
      </Item.Content>
      <Item.Actions>
        <ExternalLinkIcon class="size-4" />
      </Item.Actions>
    </a>
  {/snippet}
</Item.Root>
```

## Dropdown Integration

```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline" size="sm" class="w-fit">
        Select <ChevronDown />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-72 [--radius:0.65rem]" align="end">
    {#each people as person (person.username)}
      <DropdownMenu.Item class="p-0">
        <Item.Root size="sm" class="w-full p-2">
          <Item.Media>
            <Avatar.Root class="size-8">
              <Avatar.Image src={person.avatar} class="grayscale" />
              <Avatar.Fallback>{person.username.charAt(0)}</Avatar.Fallback>
            </Avatar.Root>
          </Item.Media>
          <Item.Content class="gap-0.5">
            <Item.Title>{person.username}</Item.Title>
            <Item.Description>{person.email}</Item.Description>
          </Item.Content>
        </Item.Root>
      </DropdownMenu.Item>
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

## Components

- `Item.Root` - Main container
- `Item.Header` - Header section (e.g., for images)
- `Item.Media` - Media container (icon, avatar, image)
- `Item.Content` - Content wrapper for title and description
- `Item.Title` - Title text
- `Item.Description` - Description text
- `Item.Actions` - Actions container (buttons, icons)
- `Item.Footer` - Footer section
- `Item.Group` - Container for multiple items
- `Item.Separator` - Divider between items