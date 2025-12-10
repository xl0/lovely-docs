## Static Site Generation with adapter-static

Use `@sveltejs/adapter-static` to prerender your entire SvelteKit site as static files. For partial prerendering with dynamic server-rendering, use a different adapter with the `prerender` option.

### Installation and Setup

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		})
	}
};
export default config;
```

```js
// src/routes/+layout.js
export const prerender = true;
```

### Configuration Options

**pages** - Directory for prerendered pages (default: `build`)

**assets** - Directory for static assets and generated JS/CSS (default: same as `pages`)

**fallback** - Fallback page for single-page app (SPA) mode. Commonly `200.html` or `404.html`. Avoid `index.html` to prevent conflicts with prerendered homepage. Has significant negative performance and SEO impacts; only recommended for specific cases like mobile app wrapping.

**precompress** - If `true`, generates `.br` (brotli) and `.gz` (gzip) compressed files

**strict** - By default checks that all pages/endpoints are prerendered or `fallback` is set. Set to `false` to disable this check if some pages are conditionally inaccessible.

### Important Configuration Notes

Set `trailingSlash` appropriately: if your host doesn't render `/a.html` for requests to `/a`, use `trailingSlash: 'always'` to create `/a/index.html` instead.

### Zero-Config Support

Vercel has zero-config support. Omit adapter options to let `adapter-static` provide optimal configuration:

```js
const config = {
	kit: {
		adapter: adapter()
	}
};
```

### GitHub Pages Deployment

Update `config.kit.paths.base` to match your repo name (site serves from `https://your-username.github.io/your-repo-name`):

```js
import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		}
	}
};
export default config;
```

Generate a custom `404.html` fallback to replace GitHub Pages' default 404 page.

### GitHub Actions Deployment Workflow

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: 'main'

jobs:
  build_site:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm i
      - run: npm run build
        env:
          BASE_PATH: '/${{ github.event.repository.name }}'
      - uses: actions/upload-pages-artifact@v3
        with:
          path: 'build/'

  deploy:
    needs: build_site
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
```

If not using GitHub Actions, add an empty `.nojekyll` file in `static/` to prevent Jekyll interference.