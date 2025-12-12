# Native Select

A styled native HTML select element with consistent design system integration.

```svelte
<script lang="ts">
  import * as NativeSelect from "$lib/components/ui/native-select/index.js";
</script>
<NativeSelect.Root>
  <NativeSelect.Option value="">Select status</NativeSelect.Option>
  <NativeSelect.Option value="todo">Todo</NativeSelect.Option>
  <NativeSelect.Option value="in-progress">In Progress</NativeSelect.Option>
  <NativeSelect.Option value="done">Done</NativeSelect.Option>
  <NativeSelect.Option value="cancelled">Cancelled</NativeSelect.Option>
</NativeSelect.Root>
```

## Installation

```bash
pnpm dlx shadcn-svelte@latest add native-select
```

```bash
npx shadcn-svelte@latest add native-select
```

```bash
bun x shadcn-svelte@latest add native-select
```

## Usage

```svelte
<script lang="ts">
  import * as NativeSelect from "$lib/components/ui/native-select/index.js";
</script>
<NativeSelect.Root>
  <NativeSelect.Option value="">Select a fruit</NativeSelect.Option>
  <NativeSelect.Option value="apple">Apple</NativeSelect.Option>
  <NativeSelect.Option value="banana">Banana</NativeSelect.Option>
  <NativeSelect.Option value="blueberry">Blueberry</NativeSelect.Option>
  <NativeSelect.Option value="grapes" disabled>Grapes</NativeSelect.Option>
  <NativeSelect.Option value="pineapple">Pineapple</NativeSelect.Option>
</NativeSelect.Root>
```

## Examples

### With Groups

Organize options using `NativeSelect.OptGroup` for better categorization.

```svelte
<script lang="ts">
  import * as NativeSelect from "$lib/components/ui/native-select/index.js";
</script>
<NativeSelect.Root>
  <NativeSelect.Option value="">Select department</NativeSelect.Option>
  <NativeSelect.OptGroup label="Engineering">
    <NativeSelect.Option value="frontend">Frontend</NativeSelect.Option>
    <NativeSelect.Option value="backend">Backend</NativeSelect.Option>
    <NativeSelect.Option value="devops">DevOps</NativeSelect.Option>
  </NativeSelect.OptGroup>
  <NativeSelect.OptGroup label="Sales">
    <NativeSelect.Option value="sales-rep">Sales Rep</NativeSelect.Option>
    <NativeSelect.Option value="account-manager"
      >Account Manager</NativeSelect.Option
    >
    <NativeSelect.Option value="sales-director"
      >Sales Director</NativeSelect.Option
    >
  </NativeSelect.OptGroup>
  <NativeSelect.OptGroup label="Operations">
    <NativeSelect.Option value="support">Customer Support</NativeSelect.Option>
    <NativeSelect.Option value="product-manager"
      >Product Manager</NativeSelect.Option
    >
    <NativeSelect.Option value="ops-manager"
      >Operations Manager</NativeSelect.Option
    >
  </NativeSelect.OptGroup>
</NativeSelect.Root>
```

```svelte
<NativeSelect.Root>
  <NativeSelect.Option value="">Select a food</NativeSelect.Option>
  <NativeSelect.OptGroup label="Fruits">
    <NativeSelect.Option value="apple">Apple</NativeSelect.Option>
    <NativeSelect.Option value="banana">Banana</NativeSelect.Option>
    <NativeSelect.Option value="blueberry">Blueberry</NativeSelect.Option>
  </NativeSelect.OptGroup>
  <NativeSelect.OptGroup label="Vegetables">
    <NativeSelect.Option value="carrot">Carrot</NativeSelect.Option>
    <NativeSelect.Option value="broccoli">Broccoli</NativeSelect.Option>
    <NativeSelect.Option value="spinach">Spinach</NativeSelect.Option>
  </NativeSelect.OptGroup>
</NativeSelect.Root>
```

### Disabled State

Disable individual options or the entire select component.

