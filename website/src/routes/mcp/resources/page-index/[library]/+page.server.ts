import type { PageServerLoad } from './$types';
import { filterLibraries, getLibrarySummaries, type LibraryFilterOptions } from 'lovely-docs/doc-cache';
import { getPageIndex } from 'lovely-docs/handlers';
import { getWebsiteLibraries } from '$lib/server/library-service';
import { flattenPagePaths, toYaml } from '$lib/server/utils';

export const load: PageServerLoad = async ({ params }) => {
	const { library } = params;
	const libraries = await getWebsiteLibraries();
	const summaries = getLibrarySummaries(libraries);
	const libs = filterLibraries(summaries, {} as LibraryFilterOptions);

	const lib = libs.get(library);
	const result = getPageIndex(libraries, library);
	const tree = result.isOk() ? (result.value.tree ?? []) : [];
	const verboseResult = getPageIndex(libraries, library, true);
	const verboseTree = verboseResult.isOk() ? (verboseResult.value.tree ?? []) : [];

	const wrappedTree = [{ '/': tree }];
	const wrappedVerboseTree = [{ '/': { essence: lib?.essence, children: verboseTree } }];

	const pageIndex = {
		label: library,
		yaml: toYaml({ '/': tree }),
		paths: flattenPagePaths(tree),
		tree: wrappedTree,
		verboseTree: wrappedVerboseTree
	};

	return { pageIndex };
};
