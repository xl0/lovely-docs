// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		// adapter: adapter()
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: "404.html",
			precompress: false,
			strict: true
		}),
		paths: {
			base: "/lovely-docs"
		},
		prerender: {
			handleUnseenRoutes: 'warn',
			handleMissingId: (details) => {
				// Ignore missing IDs for markdown level selectors (digest, fulltext, short_digest, essence)
				const markdownLevels = ['digest', 'fulltext', 'short_digest', 'essence'];
				if (markdownLevels.includes(details.id)) {
					return; // Silently ignore
				}
				// For other missing IDs, log a warning
				console.warn(`Missing ID: ${details.id} on ${details.path}`);
				console.warn(`  Referenced from: ${details.referrers.join(', ')}`);
			}
		}
	}
};

export default config;
