## Out of the box
- **SSR**: Enabled by default, keep it on for better indexing
- **Performance**: Svelte's minimal overhead helps Core Web Vitals; use hybrid rendering and image optimization
- **Normalized URLs**: Automatic trailing slash redirects prevent duplicate URL penalties

## Manual setup
- **Title/Meta**: Add unique `<title>` and `<meta name="description">` in `<svelte:head>`, typically from page `load` data
- **Sitemaps**: Create via endpoint returning XML with proper namespaces
- **AMP**: Set `inlineStyleThreshold: Infinity`, disable CSR, add `amp` to `<html>`, transform with `@sveltejs/amp` in hooks, optionally clean CSS with `dropcss`