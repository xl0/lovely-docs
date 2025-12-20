import type { PageServerLoad } from './$types';
import YAML from 'yaml';
import { filterEcosystems, filterLibraries, getEcosystems, getLibrarySummaries, type LibraryFilterOptions } from 'lovely-docs/doc-cache';
import { libraryIndex } from 'lovely-docs/handlers';
import { getWebsiteLibraries } from '$lib/server/library-service';

const toYaml = (value: unknown): string => YAML.stringify(value).trim();

export const load: PageServerLoad = async () => {
	const libraries = await getWebsiteLibraries();
	const summaries = getLibrarySummaries(libraries);
	const libs = filterLibraries(summaries, {} as LibraryFilterOptions);
	const ecosystems = Array.from(filterEcosystems(getEcosystems(summaries), {})).sort();
	const ecosystemKeys = ['*', ...ecosystems];

	const resources = ecosystemKeys.map((eco) => {
		const idx = libraryIndex(libs, eco === '*' ? '*' : eco);
		return {
			id: `doc-index:${eco}`,
			name: 'doc-index',
			label: eco,
			indexYaml: toYaml(Object.keys(idx)),
			verboseYaml: toYaml(idx),
			index: Object.keys(idx),
			verbose: idx
		};
	});

	return { ecosystems: ecosystemKeys, resources };
};
