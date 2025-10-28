import { initCache } from '$lib/server/doc-cache';

// Initialize cache on server startup
await initCache()

// .catch(error => {
// 	console.error('[hooks.server] Failed to initialize doc cache:', error);
// });

export async function handle({ event, resolve }) {
	return resolve(event);
}
