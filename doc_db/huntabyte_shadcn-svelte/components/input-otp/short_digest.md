# Input OTP

Accessible one-time password input component with copy-paste support.

## Installation

```bash
npx shadcn-svelte@latest add input-otp -y -o
```

## Basic Usage

```svelte
<script lang="ts">
  import * as InputOTP from "$lib/components/ui/input-otp/index.js";
</script>

<InputOTP.Root maxlength={6}>
  {#snippet children({ cells })}
    <InputOTP.Group>
      {#each cells as cell (cell)}
        <InputOTP.Slot {cell} />
      {/each}
    </InputOTP.Group>
  {/snippet}
</InputOTP.Root>
```

## Key Features

- **Pattern validation**: Use `pattern` prop with `REGEXP_ONLY_DIGITS_AND_CHARS` from bits-ui
- **Separators**: Add `InputOTP.Separator` between groups for visual organization
- **Error state**: Add `aria-invalid` to slots for styling
- **Form integration**: Bind to form values with `bind:value={$formData.pin}` and validate with sveltekit-superforms

## Components

- `Root` - Container with `maxlength` prop
- `Group` - Groups cells together
- `Slot` - Individual cell with `cell` and `aria-invalid` props
- `Separator` - Visual divider between groups