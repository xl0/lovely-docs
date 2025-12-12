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