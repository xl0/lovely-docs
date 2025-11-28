export const prerender = true;
// export const csr = false;
export const ssr = true;

import { browser } from '$app/environment';
import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ fetch }) => {
	// Only fetch search index in the browser to avoid inlining 1.7MB JSON in SSR HTML
	if (browser) {
		return {
			// Return the promise directly (streaming) so we don't block navigation
			searchIndex: fetch('/search-index.json')
				.then((r) => r.json())
				.catch((e) => {
					console.error('Failed to load search index', e);
					return [];
				})
		};
	}

	return {
		searchIndex: Promise.resolve([])
	};
};
