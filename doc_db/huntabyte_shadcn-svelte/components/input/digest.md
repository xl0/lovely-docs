## Input

Form input field component.

### Installation

```bash
npx shadcn-svelte@latest add input -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
</script>
<Input type="email" placeholder="email" class="max-w-xs" />
```

### Examples

**Default, disabled, invalid states:**
```svelte
<Input type="email" placeholder="email" class="max-w-xs" />
<Input disabled type="email" placeholder="email" class="max-w-sm" />
<Input aria-invalid type="email" placeholder="email" value="shadcn@example" class="max-w-sm" />
```

**With Label:**
```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  const id = $props.id();
</script>
<div class="flex w-full max-w-sm flex-col gap-1.5">
  <Label for="email-{id}">Email</Label>
  <Input type="email" id="email-{id}" placeholder="email" />
</div>
```

**With helper text:**
```svelte
<div class="flex w-full max-w-sm flex-col gap-1.5">
  <Label for="email">Email</Label>
  <Input type="email" id="email" placeholder="Email" />
  <p class="text-muted-foreground text-sm">Enter your email address.</p>
</div>
```

**With Button:**
```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<form class="flex w-full max-w-sm items-center space-x-2">
  <Input type="email" placeholder="email" />
  <Button type="submit">Subscribe</Button>
</form>
```

**File input:**
```svelte
<div class="grid w-full max-w-sm items-center gap-1.5">
  <Label for="picture">Picture</Label>
  <Input id="picture" type="file" />
</div>
```

**Form validation with sveltekit-superforms:**
```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    username: z.string().min(2).max(50)
  });
</script>
<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";
  
  const form = superForm(defaults(zod4(formSchema)), {
    validators: zod4(formSchema),
    SPA: true,
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  const { form: formData, enhance } = form;
</script>
<form method="POST" class="w-2/3 space-y-6" use:enhance>
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Username</Form.Label>
        <Input {...props} bind:value={$formData.username} />
      {/snippet}
    </Form.Control>
    <Form.Description>This is your public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

### Attributes

Supports standard HTML input attributes: `type`, `placeholder`, `disabled`, `aria-invalid`, `id`, `class`, etc. Can be bound with `bind:value`.
