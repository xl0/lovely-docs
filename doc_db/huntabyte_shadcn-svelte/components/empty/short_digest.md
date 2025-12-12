## Empty

Component for displaying empty states with media, title, description, and content sections.

### Installation

```bash
npx shadcn-svelte@latest add empty -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import * as Empty from "$lib/components/ui/empty/index.js";
  import FolderCodeIcon from "@tabler/icons-svelte/icons/folder-code";
</script>

<Empty.Root>
  <Empty.Header>
    <Empty.Media variant="icon"><FolderCodeIcon /></Empty.Media>
    <Empty.Title>No Projects Yet</Empty.Title>
    <Empty.Description>Get started by creating your first project.</Empty.Description>
  </Empty.Header>
  <Empty.Content>
    <Button>Create Project</Button>
  </Empty.Content>
</Empty.Root>
```

### Variants

**Outline** - Add `class="border border-dashed"` to `Empty.Root`

**Background** - Use Tailwind utilities: `class="bg-gradient-to-b from-muted/50 to-background"`

**Media types**:
- `variant="icon"` - Icon display (default)
- `variant="default"` - Custom content (avatars, etc.)

### Content Options

- Multiple buttons with `flex gap-2`
- InputGroup with search and keyboard shortcut
- Footer link with icon
- Avatar or avatar groups with negative spacing