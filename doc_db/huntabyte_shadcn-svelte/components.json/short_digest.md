## Overview

Configuration file for CLI-based component generation. Create with `npx shadcn-svelte@latest init`.

## Key Sections

**tailwind**: CSS file path and base color (gray|neutral|slate|stone|zinc, immutable after init)

**aliases**: Path aliases for lib, utils, components, ui, hooks (must match `svelte.config.js`)

**typescript**: Enable/disable or specify custom config path

**registry**: Component registry URL (default: https://shadcn-svelte.com/registry)

**$schema**: Reference schema at https://shadcn-svelte.com/schema.json