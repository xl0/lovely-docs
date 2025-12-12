## Card

Container component with header, content, and footer sections.

### Installation

```bash
npx shadcn-svelte@latest add card -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
</script>

<Card.Root>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>Content</Card.Content>
  <Card.Footer>Footer</Card.Footer>
</Card.Root>
```

### Components

- `Card.Root` - Main container
- `Card.Header` - Header section with optional `Card.Title`, `Card.Description`, and `Card.Action`
- `Card.Content` - Main content area
- `Card.Footer` - Footer section

All components accept Tailwind classes via `class` prop.