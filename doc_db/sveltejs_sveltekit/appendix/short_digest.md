**FAQ**: Package compatibility (publint.dev, ESM/CJS extensions, exports precedence), client libraries (browser check/onMount), database (server routes + singleton), backend API (event.fetch or proxy), middleware (Vite plugin), view transitions (onNavigate), Yarn (nodeLinker: node-modules).

**Integrations**: vitePreprocess (Vite CSS flavors), npx sv add (prettier/eslint/vitest/playwright/lucia/tailwind/drizzle/paraglide/mdsvex/storybook), svelte-preprocess (Pug/Babel/global styles), Vite plugins.

**Debugging**: VSCode debug terminal or launch.json, browser DevTools via `NODE_OPTIONS="--inspect"`, WebStorm built-in, Neovim guides.

**SvelteKit 2 breaking changes**: error/redirect no longer thrown (call directly), cookies require path, top-level promises not auto-awaited, goto rejects external URLs, paths relative by default, preloadCode single base-prefixed arg, resolvePath→resolveRoute, improved error handling (status/message), dynamic env vars forbidden during prerendering, use:enhance removes form/data, file forms need multipart/form-data, Node 18.13+/Svelte 4/Vite 5/TypeScript 5, $app/stores→$app/state.

**Sapper migration**: package.json (add "type": "module", replace sapper with @sveltejs/kit + adapter), config files (svelte.config.js), templates (app.html), routes (+page.svelte, +layout.svelte, +error.svelte), imports ($app/navigation/$app/stores), preload→load, remove regex routes, root-relative URLs, sapper: attributes→data-sveltekit-, no req/res access.

**Glossary**: CSR/SSR/hybrid/hydration/SPA/SSG/prerendering/ISR/edge/routing/PWA/MPA with definitions and config options.