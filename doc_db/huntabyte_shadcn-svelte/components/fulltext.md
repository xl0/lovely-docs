

## Pages

### accordion
Accordion component with single/multiple open items, WAI-ARIA accessible, composed of Root/Item/Trigger/Content subcomponents.

## Accordion

A vertically stacked set of interactive headings that each reveal a section of content.

## Installation

```bash
npx shadcn-svelte@latest add accordion -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

## Usage

```svelte
<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion/index.js";
</script>

<Accordion.Root type="single" class="w-full sm:max-w-[70%]" value="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
    <Accordion.Content>
      Yes. It adheres to the WAI-ARIA design pattern.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Another item</Accordion.Trigger>
    <Accordion.Content>
      Content for the second item.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

### Key Props

- `type`: Set to `"single"` for single-open behavior (only one item open at a time)
- `value`: Controls which item is initially open (e.g., `"item-1"`)
- `class`: Apply Tailwind classes for styling (e.g., `w-full sm:max-w-[70%]`)

### Components

- `Accordion.Root`: Container component
- `Accordion.Item`: Individual accordion item with a `value` prop
- `Accordion.Trigger`: Clickable heading that toggles content visibility
- `Accordion.Content`: Content section revealed when trigger is clicked

Content can include multiple paragraphs and flex layouts with gap utilities.

### alert-dialog
Modal dialog component with trigger, header, description, and cancel/action buttons; install via shadcn-svelte CLI.

## Alert Dialog

Modal dialog that interrupts the user with important content and expects a response.

### Installation

```bash
npx shadcn-svelte@latest add alert-dialog -y -o
```

Use `-y` to skip confirmation prompt and `-o` to overwrite existing files.

### Usage

```svelte
<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
</script>

<AlertDialog.Root>
  <AlertDialog.Trigger class={buttonVariants({ variant: "outline" })}>
    Show Dialog
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action>Continue</AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
```

### Components

- `AlertDialog.Root` - Root container
- `AlertDialog.Trigger` - Button to open dialog
- `AlertDialog.Content` - Dialog content wrapper
- `AlertDialog.Header` - Header section
- `AlertDialog.Title` - Dialog title
- `AlertDialog.Description` - Dialog description text
- `AlertDialog.Footer` - Footer section
- `AlertDialog.Cancel` - Cancel button
- `AlertDialog.Action` - Action/confirm button

See Bits UI documentation for full API reference.

### alert
Alert component with Root, Title, and Description subcomponents; supports default and destructive variants.

## Alert

Displays a callout for user attention.

### Installation

```bash
npx shadcn-svelte@latest add alert -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import * as Alert from "$lib/components/ui/alert/index.js";
  import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
  import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
</script>

<!-- Default alert with title and description -->
<Alert.Root>
  <CheckCircle2Icon />
  <Alert.Title>Success! Your changes have been saved</Alert.Title>
  <Alert.Description>This is an alert with icon, title and description.</Alert.Description>
</Alert.Root>

<!-- Alert with title and icon only -->
<Alert.Root>
  <CheckCircle2Icon />
  <Alert.Title>This Alert has a title and an icon. No description.</Alert.Title>
</Alert.Root>

<!-- Destructive variant with complex content -->
<Alert.Root variant="destructive">
  <AlertCircleIcon />
  <Alert.Title>Unable to process your payment.</Alert.Title>
  <Alert.Description>
    <p>Please verify your billing information and try again.</p>
    <ul class="list-inside list-disc text-sm">
      <li>Check your card details</li>
      <li>Ensure sufficient funds</li>
      <li>Verify billing address</li>
    </ul>
  </Alert.Description>
</Alert.Root>
```

### Components

- `Alert.Root`: Container for the alert
- `Alert.Title`: Alert title
- `Alert.Description`: Alert description (optional)

### Variants

- `default`: Standard alert styling
- `destructive`: Error/warning styling for destructive actions or errors

### aspect-ratio
AspectRatio component enforces a specified aspect ratio on content via numeric ratio prop (e.g., 16/9).

## Aspect Ratio

Displays content within a desired ratio.

### Installation

```bash
npx shadcn-svelte@latest add aspect-ratio -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

Import the component:

```svelte
<script lang="ts">
  import { AspectRatio } from "$lib/components/ui/aspect-ratio/index.js";
</script>
```

Basic example with 16:9 ratio:

```svelte
<div class="w-[450px]">
  <AspectRatio ratio={16 / 9} class="bg-muted">
    <img 
      src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
      alt="Gray by Drew Beamer"
      class="h-full w-full rounded-md object-cover"
    />
  </AspectRatio>
</div>
```

The `ratio` prop accepts a numeric value (e.g., `16 / 9` for widescreen). Content inside maintains the specified aspect ratio. Use `class` prop to add custom styling like background color or rounded corners.

### avatar
Avatar component with Image and Fallback subcomponents; displays user images with text fallback when loading fails.

## Avatar

Image element with fallback for user representation.

### Installation

```bash
npx shadcn-svelte@latest add avatar -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
</script>

<!-- Basic avatar -->
<Avatar.Root>
  <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
  <Avatar.Fallback>CN</Avatar.Fallback>
</Avatar.Root>

<!-- Rounded variant -->
<Avatar.Root class="rounded-lg">
  <Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
  <Avatar.Fallback>ER</Avatar.Fallback>
</Avatar.Root>

<!-- Multiple avatars with styling -->
<div class="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
  <Avatar.Root>
    <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
    <Avatar.Fallback>CN</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Image src="https://github.com/leerob.png" alt="@leerob" />
    <Avatar.Fallback>LR</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root>
    <Avatar.Image src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
    <Avatar.Fallback>ER</Avatar.Fallback>
  </Avatar.Root>
</div>
```

### Components

- `Avatar.Root`: Container component
- `Avatar.Image`: Image element with src and alt attributes
- `Avatar.Fallback`: Fallback text displayed when image fails to load

Supports custom styling via class prop on Root component.

### badge
Badge component with variants (default, secondary, destructive, outline); supports custom styling and badgeVariants helper for link badges.

## Badge

Displays a badge or a component that looks like a badge.

### Installation

```bash
npx shadcn-svelte@latest add badge -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

Basic badge with variants:

```svelte
<script lang="ts">
  import { Badge } from "$lib/components/ui/badge/index.js";
  import BadgeCheckIcon from "@lucide/svelte/icons/badge-check";
</script>

<Badge>Badge</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>

<!-- Custom styled badges -->
<Badge variant="secondary" class="bg-blue-500 text-white dark:bg-blue-600">
  <BadgeCheckIcon />
  Verified
</Badge>

<!-- Circular badges with numbers -->
<Badge class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">8</Badge>
<Badge class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums" variant="destructive">99</Badge>
<Badge class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums" variant="outline">20+</Badge>
```

### Link Badge

Use `badgeVariants` helper to create a link styled as a badge:

```svelte
<script lang="ts">
  import { badgeVariants } from "$lib/components/ui/badge/index.js";
</script>

<a href="/dashboard" class={badgeVariants({ variant: "outline" })}>Badge</a>
```

### breadcrumb
Breadcrumb component for hierarchical navigation; supports custom separators, dropdowns, ellipsis collapse, and responsive desktop/mobile variants.

# Breadcrumb

Displays the path to the current resource using a hierarchy of links.

## Installation

```bash
npx shadcn-svelte@latest add breadcrumb -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

## Usage

```svelte
<script lang="ts">
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
</script>

<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/components">Components</Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    <Breadcrumb.Item>
      <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
    </Breadcrumb.Item>
  </Breadcrumb.List>
</Breadcrumb.Root>
```

## Components

- `<Breadcrumb.Root>` - Root container
- `<Breadcrumb.List>` - List wrapper
- `<Breadcrumb.Item>` - Individual breadcrumb item
- `<Breadcrumb.Link>` - Clickable link with `href` prop; supports `asChild` prop for custom routing components
- `<Breadcrumb.Page>` - Current page (non-clickable)
- `<Breadcrumb.Separator>` - Separator between items; accepts slot for custom separators
- `<Breadcrumb.Ellipsis>` - Collapsed state indicator for long breadcrumbs

## Examples

### Custom Separator

Pass a custom component to the `<Breadcrumb.Separator />` slot:

```svelte
<Breadcrumb.Separator>
  <SlashIcon />
</Breadcrumb.Separator>
```

### Dropdown

Compose `<Breadcrumb.Item />` with `<DropdownMenu />`:

```svelte
<Breadcrumb.Item>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger class="flex items-center gap-1">
      Components
      <ChevronDownIcon class="size-4" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="start">
      <DropdownMenu.Item>Documentation</DropdownMenu.Item>
      <DropdownMenu.Item>Themes</DropdownMenu.Item>
      <DropdownMenu.Item>GitHub</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</Breadcrumb.Item>
```

### Collapsed

Use `<Breadcrumb.Ellipsis />` to show a collapsed state for long breadcrumbs:

```svelte
<Breadcrumb.Item>
  <Breadcrumb.Ellipsis />
</Breadcrumb.Item>
```

### Custom Link Component

Use the `asChild` prop on `<Breadcrumb.Link />` to integrate with routing libraries:

```svelte
<Breadcrumb.Link asChild href="/">
  <YourCustomLinkComponent />
</Breadcrumb.Link>
```

### Responsive Breadcrumb

Combines `<Breadcrumb.Ellipsis />`, `<DropdownMenu />`, and `<Drawer />` to display a dropdown on desktop and drawer on mobile:

```svelte
<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";

  const items = [
    { href: "#", label: "Home" },
    { href: "#", label: "Documentation" },
    { href: "#", label: "Building Your Application" },
    { href: "#", label: "Data Fetching" },
    { label: "Caching and Revalidating" }
  ];
  const ITEMS_TO_DISPLAY = 3;
  let open = $state(false);
  const isDesktop = new MediaQuery("(min-width: 768px)");
</script>

