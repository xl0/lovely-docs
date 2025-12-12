## Checkbox

Toggle control for checked/unchecked states.

### Installation
```bash
npx shadcn-svelte@latest add checkbox -y -o
```

### Basic Usage
```svelte
<script lang="ts">
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<Checkbox />
<Checkbox checked />
<Checkbox disabled />

<div class="flex items-center gap-3">
  <Checkbox id="terms" />
  <Label for="terms">Accept terms and conditions</Label>
</div>
```

### Styling
Use `data-[state=checked]` for conditional styling:
```svelte
<Checkbox class="data-[state=checked]:bg-blue-600 data-[state=checked]:text-white" />
```

Parent labels can use `:has()` selector:
```svelte
<Label class="has-[[aria-checked=true]]:bg-blue-50">
  <Checkbox checked />
</Label>
```

### Form Integration
```svelte
<Form.Fieldset {form} name="items">
  {#each items as item}
    <Form.Control>
      {#snippet children({ props })}
        <Checkbox
          {...props}
          checked={$formData.items.includes(item.id)}
          onCheckedChange={(v) => {
            if (v) {
              $formData.items = [...$formData.items, item.id];
            } else {
              $formData.items = $formData.items.filter((i) => i !== item.id);
            }
          }}
        />
        <Form.Label>{item.label}</Form.Label>
      {/snippet}
    </Form.Control>
  {/each}
</Form.Fieldset>
```