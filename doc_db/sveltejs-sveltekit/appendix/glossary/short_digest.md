## Rendering Modes
- **CSR**: Browser-based rendering, default in SvelteKit, disable with `csr = false`
- **SSR**: Server-side rendering, default in SvelteKit, disable with `ssr = false`
- **Hybrid**: SvelteKit default combining SSR (initial) + CSR (navigation)
- **SPA**: Single HTML file with client-side rendering, poor performance/SEO, use `adapter-static`
- **MPA**: Traditional server-rendered pages

## Static Generation
- **Prerendering**: Build-time HTML generation, controlled via `prerender` option
- **SSG**: All pages prerendered, use `adapter-static`
- **ISR**: On-demand static generation without redeploying, use `adapter-vercel`

## Other
- **Hydration**: Server HTML enhanced with client interactivity, data transmitted with HTML
- **Routing**: Client-side navigation interception, skip with `data-sveltekit-reload`
- **Edge**: CDN-based rendering near users
- **PWA**: Web app installable like native app, supports service workers