import type { PageServerLoad } from './$types';
import { filterEcosystems, filterLibraries, getEcosystems, getLibrarySummaries, type LibraryFilterOptions } from 'lovely-docs/doc-cache';
import { libraryIndex } from 'lovely-docs/handlers';
import { getWebsiteLibraries } from '$lib/server/library-service';
import { toYaml } from '$lib/server/utils';

export const load: PageServerLoad = async () => {
	const libraries = await getWebsiteLibraries();
	const summaries = getLibrarySummaries(libraries);
	const libs = filterLibraries(summaries, {} as LibraryFilterOptions);
	const ecosystems = Array.from(filterEcosystems(getEcosystems(summaries), {})).sort();
	const ecosystemKeys = ['*', ...ecosystems];

	const tools = ecosystemKeys.map((eco) => {
		const idx = libraryIndex(libs, eco === '*' ? '*' : eco);
		return {
			id: `listLibraries:${eco}`,
			name: 'listLibraries',
			label: eco,
			payloadYaml: toYaml(Object.keys(idx)),
			verboseYaml: toYaml(idx),
			payload: Object.keys(idx),
			verbose: idx
		};
	});

	return { ecosystems: ecosystemKeys, tools };
};
