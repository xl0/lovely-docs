**Project Creation**: `npx sv create my-app`, pages as Svelte components in `src/routes`, SSR then CSR.

**Structure**: `src/lib/` (with `server/` subdirectory), `src/routes/`, `src/app.html` (placeholders: `%sveltekit.head%`, `%sveltekit.body%`, `%sveltekit.assets%`, `%sveltekit.nonce%`, `%sveltekit.env.[NAME]%`, `%sveltekit.version%`), `src/error.html`, hooks, service-worker, `static/`, `tests/`, config files.

**Rendering**: Hybrid SSR+CSR default; `adapter-static` for SSG; CSR-only for SPA; `adapter-node` for own server; `adapter-vercel`/`adapter-netlify`/`adapter-cloudflare` for serverless; `bundleStrategy: 'single'` for mobile/embedded.

**Web APIs**: Standard `fetch`, `Request`/`Response`/`Headers`, `FormData`, Streams, `URL`/`URLSearchParams`, Web Crypto. Special `fetch` in `load`/server hooks/API routes invokes endpoints directly during SSR without HTTP.