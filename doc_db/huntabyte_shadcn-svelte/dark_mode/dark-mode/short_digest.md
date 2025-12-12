## Setup

Install and add `ModeWatcher` to root layout:

```bash
npm i mode-watcher
```

```svelte
// src/routes/+layout.svelte
<script lang="ts">
  import { ModeWatcher } from "mode-watcher";
  let { children } = $props();
</script>
<ModeWatcher />
{@render children?.()}
```

## Toggle Components

Button toggle with `toggleMode()`:

```svelte
<Button onclick={toggleMode}>
  <SunIcon class="rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
  <MoonIcon class="absolute rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
</Button>
```

Dropdown with `setMode("light"|"dark")` and `resetMode()` for system preference.