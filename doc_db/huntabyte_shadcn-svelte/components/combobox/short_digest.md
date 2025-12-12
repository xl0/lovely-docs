# Combobox

Autocomplete input with searchable dropdown list. Composed from Popover and Command components.

## Installation

```bash
npx shadcn-svelte@latest add popover -y -o
npx shadcn-svelte@latest add command -y -o
```

## Basic Example

```svelte
<script lang="ts">
  import CheckIcon from "@lucide/svelte/icons/check";
  import ChevronsUpDownIcon from "@lucide/svelte/icons/chevrons-up-down";
  import { tick } from "svelte";
  import * as Command from "$lib/components/ui/command/index.js";
  import * as Popover from "$lib/components/ui/popover/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";

  const frameworks = [
    { value: "sveltekit", label: "SvelteKit" },
    { value: "next.js", label: "Next.js" },
    { value: "nuxt.js", label: "Nuxt.js" },
    { value: "remix", label: "Remix" },
    { value: "astro", label: "Astro" }
  ];

  let open = $state(false);
  let value = $state("");
  let triggerRef = $state<HTMLButtonElement>(null!);
  const selectedValue = $derived(frameworks.find((f) => f.value === value)?.label);

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => triggerRef.focus());
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger bind:ref={triggerRef}>
    {#snippet child({ props })}
      <Button {...props} variant="outline" role="combobox" aria-expanded={open}>
        {selectedValue || "Select a framework..."}
        <ChevronsUpDownIcon class="ms-2 size-4 shrink-0 opacity-50" />
      </Button>
    {/snippet}
  </Popover.Trigger>
  <Popover.Content class="w-[200px] p-0">
    <Command.Root>
      <Command.Input placeholder="Search framework..." />
      <Command.List>
        <Command.Empty>No framework found.</Command.Empty>
        <Command.Group>
          {#each frameworks as framework}
            <Command.Item
              value={framework.value}
              onSelect={() => {
                value = framework.value;
                closeAndFocusTrigger();
              }}
            >
              <CheckIcon class={cn("me-2 size-4", value !== framework.value && "text-transparent")} />
              {framework.label}
            </Command.Item>
          {/each}
        </Command.Group>
      </Command.List>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
```

## Advanced Examples

**Status selector with icons**: Use dynamic icon components in items, position popover with `side="right" align="start"`.

**Dropdown menu submenu**: Embed Command in DropdownMenu.SubContent for filtered selection within menus.

**Form integration**: Wrap with `<Form.Control />` and add hidden input for form submission. Requires formsnap 0.5.0+.

## Key Patterns

- Refocus trigger after selection with `closeAndFocusTrigger()` for keyboard navigation
- Use `$state` and `$derived` for reactive state
- Set `role="combobox"` and `aria-expanded={open}` for accessibility
