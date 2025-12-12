# Native Select

Styled native HTML select element with design system integration.

## Installation

```bash
npx shadcn-svelte@latest add native-select -y -o
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

### With Groups and Disabled State

```svelte
<NativeSelect.Root disabled>
  <NativeSelect.Option value="">Select department</NativeSelect.Option>
  <NativeSelect.OptGroup label="Engineering">
    <NativeSelect.Option value="frontend">Frontend</NativeSelect.Option>
    <NativeSelect.Option value="backend">Backend</NativeSelect.Option>
    <NativeSelect.Option value="devops">DevOps</NativeSelect.Option>
  </NativeSelect.OptGroup>
  <NativeSelect.OptGroup label="Sales">
    <NativeSelect.Option value="sales-rep">Sales Rep</NativeSelect.Option>
    <NativeSelect.Option value="account-manager">Account Manager</NativeSelect.Option>
    <NativeSelect.Option value="sales-director">Sales Director</NativeSelect.Option>
  </NativeSelect.OptGroup>
</NativeSelect.Root>
```

### Invalid State

```svelte
<NativeSelect.Root aria-invalid="true">
  <NativeSelect.Option value="">Select role</NativeSelect.Option>
  <NativeSelect.Option value="admin">Admin</NativeSelect.Option>
  <NativeSelect.Option value="editor">Editor</NativeSelect.Option>
  <NativeSelect.Option value="viewer">Viewer</NativeSelect.Option>
  <NativeSelect.Option value="guest">Guest</NativeSelect.Option>
</NativeSelect.Root>
```

## NativeSelect vs Select

Use `NativeSelect` for native browser behavior, better performance, or mobile-optimized dropdowns. Use `Select` for custom styling, animations, or complex interactions.

## Accessibility

- Maintains all native HTML select accessibility features
- Screen readers navigate through options using arrow keys
- Chevron icon marked as `aria-hidden="true"` to avoid duplication
- Use `aria-label` or `aria-labelledby` for additional context

```svelte
<NativeSelect.Root aria-label="Choose your preferred language">
  <NativeSelect.Option value="en">English</NativeSelect.Option>
  <NativeSelect.Option value="es">Spanish</NativeSelect.Option>
  <NativeSelect.Option value="fr">French</NativeSelect.Option>
</NativeSelect.Root>
```

## API Reference

### NativeSelect.Root

Main select component wrapping native HTML select element.

| Prop | Type | Default |
|------|------|---------|
| `class` | `string` | |

All other props passed through to underlying `<select>` element.

### NativeSelect.Option

Individual option within the select.

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | |
| `disabled` | `boolean` | `false` |
| `class` | `string` | |

All other props passed through to underlying `<option>` element.

### NativeSelect.OptGroup

Groups related options together.

| Prop | Type | Default |
|------|------|---------|
| `label` | `string` | |
| `disabled` | `boolean` | `false` |
| `class` | `string` | |

All other props passed through to underlying `<optgroup>` element.