**Getting Started**: Use the interactive tutorial for hands-on learning (5-10 minutes to get running, 1.5 hours for full tutorial).

**Support**: Check reference docs for syntax questions. Use Stack Overflow for code-level questions and errors. Discord and Reddit for discussions about best practices and architecture.

**Resources**: Svelte Society maintains a list of books and videos.

**Tooling**: 
- VS Code: Use the official Svelte extension
- Formatting: Use prettier with prettier-plugin-svelte
- Documentation: Use specially formatted comments with `@component` tag in HTML comments for component documentation that shows on hover

**Testing**: Three types of tests are recommended:
- Unit tests: Test business logic in isolation using Vitest or similar
- Component tests: Mount and assert against components using jsdom + Vitest, Playwright, or Cypress
- E2E tests: Test full application flow using Playwright or similar

**Routing**: Official library is SvelteKit (filesystem router, SSR, HMR). Other routers available on packages page.

**Mobile**: Convert SvelteKit SPA to mobile app using Tauri or Capacitor. Svelte Native (for NativeScript) was available in Svelte 4 but not Svelte 5. Custom renderer support is in progress for Svelte 5.

**Styling**: Svelte removes unused styles to prevent scoping issues. Use `:global(...)` to opt into global styles. Partial global selectors like `.foo :global(.bar)` are supported.

**Scaling**: See GitHub issue #2546 for discussion.

**UI Libraries**: Multiple component libraries and standalone components available on packages page.

**Hot Module Reloading**: SvelteKit supports HMR out of the box via Vite and svelte-hmr. Community plugins available for rollup and webpack.

**Svelte v2**: No longer receiving new features, minimal bug fixes. Documentation still available.