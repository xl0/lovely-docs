# Button Group

Container grouping related buttons with consistent styling.

## Installation

```bash
npx shadcn-svelte@latest add button-group -y -o
```

## Basic Usage

```svelte
<ButtonGroup.Root>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup.Root>
```

## Key Features

- **Orientation**: `orientation="vertical"` for vertical layout
- **Separator**: `ButtonGroup.Separator` divides buttons (needed for non-outline variants)
- **Nesting**: Nest groups for spacing
- **Accessibility**: `role="group"`, use `aria-label` or `aria-labelledby`
- **ButtonGroup vs ToggleGroup**: Use ButtonGroup for actions, ToggleGroup for state toggles

## Composition Examples

**Split button with dropdown:**
```svelte
<ButtonGroup.Root>
  <Button variant="outline">Follow</Button>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline"><ChevronDown /></Button>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end">
      <DropdownMenu.Item>Option 1</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</ButtonGroup.Root>
```

**With input:**
```svelte
<ButtonGroup.Root>
  <Input placeholder="Search..." />
  <Button variant="outline" size="icon"><Search /></Button>
</ButtonGroup.Root>
```

**With Select and InputGroup:** Supported, see full digest for examples.