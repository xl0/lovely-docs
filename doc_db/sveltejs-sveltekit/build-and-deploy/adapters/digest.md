Adapters are plugins that transform a built SvelteKit app for deployment to specific platforms.

**Official adapters:**
- `@sveltejs/adapter-cloudflare` — Cloudflare Workers and Pages
- `@sveltejs/adapter-netlify` — Netlify
- `@sveltejs/adapter-node` — Node servers
- `@sveltejs/adapter-static` — Static site generation
- `@sveltejs/adapter-vercel` — Vercel

Community adapters are available for additional platforms.

**Configuration:**
Specify the adapter in `svelte.config.js`:
```js
import adapter from 'svelte-adapter-foo';

const config = {
	kit: {
		adapter: adapter({ /* options */ })
	}
};

export default config;
```

**Platform context:**
Some adapters provide platform-specific data (e.g., Cloudflare's `env` object) accessible via the `platform` property in `RequestEvent` within hooks and server routes.