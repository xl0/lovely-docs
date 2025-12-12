# Sidebar

Composable, themeable sidebar component with collapse-to-icons support.

## Installation

```bash
npx shadcn-svelte@latest add sidebar -y -o
```

Add CSS variables to `src/routes/layout.css` (light and dark modes with OKLch colors).

## Basic Setup

```svelte
<!-- src/routes/+layout.svelte -->
<Sidebar.Provider>
  <AppSidebar />
  <main>
    <Sidebar.Trigger />
    {@render children?.()}
  </main>
</Sidebar.Provider>

<!-- src/lib/components/app-sidebar.svelte -->
<Sidebar.Root>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each items as item}
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

## Key Components

- **Sidebar.Provider** - Context wrapper; props: `open`, `onOpenChange`; customize width with `--sidebar-width` CSS var or constants
- **Sidebar.Root** - Main container; props: `side` (left/right), `variant` (sidebar/floating/inset), `collapsible` (offcanvas/icon/none)
- **useSidebar()** - Hook for state access: `state`, `open`, `setOpen`, `openMobile`, `setOpenMobile`, `isMobile`, `toggle()`
- **Sidebar.Header/Footer** - Sticky sections
- **Sidebar.Content** - Scrollable area
- **Sidebar.Group** - Section with label, content, optional action; supports collapsible via Collapsible component
- **Sidebar.Menu** - Menu container with MenuButton, MenuAction, MenuSub, MenuBadge, MenuSkeleton
- **Sidebar.Trigger** - Toggle button; create custom with `useSidebar().toggle()`
- **Sidebar.Rail** - Toggle rail
- **Sidebar.Separator** - Divider

## Advanced Features

- **Collapsible groups/menus** - Wrap in Collapsible component
- **Dropdown menus** - Use DropdownMenu in Header/Footer/MenuAction
- **Controlled state** - Use function binding: `bind:open={() => myOpen, (newOpen) => (myOpen = newOpen)}`
- **Styling states** - Use `group-data-[collapsible=icon]:hidden` for icon mode, `peer-data-[active=true]/menu-button:opacity-100` for active states
- **Inset variant** - Wrap main content in `Sidebar.Inset`
