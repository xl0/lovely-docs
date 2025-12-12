## Input Group

Display additional information or actions to an input or textarea.

## Installation

```bash
npx shadcn-svelte@latest add input-group -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

## Usage

```svelte
<script lang="ts">
  import * as InputGroup from "$lib/components/ui/input-group/index.js";
  import SearchIcon from "@lucide/svelte/icons/search";
</script>

<InputGroup.Root>
  <InputGroup.Input placeholder="Search..." />
  <InputGroup.Addon>
    <SearchIcon />
  </InputGroup.Addon>
  <InputGroup.Addon align="inline-end">
    <InputGroup.Button>Search</InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

## Components

- `InputGroup.Root` - Container
- `InputGroup.Input` - Text input
- `InputGroup.Textarea` - Multi-line input
- `InputGroup.Addon` - Container for additional content (icons, text, buttons)
- `InputGroup.Text` - Text content within addon
- `InputGroup.Button` - Button within addon

## Addon Alignment

The `align` prop on `InputGroup.Addon` controls positioning:
- `inline-end` (default) - Right side for inputs, left side for RTL
- `block-end` - Bottom (for textareas)
- `block-start` - Top (for textareas)

## Examples

### Icons
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Search..." />
  <InputGroup.Addon>
    <SearchIcon />
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input type="email" placeholder="Enter your email" />
  <InputGroup.Addon>
    <MailIcon />
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input placeholder="Card number" />
  <InputGroup.Addon>
    <CreditCardIcon />
  </InputGroup.Addon>
  <InputGroup.Addon align="inline-end">
    <CheckIcon />
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input placeholder="Card number" />
  <InputGroup.Addon align="inline-end">
    <StarIcon />
    <InfoIcon />
  </InputGroup.Addon>
</InputGroup.Root>
```

### Text
```svelte
<InputGroup.Root>
  <InputGroup.Addon>
    <InputGroup.Text>$</InputGroup.Text>
  </InputGroup.Addon>
  <InputGroup.Input placeholder="0.00" />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Text>USD</InputGroup.Text>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Addon>
    <InputGroup.Text>https://</InputGroup.Text>
  </InputGroup.Addon>
  <InputGroup.Input placeholder="example.com" class="!ps-0.5" />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Text>.com</InputGroup.Text>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input placeholder="Enter your username" />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Text>@company.com</InputGroup.Text>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Textarea placeholder="Enter your message" />
  <InputGroup.Addon align="block-end">
    <InputGroup.Text class="text-muted-foreground text-xs">
      120 characters left
    </InputGroup.Text>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Buttons
```svelte
<script lang="ts">
  import { UseClipboard } from "$lib/hooks/use-clipboard.svelte.js";
  let isFavorite = $state(false);
  const clipboard = new UseClipboard();
</script>

<InputGroup.Root>
  <InputGroup.Input placeholder="https://x.com/shadcn" readonly />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Button
      aria-label="Copy"
      size="icon-xs"
      onclick={() => clipboard.copy("https://x.com/shadcn")}
    >
      {#if clipboard.copied}
        <CheckIcon />
      {:else}
        <CopyIcon />
      {/if}
    </InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root class="[--radius:9999px]">
  <InputGroup.Addon>
    <InputGroup.Button variant="secondary" size="icon-xs">
      <InfoIcon />
    </InputGroup.Button>
  </InputGroup.Addon>
  <InputGroup.Addon class="text-muted-foreground ps-1.5">
    <InputGroup.Text>https://</InputGroup.Text>
  </InputGroup.Addon>
  <InputGroup.Input />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Button
      onclick={() => (isFavorite = !isFavorite)}
      size="icon-xs"
    >
      <StarIcon class={isFavorite ? "fill-blue-600 stroke-blue-600" : ""} />
    </InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input placeholder="Type to search..." />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Button variant="secondary">Search</InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Tooltips
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Enter password" type="password" />
  <InputGroup.Addon align="inline-end">
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <InputGroup.Button
            {...props}
            variant="ghost"
            aria-label="Info"
            size="icon-xs"
          >
            <InfoIcon />
          </InputGroup.Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>Password must be at least 8 characters</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input placeholder="Your email address" />
  <InputGroup.Addon align="inline-end">
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <InputGroup.Button
            {...props}
            variant="ghost"
            aria-label="Help"
            size="icon-xs"
          >
            <HelpCircleIcon />
          </InputGroup.Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>We'll use this to send you notifications</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input placeholder="Enter API key" />
  <Tooltip.Root>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <InputGroup.Addon>
          <InputGroup.Button
            {...props}
            variant="ghost"
            aria-label="Help"
            size="icon-xs"
          >
            <HelpCircleIcon />
          </InputGroup.Button>
        </InputGroup.Addon>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content side="left">
      <p>Click for help with API keys</p>
    </Tooltip.Content>
  </Tooltip.Root>
</InputGroup.Root>
```

