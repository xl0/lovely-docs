## Label

Accessible label component for form controls.

```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<Label for="email">Your email address</Label>
```

Install with `npx shadcn-svelte@latest add label -y -o`. Use the `for` attribute to associate with form control `id`.