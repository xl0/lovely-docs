## Installation and Setup

Install `@sveltejs/adapter-static` and configure in `svelte.config.js`:

```js
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

Add `export const prerender = true;` to your root layout (`src/routes/+layout.js`).

## Configuration Options

- **pages**: Directory for prerendered pages (default: `build`)
- **assets**: Directory for static assets (default: same as `pages`)
- **fallback**: Fallback page for SPA mode (e.g., `200.html` or `404.html`). Has negative performance/SEO impacts
- **precompress**: Generate `.br` and `.gz` compressed files when `true`
- **strict**: Validates all pages/endpoints are prerendered or fallback is set (default: `true`). Set to `false` to disable

## Important Notes

- Set `trailingSlash: 'always'` in your layout if your host doesn't serve `/a.html` for requests to `/a`
- Vercel has zero-config support; omit adapter options there
- For GitHub Pages with non-username repos, update `config.kit.paths.base` to your repo name
- Add `.nojekyll` file to `static/` directory when deploying to GitHub Pages without GitHub Actions

## GitHub Pages Deployment Example

```js
import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter({ fallback: '404.html' }),
		paths: {
			base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
		}
	}
};
export default config;
```

Use GitHub Actions workflow to build and deploy automatically on push to main branch.