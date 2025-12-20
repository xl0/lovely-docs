import type { PageServerLoad } from './$types';
import { loadLibraryIndex } from '$lib/server/mcp-loaders';

export const load: PageServerLoad = async () => {
	return loadLibraryIndex();
};
