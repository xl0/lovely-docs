# Form

Building accessible, type-safe forms with Formsnap, Superforms, and Zod.

## Installation

```bash
npx shadcn-svelte@latest add form -y -o
```

## Basic Usage

1. **Schema** (src/routes/settings/schema.ts):
```ts
import { z } from "zod";
export const formSchema = z.object({
  username: z.string().min(2).max(50),
});
```

2. **Load function** (src/routes/settings/+page.server.ts):
```ts
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
export const load = async () => ({
  form: await superValidate(zod4(formSchema)),
});
```

3. **Form component** (src/routes/settings/settings-form.svelte):
```svelte
<script lang="ts">
  import * as Form from "$lib/components/ui/form/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { superForm } from "sveltekit-superforms";
  import { zod4Client } from "sveltekit-superforms/adapters";

  let { data } = $props();
  const form = superForm(data.form, { validators: zod4Client(formSchema) });
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
    <Form.Description>Public display name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

4. **Server action** (src/routes/settings/+page.server.ts):
```ts
export const actions = {
  default: async (event) => {
    const form = await superValidate(event, zod4(formSchema));
    if (!form.valid) return fail(400, { form });
    return { form };
  },
};
```

5. **Use component** (src/routes/settings/+page.svelte):
```svelte
<script lang="ts">
  import SettingsForm from "./settings-form.svelte";
  let { data } = $props();
</script>
<SettingsForm {data} />
```

## SPA Mode

For client-side validation without server actions, use `SPA: true` option and `defaults(zod4(formSchema))` instead of server-validated form.