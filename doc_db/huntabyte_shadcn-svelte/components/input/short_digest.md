## Input

Form input field component.

### Installation

```bash
npx shadcn-svelte@latest add input -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
</script>
<Input type="email" placeholder="email" class="max-w-xs" />
```

### Examples

**States and variants:**
```svelte
<Input type="email" placeholder="email" />
<Input disabled type="email" placeholder="email" />
<Input aria-invalid type="email" placeholder="email" value="invalid@example" />
<Input type="file" />
```

**With Label and helper text:**
```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
</script>
<div class="flex flex-col gap-1.5">
  <Label for="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
  <p class="text-muted-foreground text-sm">Enter your email address.</p>
</div>
```

**With Button:**
```svelte
<form class="flex items-center space-x-2">
  <Input type="email" placeholder="email" />
  <Button type="submit">Subscribe</Button>
</form>
```

**Form validation with sveltekit-superforms:**
```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({ username: z.string().min(2).max(50) });
</script>
<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import * as Form from "$lib/components/ui/form/index.js";
  
  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) toast.success(`Submitted: ${JSON.stringify(f.data)}`);
    }
  });
  const { form: formData, enhance } = form;
</script>
<form method="POST" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <Input {...props} bind:value={$formData.username} />
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

Supports standard HTML input attributes and `bind:value`.
