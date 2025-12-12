## Switch

A control that allows the user to toggle between checked and not checked.

### Installation

```bash
npx shadcn-svelte@latest add switch -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

### Basic Usage

```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";
</script>

<div class="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label for="airplane-mode">Airplane Mode</Label>
</div>
```

### Form Integration

Use with sveltekit-superforms and zod validation:

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    marketing_emails: z.boolean().default(false),
    security_emails: z.boolean().default(true)
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Switch } from "$lib/components/ui/switch/index.js";

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

<form method="POST" class="w-full space-y-6" use:enhance>
  <fieldset>
    <legend class="mb-4 text-lg font-medium">Email Notifications</legend>
    <div class="space-y-4">
      <Form.Field
        {form}
        name="marketing_emails"
        class="flex flex-row items-center justify-between rounded-lg border p-4"
      >
        <Form.Control>
          {#snippet children({ props })}
            <div class="space-y-0.5">
              <Form.Label>Marketing emails</Form.Label>
              <Form.Description>
                Receive emails about new products, features, and more.
              </Form.Description>
            </div>
            <Switch {...props} bind:checked={$formData.marketing_emails} />
          {/snippet}
        </Form.Control>
      </Form.Field>

      <Form.Field
        {form}
        name="security_emails"
        class="flex flex-row items-center justify-between rounded-lg border p-4"
      >
        <Form.Control>
          {#snippet children({ props })}
            <div class="space-y-0.5">
              <Form.Label>Security emails</Form.Label>
              <Form.Description>
                Receive emails about your account security.
              </Form.Description>
            </div>
            <Switch
              {...props}
              aria-readonly
              disabled
              bind:checked={$formData.security_emails}
            />
          {/snippet}
        </Form.Control>
      </Form.Field>
    </div>
  </fieldset>
  <Form.Button>Submit</Form.Button>
</form>
```

Supports `disabled` and `aria-readonly` attributes for read-only states. Use `bind:checked` to bind the switch state to form data.