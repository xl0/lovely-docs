## adapter-static: Static Site Generation

Install `@sveltejs/adapter-static` and configure in `svelte.config.js` with `prerender: true` in root layout to prerender entire site as static files.

**Key options:**
- `pages`/`assets` - Output directories (default: `build`)
- `fallback` - SPA fallback page (e.g., `200.html` or `404.html`); has SEO/performance costs
- `precompress` - Generate `.br` and `.gz` files
- `strict` - Enforce all pages prerendered (default: true)

**GitHub Pages:** Set `paths.base` to repo name, use `fallback: '404.html'`, add `.nojekyll` to `static/` if not using Actions. Example workflow provided for automated deployment.