```svelte
<script lang="ts">
  import * as NativeSelect from "$lib/components/ui/native-select/index.js";
</script>
<NativeSelect.Root disabled>
  <NativeSelect.Option value="">Select priority</NativeSelect.Option>
  <NativeSelect.Option value="low">Low</NativeSelect.Option>
  <NativeSelect.Option value="medium">Medium</NativeSelect.Option>
  <NativeSelect.Option value="high">High</NativeSelect.Option>
  <NativeSelect.Option value="critical">Critical</NativeSelect.Option>
</NativeSelect.Root>
```

### Invalid State

Show validation errors with the `aria-invalid` attribute and error styling.

```svelte
<script lang="ts">
  import * as NativeSelect from "$lib/components/ui/native-select/index.js";
</script>
<NativeSelect.Root aria-invalid="true">
  <NativeSelect.Option value="">Select role</NativeSelect.Option>
  <NativeSelect.Option value="admin">Admin</NativeSelect.Option>
  <NativeSelect.Option value="editor">Editor</NativeSelect.Option>
  <NativeSelect.Option value="viewer">Viewer</NativeSelect.Option>
  <NativeSelect.Option value="guest">Guest</NativeSelect.Option>
</NativeSelect.Root>
```

```svelte
<NativeSelect.Root aria-invalid="true">
  <NativeSelect.Option value="">Select a country</NativeSelect.Option>
  <NativeSelect.Option value="us">United States</NativeSelect.Option>
  <NativeSelect.Option value="uk">United Kingdom</NativeSelect.Option>
  <NativeSelect.Option value="ca">Canada</NativeSelect.Option>
</NativeSelect.Root>
```

## Native Select vs Select

- Use `NativeSelect` when you need native browser behavior, better performance, or mobile-optimized dropdowns.
- Use `Select` when you need custom styling, animations, or complex interactions.

The `NativeSelect` component provides native HTML select functionality with consistent styling that matches your design system.

## Accessibility

- The component maintains all native HTML select accessibility features.  
- Screen readers can navigate through options using arrow keys.  
- The chevron icon is marked as `aria-hidden="true"` to avoid duplication.
- Use `aria-label` or `aria-labelledby` for additional context when needed.

```tsx
<NativeSelect aria-label="Choose your preferred language">
  <NativeSelectOption value="en">English</NativeSelectOption>
  <NativeSelectOption value="es">Spanish</NativeSelectOption>
  <NativeSelectOption value="fr">French</NativeSelectOption>
</NativeSelect>
```

## API Reference

### NativeSelect.Root

The main select component that wraps the native HTML select element.

| Prop                  | Type            | Default |
| ----------------------------------- | ------------------------------------ | ------------------------------------------ |
| `class` | `string` |  |

All other props are passed through to the underlying `<select>` element.

```svelte
<NativeSelect.Root>
  <NativeSelect.Option value="option1">Option 1</NativeSelect.Option>
  <NativeSelect.Option value="option2">Option 2</NativeSelect.Option>
</NativeSelect.Root>
```

### NativeSelect.Option

Represents an individual option within the select.

| Prop                     | Type             | Default        |
| -------------------------------------- | ------------------------------------- | ------------------------------------------------- |
| `value`    | `string`  |                       |
| `disabled` | `boolean` | `false` |
| `class`    | `string`  |         |

All other props are passed through to the underlying `<option>` element.

```svelte
<NativeSelect.Option value="apple">Apple</NativeSelect.Option>
<NativeSelect.Option value="banana" disabled>Banana</NativeSelect.Option>
```

### NativeSelect.OptGroup

Groups related options together for better organization.

| Prop                     | Type             | Default        |
| -------------------------------------- | ------------------------------------- | ------------------------------------------------- |
| `label`    | `string`  |                       |
| `disabled` | `boolean` | `false` |
| `class`    | `string`  |         |

All other props are passed through to the underlying `<optgroup>` element.

```svelte
<NativeSelect.OptGroup label="Fruits">
  <NativeSelect.Option value="apple">Apple</NativeSelect.Option>
  <NativeSelect.Option value="banana">Banana</NativeSelect.Option>
</NativeSelect.OptGroup>
```