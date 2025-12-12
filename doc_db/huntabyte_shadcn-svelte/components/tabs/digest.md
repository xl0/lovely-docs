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