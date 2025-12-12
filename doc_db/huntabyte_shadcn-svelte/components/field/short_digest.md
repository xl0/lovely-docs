# Field

Accessible form field component combining labels, controls, and help text with vertical, horizontal, and responsive layouts.

## Installation

```bash
npx shadcn-svelte@latest add field -y -o
```

## Basic Usage

```svelte
<script lang="ts">
  import * as Field from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
</script>

<Field.Set>
  <Field.Legend>Profile</Field.Legend>
  <Field.Description>This appears on invoices and emails.</Field.Description>
  <Field.Group>
    <Field.Field>
      <Field.Label for="name">Full name</Field.Label>
      <Input id="name" placeholder="Evil Rabbit" />
      <Field.Description>This appears on invoices and emails.</Field.Description>
    </Field.Field>
    <Field.Field>
      <Field.Label for="username">Username</Field.Label>
      <Input id="username" aria-invalid />
      <Field.Error>Choose another username.</Field.Error>
    </Field.Field>
  </Field.Group>
</Field.Set>
```

## Layouts

- **Vertical** (default): Stacks label, control, and helper text
- **Horizontal**: `orientation="horizontal"` aligns label and control side-by-side
- **Responsive**: `orientation="responsive"` with `@container/field-group` for breakpoint-based switching

## Components

- `Field.Set` - Wrapper with optional legend
- `Field.Group` - Container for stacking fields
- `Field.Field` - Core wrapper
- `Field.Label`, `Field.Description`, `Field.Error` - Text elements
- `Field.Legend` - Semantic heading
- `Field.Separator` - Visual divider
- `Field.Content` - Groups label and description
- `Field.Title` - For choice cards

## Examples

### Horizontal Layout
```svelte
<Field.Field orientation="horizontal">
  <Checkbox id="newsletter" />
  <Field.Label for="newsletter">Subscribe to newsletter</Field.Label>
</Field.Field>
```

### Responsive Layout
```svelte
<Field.Field orientation="responsive">
  <Field.Content>
    <Field.Label for="name">Name</Field.Label>
    <Field.Description>Provide your full name</Field.Description>
  </Field.Content>
  <Input id="name" placeholder="Evil Rabbit" />
</Field.Field>
```

### Choice Cards (Radio/Checkbox)
```svelte
<script lang="ts">
  let computeEnvironment = $state("kubernetes");
</script>

<RadioGroup.Root bind:value={computeEnvironment}>
  <Field.Label for="kubernetes">
    <Field.Field orientation="horizontal">
      <Field.Content>
        <Field.Title>Kubernetes</Field.Title>
        <Field.Description>Run GPU workloads on a K8s configured cluster.</Field.Description>
      </Field.Content>
      <RadioGroup.Item value="kubernetes" id="kubernetes" />
    </Field.Field>
  </Field.Label>
</RadioGroup.Root>
```

### Validation
```svelte
<Field.Field data-invalid>
  <Field.Label for="email">Email</Field.Label>
  <Input id="email" type="email" aria-invalid />
  <Field.Error>Enter a valid email address.</Field.Error>
</Field.Field>
```

## Accessibility

- `Field.Set` and `Field.Legend` group related controls for keyboard/assistive tech
- `Field` outputs `role="group"` for label inheritance
- Use `Field.Separator` sparingly for clear section boundaries
