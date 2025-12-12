## Switch

Toggle control for checked/unchecked states.

### Installation

```bash
npx shadcn-svelte@latest add switch -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import { Switch } from "$lib/components/ui/switch/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<div class="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label for="airplane-mode">Airplane Mode</Label>
</div>
```

### Form Integration

Bind to form data with `bind:checked`. Supports `disabled` and `aria-readonly` attributes:

```svelte
<Switch {...props} bind:checked={$formData.marketing_emails} />
<Switch {...props} disabled aria-readonly bind:checked={$formData.security_emails} />
```

Use with sveltekit-superforms for validation and submission handling.