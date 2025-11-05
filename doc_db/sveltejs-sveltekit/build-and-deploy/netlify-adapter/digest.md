## Installation and Setup

Install `@sveltejs/adapter-netlify` and add to `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-netlify';

const config = {
	kit: {
		adapter: adapter({
			edge: false,      // Use Netlify Edge Functions (Deno-based)
			split: false      // Split app into multiple functions
		})
	}
};
export default config;
```

Ensure `netlify.toml` exists in project root with build configuration:

```toml
[build]
	command = "npm run build"
	publish = "build"
```

## Edge Functions vs Serverless

- `edge: true` - Deploys to Deno-based edge functions near visitors
- `edge: false` (default) - Deploys to Node-based Netlify Functions

## Accessing Netlify Context

Access Netlify Identity and other context in endpoints via `event.platform.context`:

```js
export const load = async (event) => {
	const context = event.platform?.context;
	console.log(context);
};
```

## Netlify-Specific Features

- `_headers` and `_redirects` files for static asset routing
- Redirect rules auto-appended to `_redirects` during compilation
- Netlify Forms require prerendered HTML pages with `export const prerender = true`
- Custom Netlify Functions can be added via `netlify.toml` `[functions]` directory config

## Troubleshooting

- Cannot use `fs` in edge deployments; use `read()` from `$app/server` instead
- In serverless deployments, use `read()` to access files since they're not copied to deployment
- Alternatively, prerender routes to avoid file system access