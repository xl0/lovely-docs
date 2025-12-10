## Installation

Install with `npm i -D @sveltejs/adapter-netlify` and add to `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-netlify';

const config = {
	kit: {
		adapter: adapter({
			edge: false,      // use Netlify Edge Functions (Deno-based) instead of Node
			split: false      // split app into multiple functions instead of single one
		})
	}
};

export default config;
```

Requires `netlify.toml` in project root:

```toml
[build]
	command = "npm run build"
	publish = "build"
```

If missing, defaults to `"build"` directory. Node LTS is used by default for new projects.

## Netlify Edge Functions

Set `edge: true` to deploy server-side rendering to Deno-based edge functions deployed close to visitors, instead of Node-based Netlify Functions.

## Netlify-Specific Features

### `_headers` and `_redirects`

Place Netlify-specific `_headers` and `_redirects` files in project root for static asset responses. Redirect rules are automatically appended during compilation.

**Important**: Use `_redirects` file instead of `[[redirects]]` in `netlify.toml` (higher priority). Don't add custom catch-all rules like `/* /foobar/:splat` as they prevent auto-appended rules from matching.

### Netlify Forms

1. Create HTML form in route (e.g., `/routes/contact/+page.svelte`) with hidden `form-name` input
2. Prerender the form page: add `export const prerender = true` or set `kit.prerender.force: true`
3. For custom success messages like `<form netlify ... action="/success">`, ensure `/routes/success/+page.svelte` exists and is prerendered

### Netlify Functions

SvelteKit endpoints become Netlify Functions. Access Netlify context (including Identity info) via `event.platform.context` in hooks and server endpoints:

```js
export const load = async (event) => {
	const context = event.platform?.context;
	console.log(context);
};
```

Add custom Netlify functions by creating a directory and configuring in `netlify.toml`:

```toml
[build]
	command = "npm run build"
	publish = "build"

[functions]
	directory = "functions"
```

## Troubleshooting

**File system access**: Can't use `fs` in edge deployments. In serverless deployments, use `read()` from `$app/server` instead (works in both edge and serverless). Alternatively, prerender routes.