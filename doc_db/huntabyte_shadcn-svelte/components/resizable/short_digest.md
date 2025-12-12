## Resizable

Accessible resizable panel groups with keyboard support.

```svelte
<script lang="ts">
  import * as Resizable from "$lib/components/ui/resizable/index.js";
</script>

<Resizable.PaneGroup direction="horizontal">
  <Resizable.Pane defaultSize={50}>One</Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={50}>Two</Resizable.Pane>
</Resizable.PaneGroup>
```

Install: `npx shadcn-svelte@latest add resizable -y -o`

Props: `direction` ("horizontal"|"vertical"), `defaultSize` (percentage), `withHandle` (show handle indicator). Supports nesting and full PaneForge API.