## Adapters

Plugins that transform built SvelteKit apps for deployment. Official adapters exist for Cloudflare, Netlify, Node, static sites, and Vercel.

Configure in `svelte.config.js`:
```js
import adapter from 'svelte-adapter-foo';
const config = {
	kit: { adapter: adapter({ /* options */ }) }
};
export default config;
```

Platform-specific context (e.g., Cloudflare's `env`) is available via the `platform` property in hooks and server routes.