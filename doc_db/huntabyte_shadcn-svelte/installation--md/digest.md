## Installation Guides

Setup instructions available for:
- SvelteKit
- Astro
- Vite
- Manual setup

## Component Structure & Imports

Components are split into multiple files (unlike React's shadcn/ui). Each component gets its own folder with an `index.ts` barrel export.

Example: Accordion component structure
```
accordion/
  ├── accordion.svelte
  ├── accordion-content.svelte
  ├── accordion-item.svelte
  ├── accordion-trigger.svelte
  └── index.ts
```

Import approaches (both tree-shaken by Rollup):
```ts
import * as Accordion from '$lib/components/ui/accordion'
// or
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '$lib/components/ui/accordion'
```

## IDE Extensions

**VSCode**: shadcn-svelte extension by @selemondev
- Initialize CLI
- Add components
- Navigate to component docs
- Import snippets

**JetBrains IDEs**: shadcn/ui Components Manager by @WarningImHack3r
- Auto-detect components
- Add/remove/update with one click
- Supports Svelte, React, Vue, Solid
- Search remote or existing components