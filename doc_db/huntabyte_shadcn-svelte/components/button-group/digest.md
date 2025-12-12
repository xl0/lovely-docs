# Button Group

Container that groups related buttons together with consistent styling.

## Installation

```bash
npx shadcn-svelte@latest add button-group -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

## Basic Usage

```svelte
<script lang="ts">
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<ButtonGroup.Root>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup.Root>
```

## Accessibility

- `ButtonGroup` has `role="group"`
- Use `tabindex` to navigate between buttons
- Label with `aria-label` or `aria-labelledby`

```svelte
<ButtonGroup.Root aria-label="Button group">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup.Root>
```

## ButtonGroup vs ToggleGroup

- **ButtonGroup**: Group buttons that perform an action
- **ToggleGroup**: Group buttons that toggle a state

## Orientation

Set `orientation="vertical"` for vertical layout:

```svelte
<ButtonGroup.Root orientation="vertical" aria-label="Media controls" class="h-fit">
  <Button variant="outline" size="icon"><Plus /></Button>
  <Button variant="outline" size="icon"><Minus /></Button>
</ButtonGroup.Root>
```

## Size

Control button sizes with `size` prop on individual buttons:

```svelte
<ButtonGroup.Root>
  <Button variant="outline" size="sm">Small</Button>
  <Button variant="outline">Default</Button>
  <Button variant="outline" size="lg">Large</Button>
</ButtonGroup.Root>
```

## Nesting

Nest `ButtonGroup` components to create groups with spacing:

```svelte
<ButtonGroup.Root>
  <ButtonGroup.Root>
    <Button variant="outline" size="sm">1</Button>
    <Button variant="outline" size="sm">2</Button>
    <Button variant="outline" size="sm">3</Button>
  </ButtonGroup.Root>
  <ButtonGroup.Root>
    <Button variant="outline" size="icon-sm" aria-label="Previous"><ArrowLeft /></Button>
    <Button variant="outline" size="icon-sm" aria-label="Next"><ArrowRight /></Button>
  </ButtonGroup.Root>
</ButtonGroup.Root>
```

## Separator

`ButtonGroup.Separator` visually divides buttons. Buttons with `variant="outline"` have borders and don't need separators. For other variants, separators improve visual hierarchy:

```svelte
<ButtonGroup.Root>
  <Button variant="secondary" size="sm">Copy</Button>
  <ButtonGroup.Separator />
  <Button variant="secondary" size="sm">Paste</Button>
</ButtonGroup.Root>
```

## Split Button

Create split button with separator:

```svelte
<ButtonGroup.Root>
  <Button variant="secondary">Button</Button>
  <ButtonGroup.Separator />
  <Button variant="secondary" size="icon"><Plus /></Button>
</ButtonGroup.Root>
```

## With Input

Wrap `Input` component with buttons:

```svelte
<ButtonGroup.Root>
  <Input placeholder="Search..." />
  <Button variant="outline" size="icon" aria-label="Search"><Search /></Button>
</ButtonGroup.Root>
```

## With InputGroup

Create complex input layouts:

```svelte
<ButtonGroup.Root class="[--radius:9999rem]">
  <ButtonGroup.Root>
    <Button variant="outline" size="icon"><Plus /></Button>
  </ButtonGroup.Root>
  <ButtonGroup.Root>
    <InputGroup.Root>
      <InputGroup.Input placeholder="Send a message..." />
      <InputGroup.Addon align="inline-end">
        <InputGroup.Button size="icon-xs" onclick={() => (voiceEnabled = !voiceEnabled)}>
          <AudioLines />
        </InputGroup.Button>
      </InputGroup.Addon>
    </InputGroup.Root>
  </ButtonGroup.Root>
</ButtonGroup.Root>
```

## With DropdownMenu

Split button with dropdown menu:

```svelte
<ButtonGroup.Root>
  <Button variant="outline">Follow</Button>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline" class="!ps-2"><ChevronDown /></Button>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end">
      <DropdownMenu.Group>
        <DropdownMenu.Item><VolumeOff />Mute Conversation</DropdownMenu.Item>
        <DropdownMenu.Item><Check />Mark as Read</DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Separator />
      <DropdownMenu.Group>
        <DropdownMenu.Item variant="destructive"><Trash />Delete</DropdownMenu.Item>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</ButtonGroup.Root>
```

## With Select

Pair with `Select` component:

```svelte
<ButtonGroup.Root>
  <ButtonGroup.Root>
    <Select.Root type="single" bind:value={currency}>
      <Select.Trigger class="font-mono">{currency}</Select.Trigger>
      <Select.Content class="min-w-24">
        {#each CURRENCIES as currencyOption (currencyOption.value)}
          <Select.Item value={currencyOption.value}>
            {currencyOption.value}
            <span class="text-muted-foreground">{currencyOption.label}</span>
          </Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
    <Input placeholder="10.00" pattern="[0-9]*" />
  </ButtonGroup.Root>
  <ButtonGroup.Root>
    <Button aria-label="Send" size="icon" variant="outline"><ArrowRight /></Button>
  </ButtonGroup.Root>
</ButtonGroup.Root>
```

## With Popover

Use with `Popover` component:

```svelte
<ButtonGroup.Root>
  <Button variant="outline"><Bot />Copilot</Button>
  <Popover.Root>
    <Popover.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline" size="icon" aria-label="Open Popover">
          <ChevronDown />
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content align="end" class="rounded-xl p-0 text-sm">
      <div class="px-4 py-3">
        <div class="text-sm font-medium">Agent Tasks</div>
      </div>
      <Separator />
      <div class="p-4 text-sm">
        <Textarea placeholder="Describe your task in natural language." class="mb-4 resize-none" />
        <p class="font-medium">Start a new task with Copilot</p>
        <p class="text-muted-foreground">Describe your task in natural language. Copilot will work in the background and open a pull request for your review.</p>
      </div>
    </Popover.Content>
  </Popover.Root>
</ButtonGroup.Root>
```