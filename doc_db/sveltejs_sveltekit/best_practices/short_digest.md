**Auth**: Sessions (DB-revocable) vs JWT (non-revocable, faster); implement via server hooks + `locals`; use Lucia.

**Performance**: Built-in code-splitting, preloading, coalescing, inlining, prerendering. Diagnose with PageSpeed/WebPageTest/devtools. Optimize images with `@sveltejs/enhanced-img`, videos with Handbrake, fonts with subsetting. Reduce code: latest Svelte, `rollup-plugin-visualizer`, server-side analytics, dynamic imports. Prevent waterfalls: server `load` functions, database joins. Host: same-datacenter backend, edge deployment, CDN images, HTTP/2+.

**Icons**: CSS via Iconify + framework plugins; avoid per-icon `.svelte` files (Vite optimization issues).

**Images**: Vite auto-hashes/inlines. `@sveltejs/enhanced-img` generates formats/sizes/width/height at build time. Dynamic images from CDN via `@unpic/svelte`, Cloudinary, etc. Best practices: high-quality 2x originals, specify `sizes` for large images, `fetchpriority="high"` for LCP, reserve space with width/height, good alt text, avoid `em`/`rem` in `sizes`.

**Accessibility**: Live region announces page title after navigation. Focus management: `afterNavigate` hook, `goto` with `keepFocus`. Set `lang` attribute dynamically for multi-language. Svelte compile-time checks apply.

**SEO**: SSR default. Unique titles/meta tags per page. Dynamic sitemaps via endpoints. AMP: `inlineStyleThreshold: Infinity`, disable CSR, `amp.transform()` in hooks.