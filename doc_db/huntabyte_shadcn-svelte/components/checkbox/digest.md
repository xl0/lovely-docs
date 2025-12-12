## Checkbox

A control that allows the user to toggle between checked and not checked.

## Installation

```bash
npx shadcn-svelte@latest add checkbox -y -o
```

The `-y` flag skips the confirmation prompt, and `-o` overwrites existing files.

## Basic Usage

```svelte
<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<Checkbox />

<!-- With label -->
<div class="flex items-center gap-3">
  <Checkbox id="terms" />
  <Label for="terms">Accept terms and conditions</Label>
</div>
```

## States

```svelte
<!-- Checked -->
<Checkbox checked />

<!-- Disabled -->
<Checkbox disabled />
```

## Styling

Checkboxes support data attributes for styling based on state:

```svelte
<Checkbox
  id="toggle-2"
  checked
  class="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
/>
```

Parent labels can use `:has()` selector to style based on checkbox state:

```svelte
<Label class="has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50">
  <Checkbox id="toggle-2" checked />
  <div>Enable notifications</div>
</Label>
```

## Form Integration

Use with sveltekit-superforms for form handling:

```svelte
<script lang="ts" module>
  import { z } from "zod/v4";
  const formSchema = z.object({
    items: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "You have to select at least one item."
    })
  });
</script>

<script lang="ts">
  import { defaults, superForm } from "sveltekit-superforms";
  import { zod4 } from "sveltekit-superforms/adapters";
  import { toast } from "svelte-sonner";
  import * as Form from "$lib/components/ui/form/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";

  const form = superForm(defaults(zod4(formSchema)), {
    SPA: true,
    validators: zod4(formSchema),
    onUpdate: ({ form: f }) => {
      if (f.valid) {
        toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
      } else {
        toast.error("Please fix the errors in the form.");
      }
    }
  });
  const { form: formData, enhance } = form;

  function addItem(id: string) {
    $formData.items = [...$formData.items, id];
  }
  function removeItem(id: string) {
    $formData.items = $formData.items.filter((i) => i !== id);
  }
</script>

<form method="POST" class="space-y-8" use:enhance>
  <Form.Fieldset {form} name="items" class="space-y-0">
    <div class="mb-4">
      <Form.Legend class="text-base">Sidebar</Form.Legend>
      <Form.Description>Select items to display in sidebar.</Form.Description>
    </div>
    <div class="space-y-2">
      {#each items as item (item.id)}
        {@const checked = $formData.items.includes(item.id)}
        <div class="flex flex-row items-start space-x-3">
          <Form.Control>
            {#snippet children({ props })}
              <Checkbox
                {...props}
                {checked}
                value={item.id}
                onCheckedChange={(v) => {
                  if (v) {
                    addItem(item.id);
                  } else {
                    removeItem(item.id);
                  }
                }}
              />
              <Form.Label class="font-normal">{item.label}</Form.Label>
            {/snippet}
          </Form.Control>
        </div>
      {/each}
      <Form.FieldErrors />
    </div>
  </Form.Fieldset>
  <Form.Button>Update display</Form.Button>
</form>
```

## API Reference

See the Bits UI checkbox documentation for complete API reference.