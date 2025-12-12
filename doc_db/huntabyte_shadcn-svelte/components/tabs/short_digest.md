## Tabs

Layered sections of content displayed one at a time.

### Installation

```bash
npx shadcn-svelte@latest add tabs -y -o
```

### Usage

```svelte
<script lang="ts">
  import * as Tabs from "$lib/components/ui/tabs/index.js";
</script>

<Tabs.Root value="account">
  <Tabs.List>
    <Tabs.Trigger value="account">Account</Tabs.Trigger>
    <Tabs.Trigger value="password">Password</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="account">Account content</Tabs.Content>
  <Tabs.Content value="password">Password content</Tabs.Content>
</Tabs.Root>
```

Components: `Tabs.Root` (container), `Tabs.List` (trigger wrapper), `Tabs.Trigger` (tab button), `Tabs.Content` (panel). Match `value` props between triggers and content.