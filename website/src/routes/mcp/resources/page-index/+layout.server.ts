import type { LayoutServerLoad } from './$types';
import { filterLibraries, getLibrarySummaries, type LibraryFilterOptions } from 'lovely-docs/doc-cache';
import { getWebsiteLibraries } from '$lib/server/library-service';

export const load: LayoutServerLoad = async () => {
	const libraries = await getWebsiteLibraries();
	const summaries = getLibrarySummaries(libraries);
	const libs = filterLibraries(summaries, {} as LibraryFilterOptions);
	const librarySummaries = Array.from(libs.entries()).map(([key, summary]) => ({
		key,
		name: summary.name ?? key
	}));

	return { libraries: librarySummaries };
};
