import type { PageServerLoad } from './$types';
import { loadPageIndex } from '$lib/server/mcp-loaders';

export const load: PageServerLoad = async ({ params }) => {
	return loadPageIndex(params.library ?? '');
};
