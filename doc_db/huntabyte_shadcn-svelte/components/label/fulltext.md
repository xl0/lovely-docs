# Label

Renders an accessible label associated with controls.

[Docs](https://bits-ui.com/docs/components/label)

[API Reference](https://bits-ui.com/docs/components/label#api-reference)

```svelte
<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>
<div>
  <div class="flex items-center space-x-2">
    <Checkbox id="terms" />
    <Label for="terms">Accept terms and conditions</Label>
  </div>
</div>
```

## Installation

```bash
pnpm dlx shadcn-svelte@latest add label
```

```bash
npx shadcn-svelte@latest add label
```

```bash
bun x shadcn-svelte@latest add label
```

## Usage

```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
</script>
<Label for="email">Your email address</Label>
```