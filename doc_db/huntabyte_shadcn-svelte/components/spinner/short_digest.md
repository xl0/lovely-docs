# Spinner

Loading indicator component using `size-*` and `text-*` utility classes for sizing and color.

## Installation

```bash
npx shadcn-svelte@latest add spinner -y -o
```

## Usage

```svelte
<script lang="ts">
  import { Spinner } from "$lib/components/ui/spinner/index.js";
</script>

<Spinner class="size-6 text-blue-500" />
```

## Examples

Works in Button, Badge, InputGroup, Empty, and Item components:

```svelte
<Button disabled><Spinner /> Loading...</Button>
<Badge><Spinner /> Syncing</Badge>
<InputGroup.Addon><Spinner /></InputGroup.Addon>
<Item.Media variant="icon"><Spinner /></Item.Media>
```

Customize by replacing the icon in the component source.