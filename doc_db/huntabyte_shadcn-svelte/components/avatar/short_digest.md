## Avatar

Image element with fallback text for user representation.

### Installation

```bash
npx shadcn-svelte@latest add avatar -y -o
```

### Usage

```svelte
<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";
</script>

<Avatar.Root class="rounded-lg">
  <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
  <Avatar.Fallback>CN</Avatar.Fallback>
</Avatar.Root>

<!-- Multiple avatars with styling -->
<div class="flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
  <Avatar.Root>
    <Avatar.Image src="..." alt="..." />
    <Avatar.Fallback>CN</Avatar.Fallback>
  </Avatar.Root>
  <!-- more avatars... -->
</div>
```

Components: `Avatar.Root`, `Avatar.Image`, `Avatar.Fallback`. Supports custom styling via class prop.