<Breadcrumb.Root>
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href={items[0].href}>
        {items[0].label}
      </Breadcrumb.Link>
    </Breadcrumb.Item>
    <Breadcrumb.Separator />
    {#if items.length > ITEMS_TO_DISPLAY}
      <Breadcrumb.Item>
        {#if isDesktop.current}
          <DropdownMenu.Root bind:open>
            <DropdownMenu.Trigger class="flex items-center gap-1" aria-label="Toggle menu">
              <Breadcrumb.Ellipsis class="size-4" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="start">
              {#each items.slice(1, -2) as item, i (i)}
                <DropdownMenu.Item>
                  <a href={item.href ? item.href : "#"}>
                    {item.label}
                  </a>
                </DropdownMenu.Item>
              {/each}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        {:else}
          <Drawer.Root bind:open>
            <Drawer.Trigger aria-label="Toggle Menu">
              <Breadcrumb.Ellipsis class="size-4" />
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Header class="text-start">
                <Drawer.Title>Navigate to</Drawer.Title>
                <Drawer.Description>Select a page to navigate to.</Drawer.Description>
              </Drawer.Header>
              <div class="grid gap-1 px-4">
                {#each items.slice(1, -2) as item, i (i)}
                  <a href={item.href ? item.href : "#"} class="py-1 text-sm">
                    {item.label}
                  </a>
                {/each}
              </div>
              <Drawer.Footer class="pt-4">
                <Drawer.Close class={buttonVariants({ variant: "outline" })}>
                  Close
                </Drawer.Close>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Root>
        {/if}
      </Breadcrumb.Item>
      <Breadcrumb.Separator />
    {/if}
    {#each items.slice(-ITEMS_TO_DISPLAY + 1) as item (item.label)}
      <Breadcrumb.Item>
        {#if item.href}
          <Breadcrumb.Link href={item.href} class="max-w-20 truncate md:max-w-none">
            {item.label}
          </Breadcrumb.Link>
          <Breadcrumb.Separator />
        {:else}
          <Breadcrumb.Page class="max-w-20 truncate md:max-w-none">
            {item.label}
          </Breadcrumb.Page>
        {/if}
      </Breadcrumb.Item>
    {/each}
  </Breadcrumb.List>
</Breadcrumb.Root>
```


### button-group
Container for grouping related buttons with consistent styling; supports vertical orientation, separators, nesting, and composition with Input, Select, DropdownMenu, Popover, and InputGroup components.

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

### button
Button component with variants (primary, secondary, destructive, outline, ghost, link), href support for links, icon support, and loading state via Spinner.

## Button

Displays a button or a component that looks like a button.

### Installation

```bash
npx shadcn-svelte@latest add button -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<!-- Default (primary) -->
<Button>Button</Button>

<!-- Variants -->
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Link Button

Convert button to an `<a>` element by passing `href` prop:

```svelte
<Button href="/dashboard">Dashboard</Button>
```

Or use `buttonVariants` helper to style a link as a button:

```svelte
<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button";
</script>

<a href="/dashboard" class={buttonVariants({ variant: "outline" })}>
  Dashboard
</a>
```

### With Icons

```svelte
<script lang="ts">
  import GitBranchIcon from "@lucide/svelte/icons/git-branch";
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<!-- Icon with text -->
<Button variant="outline" size="sm">
  <GitBranchIcon />
  Login with Email
</Button>

<!-- Icon only -->
<Button variant="secondary" size="icon" class="size-8">
  <ChevronRightIcon />
</Button>
```

### Loading State

Use Spinner component to indicate loading:

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Spinner } from "$lib/components/ui/spinner/index.js";
</script>

<Button disabled>
  <Spinner />
  Please wait
</Button>
```

See Bits UI Button docs for full API reference.

### calendar
Date picker component with single/range selection, dropdown month/year navigation, popover integration, natural language parsing support, and constraint options.

# Calendar

Date selection component built on Bits UI Calendar, using @internationalized/date for date handling.

## Installation

```bash
npx shadcn-svelte@latest add calendar -y -o
```

## Basic Usage

```svelte
<script lang="ts">
  import { getLocalTimeZone, today } from "@internationalized/date";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  let value = today(getLocalTimeZone());
</script>

<Calendar
  type="single"
  bind:value
  class="rounded-md border shadow-sm"
  captionLayout="dropdown"
/>
```

## Examples

### Multiple Months with Caption Dropdown

```svelte
<script lang="ts">
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import { CalendarDate } from "@internationalized/date";
  let value = $state<CalendarDate | undefined>(new CalendarDate(2025, 6, 12));
  let captionLayout = $state("dropdown"); // "dropdown" | "dropdown-months" | "dropdown-years"
</script>

<Calendar
  type="single"
  bind:value
  numberOfMonths={2}
  captionLayout={captionLayout}
  class="rounded-lg border shadow-sm"
/>
```

### Date of Birth Picker (with Popover)

```svelte
<script lang="ts">
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import { getLocalTimeZone, today, type CalendarDate } from "@internationalized/date";
  
  let open = $state(false);
  let value = $state<CalendarDate | undefined>();
</script>

<div class="flex flex-col gap-3">
  <Label>Date of birth</Label>
  <Popover.Root bind:open>
    <Popover.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline" class="w-48 justify-between">
          {value ? value.toDate(getLocalTimeZone()).toLocaleDateString() : "Select date"}
          <ChevronDownIcon />
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-auto p-0" align="start">
      <Calendar
        type="single"
        bind:value
        captionLayout="dropdown"
        maxValue={today(getLocalTimeZone())}
        onValueChange={() => { open = false; }}
      />
    </Popover.Content>
  </Popover.Root>
</div>
```

### Date and Time Picker

```svelte
<script lang="ts">
  import Calendar from "$lib/components/ui/calendar/calendar.svelte";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import { getLocalTimeZone, type CalendarDate } from "@internationalized/date";
  
  let open = $state(false);
  let value = $state<CalendarDate | undefined>();
</script>

<div class="flex gap-4">
  <div class="flex flex-col gap-3">
    <Label>Date</Label>
    <Popover.Root bind:open>
      <Popover.Trigger>
        {#snippet child({ props })}
          <Button {...props} variant="outline" class="w-32 justify-between">
            {value ? value.toDate(getLocalTimeZone()).toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        {/snippet}
      </Popover.Trigger>
      <Popover.Content class="w-auto p-0" align="start">
        <Calendar
          type="single"
          bind:value
          captionLayout="dropdown"
          onValueChange={() => { open = false; }}
        />
      </Popover.Content>
    </Popover.Root>
  </div>
  <div class="flex flex-col gap-3">
    <Label>Time</Label>
    <Input type="time" step="1" value="10:30:00" />
  </div>
</div>
```

### Natural Language Date Input

Uses chrono-node to parse natural language dates like "In 2 days" or "next week":

```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import { parseDate } from "chrono-node";
  import { CalendarDate, getLocalTimeZone, type DateValue } from "@internationalized/date";
  import { untrack } from "svelte";
  
  function formatDate(date: DateValue | undefined) {
    if (!date) return "";
    return date.toDate(getLocalTimeZone()).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  }
  
  let open = $state(false);
  let inputValue = $state("In 2 days");
  let value = $state<DateValue | undefined>(
    untrack(() => {
      const date = parseDate(inputValue);
      return date ? new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate()) : undefined;
    })
  );
</script>

<div class="flex flex-col gap-3">
  <Label>Schedule Date</Label>
  <div class="relative flex gap-2">
    <Input
      bind:value={() => inputValue, (v) => {
        inputValue = v;
        const date = parseDate(v);
        if (date) {
          value = new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
        }
      }}
      placeholder="Tomorrow or next week"
      onkeydown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); open = true; } }}
    />
    <Popover.Root bind:open>
      <Popover.Trigger>
        {#snippet child({ props })}
          <Button {...props} variant="ghost" class="absolute end-2 top-1/2 size-6 -translate-y-1/2">
            <CalendarIcon class="size-3.5" />
          </Button>
        {/snippet}
      </Popover.Trigger>
      <Popover.Content class="w-auto p-0" align="end">
        <Calendar
          type="single"
          bind:value
          captionLayout="dropdown"
          onValueChange={(v) => { inputValue = formatDate(v); open = false; }}
        />
      </Popover.Content>
    </Popover.Root>
  </div>
  <div class="text-sm text-muted-foreground">
    Your post will be published on <span class="font-medium">{formatDate(value)}</span>.
  </div>
</div>
```

## Key Props

- `type="single"` - Single date selection
- `bind:value` - Bind selected date
- `captionLayout` - "dropdown" (month/year), "dropdown-months" (month only), "dropdown-years" (year only)
- `numberOfMonths` - Display multiple months
- `maxValue` / `minValue` - Constrain selectable dates
- `onValueChange` - Callback when date changes
- `class` - Styling

## Related Components

- Range Calendar - for date ranges
- Date Picker - wrapper component
- 30+ calendar blocks available in Blocks Library

## Upgrade

```bash
npx shadcn-svelte@latest add calendar -y -o
```

When prompted, select Yes to overwrite. Merge any custom changes with the new version.

### card
Card component with Root, Header, Title, Description, Action, Content, and Footer sub-components; install with `npx shadcn-svelte@latest add card -y -o`.

## Card

Displays a card with header, content, and footer.

### Installation

```bash
npx shadcn-svelte@latest add card -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card Description</Card.Description>
  </Card.Header>
  <Card.Content>
    <p>Card Content</p>
  </Card.Content>
  <Card.Footer>
    <p>Card Footer</p>
  </Card.Footer>
</Card.Root>
```

### Components

- `Card.Root` - Container for the card
- `Card.Header` - Header section
- `Card.Title` - Title within header
- `Card.Description` - Description text within header
- `Card.Action` - Action element within header (optional)
- `Card.Content` - Main content area
- `Card.Footer` - Footer section

### Example: Login Form

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<Card.Root class="w-full max-w-sm">
  <Card.Header>
    <Card.Title>Login to your account</Card.Title>
    <Card.Description>Enter your email below to login to your account</Card.Description>
    <Card.Action>
      <Button variant="link">Sign Up</Button>
    </Card.Action>
  </Card.Header>
  <Card.Content>
    <form>
      <div class="flex flex-col gap-6">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Password</Label>
            <a href="##" class="ms-auto inline-block text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required />
        </div>
      </div>
    </form>
  </Card.Content>
  <Card.Footer class="flex-col gap-2">
    <Button type="submit" class="w-full">Login</Button>
    <Button variant="outline" class="w-full">Login with Google</Button>
  </Card.Footer>
</Card.Root>
```

All Card components accept standard HTML attributes and Tailwind classes via the `class` prop for styling.

### carousel
Embla-based carousel component with sizing, spacing, vertical/horizontal orientation, options, API for state tracking, events, and plugin support (autoplay).

# Carousel

Image carousel component built on Embla Carousel with motion and swipe support.

## Installation

```bash
npx shadcn-svelte@latest add carousel -y -o
```

Flags: `-y` skips confirmation, `-o` overwrites existing files.

## Basic Usage

```svelte
<script lang="ts">
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<Carousel.Root class="w-full max-w-xs">
  <Carousel.Content>
    {#each Array(5) as _, i (i)}
      <Carousel.Item>
        <Card.Root>
          <Card.Content class="flex aspect-square items-center justify-center p-6">
            <span class="text-4xl font-semibold">{i + 1}</span>
          </Card.Content>
        </Card.Root>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

## Sizing Items

Use `basis` utility classes on `<Carousel.Item />`:

```svelte
<Carousel.Root opts={{ align: "start" }} class="w-full max-w-sm">
  <Carousel.Content>
    {#each Array(5) as _, i (i)}
      <Carousel.Item class="md:basis-1/2 lg:basis-1/3">
        <!-- content -->
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

## Spacing Between Items

Use `ps-[VALUE]` on items and `-ms-[VALUE]` on content:

```svelte
<Carousel.Root class="w-full max-w-sm">
  <Carousel.Content class="-ms-2 md:-ms-4">
    {#each Array(5) as _, i (i)}
      <Carousel.Item class="ps-2 md:ps-4">
        <!-- content -->
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

## Orientation

```svelte
<Carousel.Root
  opts={{ align: "start" }}
  orientation="vertical"
  class="w-full max-w-xs"
>
  <Carousel.Content class="-mt-1 h-[200px]">
    {#each Array(5) as _, i (i)}
      <Carousel.Item class="pt-1 md:basis-1/2">
        <!-- content -->
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

Set `orientation="vertical"` or `orientation="horizontal"` (default).

## Options

Pass Embla Carousel options via `opts` prop:

```svelte
<Carousel.Root opts={{ align: "start", loop: true }}>
  <!-- content -->
</Carousel.Root>
```

See Embla Carousel API docs for all available options.

## API & State Management

Get carousel instance via `setApi` callback:

```svelte
<script lang="ts">
  import type { CarouselAPI } from "$lib/components/ui/carousel/context.js";
  let api = $state<CarouselAPI>();
  const count = $derived(api ? api.scrollSnapList().length : 0);
  let current = $state(0);
  
  $effect(() => {
    if (api) {
      current = api.selectedScrollSnap() + 1;
      api.on("select", () => {
        current = api!.selectedScrollSnap() + 1;
      });
    }
  });
</script>

<Carousel.Root setApi={(emblaApi) => (api = emblaApi)} class="w-full max-w-xs">
  <Carousel.Content>
    {#each Array(5) as _, i (i)}
      <Carousel.Item>
        <Card.Root>
          <Card.Content class="flex aspect-square items-center justify-center p-6">
            <span class="text-4xl font-semibold">{i + 1}</span>
          </Card.Content>
        </Card.Root>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>

<div class="py-2 text-center text-sm text-muted-foreground">
  Slide {current} of {count}
</div>
```

Available API methods: `scrollSnapList()`, `selectedScrollSnap()`, `on(event, callback)`.

## Events

Listen to carousel events via API instance:

```svelte
<script lang="ts">
  import type { CarouselAPI } from "$lib/components/ui/carousel/context.js";
  let api = $state<CarouselAPI>();
  
  $effect(() => {
    if (api) {
      api.on("select", () => {
        // handle selection change
      });
    }
  });
</script>

<Carousel.Root setApi={(emblaApi) => (api = emblaApi)}>
  <!-- content -->
</Carousel.Root>
```

## Plugins

Add Embla Carousel plugins via `plugins` prop:

```svelte
<script lang="ts">
  import Autoplay from "embla-carousel-autoplay";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  
  const plugin = Autoplay({ delay: 2000, stopOnInteraction: true });
</script>

<Carousel.Root
  plugins={[plugin]}
  class="w-full max-w-xs"
  onmouseenter={plugin.stop}
  onmouseleave={plugin.reset}
>
  <Carousel.Content>
    {#each Array(5) as _, i (i)}
      <Carousel.Item>
        <Card.Root>
          <Card.Content class="flex aspect-square items-center justify-center p-6">
            <span class="text-4xl font-semibold">{i + 1}</span>
          </Card.Content>
        </Card.Root>
      </Carousel.Item>
    {/each}
  </Carousel.Content>
  <Carousel.Previous />
  <Carousel.Next />
</Carousel.Root>
```

See Embla Carousel plugin docs for available plugins and options.

### chart
Chart components built on LayerChart with composition-based design, customizable config, CSS variable theming, and tooltip support.

# Chart

Beautiful, customizable charts built on LayerChart. Copy-paste components into your apps.

**Note:** LayerChart v2 is in pre-release with potential breaking changes. Track development at the LayerChart PR #449.

## Installation

```bash
npx shadcn-svelte@latest add chart -y -o
```

Flags: `-y` skips confirmation, `-o` overwrites existing files.

## Component Design

Charts use composition with LayerChart components. You build charts using LayerChart's components and only import custom components like `ChartTooltip` when needed.

```svelte
<script lang="ts">
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { BarChart } from "layerchart";
  const data = [/* ... */];
</script>
<Chart.Container>
  <BarChart {data} x="date" y="value">
    {#snippet tooltip()}
      <Chart.Tooltip />
    {/snippet}
  </BarChart>
</Chart.Container>
```

No wrapping of LayerChart—you're not locked into an abstraction. Follow official LayerChart upgrade paths directly.

## Building Your First Chart

### Data and Config

Define your data in any shape. Use `dataKey` prop to map data to the chart.

```svelte
<script lang="ts">
  import * as Chart from "$lib/components/ui/chart/index.js";
  import { scaleBand } from "d3-scale";
  import { BarChart } from "layerchart";

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 }
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb"
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa"
    }
  } satisfies Chart.ChartConfig;
</script>
```

### Building the Chart

```svelte
<Chart.Container config={chartConfig} class="min-h-[200px] w-full">
  <BarChart
    data={chartData}
    xScale={scaleBand().padding(0.25)}
    x="month"
    axis="x"
    seriesLayout="group"
    legend
    series={[
      {
        key: "desktop",
        label: chartConfig.desktop.label,
        color: chartConfig.desktop.color
      },
      {
        key: "mobile",
        label: chartConfig.mobile.label,
        color: chartConfig.mobile.color
      }
    ]}
    props={{
      xAxis: {
        format: (d) => d.slice(0, 3)
      }
    }}
  >
    {#snippet tooltip()}
      <Chart.Tooltip />
    {/snippet}
  </BarChart>
</Chart.Container>
```

Use the `props` prop to pass custom props to chart components (e.g., custom formatters for axes).

## Chart Config

The chart config holds labels, icons, and colors. It's decoupled from chart data, allowing config reuse across charts.

```svelte
<script lang="ts">
  import MonitorIcon from "@lucide/svelte/icons/monitor";
  import * as Chart from "$lib/components/ui/chart/index.js";

  const chartConfig = {
    desktop: {
      label: "Desktop",
      icon: MonitorIcon,
      color: "#2563eb",
      // OR use theme object for light/dark
      theme: {
        light: "#2563eb",
        dark: "#dc2626"
      }
    }
  } satisfies Chart.ChartConfig;
</script>
```

## Theming

### CSS Variables (Recommended)

Define colors in CSS:

```css
:root {
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
}
.dark {
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
}
```

Reference in config:

```svelte
<script lang="ts">
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)"
    },
    mobile: {
      label: "Mobile",
      color: "var(--chart-2)"
    }
  } satisfies Chart.ChartConfig;
</script>
```

### Direct Colors

Use hex, hsl, or oklch directly:

```svelte
<script lang="ts">
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb"
    }
  } satisfies Chart.ChartConfig;
</script>
```

### Using Colors

Reference theme colors with `var(--color-KEY)`:

```svelte
<Bar fill="var(--color-desktop)" />
```

In chart data:

```ts
const chartData = [
  { browser: "chrome", visitors: 275, color: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, color: "var(--color-safari)" }
];
```

In Tailwind:

```svelte
<Label class="fill-(--color-desktop)" />
```

## Tooltip

The `Chart.Tooltip` component displays label, name, indicator, and value. Colors are automatically referenced from chart config.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `labelKey` | string | Config or data key for label |
| `nameKey` | string | Config or data key for name |
| `indicator` | `dot` \| `line` \| `dashed` | Indicator style |
| `hideLabel` | boolean | Hide the label |
| `hideIndicator` | boolean | Hide the indicator |
| `label` | string | Custom label text |
| `labelFormatter` | function | Format the label |
| `formatter` | Snippet | Custom tooltip rendering |

### Custom Keys

```svelte
<script lang="ts">
  const chartData = [
    { browser: "chrome", visitors: 187 },
    { browser: "safari", visitors: 200 }
  ];

  const chartConfig = {
    visitors: {
      label: "Total Visitors"
    },
    chrome: {
      label: "Chrome",
      color: "var(--chart-1)"
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)"
    }
  } satisfies Chart.ChartConfig;
</script>

<Chart.Tooltip labelKey="visitors" nameKey="browser" />
```

This uses "Total Visitors" for the label and "Chrome"/"Safari" for tooltip names.

### checkbox
Checkbox component with checked/disabled states, data-attribute styling, and sveltekit-superforms integration.

## Checkbox

A control that allows the user to toggle between checked and not checked.

## Installation

```bash
npx shadcn-svelte@latest add checkbox -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

## Basic Usage

```svelte
<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<Checkbox />

<!-- With label -->
<div class="flex items-center gap-3">
  <Checkbox id="terms" />
  <Label for="terms">Accept terms and conditions</Label>
</div>
```

## States

```svelte
<!-- Checked -->
<Checkbox checked />

<!-- Disabled -->
<Checkbox disabled />
```

## Styling

Checkboxes support data attributes for styling based on state:

```svelte
<Checkbox
  id="toggle-2"
  checked
  class="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
/>
```

Parent labels can use `:has()` selector to style based on checkbox state:

```svelte
<Label class="has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50">
  <Checkbox id="toggle-2" checked />
  <div>Enable notifications</div>
</Label>
```

## Form Integration

Use with sveltekit-superforms for form handling:

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "You have to select at least one item."
    })
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";

  const form = superForm(defaults(zod4(formSchema)), {
    SPA: true,
    validators: zod4(formSchema),
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  const { form: formData, enhance } = form;

  function addItem(id: string) {
    $formData.items = [...$formData.items, id];
  }
  function removeItem(id: string) {
    $formData.items = $formData.items.filter((i) => i !== id);
  }
</script>

<form method="POST" class="space-y-8" use:enhance>
  <Form.Fieldset {form} name="items" class="space-y-0">
    <div class="mb-4">
      <Form.Legend class="text-base">Sidebar</Form.Legend>
      <Form.Description>Select items to display in sidebar.</Form.Description>
    </div>
    <div class="space-y-2">
      {#each items as item (item.id)}
        {@const checked = $formData.items.includes(item.id)}
        <div class="flex flex-row items-start space-x-3">
          <Form.Control>
            {#snippet children({ props })}
              <Checkbox
                {...props}
                {checked}
                value={item.id}
                onCheckedChange={(v) => {
                  if (v) {
                    addItem(item.id);
                  } else {
                    removeItem(item.id);
                  }
                }}
              />
              <Form.Label class="font-normal">{item.label}</Form.Label>
            {/snippet}
          </Form.Control>
        </div>
      {/each}
      <Form.FieldErrors />
    </div>
  </Form.Fieldset>
  <Form.Button>Update display</Form.Button>
</form>
```

## API Reference

See the Bits UI checkbox documentation for complete API reference.

### collapsible
Collapsible component with Root, Trigger, and Content subcomponents for expandable/collapsible panels.

## Collapsible

Interactive component that expands/collapses a panel.

### Installation

```bash
npx shadcn-svelte@latest add collapsible -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
</script>

<Collapsible.Root class="w-[350px] space-y-2">
  <div class="flex items-center justify-between space-x-4 px-4">
    <h4 class="text-sm font-semibold">@huntabyte starred 3 repositories</h4>
    <Collapsible.Trigger
      class={buttonVariants({ variant: "ghost", size: "sm", class: "w-9 p-0" })}
    >
      <ChevronsUpDownIcon />
      <span class="sr-only">Toggle</span>
    </Collapsible.Trigger>
  </div>
  <div class="rounded-md border px-4 py-3 font-mono text-sm">
    @huntabyte/bits-ui
  </div>
  <Collapsible.Content class="space-y-2">
    <div class="rounded-md border px-4 py-3 font-mono text-sm">
      @melt-ui/melt-ui
    </div>
    <div class="rounded-md border px-4 py-3 font-mono text-sm">
      @sveltejs/svelte
    </div>
  </Collapsible.Content>
</Collapsible.Root>
```

### Basic Example

```svelte
<Collapsible.Root>
  <Collapsible.Trigger>Can I use this in my project?</Collapsible.Trigger>
  <Collapsible.Content>
    Yes. Free to use for personal and commercial projects. No attribution required.
  </Collapsible.Content>
</Collapsible.Root>
```

### Components

- `Collapsible.Root`: Container for the collapsible component
- `Collapsible.Trigger`: Button that toggles the collapsed state
- `Collapsible.Content`: Content that expands/collapses

Full API reference available in bits-ui documentation.

### combobox
Searchable dropdown selector built from Popover + Command; supports icons, form integration, and keyboard navigation with refocus pattern.

# Combobox

Autocomplete input and command palette with a list of suggestions. Built by composing `<Popover />` and `<Command />` components.

## Installation

```bash
npx shadcn-svelte@latest add popover -y -o
npx shadcn-svelte@latest add command -y -o
```

The `-y` flag skips confirmation prompts and `-o` overwrites existing files.

## Basic Usage

```svelte
<script lang="ts">
  import CheckIcon from "@lucide/svelte/icons/check";
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import { tick } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

  const frameworks = [
    { value: "sveltekit", label: "SvelteKit" },
    { value: "next.js", label: "Next.js" },
    { value: "nuxt.js", label: "Nuxt.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" }
  ];

  let open = $state(false);
  let value = $state("");
  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived(
    frameworks.find((f) => f.value === value)?.label
  );

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => triggerRef.focus());
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button
        {...props}
        variant="outline"
        class="w-[200px] justify-between"
        role="combobox"
        aria-expanded={open}
      >
        {selectedValue || "Select a framework..."}
        <ChevronsUpDownIcon class="ms-2 size-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input placeholder="Search framework..." />
      <Command.List>
        <Command.Empty>No framework found.</Command.Empty>
        <Command.Group>
          {#each frameworks as framework}
            <Command.Item
              value={framework.value}
              onSelect={() => {
                value = framework.value;
                closeAndFocusTrigger();
              }}
            >
              <CheckIcon
                class={cn(
                  "me-2 size-4",
                  value !== framework.value && "text-transparent"
                )}
              />
              {framework.label}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
```

## Examples

### Status Selector with Icons

```svelte
<script lang="ts">
  import CircleIcon from "@lucide/svelte/icons/circle";
  import CircleArrowUpIcon from "@lucide/svelte/icons/circle-arrow-up";
  import CircleCheckIcon from "@lucide/svelte/icons/circle-check";
  import CircleHelpIcon from "@lucide/svelte/icons/circle-help";
  import CircleXIcon from "@lucide/svelte/icons/circle-x";
  import { type Component, tick } from "svelte";
  import { useId } from "bits-ui";
  import { cn } from "$lib/utils.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";

  type Status = {
    value: string;
    label: string;
    icon: Component;
  };

  const statuses: Status[] = [
    { value: "backlog", label: "Backlog", icon: CircleHelpIcon },
    { value: "todo", label: "Todo", icon: CircleIcon },
    { value: "in progress", label: "In Progress", icon: CircleArrowUpIcon },
    { value: "done", label: "Done", icon: CircleCheckIcon },
    { value: "canceled", label: "Canceled", icon: CircleXIcon }
  ];

  let open = $state(false);
  let value = $state("");
  const selectedStatus = $derived(statuses.find((s) => s.value === value));
  const triggerId = useId();

  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => document.getElementById(triggerId)?.focus());
  }
</script>

<div class="flex items-center space-x-4">
  <p class="text-muted-foreground text-sm">Status</p>
  <Popover.Root bind:open>
    <Popover.Trigger
      id={triggerId}
      class={buttonVariants({
        variant: "outline",
        size: "sm",
        class: "w-[150px] justify-start"
      })}
    >
      {#if selectedStatus}
        {@const Icon = selectedStatus.icon}
        <Icon class="me-2 size-4 shrink-0" />
        {selectedStatus.label}
      {:else}
        + Set status
      {/if}
    </Popover.Trigger>
    <Popover.Content class="w-[200px] p-0" side="right" align="start">
      <Command.Root>
        <Command.Input placeholder="Change status..." />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group>
            {#each statuses as status (status.value)}
              <Command.Item
                value={status.value}
                onSelect={() => {
                  value = status.value;
                  closeAndFocusTrigger(triggerId);
                }}
              >
                {@const Icon = status.icon}
                <Icon
                  class={cn(
                    "me-2 size-4",
                    status.value !== selectedStatus?.value &&
                      "text-foreground/40"
                  )}
                />
                <span>{status.label}</span>
              </Command.Item>
            {/each}
          </Command.Group>
        </Command.List>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>
</div>
```

### Dropdown Menu with Combobox Submenu

```svelte
<script lang="ts">
  import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
  import TagsIcon from "@lucide/svelte/icons/tags";
  import { tick } from "svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  const labels = [
    "feature",
    "bug",
    "enhancement",
    "documentation",
    "design",
    "question",
    "maintenance"
  ];

  let open = $state(false);
  let selectedLabel = $state("feature");
  let triggerRef = $state<HTMLButtonElement>(null!);

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => triggerRef.focus());
  }
</script>

<div
  class="flex w-full flex-col items-start justify-between rounded-md border px-4 py-3 sm:flex-row sm:items-center"
>
  <p class="text-sm font-medium leading-none">
    <span class="bg-primary text-primary-foreground me-2 rounded-lg px-2 py-1 text-xs">
      {selectedLabel}
    </span>
    <span class="text-muted-foreground">Create a new project</span>
  </p>
  <DropdownMenu.Root bind:open>
    <DropdownMenu.Trigger bind:ref={triggerRef}>
      {#snippet child({ props })}
        <Button variant="ghost" size="sm" {...props} aria-label="Open menu">
          <EllipsisIcon />
        </Button>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-[200px]" align="end">
      <DropdownMenu.Group>
        <DropdownMenu.Label>Actions</DropdownMenu.Label>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>
            <TagsIcon class="me-2 size-4" />
            Apply label
          </DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent class="p-0">
            <Command.Root value={selectedLabel}>
              <Command.Input autofocus placeholder="Filter label..." />
              <Command.List>
                <Command.Empty>No label found.</Command.Empty>
                <Command.Group>
                  {#each labels as label (label)}
                    <Command.Item
                      value={label}
                      onSelect={() => {
                        selectedLabel = label;
                        closeAndFocusTrigger();
                      }}
                    >
                      {label}
                    </Command.Item>
                  {/each}
                </Command.Group>
              </Command.List>
            </Command.Root>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      </DropdownMenu.Group>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
```

### Form Integration

Use `<Form.Control />` to apply proper `aria-*` attributes and add a hidden input for form submission. Requires formsnap version 0.5.0 or higher.

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const languages = [
    { label: "English", value: "en" },
    { label: "French", value: "fr" },
    { label: "German", value: "de" },
    { label: "Spanish", value: "es" },
    { label: "Portuguese", value: "pt" },
    { label: "Russian", value: "ru" },
    { label: "Japanese", value: "ja" },
    { label: "Korean", value: "ko" },
    { label: "Chinese", value: "zh" }
  ] as const;
  const formSchema = z.object({
    language: z.enum(["en", "fr", "de", "es", "pt", "ru", "ja", "ko", "zh"])
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { tick } from "svelte";
  import CheckIcon from "@lucide/svelte/icons/check";
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import { useId } from "bits-ui";
  import * as Form from "$lib/components/ui/form/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import * as Command from "$lib/components/ui/command/index.js";
  import { cn } from "$lib/utils.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";

  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });

  const { form: formData, enhance } = form;
  let open = false;
  const triggerId = useId();

  function closeAndFocusTrigger(triggerId: string) {
    open = false;
    tick().then(() => document.getElementById(triggerId)?.focus());
  }
</script>

<form method="POST" class="space-y-6" use:enhance>
  <Form.Field {form} name="language" class="flex flex-col">
    <Popover.Root bind:open>
      <Form.Control id={triggerId}>
        {#snippet children({ props })}
          <Form.Label>Language</Form.Label>
          <Popover.Trigger
            class={cn(
              buttonVariants({ variant: "outline" }),
              "w-[200px] justify-between",
              !$formData.language && "text-muted-foreground"
            )}
            role="combobox"
            {...props}
          >
            {languages.find((f) => f.value === $formData.language)?.label ??
              "Select language"}
            <ChevronsUpDownIcon class="opacity-50" />
          </Popover.Trigger>
          <input hidden value={$formData.language} name={props.name} />
        {/snippet}
      </Form.Control>
      <Popover.Content class="w-[200px] p-0">
        <Command.Root>
          <Command.Input
            autofocus
            placeholder="Search language..."
            class="h-9"
          />
          <Command.Empty>No language found.</Command.Empty>
          <Command.Group value="languages">
            {#each languages as language (language.value)}
              <Command.Item
                value={language.label}
                onSelect={() => {
                  $formData.language = language.value;
                  closeAndFocusTrigger(triggerId);
                }}
              >
                {language.label}
                <CheckIcon
                  class={cn(
                    "ms-auto",
                    language.value !== $formData.language && "text-transparent"
                  )}
                />
              </Command.Item>
            {/each}
          </Command.Group>
        </Command.Root>
      </Popover.Content>
    </Popover.Root>
    <Form.Description>
      This is the language that will be used in the dashboard.
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

## Key Patterns

- **Keyboard Navigation**: Use `closeAndFocusTrigger()` to refocus the trigger button after selection, enabling continued keyboard navigation through the form.
- **State Management**: Use Svelte 5 runes (`$state`, `$derived`) for reactive state.
- **Accessibility**: Set `role="combobox"` and `aria-expanded={open}` on the trigger button.
- **Form Integration**: Use `<Form.Control />` wrapper with a hidden input for proper form submission.


### command
Composable command menu component with root and dialog variants; supports grouped items, shortcuts, disabled state, and auto-styled icons.

## Command

Fast, composable, unstyled command menu component for Svelte.

### Installation

```bash
npx shadcn-svelte@latest add command -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Command from "$lib/components/ui/command/index.js";
</script>

<Command.Root>
  <Command.Input placeholder="Type a command or search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Suggestions">
      <Command.Item>Calendar</Command.Item>
      <Command.Item>Search Emoji</Command.Item>
      <Command.Item disabled>Calculator</Command.Item>
    </Command.Group>
    <Command.Separator />
    <Command.Group heading="Settings">
      <Command.Item>
        <span>Profile</span>
        <Command.Shortcut>P</Command.Shortcut>
      </Command.Item>
      <Command.Item>
        <span>Billing</span>
        <Command.Shortcut>B</Command.Shortcut>
      </Command.Item>
      <Command.Item>
        <span>Settings</span>
        <Command.Shortcut>S</Command.Shortcut>
      </Command.Item>
    </Command.Group>
  </Command.List>
</Command.Root>
```

### Components

- `<Command.Root>` - Container for the command menu
- `<Command.Input>` - Search/input field
- `<Command.List>` - Container for command items
- `<Command.Empty>` - Message shown when no results match
- `<Command.Group>` - Groups items with an optional heading
- `<Command.Item>` - Individual command item (supports `disabled` prop)
- `<Command.Separator>` - Visual separator between groups
- `<Command.Shortcut>` - Displays keyboard shortcut hint
- `<Command.Dialog>` - Dialog variant that wraps the command menu

### Dialog Example

Use `<Command.Dialog>` instead of `<Command.Root>` to display the command menu in a modal dialog. It accepts props for both `Dialog.Root` and `Command.Root`.

```svelte
<script lang="ts">
  import * as Command from "$lib/components/ui/command/index.js";
  
  let open = $state(false);
  
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      open = !open;
    }
  }
</script>

<svelte:document onkeydown={handleKeydown} />

<Command.Dialog bind:open>
  <Command.Input placeholder="Type a command or search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Suggestions">
      <Command.Item>Calendar</Command.Item>
      <Command.Item>Search Emoji</Command.Item>
      <Command.Item>Calculator</Command.Item>
    </Command.Group>
    <Command.Group heading="Settings">
      <Command.Item>
        <span>Profile</span>
        <Command.Shortcut>P</Command.Shortcut>
      </Command.Item>
      <Command.Item>
        <span>Billing</span>
        <Command.Shortcut>B</Command.Shortcut>
      </Command.Item>
      <Command.Item>
        <span>Settings</span>
        <Command.Shortcut>S</Command.Shortcut>
      </Command.Item>
    </Command.Group>
  </Command.List>
</Command.Dialog>
```

### Icon Styling

As of 2024-10-30, `<Command.Item>` automatically applies styling to icons: `gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0`. Icons placed inside items are automatically sized and styled without additional classes.

### References

Full API reference and additional documentation available in the Bits UI documentation for the command component.

### context-menu
Right-click context menu with items, submenus, checkboxes, radio groups, separators, and keyboard shortcuts.

## Context Menu

Right-click triggered menu displaying actions or functions.

## Installation

```bash
npx shadcn-svelte@latest add context-menu -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

## Usage

```svelte
<script lang="ts">
  import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
  let showBookmarks = $state(false);
  let showFullURLs = $state(true);
  let value = $state("pedro");
</script>

<ContextMenu.Root>
  <ContextMenu.Trigger class="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm">
    Right click here
  </ContextMenu.Trigger>
  <ContextMenu.Content class="w-52">
    <ContextMenu.Item inset>
      Back
      <ContextMenu.Shortcut>[</ContextMenu.Shortcut>
    </ContextMenu.Item>
    <ContextMenu.Item inset disabled>
      Forward
      <ContextMenu.Shortcut>]</ContextMenu.Shortcut>
    </ContextMenu.Item>
    <ContextMenu.Item inset>
      Reload
      <ContextMenu.Shortcut>R</ContextMenu.Shortcut>
    </ContextMenu.Item>
    
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger inset>More Tools</ContextMenu.SubTrigger>
      <ContextMenu.SubContent class="w-48">
        <ContextMenu.Item>
          Save Page As...
          <ContextMenu.Shortcut>S</ContextMenu.Shortcut>
        </ContextMenu.Item>
        <ContextMenu.Item>Create Shortcut...</ContextMenu.Item>
        <ContextMenu.Item>Name Window...</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item>Developer Tools</ContextMenu.Item>
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
    
    <ContextMenu.Separator />
    
    <ContextMenu.CheckboxItem bind:checked={showBookmarks}>
      Show Bookmarks
    </ContextMenu.CheckboxItem>
    <ContextMenu.CheckboxItem bind:checked={showFullURLs}>
      Show Full URLs
    </ContextMenu.CheckboxItem>
    
    <ContextMenu.Separator />
    
    <ContextMenu.RadioGroup bind:value>
      <ContextMenu.Group>
        <ContextMenu.GroupHeading inset>People</ContextMenu.GroupHeading>
        <ContextMenu.RadioItem value="pedro">Pedro Duarte</ContextMenu.RadioItem>
        <ContextMenu.RadioItem value="colm">Colm Tuite</ContextMenu.RadioItem>
      </ContextMenu.Group>
    </ContextMenu.RadioGroup>
  </ContextMenu.Content>
</ContextMenu.Root>
```

## Components

- `ContextMenu.Root`: Container
- `ContextMenu.Trigger`: Right-click target element
- `ContextMenu.Content`: Menu container with `class` prop for sizing
- `ContextMenu.Item`: Menu item with optional `inset` and `disabled` props; supports `ContextMenu.Shortcut` child
- `ContextMenu.Sub` / `ContextMenu.SubTrigger` / `ContextMenu.SubContent`: Nested submenu
- `ContextMenu.Separator`: Visual divider
- `ContextMenu.CheckboxItem`: Checkbox item with `bind:checked` for state binding
- `ContextMenu.RadioGroup` / `ContextMenu.RadioItem`: Radio selection group with `bind:value`
- `ContextMenu.Group` / `ContextMenu.GroupHeading`: Item grouping with optional `inset` heading

### data-table
TanStack Table v8 integration with pagination, sorting, filtering, column visibility, row selection, and custom cell rendering via snippets and components.

# Data Table

Powerful table and datagrids built using TanStack Table v8.

## Installation

```bash
npm i @tanstack/table-core
npx shadcn-svelte@latest add table data-table -y -o
```

The `-y` flag skips confirmation prompts, `-o` overwrites existing files.

## Basic Table

Define columns with `ColumnDef<T>`:

```ts
import type { ColumnDef } from "@tanstack/table-core";

export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  { accessorKey: "status", header: "Status" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "amount", header: "Amount" },
];
```

Create a reusable `<DataTable />` component:

```svelte
<script lang="ts" generics="TData, TValue">
  import { type ColumnDef, getCoreRowModel } from "@tanstack/table-core";
  import { createSvelteTable, FlexRender } from "$lib/components/ui/data-table/index.js";
  import * as Table from "$lib/components/ui/table/index.js";

  type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
  };

  let { data, columns }: DataTableProps<TData, TValue> = $props();

  const table = createSvelteTable({
    get data() { return data; },
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
</script>

<div class="rounded-md border">
  <Table.Root>
    <Table.Header>
      {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
        <Table.Row>
          {#each headerGroup.headers as header (header.id)}
            <Table.Head colspan={header.colSpan}>
              {#if !header.isPlaceholder}
                <FlexRender content={header.column.columnDef.header} context={header.getContext()} />
              {/if}
            </Table.Head>
          {/each}
        </Table.Row>
      {/each}
    </Table.Header>
    <Table.Body>
      {#each table.getRowModel().rows as row (row.id)}
        <Table.Row data-state={row.getIsSelected() && "selected"}>
          {#each row.getVisibleCells() as cell (cell.id)}
            <Table.Cell>
              <FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
            </Table.Cell>
          {/each}
        </Table.Row>
      {:else}
        <Table.Row>
          <Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
```

Use in a page:

```svelte
<script lang="ts">
  import DataTable from "./data-table.svelte";
  import { columns } from "./columns.js";
  let { data } = $props();
</script>

<DataTable data={data.payments} {columns} />
```

## Cell Formatting

Use `createRawSnippet` and `renderSnippet` for custom cell rendering:

```ts
import { createRawSnippet } from "svelte";
import { renderSnippet } from "$lib/components/ui/data-table/index.js";

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "amount",
    header: () => {
      const snippet = createRawSnippet(() => ({
        render: () => `<div class="text-end">Amount</div>`,
      }));
      return renderSnippet(snippet);
    },
    cell: ({ row }) => {
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      });
      const snippet = createRawSnippet<[{ amount: number }]>((getAmount) => {
        const { amount } = getAmount();
        return {
          render: () => `<div class="text-end font-medium">${formatter.format(amount)}</div>`,
        };
      });
      return renderSnippet(snippet, { amount: row.original.amount });
    },
  },
];
```

## Row Actions

Create a `data-table-actions.svelte` component:

```svelte
<script lang="ts">
  import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

  let { id }: { id: string } = $props();
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
        <span class="sr-only">Open menu</span>
        <EllipsisIcon />
      </Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Group>
      <DropdownMenu.Label>Actions</DropdownMenu.Label>
      <DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>
        Copy payment ID
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>View customer</DropdownMenu.Item>
    <DropdownMenu.Item>View payment details</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

Add to columns using `renderComponent`:

```ts
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import DataTableActions from "./data-table-actions.svelte";

export const columns: ColumnDef<Payment>[] = [
  // ...
  {
    id: "actions",
    cell: ({ row }) => renderComponent(DataTableActions, { id: row.original.id }),
  },
];
```

Access row data via `row.original` to handle actions like API calls.

## Pagination

Add pagination state and row models:

```ts
import { type PaginationState, getPaginationRowModel } from "@tanstack/table-core";

let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });

const table = createSvelteTable({
  // ...
  state: {
    get pagination() { return pagination; },
  },
  onPaginationChange: (updater) => {
    pagination = typeof updater === "function" ? updater(pagination) : updater;
  },
  getPaginationRowModel: getPaginationRowModel(),
});
```

Add pagination controls:

```svelte
<div class="flex items-center justify-end space-x-2 py-4">
  <Button
    variant="outline"
    size="sm"
    onclick={() => table.previousPage()}
    disabled={!table.getCanPreviousPage()}
  >
    Previous
  </Button>
  <Button
    variant="outline"
    size="sm"
    onclick={() => table.nextPage()}
    disabled={!table.getCanNextPage()}
  >
    Next
  </Button>
</div>
```

## Sorting

Create a sortable header button component:

```svelte
<script lang="ts">
  import type { ComponentProps } from "svelte";
  import ArrowUpDownIcon from "@lucide/svelte/icons/arrow-up-down";
  import { Button } from "$lib/components/ui/button/index.js";

  let { variant = "ghost", ...restProps }: ComponentProps<typeof Button> = $props();
</script>

<Button {variant} {...restProps}>
  Email
  <ArrowUpDownIcon class="ms-2" />
</Button>
```

Add sorting to table:

```ts
import { type SortingState, getSortedRowModel } from "@tanstack/table-core";
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import DataTableEmailButton from "./data-table-email-button.svelte";

let sorting = $state<SortingState>([]);

const table = createSvelteTable({
  // ...
  state: {
    get sorting() { return sorting; },
  },
  onSortingChange: (updater) => {
    sorting = typeof updater === "function" ? updater(sorting) : updater;
  },
  getSortedRowModel: getSortedRowModel(),
});

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "email",
    header: ({ column }) =>
      renderComponent(DataTableEmailButton, {
        onclick: column.getToggleSortingHandler(),
      }),
  },
];
```

## Filtering

Add filtering with search input:

```ts
import { type ColumnFiltersState, getFilteredRowModel } from "@tanstack/table-core";
import { Input } from "$lib/components/ui/input/index.js";

let columnFilters = $state<ColumnFiltersState>([]);

const table = createSvelteTable({
  // ...
  state: {
    get columnFilters() { return columnFilters; },
  },
  onColumnFiltersChange: (updater) => {
    columnFilters = typeof updater === "function" ? updater(columnFilters) : updater;
  },
  getFilteredRowModel: getFilteredRowModel(),
});
```

```svelte
<div class="flex items-center py-4">
  <Input
    placeholder="Filter emails..."
    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
    oninput={(e) => table.getColumn("email")?.setFilterValue(e.currentTarget.value)}
    class="max-w-sm"
  />
</div>
```

## Column Visibility

Add column visibility toggle:

```ts
import { type VisibilityState } from "@tanstack/table-core";
import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

let columnVisibility = $state<VisibilityState>({});

const table = createSvelteTable({
  // ...
  state: {
    get columnVisibility() { return columnVisibility; },
  },
  onColumnVisibilityChange: (updater) => {
    columnVisibility = typeof updater === "function" ? updater(columnVisibility) : updater;
  },
});
```

```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline" class="ms-auto">Columns</Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    {#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column.id)}
      <DropdownMenu.CheckboxItem
        class="capitalize"
        bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
      >
        {column.id}
      </DropdownMenu.CheckboxItem>
    {/each}
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

## Row Selection

Create checkbox component:

```svelte
<script lang="ts">
  import type { ComponentProps } from "svelte";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";

  let {
    checked = false,
    onCheckedChange = (v) => (checked = v),
    ...restProps
  }: ComponentProps<typeof Checkbox> = $props();
</script>

<Checkbox bind:checked={() => checked, onCheckedChange} {...restProps} />
```

Add row selection to table:

```ts
import { type RowSelectionState } from "@tanstack/table-core";
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import DataTableCheckbox from "./data-table-checkbox.svelte";

let rowSelection = $state<RowSelectionState>({});

const table = createSvelteTable({
  // ...
  state: {
    get rowSelection() { return rowSelection; },
  },
  onRowSelectionChange: (updater) => {
    rowSelection = typeof updater === "function" ? updater(rowSelection) : updater;
  },
});

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) =>
      renderComponent(DataTableCheckbox, {
        checked: table.getIsAllPageRowsSelected(),
        indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
        onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
        "aria-label": "Select all",
      }),
    cell: ({ row }) =>
      renderComponent(DataTableCheckbox, {
        checked: row.getIsSelected(),
        onCheckedChange: (value) => row.toggleSelected(!!value),
        "aria-label": "Select row",
      }),
    enableSorting: false,
    enableHiding: false,
  },
];
```

Display selected row count:

```svelte
<div class="text-muted-foreground flex-1 text-sm">
  {table.getFilteredSelectedRowModel().rows.length} of
  {table.getFilteredRowModel().rows.length} row(s) selected.
</div>
```

## Complete Example

Combining all features:

```svelte
<script lang="ts">
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import {
    type ColumnDef,
    type ColumnFiltersState,
    type PaginationState,
    type RowSelectionState,
    type SortingState,
    type VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
  } from "@tanstack/table-core";
  import { createRawSnippet } from "svelte";
  import DataTableCheckbox from "./data-table/data-table-checkbox.svelte";
  import DataTableEmailButton from "./data-table/data-table-email-button.svelte";
  import DataTableActions from "./data-table/data-table-actions.svelte";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import {
    FlexRender,
    createSvelteTable,
    renderComponent,
    renderSnippet,
  } from "$lib/components/ui/data-table/index.js";

  type Payment = {
    id: string;
    amount: number;
    status: "Pending" | "Processing" | "Success" | "Failed";
    email: string;
  };

  const data: Payment[] = [
    { id: "m5gr84i9", amount: 316, status: "Success", email: "ken99@yahoo.com" },
    { id: "3u1reuv4", amount: 242, status: "Success", email: "Abe45@gmail.com" },
    { id: "derv1ws0", amount: 837, status: "Processing", email: "Monserrat44@gmail.com" },
    { id: "5kma53ae", amount: 874, status: "Success", email: "Silas22@gmail.com" },
    { id: "bhqecj4p", amount: 721, status: "Failed", email: "carmella@hotmail.com" },
  ];

  const columns: ColumnDef<Payment>[] = [
    {
      id: "select",
      header: ({ table }) =>
        renderComponent(DataTableCheckbox, {
          checked: table.getIsAllPageRowsSelected(),
          indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
          onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
          "aria-label": "Select all",
        }),
      cell: ({ row }) =>
        renderComponent(DataTableCheckbox, {
          checked: row.getIsSelected(),
          onCheckedChange: (value) => row.toggleSelected(!!value),
          "aria-label": "Select row",
        }),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const snippet = createRawSnippet<[{ status: string }]>((getStatus) => {
          const { status } = getStatus();
          return { render: () => `<div class="capitalize">${status}</div>` };
        });
        return renderSnippet(snippet, { status: row.original.status });
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) =>
        renderComponent(DataTableEmailButton, {
          onclick: column.getToggleSortingHandler(),
        }),
      cell: ({ row }) => {
        const snippet = createRawSnippet<[{ email: string }]>((getEmail) => {
          const { email } = getEmail();
          return { render: () => `<div class="lowercase">${email}</div>` };
        });
        return renderSnippet(snippet, { email: row.original.email });
      },
    },
    {
      accessorKey: "amount",
      header: () => {
        const snippet = createRawSnippet(() => ({
          render: () => `<div class="text-end">Amount</div>`,
        }));
        return renderSnippet(snippet);
      },
      cell: ({ row }) => {
        const formatter = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        });
        const snippet = createRawSnippet<[{ amount: number }]>((getAmount) => {
          const { amount } = getAmount();
          return {
            render: () => `<div class="text-end font-medium">${formatter.format(amount)}</div>`,
          };
        });
        return renderSnippet(snippet, { amount: row.original.amount });
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => renderComponent(DataTableActions, { id: row.original.id }),
    },
  ];

  let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
  let sorting = $state<SortingState>([]);
  let columnFilters = $state<ColumnFiltersState>([]);
  let rowSelection = $state<RowSelectionState>({});
  let columnVisibility = $state<VisibilityState>({});

  const table = createSvelteTable({
    get data() { return data; },
    columns,
    state: {
      get pagination() { return pagination; },
      get sorting() { return sorting; },
      get columnVisibility() { return columnVisibility; },
      get rowSelection() { return rowSelection; },
      get columnFilters() { return columnFilters; },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: (updater) => {
      pagination = typeof updater === "function" ? updater(pagination) : updater;
    },
    onSortingChange: (updater) => {
      sorting = typeof updater === "function" ? updater(sorting) : updater;
    },
    onColumnFiltersChange: (updater) => {
      columnFilters = typeof updater === "function" ? updater(columnFilters) : updater;
    },
    onColumnVisibilityChange: (updater) => {
      columnVisibility = typeof updater === "function" ? updater(columnVisibility) : updater;
    },
    onRowSelectionChange: (updater) => {
      rowSelection = typeof updater === "function" ? updater(rowSelection) : updater;
    },
  });
</script>

<div class="w-full">
  <div class="flex items-center py-4">
    <Input
      placeholder="Filter emails..."
      value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
      oninput={(e) => table.getColumn("email")?.setFilterValue(e.currentTarget.value)}
      class="max-w-sm"
    />
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Button {...props} variant="outline" class="ms-auto">
            Columns <ChevronDownIcon class="ms-2 size-4" />
          </Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        {#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column.id)}
          <DropdownMenu.CheckboxItem
            class="capitalize"
            bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
          >
            {column.id}
          </DropdownMenu.CheckboxItem>
        {/each}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>

  <div class="rounded-md border">
    <Table.Root>
      <Table.Header>
        {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
          <Table.Row>
            {#each headerGroup.headers as header (header.id)}
              <Table.Head class="[&:has([role=checkbox])]:ps-3">
                {#if !header.isPlaceholder}
                  <FlexRender content={header.column.columnDef.header} context={header.getContext()} />
                {/if}
              </Table.Head>
            {/each}
          </Table.Row>
        {/each}
      </Table.Header>
      <Table.Body>
        {#each table.getRowModel().rows as row (row.id)}
          <Table.Row data-state={row.getIsSelected() && "selected"}>
            {#each row.getVisibleCells() as cell (cell.id)}
              <Table.Cell class="[&:has([role=checkbox])]:ps-3">
                <FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
              </Table.Cell>
            {/each}
          </Table.Row>
        {:else}
          <Table.Row>
            <Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
          </Table.Row>
        {/each}
      </Table.Body>
    </Table.Root>
  </div>

  <div class="flex items-center justify-end space-x-2 pt-4">
    <div class="text-muted-foreground flex-1 text-sm">
      {table.getFilteredSelectedRowModel().rows.length} of
      {table.getFilteredRowModel().rows.length} row(s) selected.
    </div>
    <div class="space-x-2">
      <Button
        variant="outline"
        size="sm"
        onclick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onclick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </Button>
    </div>
  </div>
</div>
```


### date-picker
Popover-based date picker supporting single/range selection, presets, dropdown month navigation, date constraints, and form validation integration.

# Date Picker

A date picker component combining Popover and Calendar (or RangeCalendar) components.

## Installation

Install dependencies: Popover, Calendar, and RangeCalendar components.

```bash
npx shadcn-svelte@latest add popover calendar range-calendar -y -o
```

## Basic Usage

```svelte
<script lang="ts">
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import { DateFormatter, type DateValue, getLocalTimeZone } from "@internationalized/date";
  import { cn } from "$lib/utils.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Calendar } from "$lib/components/ui/calendar/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";

  const df = new DateFormatter("en-US", { dateStyle: "long" });
  let value = $state<DateValue>();
</script>

<Popover.Root>
  <Popover.Trigger>
    {#snippet child({ props })}
      <Button
        variant="outline"
        class={cn("w-[280px] justify-start text-start font-normal", !value && "text-muted-foreground")}
        {...props}
      >
        <CalendarIcon class="me-2 size-4" />
        {value ? df.format(value.toDate(getLocalTimeZone())) : "Select a date"}
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0">
    <Calendar bind:value type="single" initialFocus captionLayout="dropdown" />
  </Popover.Content>
</Popover.Root>
```

## Date Range Picker

```svelte
<script lang="ts">
  import type { DateRange } from "bits-ui";
  import { CalendarDate, DateFormatter, type DateValue, getLocalTimeZone } from "@internationalized/date";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
  
  const df = new DateFormatter("en-US", { dateStyle: "medium" });
  let value: DateRange = $state({
    start: new CalendarDate(2022, 1, 20),
    end: new CalendarDate(2022, 1, 20).add({ days: 20 })
  });
  let startValue: DateValue | undefined = $state(undefined);
</script>

<Popover.Root>
  <Popover.Trigger class={cn(buttonVariants({ variant: "outline" }), !value && "text-muted-foreground")}>
    <CalendarIcon class="me-2 size-4" />
    {#if value?.start}
      {df.format(value.start.toDate(getLocalTimeZone()))}
      {#if value.end}
        - {df.format(value.end.toDate(getLocalTimeZone()))}
      {/if}
    {:else if startValue}
      {df.format(startValue.toDate(getLocalTimeZone()))}
    {:else}
      Pick a date
    {/if}
  </Popover.Trigger>
  <Popover.Content class="w-auto p-0" align="start">
    <RangeCalendar
      bind:value
      onStartValueChange={(v) => { startValue = v; }}
      numberOfMonths={2}
    />
  </Popover.Content>
</Popover.Root>
```

## With Presets

Combine a Select component with Calendar for quick date selection:

```svelte
<script lang="ts">
  import { today } from "@internationalized/date";
  import * as Select from "$lib/components/ui/select/index.js";

  let value: DateValue | undefined = $state();
  const valueString = $derived(value ? df.format(value.toDate(getLocalTimeZone())) : "");
  const items = [
    { value: 0, label: "Today" },
    { value: 1, label: "Tomorrow" },
    { value: 3, label: "In 3 days" },
    { value: 7, label: "In a week" }
  ];
</script>

<Popover.Root>
  <Popover.Trigger class={cn(buttonVariants({ variant: "outline", class: "w-[280px] justify-start text-start font-normal" }), !value && "text-muted-foreground")}>
    <CalendarIcon class="me-2 size-4" />
    {value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date"}
  </Popover.Trigger>
  <Popover.Content class="flex w-auto flex-col space-y-2 p-2">
    <Select.Root
      type="single"
      bind:value={() => valueString, (v) => {
        if (!v) return;
        value = today(getLocalTimeZone()).add({ days: Number.parseInt(v) });
      }}
    >
      <Select.Trigger>{valueString}</Select.Trigger>
      <Select.Content>
        {#each items as item (item.value)}
          <Select.Item value={`${item.value}`}>{item.label}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
    <div class="rounded-md border">
      <Calendar type="single" bind:value />
    </div>
  </Popover.Content>
</Popover.Root>
```

## Form Integration

Use with sveltekit-superforms for validation:

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    dob: z.string().refine((v) => v, { message: "A date of birth is required." })
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";

  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  const { form: formData, enhance } = form;

  let value = $derived($formData.dob ? parseDate($formData.dob) : undefined);
  let placeholder = $state<DateValue>(today(getLocalTimeZone()));
</script>

<form method="POST" class="space-y-8" use:enhance>
  <Form.Field {form} name="dob" class="flex flex-col">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Date of birth</Form.Label>
        <Popover.Root>
          <Popover.Trigger
            {...props}
            class={cn(buttonVariants({ variant: "outline" }), "w-[280px] justify-start ps-4 text-start font-normal", !value && "text-muted-foreground")}
          >
            {value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date"}
            <CalendarIcon class="ms-auto size-4 opacity-50" />
          </Popover.Trigger>
          <Popover.Content class="w-auto p-0" side="top">
            <Calendar
              type="single"
              value={value as DateValue}
              bind:placeholder
              captionLayout="dropdown"
              minValue={new CalendarDate(1900, 1, 1)}
              maxValue={today(getLocalTimeZone())}
              calendarLabel="Date of birth"
              onValueChange={(v) => {
                $formData.dob = v ? v.toString() : "";
              }}
            />
          </Popover.Content>
        </Popover.Root>
        <Form.Description>Your date of birth is used to calculate your age</Form.Description>
        <Form.FieldErrors />
        <input hidden value={$formData.dob} name={props.name} />
      {/snippet}
    </Form.Control>
  </Form.Field>
  <Button type="submit">Submit</Button>
</form>
```

## Key Features

- **Single date selection**: Use `type="single"` with Calendar
- **Date range selection**: Use RangeCalendar with `numberOfMonths` for multi-month display
- **Presets**: Combine with Select for quick date options
- **Dropdown captions**: Use `captionLayout="dropdown"` for month/year navigation
- **Date constraints**: Set `minValue` and `maxValue` on Calendar
- **Form validation**: Integrate with sveltekit-superforms for schema validation
- **Internationalization**: Use DateFormatter for locale-specific formatting
- **Initial focus**: Use `initialFocus` prop to focus calendar on open

### dialog
Modal dialog overlay component with Root, Trigger, Content, Header, Title, Description, and Footer subcomponents.

## Dialog

A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.

### Installation

```bash
npx shadcn-svelte@latest add dialog -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<Dialog.Root>
  <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
    Edit Profile
  </Dialog.Trigger>
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Edit profile</Dialog.Title>
      <Dialog.Description>
        Make changes to your profile here. Click save when you're done.
      </Dialog.Description>
    </Dialog.Header>
    <div class="grid gap-4 py-4">
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="name" class="text-end">Name</Label>
        <Input id="name" value="Pedro Duarte" class="col-span-3" />
      </div>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="username" class="text-end">Username</Label>
        <Input id="username" value="@peduarte" class="col-span-3" />
      </div>
    </div>
    <Dialog.Footer>
      <Button type="submit">Save changes</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
```

### Components

- `Dialog.Root`: Container for the dialog
- `Dialog.Trigger`: Element that opens the dialog
- `Dialog.Content`: Dialog content wrapper
- `Dialog.Header`: Header section
- `Dialog.Title`: Dialog title
- `Dialog.Description`: Dialog description
- `Dialog.Footer`: Footer section

Refer to the Bits UI Dialog API Reference for full component API details.

### drawer
Slide-out panel component built on Vaul Svelte with Root, Trigger, Content, Header, Title, Description, Footer, and Close subcomponents; supports responsive Dialog/Drawer switching via MediaQuery.

## Drawer

A slide-out panel component built on Vaul Svelte (Svelte port of Vaul by Emil Kowalski).

## Installation

```bash
npx shadcn-svelte@latest add drawer -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

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
      <Drawer.Description>Description text</Drawer.Description>
    </Drawer.Header>
    <Drawer.Footer>
      <Button>Submit</Button>
      <Drawer.Close>Cancel</Drawer.Close>
    </Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>
```

## Full Example with Interactive Content

```svelte
<script lang="ts">
  import MinusIcon from "@lucide/svelte/icons/minus";
  import PlusIcon from "@lucide/svelte/icons/plus";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { BarChart, type ChartContextValue } from "layerchart";
  import { scaleBand } from "d3-scale";
  import { cubicInOut } from "svelte/easing";

  const data = [
    { goal: 400 }, { goal: 300 }, { goal: 200 }, { goal: 300 },
    { goal: 200 }, { goal: 278 }, { goal: 189 }, { goal: 239 },
    { goal: 300 }, { goal: 200 }, { goal: 278 }, { goal: 189 },
    { goal: 349 }
  ];

  let goal = $state(350);
  function handleClick(adjustment: number) {
    goal = Math.max(200, Math.min(400, goal + adjustment));
  }
  let context = $state<ChartContextValue>();
</script>

<Drawer.Root>
  <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>
    Open Drawer
  </Drawer.Trigger>
  <Drawer.Content>
    <div class="mx-auto w-full max-w-sm">
      <Drawer.Header>
        <Drawer.Title>Move Goal</Drawer.Title>
        <Drawer.Description>Set your daily activity goal.</Drawer.Description>
      </Drawer.Header>
      <div class="p-4 pb-0">
        <div class="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            class="size-8 shrink-0 rounded-full"
            onclick={() => handleClick(-10)}
            disabled={goal <= 200}
          >
            <MinusIcon />
            <span class="sr-only">Decrease</span>
          </Button>
          <div class="flex-1 text-center">
            <div class="text-7xl font-bold tracking-tighter">{goal}</div>
            <div class="text-muted-foreground text-[0.70rem] uppercase">
              Calories/day
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            class="size-8 shrink-0 rounded-full"
            onclick={() => handleClick(10)}
            disabled={goal >= 400}
          >
            <PlusIcon />
            <span class="sr-only">Increase</span>
          </Button>
        </div>
        <div class="mt-3 h-[120px]">
          <BarChart
            bind:context
            data={data.map((d, i) => ({ goal: d.goal, index: i }))}
            y="goal"
            x="index"
            xScale={scaleBand().padding(0.25)}
            axis={false}
            tooltip={false}
            props={{
              bars: {
                stroke: "none",
                rounded: "all",
                radius: 4,
                initialY: context?.height,
                initialHeight: 0,
                motion: {
                  x: { type: "tween", duration: 500, easing: cubicInOut },
                  width: { type: "tween", duration: 500, easing: cubicInOut },
                  height: { type: "tween", duration: 500, easing: cubicInOut },
                  y: { type: "tween", duration: 500, easing: cubicInOut }
                },
                fill: "var(--color-foreground)",
                fillOpacity: 0.9
              },
              highlight: { area: { fill: "none" } }
            }}
          />
        </div>
      </div>
      <Drawer.Footer>
        <Button>Submit</Button>
        <Drawer.Close class={buttonVariants({ variant: "outline" })}>
          Cancel
        </Drawer.Close>
      </Drawer.Footer>
    </div>
  </Drawer.Content>
</Drawer.Root>
```

## Responsive Dialog Pattern

Combine Dialog and Drawer to render Dialog on desktop (≥768px) and Drawer on mobile:

```svelte
<script lang="ts">
  import { MediaQuery } from "svelte/reactivity";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";

  let open = $state(false);
  const isDesktop = new MediaQuery("(min-width: 768px)");
  const id = $props.id();
</script>

{#if isDesktop.current}
  <Dialog.Root bind:open>
    <Dialog.Trigger class={buttonVariants({ variant: "outline" })}>
      Edit Profile
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
      <Dialog.Header>
        <Dialog.Title>Edit profile</Dialog.Title>
        <Dialog.Description>
          Make changes to your profile here. Click save when you're done.
        </Dialog.Description>
      </Dialog.Header>
      <form class="grid items-start gap-4">
        <div class="grid gap-2">
          <Label for="email-{id}">Email</Label>
          <Input type="email" id="email-{id}" value="shadcn@example.com" />
        </div>
        <div class="grid gap-2">
          <Label for="username-{id}">Username</Label>
          <Input id="username-{id}" value="@shadcn" />
        </div>
        <Button type="submit">Save changes</Button>
      </form>
    </Dialog.Content>
  </Dialog.Root>
{:else}
  <Drawer.Root bind:open>
    <Drawer.Trigger class={buttonVariants({ variant: "outline" })}>
      Edit Profile
    </Drawer.Trigger>
    <Drawer.Content>
      <Drawer.Header class="text-start">
        <Drawer.Title>Edit profile</Drawer.Title>
        <Drawer.Description>
          Make changes to your profile here. Click save when you're done.
        </Drawer.Description>
      </Drawer.Header>
      <form class="grid items-start gap-4 px-4">
        <div class="grid gap-2">
          <Label for="email-{id}">Email</Label>
          <Input type="email" id="email-{id}" value="shadcn@example.com" />
        </div>
        <div class="grid gap-2">
          <Label for="username-{id}">Username</Label>
          <Input id="username-{id}" value="@shadcn" />
        </div>
        <Button type="submit">Save changes</Button>
      </form>
      <Drawer.Footer class="pt-2">
        <Drawer.Close class={buttonVariants({ variant: "outline" })}>
          Cancel
        </Drawer.Close>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Root>
{/if}
```

## Components

- `Drawer.Root` - Container
- `Drawer.Trigger` - Opens drawer
- `Drawer.Content` - Main content area
- `Drawer.Header` - Header section
- `Drawer.Title` - Title text
- `Drawer.Description` - Description text
- `Drawer.Footer` - Footer section
- `Drawer.Close` - Closes drawer

### dropdown-menu
Menu component with items, groups, checkboxes, radio groups, submenus, shortcuts, and disabled states.

# Dropdown Menu

Menu component triggered by a button, displaying a set of actions or functions.

## Installation

```bash
npx shadcn-svelte@latest add dropdown-menu -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

## Basic Usage

```svelte
<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Open</Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56" align="start">
    <DropdownMenu.Label>My Account</DropdownMenu.Label>
    <DropdownMenu.Group>
      <DropdownMenu.Item>
        Profile
        <DropdownMenu.Shortcut>P</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
      <DropdownMenu.Item>Billing</DropdownMenu.Item>
      <DropdownMenu.Item>Settings</DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item disabled>API</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

## Components

- `Root`: Container for the dropdown menu
- `Trigger`: Button that opens the menu (accepts snippet with `props`)
- `Content`: Menu container (supports `class` and `align` props)
- `Label`: Section label
- `Group`: Groups related items
- `Item`: Menu item (supports `disabled` state)
- `Shortcut`: Keyboard shortcut display
- `Separator`: Visual divider
- `Sub` / `SubTrigger` / `SubContent`: Nested submenu

## Checkboxes

```svelte
<script lang="ts">
  let showStatusBar = $state(true);
  let showActivityBar = $state(false);
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Open</Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56">
    <DropdownMenu.Group>
      <DropdownMenu.Label>Appearance</DropdownMenu.Label>
      <DropdownMenu.Separator />
      <DropdownMenu.CheckboxItem bind:checked={showStatusBar}>
        Status Bar
      </DropdownMenu.CheckboxItem>
      <DropdownMenu.CheckboxItem bind:checked={showActivityBar} disabled>
        Activity Bar
      </DropdownMenu.CheckboxItem>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

## Radio Group

```svelte
<script lang="ts">
  let position = $state("bottom");
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      <Button {...props} variant="outline">Open</Button>
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content class="w-56">
    <DropdownMenu.Group>
      <DropdownMenu.Label>Panel Position</DropdownMenu.Label>
      <DropdownMenu.Separator />
      <DropdownMenu.RadioGroup bind:value={position}>
        <DropdownMenu.RadioItem value="top">Top</DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="bottom">Bottom</DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem value="right">Right</DropdownMenu.RadioItem>
      </DropdownMenu.RadioGroup>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
```

## Changelog

### 2024-10-30

Added automatic styling for `SubTrigger`: `gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0` classes now automatically style icons inside dropdown menu sub triggers. Removed manual `size-4` from icon examples.

### empty
Empty state component with customizable media (icon/avatar), title, description, and content sections; supports outline/gradient styling and various content types.

## Empty

Component for displaying empty states with customizable media, title, description, and content sections.

### Installation

```bash
npx shadcn-svelte@latest add empty -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Empty from "$lib/components/ui/empty/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import FolderCodeIcon from "@tabler/icons-svelte/icons/folder-code";
</script>

<Empty.Root>
  <Empty.Header>
    <Empty.Media variant="icon">
      <FolderCodeIcon />
    </Empty.Media>
    <Empty.Title>No Projects Yet</Empty.Title>
    <Empty.Description>
      You haven't created any projects yet. Get started by creating your first project.
    </Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button>Create Project</Button>
  </Empty.Content>
</Empty.Root>
```

### Structure

- `Empty.Root` - Container
- `Empty.Header` - Header section containing media, title, and description
- `Empty.Media` - Media container with `variant="icon"` (default) or `variant="default"` for custom content
- `Empty.Title` - Title text
- `Empty.Description` - Description text
- `Empty.Content` - Content section for buttons, forms, etc.

### Styling Examples

**Outline variant** - Add `class="border border-dashed"` to `Empty.Root`:
```svelte
<Empty.Root class="border border-dashed">
  <Empty.Header>
    <Empty.Media variant="icon"><CloudIcon /></Empty.Media>
    <Empty.Title>Cloud Storage Empty</Empty.Title>
    <Empty.Description>Upload files to your cloud storage to access them anywhere.</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button variant="outline" size="sm">Upload Files</Button>
  </Empty.Content>
</Empty.Root>
```

**Background gradient** - Use Tailwind utilities on `Empty.Root`:
```svelte
<Empty.Root class="from-muted/50 to-background h-full bg-gradient-to-b from-30%">
  <!-- content -->
</Empty.Root>
```

### Media Variants

**Icon variant** (default):
```svelte
<Empty.Media variant="icon">
  <FolderCodeIcon />
</Empty.Media>
```

**Avatar** - Use `variant="default"` with Avatar component:
```svelte
<Empty.Media variant="default">
  <Avatar.Root class="size-12">
    <Avatar.Image src="https://github.com/shadcn.png" class="grayscale" />
    <Avatar.Fallback>LR</Avatar.Fallback>
  </Avatar.Root>
</Empty.Media>
```

**Avatar group** - Multiple avatars with negative spacing:
```svelte
<Empty.Media>
  <div class="*:ring-background flex -space-x-2 *:size-12 *:ring-2 *:grayscale">
    <Avatar.Root>
      <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
      <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>
    <Avatar.Root>
      <Avatar.Image src="https://github.com/maxleiter.png" alt="@maxleiter" />
      <Avatar.Fallback>ML</Avatar.Fallback>
    </Avatar.Root>
  </div>
</Empty.Media>
```

### Content Examples

**Multiple buttons**:
```svelte
<Empty.Content>
  <div class="flex gap-2">
    <Button>Create Project</Button>
    <Button variant="outline">Import Project</Button>
  </div>
</Empty.Content>
```

**With InputGroup for search**:
```svelte
<Empty.Content>
  <InputGroup.Root class="sm:w-3/4">
    <InputGroup.Input placeholder="Try searching for pages..." />
    <InputGroup.Addon>
      <SearchIcon />
    </InputGroup.Addon>
    <InputGroup.Addon align="inline-end">
      <Kbd.Root>/</Kbd.Root>
    </InputGroup.Addon>
  </InputGroup.Root>
  <Empty.Description>
    Need help? <a href="#/">Contact support</a>
  </Empty.Description>
</Empty.Content>
```

**Footer link**:
```svelte
<Button variant="link" class="text-muted-foreground" size="sm">
  <a href="#/">
    Learn More <ArrowUpRightIcon class="inline" />
  </a>
</Button>
```

### field
Accessible form field wrapper supporting vertical/horizontal/responsive layouts with labels, descriptions, errors, and semantic grouping.

# Field

Accessible form field component for combining labels, controls, and help text. Supports vertical, horizontal, and responsive layouts with validation states.

## Installation

```bash
npx shadcn-svelte@latest add field -y -o
```

## Components

- `Field.Set` - Wrapper for related fields with optional legend
- `Field.Group` - Container for stacking fields
- `Field.Field` - Core wrapper for a single field
- `Field.Label` - Label element
- `Field.Description` - Helper text
- `Field.Error` - Validation error message
- `Field.Legend` - Semantic heading for field groups
- `Field.Separator` - Visual divider between field groups
- `Field.Content` - Flex column grouping label and description
- `Field.Title` - Title for choice cards

## Basic Usage

```svelte
<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
</script>

<Field.Set>
  <Field.Legend>Profile</Field.Legend>
  <Field.Description>This appears on invoices and emails.</Field.Description>
  <Field.Group>
    <Field.Field>
      <Field.Label for="name">Full name</Field.Label>
      <Input id="name" placeholder="Evil Rabbit" />
      <Field.Description>This appears on invoices and emails.</Field.Description>
    </Field.Field>
    <Field.Field>
      <Field.Label for="username">Username</Field.Label>
      <Input id="username" aria-invalid />
      <Field.Error>Choose another username.</Field.Error>
    </Field.Field>
  </Field.Group>
</Field.Set>
```

## Layouts

### Vertical (Default)
Stacks label, control, and helper text vertically. Ideal for mobile-first layouts.

### Horizontal
Set `orientation="horizontal"` on `Field` to align label and control side-by-side:

```svelte
<Field.Field orientation="horizontal">
  <Checkbox id="newsletter" />
  <Field.Label for="newsletter">Subscribe to newsletter</Field.Label>
</Field.Field>
```

### Responsive
Set `orientation="responsive"` for automatic column layouts. Apply `@container/field-group` classes on `FieldGroup` to switch orientations at breakpoints:

```svelte
<Field.Group>
  <Field.Field orientation="responsive">
    <Field.Content>
      <Field.Label for="name">Name</Field.Label>
      <Field.Description>Provide your full name</Field.Description>
    </Field.Content>
    <Input id="name" placeholder="Evil Rabbit" />
  </Field.Field>
</Field.Group>
```

## Examples

### Input Fields
```svelte
<Field.Set>
  <Field.Group>
    <Field.Field>
      <Field.Label for="username">Username</Field.Label>
      <Input id="username" type="text" placeholder="Max Leiter" />
      <Field.Description>Choose a unique username for your account.</Field.Description>
    </Field.Field>
    <Field.Field>
      <Field.Label for="password">Password</Field.Label>
      <Field.Description>Must be at least 8 characters long.</Field.Description>
      <Input id="password" type="password" placeholder="********" />
    </Field.Field>
  </Field.Group>
</Field.Set>
```

### Textarea
```svelte
<Field.Set>
  <Field.Group>
    <Field.Field>
      <Field.Label for="feedback">Feedback</Field.Label>
      <Textarea id="feedback" placeholder="Your feedback helps us improve..." rows={4} />
      <Field.Description>Share your thoughts about our service.</Field.Description>
    </Field.Field>
  </Field.Group>
</Field.Set>
```

### Select
```svelte
<script lang="ts">
  let department = $state<string>();
  const departments = [
    { value: "engineering", label: "Engineering" },
    { value: "design", label: "Design" },
    { value: "marketing", label: "Marketing" },
  ];
  const departmentLabel = $derived(
    departments.find((d) => d.value === department)?.label ?? "Choose department"
  );
</script>

<Field.Field>
  <Field.Label for="department">Department</Field.Label>
  <Select.Root type="single" bind:value={department}>
    <Select.Trigger id="department">{departmentLabel}</Select.Trigger>
    <Select.Content>
      {#each departments as dept (dept.value)}
        <Select.Item {...dept} />
      {/each}
    </Select.Content>
  </Select.Root>
  <Field.Description>Select your department or area of work.</Field.Description>
</Field.Field>
```

### Slider
```svelte
<script lang="ts">
  let value = $state([200, 800]);
</script>

<Field.Field>
  <Field.Label>Price Range</Field.Label>
  <Field.Description>
    Set your budget range ($<span class="font-medium">{value[0]}</span> - <span class="font-medium">{value[1]}</span>).
  </Field.Description>
  <Slider type="multiple" bind:value max={1000} min={0} step={10} class="mt-2 w-full" aria-label="Price Range" />
</Field.Field>
```

### Checkbox Group
```svelte
<Field.Group>
  <Field.Set>
    <Field.Legend variant="label">Show these items on the desktop</Field.Legend>
    <Field.Description>Select the items you want to show on the desktop.</Field.Description>
    <Field.Group class="gap-3">
      <Field.Field orientation="horizontal">
        <Checkbox id="hard-disks" checked />
        <Field.Label for="hard-disks" class="font-normal">Hard disks</Field.Label>
      </Field.Field>
      <Field.Field orientation="horizontal">
        <Checkbox id="external-disks" />
        <Field.Label for="external-disks" class="font-normal">External disks</Field.Label>
      </Field.Field>
    </Field.Group>
  </Field.Set>
  <Field.Separator />
  <Field.Field orientation="horizontal">
    <Checkbox id="sync-folders" checked />
    <Field.Content>
      <Field.Label for="sync-folders">Sync Desktop & Documents folders</Field.Label>
      <Field.Description>Your folders are being synced with iCloud Drive.</Field.Description>
    </Field.Content>
  </Field.Field>
</Field.Group>
```

### Radio Group
```svelte
<script lang="ts">
  let plan = $state("monthly");
</script>

<Field.Set>
  <Field.Label>Subscription Plan</Field.Label>
  <Field.Description>Yearly and lifetime plans offer significant savings.</Field.Description>
  <RadioGroup.Root bind:value={plan}>
    <Field.Field orientation="horizontal">
      <RadioGroup.Item value="monthly" id="plan-monthly" />
      <Field.Label for="plan-monthly" class="font-normal">Monthly ($9.99/month)</Field.Label>
    </Field.Field>
    <Field.Field orientation="horizontal">
      <RadioGroup.Item value="yearly" id="plan-yearly" />
      <Field.Label for="plan-yearly" class="font-normal">Yearly ($99.99/year)</Field.Label>
    </Field.Field>
  </RadioGroup.Root>
</Field.Set>
```

### Switch
```svelte
<Field.Field orientation="horizontal">
  <Field.Content>
    <Field.Label for="2fa">Multi-factor authentication</Field.Label>
    <Field.Description>Enable multi-factor authentication for added security.</Field.Description>
  </Field.Content>
  <Switch id="2fa" />
</Field.Field>
```

### Choice Card
Wrap `Field` components inside `FieldLabel` to create selectable field groups with radio items, checkboxes, or switches:

```svelte
<script lang="ts">
  let computeEnvironment = $state("kubernetes");
</script>

<Field.Group>
  <Field.Set>
    <Field.Label for="compute-environment">Compute Environment</Field.Label>
    <Field.Description>Select the compute environment for your cluster.</Field.Description>
    <RadioGroup.Root bind:value={computeEnvironment}>
      <Field.Label for="kubernetes">
        <Field.Field orientation="horizontal">
          <Field.Content>
            <Field.Title>Kubernetes</Field.Title>
            <Field.Description>Run GPU workloads on a K8s configured cluster.</Field.Description>
          </Field.Content>
          <RadioGroup.Item value="kubernetes" id="kubernetes" />
        </Field.Field>
      </Field.Label>
      <Field.Label for="vm">
        <Field.Field orientation="horizontal">
          <Field.Content>
            <Field.Title>Virtual Machine</Field.Title>
            <Field.Description>Access a VM configured cluster to run GPU workloads.</Field.Description>
          </Field.Content>
          <RadioGroup.Item value="vm" id="vm" />
        </Field.Field>
      </Field.Label>
    </RadioGroup.Root>
  </Field.Set>
</Field.Group>
```

### Field Groups with Separators
```svelte
<Field.Group>
  <Field.Set>
    <Field.Label>Responses</Field.Label>
    <Field.Description>Get notified when ChatGPT responds to requests.</Field.Description>
    <Field.Group data-slot="checkbox-group">
      <Field.Field orientation="horizontal">
        <Checkbox id="push" checked disabled />
        <Field.Label for="push" class="font-normal">Push notifications</Field.Label>
      </Field.Field>
    </Field.Group>
  </Field.Set>
  <Field.Separator />
  <Field.Set>
    <Field.Label>Tasks</Field.Label>
    <Field.Description>Get notified when tasks you've created have updates.</Field.Description>
    <Field.Group data-slot="checkbox-group">
      <Field.Field orientation="horizontal">
        <Checkbox id="push-tasks" />
        <Field.Label for="push-tasks" class="font-normal">Push notifications</Field.Label>
      </Field.Field>
      <Field.Field orientation="horizontal">
        <Checkbox id="email-tasks" />
        <Field.Label for="email-tasks" class="font-normal">Email notifications</Field.Label>
      </Field.Field>
    </Field.Group>
  </Field.Set>
</Field.Group>
```

### Complex Form (Payment)
```svelte
<script lang="ts">
  let month = $state<string>();
  let year = $state<string>();
</script>

<form>
  <Field.Group>
    <Field.Set>
      <Field.Legend>Payment Method</Field.Legend>
      <Field.Description>All transactions are secure and encrypted</Field.Description>
      <Field.Group>
        <Field.Field>
          <Field.Label for="card-name">Name on Card</Field.Label>
          <Input id="card-name" placeholder="Evil Rabbit" required />
        </Field.Field>
        <Field.Field>
          <Field.Label for="card-number">Card Number</Field.Label>
          <Input id="card-number" placeholder="1234 5678 9012 3456" required />
          <Field.Description>Enter your 16-digit card number</Field.Description>
        </Field.Field>
        <div class="grid grid-cols-3 gap-4">
          <Field.Field>
            <Field.Label for="exp-month">Month</Field.Label>
            <Select.Root type="single" bind:value={month}>
              <Select.Trigger id="exp-month"><span>{month || "MM"}</span></Select.Trigger>
              <Select.Content>
                {#each Array.from({length: 12}, (_, i) => String(i + 1).padStart(2, '0')) as m}
                  <Select.Item value={m}>{m}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </Field.Field>
          <Field.Field>
            <Field.Label for="exp-year">Year</Field.Label>
            <Select.Root type="single" bind:value={year}>
              <Select.Trigger id="exp-year"><span>{year || "YYYY"}</span></Select.Trigger>
              <Select.Content>
                {#each [2024, 2025, 2026, 2027, 2028, 2029] as y}
                  <Select.Item value={String(y)}>{y}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </Field.Field>
          <Field.Field>
            <Field.Label for="cvv">CVV</Field.Label>
            <Input id="cvv" placeholder="123" required />
          </Field.Field>
        </div>
      </Field.Group>
    </Field.Set>
    <Field.Separator />
    <Field.Set>
      <Field.Legend>Billing Address</Field.Legend>
      <Field.Description>The billing address associated with your payment method</Field.Description>
      <Field.Group>
        <Field.Field orientation="horizontal">
          <Checkbox id="same-as-shipping" checked={true} />
          <Field.Label for="same-as-shipping" class="font-normal">Same as shipping address</Field.Label>
        </Field.Field>
      </Field.Group>
    </Field.Set>
    <Field.Separator />
    <Field.Set>
      <Field.Group>
        <Field.Field>
          <Field.Label for="comments">Comments</Field.Label>
          <Textarea id="comments" placeholder="Add any additional comments" class="resize-none" />
        </Field.Field>
      </Field.Group>
    </Field.Set>
    <Field.Field orientation="horizontal">
      <Button type="submit">Submit</Button>
      <Button variant="outline" type="button">Cancel</Button>
    </Field.Field>
  </Field.Group>
</form>
```

## Validation and Errors

Add `data-invalid` to `Field` to switch the entire block into an error state. Add `aria-invalid` on the input itself for assistive technologies. Render `Field.Error` immediately after the control or inside `Field.Content`:

```svelte
<Field.Field data-invalid>
  <Field.Label for="email">Email</Field.Label>
  <Input id="email" type="email" aria-invalid />
  <Field.Error>Enter a valid email address.</Field.Error>
</Field.Field>
```

## Accessibility

- `Field.Set` and `Field.Legend` keep related controls grouped for keyboard and assistive tech users
- `Field` outputs `role="group"` so nested controls inherit labeling from `Field.Label` and `Field.Legend`
- Apply `Field.Separator` sparingly to ensure screen readers encounter clear section boundaries


### form
Composable form components with Zod validation, ARIA attributes, and Superforms integration for accessible, type-safe forms with client/server validation.

# Form

Building accessible, type-safe forms with Formsnap, Superforms, and Zod.

## Features

- Composable form components with field scoping
- Form validation using Zod or any Superforms-compatible library
- Automatic ARIA attributes based on field states
- Integration with Select, RadioGroup, Switch, Checkbox, and other form components

## Anatomy

```svelte
<form>
  <Form.Field>
    <Form.Control>
      <Form.Label />
    </Form.Control>
    <Form.Description />
    <Form.FieldErrors />
  </Form.Field>
</form>
```

## Installation

```bash
npx shadcn-svelte@latest add form -y -o
```

## Usage

### 1. Create a form schema (src/routes/settings/schema.ts)

```ts
import { z } from "zod";
export const formSchema = z.object({
  username: z.string().min(2).max(50),
});
export type FormSchema = typeof formSchema;
```

### 2. Setup the load function (src/routes/settings/+page.server.ts)

```ts
import type { PageServerLoad } from "./$types.js";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod4 } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod4(formSchema)),
  };
};
```

### 3. Create form component (src/routes/settings/settings-form.svelte)

```svelte
<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { formSchema, type FormSchema } from "./schema";
  import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";

  let { data }: { data: { form: SuperValidated<Infer<FormSchema>> } } = $props();
  const form = superForm(data.form, {
    validators: zod4Client(formSchema),
  });
  const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <Input {...props} bind:value={$formData.username} />
      {/snippet}
    </Form.Control>
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

The `name`, `id`, and accessibility attributes are applied via the `props` object from `Form.Control`. The `Form.Label` automatically associates with the input using the `for` attribute.

### 4. Use the component (src/routes/settings/+page.svelte)

```svelte
<script lang="ts">
  import type { PageData } from "./$types.js";
  import SettingsForm from "./settings-form.svelte";
  let { data }: { data: PageData } = $props();
</script>

<SettingsForm {data} />
```

### 5. Create a server action (src/routes/settings/+page.server.ts)

```ts
import type { PageServerLoad, Actions } from "./$types.js";
import { fail } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { formSchema } from "./schema";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod4(formSchema)),
  };
};

export const actions: Actions = {
  default: async (event) => {
    const form = await superValidate(event, zod4(formSchema));
    if (!form.valid) {
      return fail(400, { form });
    }
    return { form };
  },
};
```

## SPA Example

For client-side only forms without server actions:

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    username: z.string().min(2).max(50)
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";

  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  const { form: formData, enhance } = form;
</script>

<form method="POST" class="w-2/3 space-y-6" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <Input {...props} bind:value={$formData.username} />
      {/snippet}
    </Form.Control>
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

## Related Components

See form examples in: Checkbox, Date Picker, Input, Radio Group, Select, Switch, Textarea documentation.

### hover-card
Hover card component for displaying preview content on hover; Root/Trigger/Content structure; Trigger accepts link attributes.

## Hover Card

Preview content on hover for sighted users.

### Installation

```bash
npx shadcn-svelte@latest add hover-card -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import CalendarDaysIcon from "@lucide/svelte/icons/calendar-days";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import * as HoverCard from "$lib/components/ui/hover-card/index.js";
</script>

<HoverCard.Root>
  <HoverCard.Trigger
    href="https://github.com/sveltejs"
    target="_blank"
    rel="noreferrer noopener"
    class="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
  >
    @sveltejs
  </HoverCard.Trigger>
  <HoverCard.Content class="w-80">
    <div class="flex justify-between space-x-4">
      <Avatar.Root>
        <Avatar.Image src="https://github.com/sveltejs.png" />
        <Avatar.Fallback>SK</Avatar.Fallback>
      </Avatar.Root>
      <div class="space-y-1">
        <h4 class="text-sm font-semibold">@sveltejs</h4>
        <p class="text-sm">Cybernetically enhanced web apps.</p>
        <div class="flex items-center pt-2">
          <CalendarDaysIcon class="me-2 size-4 opacity-70" />
          <span class="text-muted-foreground text-xs">
            Joined September 2022
          </span>
        </div>
      </div>
    </div>
  </HoverCard.Content>
</HoverCard.Root>
```

### Components

- `HoverCard.Root` - Container
- `HoverCard.Trigger` - Hover target (accepts link attributes like `href`, `target`, `rel`)
- `HoverCard.Content` - Preview content shown on hover

See Bits UI documentation for full API reference.

### input-group
Input group component for adding icons, text, buttons, tooltips, dropdowns, and spinners to inputs/textareas with configurable alignment (inline-end, block-start, block-end); supports custom inputs via data-slot attribute.

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

### input-otp
Accessible OTP input component with configurable length, pattern validation, separators, error states, and form integration support.

# Input OTP

Accessible one-time password component with copy-paste functionality, built on Bits UI's PinInput.

## Installation

```bash
npx shadcn-svelte@latest add input-otp -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

## Components

- `InputOTP.Root` - Container with `maxlength` prop
- `InputOTP.Group` - Groups cells together
- `InputOTP.Slot` - Individual cell, accepts `cell` prop and `aria-invalid` for error state
- `InputOTP.Separator` - Visual separator between groups

## Basic Usage

```svelte
<script lang="ts">
  import * as InputOTP from "$lib/components/ui/input-otp/index.js";
</script>

<InputOTP.Root maxlength={6}>
  {#snippet children({ cells })}
    <InputOTP.Group>
      {#each cells.slice(0, 3) as cell (cell)}
        <InputOTP.Slot {cell} />
      {/each}
    </InputOTP.Group>
    <InputOTP.Separator />
    <InputOTP.Group>
      {#each cells.slice(3, 6) as cell (cell)}
        <InputOTP.Slot {cell} />
      {/each}
    </InputOTP.Group>
  {/snippet}
</InputOTP.Root>
```

## Pattern Validation

Use `pattern` prop to restrict input. Import patterns from `bits-ui`:

```svelte
<script lang="ts">
  import * as InputOTP from "$lib/components/ui/input-otp/index.js";
  import { REGEXP_ONLY_DIGITS_AND_CHARS } from "bits-ui";
</script>

<InputOTP.Root maxlength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
  {#snippet children({ cells })}
    <InputOTP.Group>
      {#each cells as cell (cell)}
        <InputOTP.Slot {cell} />
      {/each}
    </InputOTP.Group>
  {/snippet}
</InputOTP.Root>
```

## Invalid State

Add `aria-invalid` attribute to slots for error styling:

```svelte
<InputOTP.Root maxlength={6}>
  {#snippet children({ cells })}
    <InputOTP.Group>
      {#each cells as cell (cell)}
        <InputOTP.Slot aria-invalid {cell} />
      {/each}
    </InputOTP.Group>
  {/snippet}
</InputOTP.Root>
```

## Form Integration

Use with sveltekit-superforms for validation:

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    pin: z.string().min(6, {
      message: "Your one-time password must be at least 6 characters."
    })
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as InputOTP from "$lib/components/ui/input-otp/index.js";
  import * as Form from "$lib/components/ui/form/index.js";

  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  const { form: formData, enhance } = form;
</script>

<form method="POST" class="w-2/3 space-y-6" use:enhance>
  <Form.Field {form} name="pin">
    <Form.Control>
      {#snippet children({ props })}
        <InputOTP.Root maxlength={6} {...props} bind:value={$formData.pin}>
          {#snippet children({ cells })}
            <InputOTP.Group>
              {#each cells as cell (cell)}
                <InputOTP.Slot {cell} />
              {/each}
            </InputOTP.Group>
          {/snippet}
        </InputOTP.Root>
      {/snippet}
    </Form.Control>
    <Form.Description>Please enter the one-time password sent to your phone.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

## Customization

Arrange cells into multiple groups with separators for different layouts (e.g., 2-2-2 or 4-2 patterns). Use `cells.slice()` to distribute cells across groups.

### input
Form input component supporting email, file, disabled, invalid states, labels, helper text, buttons, and sveltekit-superforms validation.

## Input

Form input field component.

### Installation

```bash
npx shadcn-svelte@latest add input -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
</script>
<Input type="email" placeholder="email" class="max-w-xs" />
```

### Examples

**Default, disabled, invalid states:**
```svelte
<Input type="email" placeholder="email" class="max-w-xs" />
<Input disabled type="email" placeholder="email" class="max-w-sm" />
<Input aria-invalid type="email" placeholder="email" value="shadcn@example" class="max-w-sm" />
```

**With Label:**
```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  const id = $props.id();
</script>
<div class="flex w-full max-w-sm flex-col gap-1.5">
  <Label for="email-{id}">Email</Label>
  <Input type="email" id="email-{id}" placeholder="email" />
</div>
```

**With helper text:**
```svelte
<div class="flex w-full max-w-sm flex-col gap-1.5">
  <Label for="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
  <p class="text-muted-foreground text-sm">Enter your email address.</p>
</div>
```

**With Button:**
```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<form class="flex w-full max-w-sm items-center space-x-2">
  <Input type="email" placeholder="email" />
  <Button type="submit">Subscribe</Button>
</form>
```

**File input:**
```svelte
<div class="grid w-full max-w-sm items-center gap-1.5">
  <Label for="picture">Picture</Label>
  <Input id="picture" type="file" />
</div>
```

**Form validation with sveltekit-superforms:**
```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    username: z.string().min(2).max(50)
  });
</script>
<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";
  
  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  const { form: formData, enhance } = form;
</script>
<form method="POST" class="w-2/3 space-y-6" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <Input {...props} bind:value={$formData.username} />
      {/snippet}
    </Form.Control>
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

### Attributes

Supports standard HTML input attributes: `type`, `placeholder`, `disabled`, `aria-invalid`, `id`, `class`, etc. Can be bound with `bind:value`.


### item
Flex container component for displaying content with title, description, and actions; supports variants (default/outline/muted), sizes (default/sm), media types (icon/image/avatar), grouping with separators, link rendering via child snippet, and dropdown integration.

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

### kbd
Kbd component displays keyboard input; use Kbd.Root for keys and Kbd.Group to group them; integrates with buttons, tooltips, and input groups.

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

### label
Accessible label component; use `for` attribute to link to form control id

## Label

Renders an accessible label associated with controls.

### Installation

```bash
npx shadcn-svelte@latest add label -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
</script>

<div class="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label for="terms">Accept terms and conditions</Label>
</div>

<Label for="email">Your email address</Label>
```

The `for` attribute associates the label with a form control by its `id`.

See Bits UI documentation for full API reference.

### menubar
Desktop menubar component with menus, submenus, separators, shortcuts, checkboxes, and radio buttons; install with `npx shadcn-svelte@latest add menubar -y -o`

## Menubar

A visually persistent menu common in desktop applications providing quick access to a consistent set of commands.

## Installation

```bash
npx shadcn-svelte@latest add menubar -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

## Usage

Import and compose menubar components:

```svelte
<script lang="ts">
  import * as Menubar from "$lib/components/ui/menubar/index.js";
  let bookmarks = $state(false);
  let fullUrls = $state(true);
  let profileRadioValue = $state("benoit");
</script>

<Menubar.Root>
  <Menubar.Menu>
    <Menubar.Trigger>File</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item>
        New Tab <Menubar.Shortcut>T</Menubar.Shortcut>
      </Menubar.Item>
      <Menubar.Item>New Window <Menubar.Shortcut>N</Menubar.Shortcut></Menubar.Item>
      <Menubar.Item>New Incognito Window</Menubar.Item>
      <Menubar.Separator />
      <Menubar.Sub>
        <Menubar.SubTrigger>Share</Menubar.SubTrigger>
        <Menubar.SubContent>
          <Menubar.Item>Email link</Menubar.Item>
          <Menubar.Item>Messages</Menubar.Item>
          <Menubar.Item>Notes</Menubar.Item>
        </Menubar.SubContent>
      </Menubar.Sub>
      <Menubar.Separator />
      <Menubar.Item>Print... <Menubar.Shortcut>P</Menubar.Shortcut></Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>

  <Menubar.Menu>
    <Menubar.Trigger>Edit</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.Item>Undo <Menubar.Shortcut>Z</Menubar.Shortcut></Menubar.Item>
      <Menubar.Item>Redo <Menubar.Shortcut>Z</Menubar.Shortcut></Menubar.Item>
      <Menubar.Separator />
      <Menubar.Sub>
        <Menubar.SubTrigger>Find</Menubar.SubTrigger>
        <Menubar.SubContent>
          <Menubar.Item>Search the web</Menubar.Item>
          <Menubar.Separator />
          <Menubar.Item>Find...</Menubar.Item>
          <Menubar.Item>Find Next</Menubar.Item>
          <Menubar.Item>Find Previous</Menubar.Item>
        </Menubar.SubContent>
      </Menubar.Sub>
      <Menubar.Separator />
      <Menubar.Item>Cut</Menubar.Item>
      <Menubar.Item>Copy</Menubar.Item>
      <Menubar.Item>Paste</Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>

  <Menubar.Menu>
    <Menubar.Trigger>View</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.CheckboxItem bind:checked={bookmarks}>
        Always Show Bookmarks Bar
      </Menubar.CheckboxItem>
      <Menubar.CheckboxItem bind:checked={fullUrls}>
        Always Show Full URLs
      </Menubar.CheckboxItem>
      <Menubar.Separator />
      <Menubar.Item inset>Reload <Menubar.Shortcut>R</Menubar.Shortcut></Menubar.Item>
      <Menubar.Item inset>Force Reload <Menubar.Shortcut>R</Menubar.Shortcut></Menubar.Item>
      <Menubar.Separator />
      <Menubar.Item inset>Toggle Fullscreen</Menubar.Item>
      <Menubar.Separator />
      <Menubar.Item inset>Hide Sidebar</Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>

  <Menubar.Menu>
    <Menubar.Trigger>Profiles</Menubar.Trigger>
    <Menubar.Content>
      <Menubar.RadioGroup bind:value={profileRadioValue}>
        <Menubar.RadioItem value="andy">Andy</Menubar.RadioItem>
        <Menubar.RadioItem value="benoit">Benoit</Menubar.RadioItem>
        <Menubar.RadioItem value="Luis">Luis</Menubar.RadioItem>
      </Menubar.RadioGroup>
      <Menubar.Separator />
      <Menubar.Item inset>Edit...</Menubar.Item>
      <Menubar.Separator />
      <Menubar.Item inset>Add Profile...</Menubar.Item>
    </Menubar.Content>
  </Menubar.Menu>
</Menubar.Root>
```

## Components

- **Menubar.Root**: Container for all menus
- **Menubar.Menu**: Individual menu group
- **Menubar.Trigger**: Menu label/button
- **Menubar.Content**: Menu dropdown container
- **Menubar.Item**: Menu item with optional `inset` prop for alignment
- **Menubar.Shortcut**: Keyboard shortcut display
- **Menubar.Separator**: Visual divider
- **Menubar.Sub**: Submenu container
- **Menubar.SubTrigger**: Submenu label
- **Menubar.SubContent**: Submenu dropdown
- **Menubar.CheckboxItem**: Checkbox menu item with `bind:checked` for state
- **Menubar.RadioGroup**: Radio button group container
- **Menubar.RadioItem**: Radio button menu item with `value` prop and `bind:value` for state

### native-select
Native HTML select wrapper with grouping, disabled states, validation, and accessibility support; prefer over Select for native behavior and mobile.

# Native Select

Styled native HTML select element with design system integration.

## Installation

```bash
npx shadcn-svelte@latest add native-select -y -o
```

## Usage

```svelte
<script lang="ts">
  import * as NativeSelect from "$lib/components/ui/native-select/index.js";
</script>

<NativeSelect.Root>
  <NativeSelect.Option value="">Select a fruit</NativeSelect.Option>
  <NativeSelect.Option value="apple">Apple</NativeSelect.Option>
  <NativeSelect.Option value="banana">Banana</NativeSelect.Option>
  <NativeSelect.Option value="blueberry">Blueberry</NativeSelect.Option>
  <NativeSelect.Option value="grapes" disabled>Grapes</NativeSelect.Option>
  <NativeSelect.Option value="pineapple">Pineapple</NativeSelect.Option>
</NativeSelect.Root>
```

## Examples

### With Groups and Disabled State

```svelte
<NativeSelect.Root disabled>
  <NativeSelect.Option value="">Select department</NativeSelect.Option>
  <NativeSelect.OptGroup label="Engineering">
    <NativeSelect.Option value="frontend">Frontend</NativeSelect.Option>
    <NativeSelect.Option value="backend">Backend</NativeSelect.Option>
    <NativeSelect.Option value="devops">DevOps</NativeSelect.Option>
  </NativeSelect.OptGroup>
  <NativeSelect.OptGroup label="Sales">
    <NativeSelect.Option value="sales-rep">Sales Rep</NativeSelect.Option>
    <NativeSelect.Option value="account-manager">Account Manager</NativeSelect.Option>
    <NativeSelect.Option value="sales-director">Sales Director</NativeSelect.Option>
  </NativeSelect.OptGroup>
</NativeSelect.Root>
```

### Invalid State

```svelte
<NativeSelect.Root aria-invalid="true">
  <NativeSelect.Option value="">Select role</NativeSelect.Option>
  <NativeSelect.Option value="admin">Admin</NativeSelect.Option>
  <NativeSelect.Option value="editor">Editor</NativeSelect.Option>
  <NativeSelect.Option value="viewer">Viewer</NativeSelect.Option>
  <NativeSelect.Option value="guest">Guest</NativeSelect.Option>
</NativeSelect.Root>
```

## NativeSelect vs Select

Use `NativeSelect` for native browser behavior, better performance, or mobile-optimized dropdowns. Use `Select` for custom styling, animations, or complex interactions.

## Accessibility

- Maintains all native HTML select accessibility features
- Screen readers navigate through options using arrow keys
- Chevron icon marked as `aria-hidden="true"` to avoid duplication
- Use `aria-label` or `aria-labelledby` for additional context

```svelte
<NativeSelect.Root aria-label="Choose your preferred language">
  <NativeSelect.Option value="en">English</NativeSelect.Option>
  <NativeSelect.Option value="es">Spanish</NativeSelect.Option>
  <NativeSelect.Option value="fr">French</NativeSelect.Option>
</NativeSelect.Root>
```

## API Reference

### NativeSelect.Root

Main select component wrapping native HTML select element.

| Prop | Type | Default |
|------|------|---------|
| `class` | `string` | |

All other props passed through to underlying `<select>` element.

### NativeSelect.Option

Individual option within the select.

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | |
| `disabled` | `boolean` | `false` |
| `class` | `string` | |

All other props passed through to underlying `<option>` element.

### NativeSelect.OptGroup

Groups related options together.

| Prop | Type | Default |
|------|------|---------|
| `label` | `string` | |
| `disabled` | `boolean` | `false` |
| `class` | `string` | |

All other props passed through to underlying `<optgroup>` element.

### navigation-menu
Navigation menu component with trigger-based dropdowns and direct links; supports custom layouts, icons, and responsive grids.

# Navigation Menu

A collection of links for navigating websites.

## Installation

```bash
npx shadcn-svelte@latest add navigation-menu -y -o
```

## Usage

```svelte
<script lang="ts">
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
  import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";
  import { cn } from "$lib/utils.js";
</script>

<NavigationMenu.Root viewport={false}>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Home</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <ul class="grid gap-2 p-2 md:w-[400px] lg:w-[500px]">
          <li>
            <NavigationMenu.Link>
              {#snippet child()}
                <a href="/">shadcn-svelte</a>
              {/snippet}
            </NavigationMenu.Link>
          </li>
        </ul>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    
    <NavigationMenu.Item>
      <NavigationMenu.Link>
        {#snippet child()}
          <a href="/docs" class={navigationMenuTriggerStyle()}>Docs</a>
        {/snippet}
      </NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>
```

## Structure

- `NavigationMenu.Root` - Container with optional `viewport={false}` prop
- `NavigationMenu.List` - Wrapper for menu items
- `NavigationMenu.Item` - Individual menu item
- `NavigationMenu.Trigger` - Clickable trigger that opens content
- `NavigationMenu.Content` - Dropdown content container
- `NavigationMenu.Link` - Link component with `child` snippet for custom content

## Features

**Trigger-based menus**: Use `NavigationMenu.Trigger` to create expandable menu sections with dropdown content.

**Direct links**: Use `NavigationMenu.Link` without a trigger for direct navigation without dropdown behavior.

**Custom styling**: Apply `navigationMenuTriggerStyle()` utility to style trigger elements. Use `cn()` utility to combine classes.

**Icon support**: Links can include icons alongside text by using flexbox layout in the child snippet.

**Grid layouts**: Content areas support responsive grid layouts with Tailwind classes for organizing multiple links.

**Nested structure**: Create complex menus with multiple items, each with their own triggers and content areas.

### pagination
Pagination component with configurable items-per-page, sibling count, previous/next buttons, and ellipsis support; responsive-friendly with snippet-based rendering.

## Pagination

Component for displaying paginated content with page navigation, previous/next buttons, and ellipsis for skipped pages.

### Installation

```bash
npx shadcn-svelte@latest add pagination -y -o
```

Use `-y` to skip confirmation and `-o` to overwrite existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as Pagination from "$lib/components/ui/pagination/index.js";
</script>

<Pagination.Root count={100} perPage={10}>
  {#snippet children({ pages, currentPage })}
    <Pagination.Content>
      <Pagination.Item>
        <Pagination.PrevButton />
      </Pagination.Item>
      {#each pages as page (page.key)}
        {#if page.type === "ellipsis"}
          <Pagination.Item>
            <Pagination.Ellipsis />
          </Pagination.Item>
        {:else}
          <Pagination.Item>
            <Pagination.Link {page} isActive={currentPage === page.value}>
              {page.value}
            </Pagination.Link>
          </Pagination.Item>
        {/if}
      {/each}
      <Pagination.Item>
        <Pagination.NextButton />
      </Pagination.Item>
    </Pagination.Content>
  {/snippet}
</Pagination.Root>
```

### Advanced Example with Responsive Configuration

```svelte
<script lang="ts">
  import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
  import { MediaQuery } from "svelte/reactivity";
  import * as Pagination from "$lib/components/ui/pagination/index.js";
  
  const isDesktop = new MediaQuery("(min-width: 768px)");
  const count = 20;
  const perPage = $derived(isDesktop.current ? 3 : 8);
  const siblingCount = $derived(isDesktop.current ? 1 : 0);
</script>

<Pagination.Root {count} {perPage} {siblingCount}>
  {#snippet children({ pages, currentPage })}
    <Pagination.Content>
      <Pagination.Item>
        <Pagination.PrevButton>
          <ChevronLeftIcon class="size-4" />
          <span class="hidden sm:block">Previous</span>
        </Pagination.PrevButton>
      </Pagination.Item>
      {#each pages as page (page.key)}
        {#if page.type === "ellipsis"}
          <Pagination.Item>
            <Pagination.Ellipsis />
          </Pagination.Item>
        {:else}
          <Pagination.Item>
            <Pagination.Link {page} isActive={currentPage === page.value}>
              {page.value}
            </Pagination.Link>
          </Pagination.Item>
        {/if}
      {/each}
      <Pagination.Item>
        <Pagination.NextButton>
          <span class="hidden sm:block">Next</span>
          <ChevronRightIcon class="size-4" />
        </Pagination.NextButton>
      </Pagination.Item>
    </Pagination.Content>
  {/snippet}
</Pagination.Root>
```

### API

- `Pagination.Root`: Container component accepting `count` (total items), `perPage` (items per page), and optional `siblingCount` (number of page links adjacent to current page)
- `Pagination.Content`: Wrapper for pagination items
- `Pagination.Item`: Individual pagination element container
- `Pagination.Link`: Clickable page number link with `page` prop and `isActive` boolean
- `Pagination.PrevButton`: Previous page button
- `Pagination.NextButton`: Next page button
- `Pagination.Ellipsis`: Ellipsis indicator for skipped pages
- Snippet receives `pages` array and `currentPage` number for rendering logic

### popover
Portal popover component with Root, Trigger, and Content subcomponents; install with `npx shadcn-svelte@latest add popover -y -o`.

## Popover

Displays rich content in a portal, triggered by a button.

### Installation

```bash
npx shadcn-svelte@latest add popover -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<Popover.Root>
  <Popover.Trigger class={buttonVariants({ variant: "outline" })}>
    Open
  </Popover.Trigger>
  <Popover.Content class="w-80">
    <div class="grid gap-4">
      <div class="space-y-2">
        <h4 class="font-medium leading-none">Dimensions</h4>
        <p class="text-muted-foreground text-sm">
          Set the dimensions for the layer.
        </p>
      </div>
      <div class="grid gap-2">
        <div class="grid grid-cols-3 items-center gap-4">
          <Label for="width">Width</Label>
          <Input id="width" value="100%" class="col-span-2 h-8" />
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <Label for="maxWidth">Max. width</Label>
          <Input id="maxWidth" value="300px" class="col-span-2 h-8" />
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <Label for="height">Height</Label>
          <Input id="height" value="25px" class="col-span-2 h-8" />
        </div>
        <div class="grid grid-cols-3 items-center gap-4">
          <Label for="maxHeight">Max. height</Label>
          <Input id="maxHeight" value="none" class="col-span-2 h-8" />
        </div>
      </div>
    </div>
  </Popover.Content>
</Popover.Root>
```

### API

Refer to the Bits UI Popover API reference for detailed component props and behavior.

### Components

- `Popover.Root` - Container component
- `Popover.Trigger` - Button that opens the popover
- `Popover.Content` - Portal content displayed when triggered

### progress
Progress bar component with reactive value and max props; install via shadcn-svelte CLI

## Progress

Displays a progress bar indicator showing task completion progress.

### Installation

```bash
npx shadcn-svelte@latest add progress -y -o
```

Use `-y` to skip confirmation prompt and `-o` to overwrite existing files.

### Usage

```svelte
<script lang="ts">
  import { onMount } from "svelte";
  import { Progress } from "$lib/components/ui/progress/index.js";
  
  let value = $state(13);
  
  onMount(() => {
    const timer = setTimeout(() => (value = 66), 500);
    return () => clearTimeout(timer);
  });
</script>

<Progress {value} max={100} class="w-[60%]" />
```

### Props

- `value`: Current progress value (number)
- `max`: Maximum value (default: 100)
- `class`: CSS classes for styling

The component uses reactive state (`$state`) to update progress dynamically.

### radio-group
Radio button group component with controlled value binding and form integration support via sveltekit-superforms.

## Radio Group

A set of radio buttons where only one button can be checked at a time.

## Installation

```bash
npx shadcn-svelte@latest add radio-group -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

## Basic Usage

```svelte
<script lang="ts">
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<RadioGroup.Root value="comfortable">
  <div class="flex items-center space-x-2">
    <RadioGroup.Item value="default" id="r1" />
    <Label for="r1">Default</Label>
  </div>
  <div class="flex items-center space-x-2">
    <RadioGroup.Item value="comfortable" id="r2" />
    <Label for="r2">Comfortable</Label>
  </div>
  <div class="flex items-center space-x-2">
    <RadioGroup.Item value="compact" id="r3" />
    <Label for="r3">Compact</Label>
  </div>
</RadioGroup.Root>
```

## Form Integration

Use with sveltekit-superforms for form handling:

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    type: z.enum(["all", "mentions", "none"])
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";

  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`Submitted: ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  const { form: formData, enhance } = form;
</script>

<form method="POST" class="w-2/3 space-y-6" use:enhance>
  <Form.Fieldset {form} name="type" class="space-y-3">
    <Form.Legend>Notify me about...</Form.Legend>
    <RadioGroup.Root bind:value={$formData.type} class="flex flex-col space-y-1" name="type">
      <div class="flex items-center space-x-3 space-y-0">
        <Form.Control>
          {#snippet children({ props })}
            <RadioGroup.Item value="all" {...props} />
            <Form.Label class="font-normal">All new messages</Form.Label>
          {/snippet}
        </Form.Control>
      </div>
      <div class="flex items-center space-x-3 space-y-0">
        <Form.Control>
          {#snippet children({ props })}
            <RadioGroup.Item value="mentions" {...props} />
            <Form.Label class="font-normal">Direction messages and mentions</Form.Label>
          {/snippet}
        </Form.Control>
      </div>
      <div class="flex items-center space-x-3 space-y-0">
        <Form.Control>
          {#snippet children({ props })}
            <RadioGroup.Item value="none" {...props} />
            <Form.Label class="font-normal">Nothing</Form.Label>
          {/snippet}
        </Form.Control>
      </div>
    </RadioGroup.Root>
    <Form.FieldErrors />
  </Form.Fieldset>
  <Form.Button>Submit</Form.Button>
</form>
```

## API

- `RadioGroup.Root`: Container component with `value` prop for controlled state and `name` prop for form integration
- `RadioGroup.Item`: Individual radio button with `value` and `id` props

### range-calendar
Date range picker component built on Bits UI, uses @internationalized/date for date handling

## Range Calendar

A calendar component for selecting a range of dates.

### Basic Usage

```svelte
<script lang="ts">
  import { getLocalTimeZone, today } from "@internationalized/date";
  import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
  
  const start = today(getLocalTimeZone());
  const end = start.add({ days: 7 });
  let value = $state({
    start,
    end
  });
</script>

<RangeCalendar bind:value class="rounded-md border" />
```

### About

Built on top of Bits Range Calendar component. Uses the `@internationalized/date` package for date handling.

### Installation

```bash
npx shadcn-svelte@latest add range-calendar -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

### Blocks

30+ Calendar Blocks available demonstrating the component in action.

### resizable
Resizable panel groups with horizontal/vertical layouts, keyboard support, and nested pane support via PaneForge.

## Resizable

Accessible resizable panel groups and layouts with keyboard support, built on PaneForge.

## Installation

```bash
npx shadcn-svelte@latest add resizable -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

## Usage

```svelte
<script lang="ts">
  import * as Resizable from "$lib/components/ui/resizable/index.js";
</script>

<!-- Horizontal layout -->
<Resizable.PaneGroup direction="horizontal">
  <Resizable.Pane defaultSize={50}>One</Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={50}>Two</Resizable.Pane>
</Resizable.PaneGroup>

<!-- Vertical layout -->
<Resizable.PaneGroup direction="vertical" class="min-h-[200px]">
  <Resizable.Pane defaultSize={25}>Header</Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={75}>Content</Resizable.Pane>
</Resizable.PaneGroup>

<!-- Nested panes -->
<Resizable.PaneGroup direction="horizontal" class="max-w-md rounded-lg border">
  <Resizable.Pane defaultSize={50}>
    <div class="flex h-[200px] items-center justify-center p-6">
      <span class="font-semibold">One</span>
    </div>
  </Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={50}>
    <Resizable.PaneGroup direction="vertical">
      <Resizable.Pane defaultSize={25}>Two</Resizable.Pane>
      <Resizable.Handle />
      <Resizable.Pane defaultSize={75}>Three</Resizable.Pane>
    </Resizable.PaneGroup>
  </Resizable.Pane>
</Resizable.PaneGroup>
```

## Props

- `direction`: Set to `"horizontal"` or `"vertical"` on `PaneGroup`
- `defaultSize`: Set initial pane size as percentage on `Pane`
- `withHandle`: Show visual handle indicator on `Handle` component
- Standard HTML attributes like `class` supported on `PaneGroup`

## Features

- Keyboard support for accessibility
- Nested pane groups supported
- Customizable handle visibility with `withHandle` prop
- Full PaneForge API available (see PaneForge documentation)

### scroll-area
Custom-styled scrollable container with vertical, horizontal, or bidirectional scrolling via `orientation` prop.

## Scroll Area

Augments native scroll functionality for custom, cross-browser styling.

## Installation

```bash
npx shadcn-svelte@latest add scroll-area -y -o
```

Use `-y` to skip confirmation prompt and `-o` to overwrite existing files.

## Basic Usage

```svelte
<script lang="ts">
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
</script>

<ScrollArea class="h-[200px] w-[350px] rounded-md border p-4">
  Content that overflows the container will be scrollable.
</ScrollArea>
```

## Orientation Prop

Control scrolling direction with the `orientation` prop:

- `"vertical"` (default): Vertical scrolling only
- `"horizontal"`: Horizontal scrolling only
- `"both"`: Both horizontal and vertical scrolling

### Horizontal Scrolling Example

```svelte
<script lang="ts">
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";
  
  const works = [
    { artist: "Ornella Binni", art: "https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80" },
    { artist: "Tom Byrom", art: "https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80" },
    { artist: "Vladimir Malyavko", art: "https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80" }
  ];
</script>

<ScrollArea class="w-96 whitespace-nowrap rounded-md border" orientation="horizontal">
  <div class="flex w-max space-x-4 p-4">
    {#each works as artwork (artwork.artist)}
      <figure class="shrink-0">
        <div class="overflow-hidden rounded-md">
          <img src={artwork.art} alt="Photo by {artwork.artist}" class="aspect-[3/4] h-fit w-fit object-cover" width={300} height={400} />
        </div>
        <figcaption class="text-muted-foreground pt-2 text-xs">
          Photo by <span class="text-foreground font-semibold">{artwork.artist}</span>
        </figcaption>
      </figure>
    {/each}
  </div>
</ScrollArea>
```

### Both Directions Example

```svelte
<ScrollArea class="h-[200px] w-[350px] rounded-md border p-4" orientation="both">
  <div class="w-[400px]">
    Content wider than container with vertical overflow.
  </div>
</ScrollArea>
```

## Styling

Apply Tailwind classes directly to the `ScrollArea` component for sizing, borders, padding, and border-radius.

### select
Select dropdown component with single selection, grouping, disabled items, form integration via sveltekit-superforms, and reactive trigger content via $derived.

## Select

Displays a list of options for the user to pick from, triggered by a button.

## Installation

```bash
npx shadcn-svelte@latest add select -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

## Basic Usage

```svelte
<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
</script>

<Select.Root type="single">
  <Select.Trigger class="w-[180px]">Select a fruit</Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>Fruits</Select.Label>
      <Select.Item value="apple" label="Apple">Apple</Select.Item>
      <Select.Item value="banana" label="Banana">Banana</Select.Item>
      <Select.Item value="blueberry" label="Blueberry">Blueberry</Select.Item>
      <Select.Item value="grapes" label="Grapes" disabled>Grapes</Select.Item>
      <Select.Item value="pineapple" label="Pineapple">Pineapple</Select.Item>
    </Select.Group>
  </Select.Content>
</Select.Root>
```

Key features:
- `Select.Root` with `type="single"` for single selection
- `Select.Trigger` displays the current selection
- `Select.Content` wraps the options
- `Select.Group` and `Select.Label` organize items
- `Select.Item` with `disabled` prop to disable specific options
- Bind value with `bind:value` to track selection state

## Dynamic Content with Derived State

```svelte
<script lang="ts">
  const fruits = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "blueberry", label: "Blueberry" },
    { value: "grapes", label: "Grapes" },
    { value: "pineapple", label: "Pineapple" }
  ];
  let value = $state("");
  const triggerContent = $derived(
    fruits.find((f) => f.value === value)?.label ?? "Select a fruit"
  );
</script>

<Select.Root type="single" name="favoriteFruit" bind:value>
  <Select.Trigger class="w-[180px]">
    {triggerContent}
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>Fruits</Select.Label>
      {#each fruits as fruit (fruit.value)}
        <Select.Item
          value={fruit.value}
          label={fruit.label}
          disabled={fruit.value === "grapes"}
        >
          {fruit.label}
        </Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
```

Use `$derived` to compute trigger content based on selected value. Use `{#each}` to render items from an array.

## Form Integration

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    email: z.email({ message: "Please select an email to display" })
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";
  import * as Select from "$lib/components/ui/select/index.js";

  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  const { form: formData, enhance } = form;
</script>

<form method="POST" class="w-2/3 space-y-6" use:enhance>
  <Form.Field {form} name="email">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Email</Form.Label>
        <Select.Root
          type="single"
          bind:value={$formData.email}
          name={props.name}
        >
          <Select.Trigger {...props}>
            {$formData.email ?? "Select a verified email to display"}
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="m@example.com" label="m@example.com" />
            <Select.Item value="m@google.com" label="m@google.com" />
            <Select.Item value="m@support.com" label="m@support.com" />
          </Select.Content>
        </Select.Root>
      {/snippet}
    </Form.Control>
    <Form.Description>
      You can manage email address in your email settings.
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

Integrate with sveltekit-superforms for form validation and submission handling. Use `Form.Field`, `Form.Control`, `Form.Label`, `Form.Description`, and `Form.FieldErrors` for complete form structure.

## API Reference

See the Bits UI documentation for the complete API reference.

### separator
Separator component for visual/semantic content division; supports horizontal (default) and vertical orientations via `orientation` prop.

## Separator

Visually or semantically separates content.

### Installation

```bash
npx shadcn-svelte@latest add separator -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import { Separator } from "$lib/components/ui/separator/index.js";
</script>

<!-- Horizontal separator (default) -->
<div class="space-y-1">
  <h4 class="text-sm font-medium leading-none">Bits UI Primitives</h4>
  <p class="text-muted-foreground text-sm">An open-source UI component library.</p>
</div>
<Separator class="my-4" />

<!-- Vertical separator -->
<div class="flex h-5 items-center space-x-4 text-sm">
  <div>Blog</div>
  <Separator orientation="vertical" />
  <div>Docs</div>
  <Separator orientation="vertical" />
  <div>Source</div>
</div>
```

### Props

- `orientation`: Set to `"vertical"` for vertical separators (default is horizontal)
- `class`: Apply custom CSS classes for styling (e.g., `my-4` for margin)

### sheet
Sheet component: dialog-based overlay sliding from screen edges (top/right/bottom/left), customizable size via CSS classes, with Header/Title/Description/Footer/Close subcomponents.

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

### sidebar
Composable sidebar with Provider/Root/Header/Content/Footer/Trigger; supports left/right, sidebar/floating/inset variants, offcanvas/icon/none collapse modes; useSidebar hook for state; Menu with Button/Action/Sub/Badge/Skeleton; collapsible groups/menus via Collapsible; OKLch CSS variables for theming.

# Sidebar

Composable, themeable, customizable sidebar component that collapses to icons.

## Installation

```bash
npx shadcn-svelte@latest add sidebar -y -o
```

Add CSS variables to `src/routes/layout.css`:

```css
:root {
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}
.dark {
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.439 0 0);
}
```

## Structure

- `Sidebar.Provider` - Handles collapsible state
- `Sidebar.Root` - Sidebar container
- `Sidebar.Header` / `Sidebar.Footer` - Sticky top/bottom
- `Sidebar.Content` - Scrollable content
- `Sidebar.Group` - Section within content
- `Sidebar.Trigger` - Toggle button

## Basic Setup

`src/routes/+layout.svelte`:
```svelte
<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import AppSidebar from "$lib/components/app-sidebar.svelte";
  let { children } = $props();
</script>
<Sidebar.Provider>
  <AppSidebar />
  <main>
    <Sidebar.Trigger />
    {@render children?.()}
  </main>
</Sidebar.Provider>
```

`src/lib/components/app-sidebar.svelte`:
```svelte
<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import CalendarIcon from "@lucide/svelte/icons/calendar";
  import HouseIcon from "@lucide/svelte/icons/house";
  import InboxIcon from "@lucide/svelte/icons/inbox";
  import SearchIcon from "@lucide/svelte/icons/search";
  import SettingsIcon from "@lucide/svelte/icons/settings";

  const items = [
    { title: "Home", url: "#", icon: HouseIcon },
    { title: "Inbox", url: "#", icon: InboxIcon },
    { title: "Calendar", url: "#", icon: CalendarIcon },
    { title: "Search", url: "#", icon: SearchIcon },
    { title: "Settings", url: "#", icon: SettingsIcon },
  ];
</script>
<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each items as item (item.title)}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                {#snippet child({ props })}
                  <a href={item.url} {...props}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
</Sidebar.Root>
```

## Sidebar.Provider

Provides sidebar context. Wrap application in this component.

**Props:**
- `open: boolean` - Open state (bindable)
- `onOpenChange: (open: boolean) => void` - Callback on state change

**Width:**
```svelte
<Sidebar.Provider style="--sidebar-width: 20rem; --sidebar-width-mobile: 20rem;">
  <Sidebar.Root />
</Sidebar.Provider>
```

Or modify constants in `src/lib/components/ui/sidebar/constants.ts`:
```ts
export const SIDEBAR_WIDTH = "16rem";
export const SIDEBAR_WIDTH_MOBILE = "18rem";
```

**Keyboard Shortcut:**
Modify `SIDEBAR_KEYBOARD_SHORTCUT` in constants (default: `"b"` for cmd+b/ctrl+b):
```ts
export const SIDEBAR_KEYBOARD_SHORTCUT = "b";
```

## Sidebar.Root

Main sidebar component.

**Props:**
- `side: "left" | "right"` - Sidebar position
- `variant: "sidebar" | "floating" | "inset"` - Visual variant
- `collapsible: "offcanvas" | "icon" | "none"` - Collapse behavior

For `inset` variant, wrap main content in `Sidebar.Inset`:
```svelte
<Sidebar.Provider>
  <Sidebar.Root variant="inset">
    <Sidebar.Inset>
      <main></main>
    </Sidebar.Inset>
  </Sidebar.Root>
</Sidebar.Provider>
```

## useSidebar Hook

Access sidebar context (cannot be destructured):
```svelte
<script lang="ts">
  import { useSidebar } from "$lib/components/ui/sidebar/index.js";
  const sidebar = useSidebar();
</script>
```

**Properties:**
- `state: "expanded" | "collapsed"` - Current state
- `open: boolean` - Whether open
- `setOpen: (open: boolean) => void` - Set open state
- `openMobile: boolean` - Mobile open state
- `setOpenMobile: (open: boolean) => void` - Set mobile state
- `isMobile: boolean` - Is mobile viewport
- `toggle: () => void` - Toggle sidebar

## Sidebar.Header & Sidebar.Footer

Sticky header/footer sections. Example with dropdown menu:

```svelte
<Sidebar.Root>
  <Sidebar.Header>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            {#snippet child({ props })}
              <Sidebar.MenuButton {...props}>
                Select Workspace
                <ChevronDown class="ms-auto" />
              </Sidebar.MenuButton>
            {/snippet}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content class="w-(--bits-dropdown-menu-anchor-width)">
            <DropdownMenu.Item><span>Acme Inc</span></DropdownMenu.Item>
            <DropdownMenu.Item><span>Acme Corp.</span></DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Header>
  <Sidebar.Content />
  <Sidebar.Footer>
    <Sidebar.Menu>
      <Sidebar.MenuItem>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            {#snippet child({ props })}
              <Sidebar.MenuButton {...props} class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                Username
                <ChevronUp class="ms-auto" />
              </Sidebar.MenuButton>
            {/snippet}
          </DropdownMenu.Trigger>
          <DropdownMenu.Content side="top" class="w-(--bits-dropdown-menu-anchor-width)">
            <DropdownMenu.Item><span>Account</span></DropdownMenu.Item>
            <DropdownMenu.Item><span>Billing</span></DropdownMenu.Item>
            <DropdownMenu.Item><span>Sign out</span></DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Sidebar.MenuItem>
    </Sidebar.Menu>
  </Sidebar.Footer>
</Sidebar.Root>
```

## Sidebar.Content

Scrollable container for `Sidebar.Group` components:
```svelte
<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group />
    <Sidebar.Group />
  </Sidebar.Content>
</Sidebar.Root>
```

## Sidebar.Group

Section within sidebar with label, content, and optional action:
```svelte
<Sidebar.Group>
  <Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
  <Sidebar.GroupAction title="Add Project">
    <Plus /> <span class="sr-only">Add Project</span>
  </Sidebar.GroupAction>
  <Sidebar.GroupContent></Sidebar.GroupContent>
</Sidebar.Group>
```

**Collapsible Group:**
```svelte
<Collapsible.Root open class="group/collapsible">
  <Sidebar.Group>
    <Sidebar.GroupLabel>
      {#snippet child({ props })}
        <Collapsible.Trigger {...props}>
          Help
          <ChevronDown class="ms-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
        </Collapsible.Trigger>
      {/snippet}
    </Sidebar.GroupLabel>
    <Collapsible.Content>
      <Sidebar.GroupContent />
    </Collapsible.Content>
  </Sidebar.Group>
</Collapsible.Root>
```

## Sidebar.Menu Components

**Sidebar.MenuButton:**
```svelte
<Sidebar.MenuButton isActive>
  {#snippet child({ props })}
    <a href="/home" {...props}>
      <House />
      <span>Home</span>
    </a>
  {/snippet}
</Sidebar.MenuButton>
```

**Sidebar.MenuAction:**
Independent button within menu item:
```svelte
<Sidebar.MenuItem>
  <Sidebar.MenuButton>
    {#snippet child({ props })}
      <a href="/home" {...props}>
        <House />
        <span>Home</span>
      </a>
    {/snippet}
  </Sidebar.MenuButton>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        <Sidebar.MenuAction {...props}>
          <Ellipsis />
        </Sidebar.MenuAction>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content side="right" align="start">
      <DropdownMenu.Item><span>Edit Project</span></DropdownMenu.Item>
      <DropdownMenu.Item><span>Delete Project</span></DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</Sidebar.MenuItem>
```

**Sidebar.MenuSub:**
```svelte
<Sidebar.MenuItem>
  <Sidebar.MenuButton />
  <Sidebar.MenuSub>
    <Sidebar.MenuSubItem>
      <Sidebar.MenuSubButton />
    </Sidebar.MenuSubItem>
  </Sidebar.MenuSub>
</Sidebar.MenuItem>
```

**Collapsible Menu:**
```svelte
<Sidebar.Menu>
  <Collapsible.Root open class="group/collapsible">
    <Sidebar.MenuItem>
      <Collapsible.Trigger>
        {#snippet child({ props })}
          <Sidebar.MenuButton {...props} />
        {/snippet}
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Sidebar.MenuSub>
          <Sidebar.MenuSubItem />
        </Sidebar.MenuSub>
      </Collapsible.Content>
    </Sidebar.MenuItem>
  </Collapsible.Root>
</Sidebar.Menu>
```

**Sidebar.MenuBadge:**
```svelte
<Sidebar.MenuItem>
  <Sidebar.MenuButton />
  <Sidebar.MenuBadge>24</Sidebar.MenuBadge>
</Sidebar.MenuItem>
```

**Sidebar.MenuSkeleton:**
Loading state:
```svelte
<Sidebar.Menu>
  {#each Array.from({ length: 5 }) as _, index (index)}
    <Sidebar.MenuItem>
      <Sidebar.MenuSkeleton />
    </Sidebar.MenuItem>
  {/each}
</Sidebar.Menu>
```

## Sidebar.Separator

Divider within sidebar:
```svelte
<Sidebar.Root>
  <Sidebar.Header />
  <Sidebar.Separator />
  <Sidebar.Content>
    <Sidebar.Group />
    <Sidebar.Separator />
    <Sidebar.Group />
  </Sidebar.Content>
</Sidebar.Root>
```

## Sidebar.Trigger

Toggle button (must be within `Sidebar.Provider`):
```svelte
<Sidebar.Provider>
  <Sidebar.Root />
  <main>
    <Sidebar.Trigger />
  </main>
</Sidebar.Provider>
```

**Custom Trigger:**
```svelte
<script lang="ts">
  import { useSidebar } from "$lib/components/ui/sidebar/index.js";
  const sidebar = useSidebar();
</script>
<button onclick={() => sidebar.toggle()}>Toggle Sidebar</button>
```

## Sidebar.Rail

Rail component for toggling sidebar:
```svelte
<Sidebar.Root>
  <Sidebar.Header />
  <Sidebar.Content>
    <Sidebar.Group />
  </Sidebar.Content>
  <Sidebar.Footer />
  <Sidebar.Rail />
</Sidebar.Root>
```

## Controlled Sidebar

Use function binding to control state:
```svelte
<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  let myOpen = $state(true);
</script>
<Sidebar.Provider bind:open={() => myOpen, (newOpen) => (myOpen = newOpen)}>
  <Sidebar.Root />
</Sidebar.Provider>
```

Or simpler:
```svelte
<Sidebar.Provider bind:open>
  <Sidebar.Root />
</Sidebar.Provider>
```

## Styling

**Hide element in icon mode:**
```svelte
<Sidebar.Root collapsible="icon">
  <Sidebar.Content>
    <Sidebar.Group class="group-data-[collapsible=icon]:hidden" />
  </Sidebar.Content>
</Sidebar.Root>
```

**Style menu action based on button active state:**
```svelte
<Sidebar.MenuItem>
  <Sidebar.MenuButton />
  <Sidebar.MenuAction class="peer-data-[active=true]/menu-button:opacity-100" />
</Sidebar.MenuItem>
```

CSS variables use OKLch color space and are intentionally separate from main application colors to allow different styling (e.g., darker sidebar).


### skeleton
Skeleton component for loading placeholders; styled with Tailwind classes for size, shape, and spacing.

## Skeleton

Placeholder component for displaying while content loads.

### Installation

```bash
npx shadcn-svelte@latest add skeleton -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import { Skeleton } from "$lib/components/ui/skeleton/index.js";
</script>

<!-- Circular skeleton (e.g., avatar) -->
<Skeleton class="size-12 rounded-full" />

<!-- Text skeleton lines -->
<Skeleton class="h-4 w-[250px]" />
<Skeleton class="h-4 w-[200px]" />

<!-- Custom dimensions -->
<Skeleton class="h-[20px] w-[100px] rounded-full" />
```

Use Tailwind classes to customize dimensions and shape. Common patterns: `size-12 rounded-full` for avatars, `h-4 w-[250px]` for text lines.

### slider
Range input with single/multiple thumbs, horizontal/vertical orientation, configurable step and max value.

## Slider

An input component where users select a value from a given range.

## Installation

```bash
npx shadcn-svelte@latest add slider -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

## Usage

### Single Value

```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state(33);
</script>

<Slider type="single" bind:value max={100} step={1} />
```

### Multiple Thumbs

```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state([25, 75]);
</script>

<Slider type="multiple" bind:value max={100} step={1} />
```

### Vertical Orientation

```svelte
<script lang="ts">
  import { Slider } from "$lib/components/ui/slider/index.js";
  let value = $state(50);
</script>

<Slider type="single" orientation="vertical" bind:value max={100} step={1} />
```

### Styling

Use the `class` prop to apply custom styles:

```svelte
<Slider type="single" bind:value max={100} step={1} class="max-w-[70%]" />
```

## API

- `type`: "single" or "multiple" - determines if one or multiple values can be selected
- `bind:value`: reactive binding to the selected value(s)
- `max`: maximum value of the range
- `step`: increment between selectable values
- `orientation`: "horizontal" (default) or "vertical"
- `class`: custom CSS classes

For full API reference, see the Bits UI Slider documentation.

### sonner
Toast notification component with success/error variants, descriptions, and action buttons; dark mode support via system preferences or theme prop.

## Sonner

Toast component for Svelte, ported from the React Sonner library by Emil Kowalski.

### Installation

Install via CLI:
```bash
npx shadcn-svelte@latest add sonner -y -o
```

Add the Toaster component to your root layout:

```svelte
<script lang="ts">
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  let { children } = $props();
</script>
<Toaster />
{@render children?.()}
```

### Usage

Basic toast:
```svelte
<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button onclick={() => toast("Hello world")}>Show toast</Button>
```

Toast with description, action, and success variant:
```svelte
<Button
  variant="outline"
  onclick={() =>
    toast.success("Event has been created", {
      description: "Sunday, December 03, 2023 at 9:00 AM",
      action: {
        label: "Undo",
        onClick: () => console.info("Undo")
      }
    })}
>
  Show Toast
</Button>
```

### Dark Mode

By default, Sonner uses system preferences for theme. To control theme explicitly, use the `theme` prop on the Toaster component or integrate with mode-watcher for hardcoded dark/light mode. See dark mode documentation for setup details.

To opt out of dark mode support, uninstall mode-watcher and remove the `theme` prop from the Toaster component.

### spinner
Spinner component for loading states; customize size/color with utility classes or replace icon; integrates with Button, Badge, InputGroup, Empty, Item components.

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

### switch
Toggle switch component with form integration, disabled/readonly states, and sveltekit-superforms support.

## Switch

A control that allows the user to toggle between checked and not checked.

### Installation

```bash
npx shadcn-svelte@latest add switch -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
</script>

<div class="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label for="airplane-mode">Airplane Mode</Label>
</div>
```

### Form Integration

Use with sveltekit-superforms and zod validation:

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    marketing_emails: z.boolean().default(false),
    security_emails: z.boolean().default(true)
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";

  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  const { form: formData, enhance } = form;
</script>

<form method="POST" class="w-full space-y-6" use:enhance>
  <fieldset>
    <legend class="mb-4 text-lg font-medium">Email Notifications</legend>
    <div class="space-y-4">
      <Form.Field
        {form}
        name="marketing_emails"
        class="flex flex-row items-center justify-between rounded-lg border p-4"
      >
        <Form.Control>
          {#snippet children({ props })}
            <div class="space-y-0.5">
              <Form.Label>Marketing emails</Form.Label>
              <Form.Description>
                Receive emails about new products, features, and more.
              </Form.Description>
            </div>
            <Switch {...props} bind:checked={$formData.marketing_emails} />
          {/snippet}
        </Form.Control>
      </Form.Field>

      <Form.Field
        {form}
        name="security_emails"
        class="flex flex-row items-center justify-between rounded-lg border p-4"
      >
        <Form.Control>
          {#snippet children({ props })}
            <div class="space-y-0.5">
              <Form.Label>Security emails</Form.Label>
              <Form.Description>
                Receive emails about your account security.
              </Form.Description>
            </div>
            <Switch
              {...props}
              aria-readonly
              disabled
              bind:checked={$formData.security_emails}
            />
          {/snippet}
        </Form.Control>
      </Form.Field>
    </div>
  </fieldset>
  <Form.Button>Submit</Form.Button>
</form>
```

Supports `disabled` and `aria-readonly` attributes for read-only states. Use `bind:checked` to bind the switch state to form data.

### table
Responsive table component with Root, Header, Body, Footer, Row, Head, and Cell subcomponents; supports dynamic data rendering, colspan, and Tailwind styling.

## Table

A responsive table component for displaying tabular data.

### Installation

```bash
npx shadcn-svelte@latest add table -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Usage

Import the table components:

```svelte
<script lang="ts">
  import * as Table from "$lib/components/ui/table/index.js";
</script>
```

### Basic Example

```svelte
<Table.Root>
  <Table.Caption>A list of your recent invoices.</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-[100px]">Invoice</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Method</Table.Head>
      <Table.Head class="text-end">Amount</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell class="font-medium">INV001</Table.Cell>
      <Table.Cell>Paid</Table.Cell>
      <Table.Cell>Credit Card</Table.Cell>
      <Table.Cell class="text-end">$250.00</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>
```

### Components

- `Table.Root` - Main table wrapper
- `Table.Caption` - Table caption/title
- `Table.Header` - Header section
- `Table.Body` - Body section
- `Table.Footer` - Footer section
- `Table.Row` - Table row
- `Table.Head` - Header cell
- `Table.Cell` - Body/footer cell

### Features

- Responsive design
- Support for header, body, and footer sections
- Styling via class attributes (e.g., `text-end` for right alignment, `font-medium` for bold text)
- Column width control (e.g., `w-[100px]`)
- `colspan` attribute support for spanning multiple columns

### Complete Example with Dynamic Data

```svelte
<script lang="ts">
  const invoices = [
    { invoice: "INV001", paymentStatus: "Paid", totalAmount: "$250.00", paymentMethod: "Credit Card" },
    { invoice: "INV002", paymentStatus: "Pending", totalAmount: "$150.00", paymentMethod: "PayPal" },
    { invoice: "INV003", paymentStatus: "Unpaid", totalAmount: "$350.00", paymentMethod: "Bank Transfer" },
    { invoice: "INV004", paymentStatus: "Paid", totalAmount: "$450.00", paymentMethod: "Credit Card" },
    { invoice: "INV005", paymentStatus: "Paid", totalAmount: "$550.00", paymentMethod: "PayPal" },
    { invoice: "INV006", paymentStatus: "Pending", totalAmount: "$200.00", paymentMethod: "Bank Transfer" },
    { invoice: "INV007", paymentStatus: "Unpaid", totalAmount: "$300.00", paymentMethod: "Credit Card" }
  ];
</script>

<Table.Root>
  <Table.Caption>A list of your recent invoices.</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-[100px]">Invoice</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Method</Table.Head>
      <Table.Head class="text-end">Amount</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each invoices as invoice (invoice)}
      <Table.Row>
        <Table.Cell class="font-medium">{invoice.invoice}</Table.Cell>
        <Table.Cell>{invoice.paymentStatus}</Table.Cell>
        <Table.Cell>{invoice.paymentMethod}</Table.Cell>
        <Table.Cell class="text-end">{invoice.totalAmount}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
  <Table.Footer>
    <Table.Row>
      <Table.Cell colspan={3}>Total</Table.Cell>
      <Table.Cell class="text-end">$2,500.00</Table.Cell>
    </Table.Row>
  </Table.Footer>
</Table.Root>
```

### tabs
Tabbed interface component with Root, List, Trigger, and Content subcomponents; activate tabs by matching value props.

## Tabs

A set of layered sections of content (tab panels) displayed one at a time.

### Installation

```bash
npx shadcn-svelte@latest add tabs -y -o
```

The `-y` flag skips the confirmation prompt and `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<Tabs.Root value="account" class="w-[400px]">
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="password">Password</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">
    <Card.Root>
      <Card.Header>
        <Card.Title>Account</Card.Title>
        <Card.Description>Make changes to your account here.</Card.Description>
      </Card.Header>
      <Card.Content class="grid gap-6">
        <div class="grid gap-3">
          <Label for="name">Name</Label>
          <Input id="name" value="Pedro Duarte" />
        </div>
        <div class="grid gap-3">
          <Label for="username">Username</Label>
          <Input id="username" value="@peduarte" />
        </div>
      </Card.Content>
      <Card.Footer>
        <Button>Save changes</Button>
      </Card.Footer>
    </Card.Root>
  </Tabs.Content>
  <Tabs.Content value="password">
    <Card.Root>
      <Card.Header>
        <Card.Title>Password</Card.Title>
        <Card.Description>Change your password here.</Card.Description>
      </Card.Header>
      <Card.Content class="grid gap-6">
        <div class="grid gap-3">
          <Label for="current">Current password</Label>
          <Input id="current" type="password" />
        </div>
        <div class="grid gap-3">
          <Label for="new">New password</Label>
          <Input id="new" type="password" />
        </div>
      </Card.Content>
      <Card.Footer>
        <Button>Save password</Button>
      </Card.Footer>
    </Card.Root>
  </Tabs.Content>
</Tabs.Root>
```

### API

- `Tabs.Root`: Container with `value` prop for the active tab
- `Tabs.List`: Wrapper for tab triggers
- `Tabs.Trigger`: Individual tab button with `value` prop matching content
- `Tabs.Content`: Panel content with `value` prop matching trigger

### textarea
Textarea component for multi-line text input with support for disabled state, labels, and form validation integration.

## Textarea

Form textarea component that displays as a native textarea or styled component.

### Installation

```bash
npx shadcn-svelte@latest add textarea -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import { Textarea } from "$lib/components/ui/textarea/index.js";
</script>

<Textarea />
```

### Examples

**Default with placeholder:**
```svelte
<Textarea placeholder="Type your message here." />
```

**Disabled state:**
```svelte
<Textarea disabled placeholder="Type your message here." />
```

**With Label and description text:**
```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
</script>

<div class="grid w-full gap-1.5">
  <Label for="message">Your message</Label>
  <Textarea placeholder="Type your message here." id="message" />
  <p class="text-muted-foreground text-sm">Your message will be copied to the support team.</p>
</div>
```

**With Button:**
```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
</script>

<div class="grid w-full gap-2">
  <Textarea placeholder="Type your message here." />
  <Button>Send message</Button>
</div>
```

**Form integration with validation:**
```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    bio: z.string().min(10, "Bio must be at least 10 characters.").max(160, "Bio must be at most 160 characters.")
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  
  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  const { form: formData, enhance } = form;
</script>

<form method="POST" class="w-2/3 space-y-6" use:enhance>
  <Form.Field {form} name="bio">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Bio</Form.Label>
        <Textarea
          {...props}
          placeholder="Tell us a little bit about yourself"
          class="resize-none"
          bind:value={$formData.bio}
        />
        <Form.Description>You can @mention other users and organizations.</Form.Description>
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

Supports standard HTML textarea attributes like `placeholder`, `disabled`, `id`, and custom class binding. Can be used standalone or integrated with form validation using sveltekit-superforms.

### toggle-group
Toggle group component with single/multiple selection modes, outline variant, sm/lg sizes, and disabled state.

## Toggle Group

A set of two-state buttons that can be toggled on or off.

### Installation

```bash
npx shadcn-svelte@latest add toggle-group -y -o
```

Use `-y` to skip confirmation prompt and `-o` to overwrite existing files.

### Basic Usage

```svelte
<script lang="ts">
  import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
</script>

<ToggleGroup.Root type="single">
  <ToggleGroup.Item value="a">A</ToggleGroup.Item>
  <ToggleGroup.Item value="b">B</ToggleGroup.Item>
  <ToggleGroup.Item value="c">C</ToggleGroup.Item>
</ToggleGroup.Root>
```

### Examples

#### Default (Multiple Selection with Outline Variant)

```svelte
<ToggleGroup.Root variant="outline" type="multiple">
  <ToggleGroup.Item value="bold" aria-label="Toggle bold">
    <BoldIcon class="h-4 w-4" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="italic" aria-label="Toggle italic">
    <ItalicIcon class="h-4 w-4" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="strikethrough" aria-label="Toggle strikethrough">
    <UnderlineIcon class="h-4 w-4" />
  </ToggleGroup.Item>
</ToggleGroup.Root>
```

#### Single Selection

```svelte
<ToggleGroup.Root type="single">
  <ToggleGroup.Item value="bold" aria-label="Toggle bold">
    <BoldIcon class="size-4" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="italic" aria-label="Toggle italic">
    <ItalicIcon class="size-4" />
  </ToggleGroup.Item>
  <ToggleGroup.Item value="strikethrough" aria-label="Toggle strikethrough">
    <UnderlineIcon class="size-4" />
  </ToggleGroup.Item>
</ToggleGroup.Root>
```

#### Size Variants (Small and Large)

```svelte
<!-- Small -->
<ToggleGroup.Root size="sm" type="multiple">
  <ToggleGroup.Item value="bold"><BoldIcon class="size-4" /></ToggleGroup.Item>
  <ToggleGroup.Item value="italic"><ItalicIcon class="size-4" /></ToggleGroup.Item>
  <ToggleGroup.Item value="strikethrough"><UnderlineIcon class="size-4" /></ToggleGroup.Item>
</ToggleGroup.Root>

<!-- Large -->
<ToggleGroup.Root size="lg" type="multiple">
  <ToggleGroup.Item value="bold"><BoldIcon class="size-4" /></ToggleGroup.Item>
  <ToggleGroup.Item value="italic"><ItalicIcon class="size-4" /></ToggleGroup.Item>
  <ToggleGroup.Item value="strikethrough"><UnderlineIcon class="size-4" /></ToggleGroup.Item>
</ToggleGroup.Root>
```

#### Disabled State

```svelte
<ToggleGroup.Root disabled type="single">
  <ToggleGroup.Item value="bold"><BoldIcon class="size-4" /></ToggleGroup.Item>
  <ToggleGroup.Item value="italic"><ItalicIcon class="size-4" /></ToggleGroup.Item>
  <ToggleGroup.Item value="strikethrough"><UnderlineIcon class="size-4" /></ToggleGroup.Item>
</ToggleGroup.Root>
```

### Props

- `type`: "single" (only one item can be selected) or "multiple" (multiple items can be selected)
- `variant`: "outline" (default styling)
- `size`: "sm" (small), default, or "lg" (large)
- `disabled`: boolean to disable all items in the group

### toggle
Two-state toggle button with outline/default variants, sm/default/lg sizes, disabled state, and icon/text content support.

## Toggle

A two-state button that can be either on or off.

### Installation

```bash
npx shadcn-svelte@latest add toggle -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import BoldIcon from "@lucide/svelte/icons/bold";
  import { Toggle } from "$lib/components/ui/toggle/index.js";
</script>

<Toggle aria-label="toggle bold">
  <BoldIcon class="size-4" />
</Toggle>
```

### Variants and Sizes

**Outline variant:**
```svelte
<Toggle variant="outline" aria-label="Toggle italic">
  <ItalicIcon class="size-4" />
</Toggle>
```

**With text content:**
```svelte
<Toggle aria-label="Toggle italic">
  <ItalicIcon class="me-2 size-4" />
  Italic
</Toggle>
```

**Size options (sm, lg):**
```svelte
<Toggle size="sm" aria-label="Toggle italic">
  <ItalicIcon class="size-4" />
</Toggle>

<Toggle size="lg" aria-label="Toggle italic">
  <ItalicIcon class="size-4" />
</Toggle>
```

**Disabled state:**
```svelte
<Toggle aria-label="Toggle underline" disabled>
  <UnderlineIcon class="size-4" />
</Toggle>
```

### Props

- `variant`: "default" or "outline"
- `size`: "default", "sm", or "lg"
- `disabled`: boolean to disable the toggle
- `aria-label`: accessibility label (recommended)

### tooltip
Tooltip component for hover/focus popups; install with `add tooltip -y -o`, wrap app in `Tooltip.Provider`, use `Root`/`Trigger`/`Content`; supports nested providers with custom `delayDuration`.

## Tooltip

A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

### Installation

```bash
npx shadcn-svelte@latest add tooltip -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Setup

Place `Tooltip.Provider` once in your root layout to ensure only one tooltip within the provider can be open at a time:

```svelte
<script lang="ts">
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
  let { children } = $props();
</script>
<Tooltip.Provider>
  {@render children()}
</Tooltip.Provider>
```

### Usage

```svelte
<script lang="ts">
  import { buttonVariants } from "../ui/button/index.js";
  import * as Tooltip from "$lib/components/ui/tooltip/index.js";
</script>
<Tooltip.Root>
  <Tooltip.Trigger class={buttonVariants({ variant: "outline" })}>
    Hover
  </Tooltip.Trigger>
  <Tooltip.Content>
    <p>Add to library</p>
  </Tooltip.Content>
</Tooltip.Root>
```

### Nested Providers

You can nest providers to create groups with different settings. Tooltips use the closest ancestor provider. This is useful for instant tooltips in specific areas:

```svelte
<Tooltip.Provider delayDuration={0}>
  <!-- tooltips here have no delay -->
</Tooltip.Provider>
```

See the Bits UI documentation for full API reference.

### typography
Utility-based typography styles for headings (h1-h4), paragraphs (standard, lead, large, small, muted), blockquotes, lists, tables, and inline code using Tailwind classes.

## Typography

No typography styles are shipped by default. Use utility classes to style text elements.

### Heading Styles

**h1** - Large primary heading
```svelte
<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
  Taxing Laughter: The Joke Tax Chronicles
</h1>
```

**h2** - Secondary heading with bottom border
```svelte
<h2 class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
  The People of the Kingdom
</h2>
```

**h3** - Tertiary heading
```svelte
<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">The Joke Tax</h3>
```

**h4** - Quaternary heading
```svelte
<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
  People stopped telling jokes
</h4>
```

### Paragraph Styles

**p** - Standard paragraph with margin between non-first siblings
```svelte
<p class="leading-7 [&:not(:first-child)]:mt-6">
  The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
</p>
```

**Lead** - Large introductory text
```svelte
<p class="text-muted-foreground text-xl">
  A modal dialog that interrupts the user with important content and expects a response.
</p>
```

**Large** - Emphasized text
```svelte
<div class="text-lg font-semibold">Are you sure absolutely sure?</div>
```

**Small** - Reduced size text
```svelte
<small class="text-sm font-medium leading-none">Email address</small>
```

**Muted** - Subdued secondary text
```svelte
<p class="text-muted-foreground text-sm">Enter your email address.</p>
```

### Block Elements

**Blockquote** - Indented quoted text with left border
```svelte
<blockquote class="mt-6 border-s-2 ps-6 italic">
  "After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."
</blockquote>
```

**Unordered List** - Bulleted list with spacing
```svelte
<ul class="my-6 ms-6 list-disc [&>li]:mt-2">
  <li>1st level of puns: 5 gold coins</li>
  <li>2nd level of jokes: 10 gold coins</li>
  <li>3rd level of one-liners: 20 gold coins</li>
</ul>
```

**Table** - Responsive table with borders and alternating row backgrounds
```svelte
<div class="my-6 w-full overflow-y-auto">
  <table class="w-full">
    <thead>
      <tr class="even:bg-muted m-0 border-t p-0">
        <th class="border px-4 py-2 text-start font-bold [&[align=center]]:text-center [&[align=right]]:text-end">
          King's Treasury
        </th>
        <th class="border px-4 py-2 text-start font-bold [&[align=center]]:text-center [&[align=right]]:text-end">
          People's happiness
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="even:bg-muted m-0 border-t p-0">
        <td class="border px-4 py-2 text-start [&[align=center]]:text-center [&[align=right]]:text-end">Empty</td>
        <td class="border px-4 py-2 text-start [&[align=center]]:text-center [&[align=right]]:text-end">Overflowing</td>
      </tr>
    </tbody>
  </table>
</div>
```

**Inline Code** - Monospace code snippet
```svelte
<code class="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
  @lucide/svelte
</code>
```

### Key Utility Classes

- `scroll-m-20` - Scroll margin for anchor links
- `text-balance` - Balanced text wrapping
- `text-muted-foreground` - Muted text color
- `leading-7` - Line height
- `[&:not(:first-child)]:mt-6` - Margin on non-first children
- `border-s-2` - Start border (left in LTR)
- `ps-6` - Padding start
- `[&[align=center]]:text-center` - Conditional alignment styling


