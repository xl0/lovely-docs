## Setup

Installation guides for SvelteKit, Astro, Vite, and manual setup.

## Imports

Components split into multiple files per folder with `index.ts` barrel export. Both named and namespace imports work and are tree-shaken:
```ts
import * as Accordion from '$lib/components/ui/accordion'
import { Accordion, AccordionContent } from '$lib/components/ui/accordion'
```

## IDE Extensions

VSCode and JetBrains extensions available for managing components and navigation.