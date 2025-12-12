## Kbd

Display keyboard input. Use `Kbd.Root` for individual keys and `Kbd.Group` to group multiple keys.

```svelte
import * as Kbd from "$lib/components/ui/kbd/index.js";

<Kbd.Root>B</Kbd.Root>
<Kbd.Group>
  <Kbd.Root>Ctrl</Kbd.Root>
  <Kbd.Root>K</Kbd.Root>
</Kbd.Group>
```

Works in buttons, tooltips, and input groups.