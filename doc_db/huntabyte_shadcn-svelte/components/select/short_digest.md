## Select

Dropdown component for picking from a list of options.

## Installation

```bash
npx shadcn-svelte@latest add select -y -o
```

## Usage

```svelte
<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";
  const fruits = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "grapes", label: "Grapes" }
  ];
  let value = $state("");
  const triggerContent = $derived(
    fruits.find((f) => f.value === value)?.label ?? "Select a fruit"
  );
</script>

<Select.Root type="single" name="favoriteFruit" bind:value>
  <Select.Trigger class="w-[180px]">{triggerContent}</Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>Fruits</Select.Label>
      {#each fruits as fruit (fruit.value)}
        <Select.Item
          value={fruit.value}
          label={fruit.label}
          disabled={fruit.value === "grapes"}
        >
          {fruit.label}
        </Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
</Select.Root>
```

Key components: `Select.Root` (type="single"), `Select.Trigger`, `Select.Content`, `Select.Group`, `Select.Label`, `Select.Item` (supports disabled). Use `bind:value` for two-way binding and `$derived` for computed trigger content.

## Form Integration

Integrate with sveltekit-superforms using `Form.Field`, `Form.Control`, `Form.Label`, `Form.Description`, and `Form.FieldErrors` for validation and error handling.