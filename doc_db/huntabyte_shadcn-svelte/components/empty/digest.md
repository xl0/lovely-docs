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