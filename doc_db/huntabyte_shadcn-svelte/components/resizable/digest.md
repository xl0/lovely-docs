## Resizable

Accessible resizable panel groups and layouts with keyboard support, built on PaneForge.

## Installation

```bash
npx shadcn-svelte@latest add resizable -y -o
```

Flags: `-y` skips confirmation prompt, `-o` overwrites existing files.

## Usage

```svelte
<script lang="ts">
  import * as Resizable from "$lib/components/ui/resizable/index.js";
</script>

<!-- Horizontal layout -->
<Resizable.PaneGroup direction="horizontal">
  <Resizable.Pane defaultSize={50}>One</Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={50}>Two</Resizable.Pane>
</Resizable.PaneGroup>

<!-- Vertical layout -->
<Resizable.PaneGroup direction="vertical" class="min-h-[200px]">
  <Resizable.Pane defaultSize={25}>Header</Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={75}>Content</Resizable.Pane>
</Resizable.PaneGroup>

<!-- Nested panes -->
<Resizable.PaneGroup direction="horizontal" class="max-w-md rounded-lg border">
  <Resizable.Pane defaultSize={50}>
    <div class="flex h-[200px] items-center justify-center p-6">
      <span class="font-semibold">One</span>
    </div>
  </Resizable.Pane>
  <Resizable.Handle />
  <Resizable.Pane defaultSize={50}>
    <Resizable.PaneGroup direction="vertical">
      <Resizable.Pane defaultSize={25}>Two</Resizable.Pane>
      <Resizable.Handle />
      <Resizable.Pane defaultSize={75}>Three</Resizable.Pane>
    </Resizable.PaneGroup>
  </Resizable.Pane>
</Resizable.PaneGroup>
```

## Props

- `direction`: Set to `"horizontal"` or `"vertical"` on `PaneGroup`
- `defaultSize`: Set initial pane size as percentage on `Pane`
- `withHandle`: Show visual handle indicator on `Handle` component
- Standard HTML attributes like `class` supported on `PaneGroup`

## Features

- Keyboard support for accessibility
- Nested pane groups supported
- Customizable handle visibility with `withHandle` prop
- Full PaneForge API available (see PaneForge documentation)