**Getting Started**: Interactive tutorial takes 5-10 minutes to run, 1.5 hours complete

**Support**: Reference docs, Stack Overflow (tag: svelte), Discord, Reddit

**Tooling**: Official VS Code extension, prettier-plugin-svelte for formatting

**Component Docs**: Use `@component` tag in HTML comments for Language Server support

**Testing**: Unit (Vitest), Component (jsdom/Playwright/Cypress), E2E (Playwright)

**Routing**: Official SvelteKit or alternatives like page.js, navaid, svelte-spa-router, Routify

**Mobile**: SvelteKit SPA → Tauri or Capacitor; Svelte Native for Svelte 4 only

**Styling**: Svelte removes unused styles; use `:global(...)` for global styles

**HMR**: Use SvelteKit (built on Vite) or community plugins for rollup/webpack