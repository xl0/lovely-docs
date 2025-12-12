## Textarea

Form textarea component that displays as a native textarea or styled component.

### Installation

```bash
npx shadcn-svelte@latest add textarea -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

### Usage

```svelte
<script lang="ts">
  import { Textarea } from "$lib/components/ui/textarea/index.js";
</script>

<Textarea />
```

### Examples

**Default with placeholder:**
```svelte
<Textarea placeholder="Type your message here." />
```

**Disabled state:**
```svelte
<Textarea disabled placeholder="Type your message here." />
```

**With Label and description text:**
```svelte
<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
</script>

<div class="grid w-full gap-1.5">
  <Label for="message">Your message</Label>
  <Textarea placeholder="Type your message here." id="message" />
  <p class="text-muted-foreground text-sm">Your message will be copied to the support team.</p>
</div>
```

**With Button:**
```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
</script>

<div class="grid w-full gap-2">
  <Textarea placeholder="Type your message here." />
  <Button>Send message</Button>
</div>
```

**Form integration with validation:**
```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    bio: z.string().min(10, "Bio must be at least 10 characters.").max(160, "Bio must be at most 160 characters.")
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  
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
  <Form.Field {form} name="bio">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Bio</Form.Label>
        <Textarea
          {...props}
          placeholder="Tell us a little bit about yourself"
          class="resize-none"
          bind:value={$formData.bio}
        />
        <Form.Description>You can @mention other users and organizations.</Form.Description>
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button>Submit</Form.Button>
</form>
```

Supports standard HTML textarea attributes like `placeholder`, `disabled`, `id`, and custom class binding. Can be used standalone or integrated with form validation using sveltekit-superforms.