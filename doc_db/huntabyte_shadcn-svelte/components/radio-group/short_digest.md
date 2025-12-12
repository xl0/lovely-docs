## Radio Group

Mutually exclusive selection component.

### Installation

```bash
npx shadcn-svelte@latest add radio-group -y -o
```

### Basic Usage

```svelte
<script lang="ts">
  import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
</script>

<RadioGroup.Root value="comfortable">
  <div class="flex items-center space-x-2">
    <RadioGroup.Item value="default" id="r1" />
    <Label for="r1">Default</Label>
  </div>
  <div class="flex items-center space-x-2">
    <RadioGroup.Item value="comfortable" id="r2" />
    <Label for="r2">Comfortable</Label>
  </div>
</RadioGroup.Root>
```

### Form Integration

Bind to form state with `bind:value={$formData.fieldName}` and wrap items in `Form.Control` with `Form.Label` for validation support.