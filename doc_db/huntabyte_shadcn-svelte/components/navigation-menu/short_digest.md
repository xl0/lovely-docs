# Navigation Menu

Collection of links for website navigation.

## Installation

```bash
npx shadcn-svelte@latest add navigation-menu -y -o
```

## Basic Usage

```svelte
<script lang="ts">
  import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
  import { navigationMenuTriggerStyle } from "$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte";
</script>

<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
      <NavigationMenu.Trigger>Menu</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.Link href="##">Link</NavigationMenu.Link>
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

**Components**: `Root`, `List`, `Item`, `Trigger`, `Content`, `Link`

**Key utilities**: `navigationMenuTriggerStyle()` for styling triggers