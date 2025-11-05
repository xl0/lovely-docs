**Getting Started**
- Start with the interactive tutorial at /tutorial, takes 5-10 minutes to get running, 1.5 hours for full completion

**Support & Resources**
- Reference docs at /docs/svelte for syntax questions
- Stack Overflow for code-level questions (tag: svelte)
- Discord or Reddit for discussions about best practices and architecture
- Svelte Society maintains a list of books and videos

**Tooling**
- VS Code: Use official Svelte extension for syntax highlighting
- Formatting: Use prettier with prettier-plugin-svelte
- Component documentation: Use specially formatted comments with `@component` tag in editors using Svelte Language Server

**Component Documentation Example**
```svelte
<script>
	/** What should we call the user? */
	export let name = 'world';
</script>

<!--
@component
Here's some documentation for this component.
- You can use markdown here.
- Usage:
  ```svelte
  <main name="Arethra">
  ```
-->
```

**Testing**
- Unit tests: Test business logic in isolation using Vitest or other runners
- Component tests: Mount and assert against components using jsdom + Vitest, Playwright, or Cypress
- E2E tests: Test full application in production-like environment using Playwright or other E2E libraries

**Routing**
- Official: SvelteKit provides filesystem router, SSR, and HMR
- Alternatives: page.js, navaid, universal-router, svelte-routing, svelte-navigator, svelte-spa-router, Routify

**Mobile Development**
- Convert SvelteKit SPA to mobile app using Tauri or Capacitor with access to camera, geolocation, push notifications
- Svelte Native (NativeScript) available for Svelte 4 only, not supported in Svelte 5

**Styling**
- Svelte removes unused styles to prevent scoping issues
- Use `:global(...)` to opt into global styles when needed
- Partial global selectors like `.foo :global(.bar)` work for styling specific elements

**Hot Module Reloading**
- Use SvelteKit (built on Vite and svelte-hmr) for HMR out of the box
- Community plugins available for rollup and webpack

**UI Components**
- Multiple UI component libraries available on Svelte Society design systems section

**Scaling**
- Svelte scales well; see GitHub issue #2546 for details

**Svelte v2**
- No longer receiving new features, minimal bug fixes
- Documentation still available at v2.svelte.dev/guide