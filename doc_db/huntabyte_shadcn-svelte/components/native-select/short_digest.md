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
  <NativeSelect.Option value="grapes" disabled>Grapes</NativeSelect.Option>
</NativeSelect.Root>
```

## Features

- **Groups**: Use `NativeSelect.OptGroup` with `label` prop to organize options
- **Disabled**: Set `disabled` on `Root` or individual `Option` elements
- **Invalid state**: Use `aria-invalid="true"` on `Root` for validation errors
- **Accessibility**: Maintains native HTML select features, supports `aria-label`

## NativeSelect vs Select

Use `NativeSelect` for native browser behavior and mobile optimization. Use `Select` for custom styling and animations.