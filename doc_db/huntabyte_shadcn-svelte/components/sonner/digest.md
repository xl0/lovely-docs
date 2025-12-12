## Sonner

Toast component for Svelte, ported from the React Sonner library by Emil Kowalski.

### Installation

Install via CLI:
```bash
npx shadcn-svelte@latest add sonner -y -o
```

Add the Toaster component to your root layout:

```svelte
<script lang="ts">
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  let { children } = $props();
</script>
<Toaster />
{@render children?.()}
```

### Usage

Basic toast:
```svelte
<script lang="ts">
  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button/index.js";
</script>
<Button onclick={() => toast("Hello world")}>Show toast</Button>
```

Toast with description, action, and success variant:
```svelte
<Button
  variant="outline"
  onclick={() =>
    toast.success("Event has been created", {
      description: "Sunday, December 03, 2023 at 9:00 AM",
      action: {
        label: "Undo",
        onClick: () => console.info("Undo")
      }
    })}
>
  Show Toast
</Button>
```

### Dark Mode

By default, Sonner uses system preferences for theme. To control theme explicitly, use the `theme` prop on the Toaster component or integrate with mode-watcher for hardcoded dark/light mode. See dark mode documentation for setup details.

To opt out of dark mode support, uninstall mode-watcher and remove the `theme` prop from the Toaster component.