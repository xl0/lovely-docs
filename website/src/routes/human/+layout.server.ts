import { getLibrarySummaries } from 'lovely-docs/doc-cache';
import { getWebsiteLibraries } from '$lib/server/library-service';
import type { LayoutServerLoad } from '../$types';

export const load: LayoutServerLoad = async () => {
	const libraries = await getWebsiteLibraries();
	return { libraries: getLibrarySummaries(libraries) };
};