### Textarea
```svelte
<InputGroup.Root>
  <InputGroup.Addon align="block-start" class="border-b">
    <InputGroup.Text class="font-mono font-medium">
      script.js
    </InputGroup.Text>
    <InputGroup.Button class="ms-auto" size="icon-xs">
      <RefreshCwIcon />
    </InputGroup.Button>
    <InputGroup.Button variant="ghost" size="icon-xs">
      <CopyIcon />
    </InputGroup.Button>
  </InputGroup.Addon>
  <InputGroup.Textarea
    placeholder="console.log('Hello, world!');"
    class="min-h-[200px]"
  />
  <InputGroup.Addon align="block-end" class="border-t">
    <InputGroup.Text>Line 1, Column 1</InputGroup.Text>
    <InputGroup.Button size="sm" class="ms-auto" variant="default">
      Run <CornerDownLeftIcon />
    </InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Loading States
```svelte
<InputGroup.Root data-disabled>
  <InputGroup.Input placeholder="Searching..." disabled />
  <InputGroup.Addon align="inline-end">
    <Spinner />
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root data-disabled>
  <InputGroup.Input placeholder="Processing..." disabled />
  <InputGroup.Addon>
    <Spinner />
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root data-disabled>
  <InputGroup.Input placeholder="Saving changes..." disabled />
  <InputGroup.Addon align="inline-end">
    <InputGroup.Text>Saving...</InputGroup.Text>
    <Spinner />
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root data-disabled>
  <InputGroup.Input placeholder="Refreshing data..." disabled />
  <InputGroup.Addon>
    <LoaderIcon class="animate-spin" />
  </InputGroup.Addon>
  <InputGroup.Addon align="inline-end">
    <InputGroup.Text class="text-muted-foreground">
      Please wait...
    </InputGroup.Text>
  </InputGroup.Addon>
</InputGroup.Root>
```

Use `data-disabled` attribute on `InputGroup.Root` for disabled state styling.

### Labels
```svelte
<InputGroup.Root>
  <InputGroup.Input id="email" placeholder="shadcn" />
  <InputGroup.Addon>
    <Label.Root for="email">@</Label.Root>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root>
  <InputGroup.Input id="email-2" placeholder="shadcn@vercel.com" />
  <InputGroup.Addon align="block-start">
    <Label.Root for="email-2" class="text-foreground">Email</Label.Root>
    <Tooltip.Root>
      <Tooltip.Trigger>
        {#snippet child({ props })}
          <InputGroup.Button
            {...props}
            variant="ghost"
            aria-label="Help"
            class="ms-auto rounded-full"
            size="icon-xs"
          >
            <InfoIcon />
          </InputGroup.Button>
        {/snippet}
      </Tooltip.Trigger>
      <Tooltip.Content>
        <p>We'll use this to send you notifications</p>
      </Tooltip.Content>
    </Tooltip.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Dropdowns
```svelte
<InputGroup.Root>
  <InputGroup.Input placeholder="Enter file name" />
  <InputGroup.Addon align="inline-end">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <InputGroup.Button
            {...props}
            variant="ghost"
            aria-label="More"
            size="icon-xs"
          >
            <MoreHorizontalIcon />
          </InputGroup.Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <DropdownMenu.Item>Settings</DropdownMenu.Item>
        <DropdownMenu.Item>Copy path</DropdownMenu.Item>
        <DropdownMenu.Item>Open location</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </InputGroup.Addon>
</InputGroup.Root>

<InputGroup.Root class="[--radius:1rem]">
  <InputGroup.Input placeholder="Enter search query" />
  <InputGroup.Addon align="inline-end">
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <InputGroup.Button
            {...props}
            variant="ghost"
            class="!pe-1.5 text-xs"
          >
            Search In... <ChevronDownIcon class="size-3" />
          </InputGroup.Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" class="[--radius:0.95rem]">
        <DropdownMenu.Item>Documentation</DropdownMenu.Item>
        <DropdownMenu.Item>Blog Posts</DropdownMenu.Item>
        <DropdownMenu.Item>Changelog</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </InputGroup.Addon>
</InputGroup.Root>
```

### Button Groups
```svelte
<ButtonGroup.Root>
  <ButtonGroup.Text>
    <Label.Root for="url">https://</Label.Root>
  </ButtonGroup.Text>
  <InputGroup.Root>
    <InputGroup.Input id="url" />
    <InputGroup.Addon align="inline-end">
      <Link2Icon />
    </InputGroup.Addon>
  </InputGroup.Root>
  <ButtonGroup.Text>.com</ButtonGroup.Text>
</ButtonGroup.Root>
```

Wrap input groups with button groups to create prefixes and suffixes.

### Custom Input
```svelte
<InputGroup.Root>
  <textarea
    data-slot="input-group-control"
    class="field-sizing-content flex min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base outline-none transition-[color,box-shadow] md:text-sm"
    placeholder="Autoresize textarea..."
  ></textarea>
  <InputGroup.Addon align="block-end">
    <InputGroup.Button class="ms-auto" size="sm" variant="default">
      Submit
    </InputGroup.Button>
  </InputGroup.Addon>
</InputGroup.Root>
```

Add `data-slot="input-group-control"` attribute to custom inputs for automatic behavior and focus state handling. No styles are applied; use the `class` prop for styling.